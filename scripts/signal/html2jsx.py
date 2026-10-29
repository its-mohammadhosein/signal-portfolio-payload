"""
HTML -> JSX conversion used by to_react.py. Keeps the DOM identical to the source:
same elements, attributes and classes, and whitespace wherever HTML would render it.
{{token}} placeholders become JSX expressions ({token} in text, attr={token} or a template literal).
"""

import json
import re
from html.parser import HTMLParser

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}
INLINE = {'a', 'abbr', 'b', 'br', 'button', 'code', 'em', 'i', 'iframe', 'img', 'input', 'label', 'picture', 'select',
          'small', 'span', 'strong', 'sub', 'sup', 'svg', 'textarea', 'time', 'video'}
BOOLEAN = {'allowfullscreen', 'async', 'autoplay', 'checked', 'controls', 'defer', 'disabled', 'hidden', 'loop',
           'multiple', 'muted', 'novalidate', 'playsinline', 'readonly', 'required', 'selected'}
RENAME = {
    'accept-charset': 'acceptCharset', 'allowfullscreen': 'allowFullScreen', 'autocomplete': 'autoComplete',
    'autoplay': 'autoPlay', 'charset': 'charSet', 'class': 'className', 'colspan': 'colSpan',
    'contenteditable': 'contentEditable', 'crossorigin': 'crossOrigin', 'datetime': 'dateTime', 'enctype': 'encType',
    'fetchpriority': 'fetchPriority', 'for': 'htmlFor', 'frameborder': 'frameBorder', 'http-equiv': 'httpEquiv',
    'inputmode': 'inputMode', 'maxlength': 'maxLength', 'minlength': 'minLength', 'novalidate': 'noValidate',
    'playsinline': 'playsInline', 'readonly': 'readOnly', 'rowspan': 'rowSpan', 'spellcheck': 'spellCheck',
    'srcset': 'srcSet', 'tabindex': 'tabIndex',
}
SVG_CASE = {'viewbox': 'viewBox', 'preserveaspectratio': 'preserveAspectRatio', 'xmlns:xlink': 'xmlnsXlink',
            'xlink:href': 'xlinkHref'}
TOKEN = re.compile(r'\{\{(\w+)\}\}')


class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, attrs or [], parent, []


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('#root')
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.cur)
        self.cur.children.append(node)
        if tag not in VOID:
            self.cur = node

    def handle_startendtag(self, tag, attrs):
        node = Node(tag, attrs, self.cur)
        self.cur.children.append(node)

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def parse(html):
    p = Parser()
    p.feed(html)
    p.close()
    return p.root


def js_string(s):
    return json.dumps(s, ensure_ascii=False).replace(' ', '\\u00a0')


def template_literal(value):
    parts = TOKEN.split(value)
    out = ''
    for i, part in enumerate(parts):
        if i % 2:
            out += '${' + part + '}'
        else:
            out += part.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    return '`' + out + '`'


def camel(prop):
    if prop.startswith('--'):
        return js_string(prop)
    prop = re.sub(r'^-(webkit|moz|o)-', lambda m: m.group(1).capitalize() + '-', prop)
    prop = re.sub(r'^-ms-', 'ms-', prop)
    return re.sub(r'-([a-z])', lambda m: m.group(1).upper(), prop)


def style_object(value):
    decls = []
    for part in re.split(r';(?![^(]*\))', value):
        if ':' not in part:
            continue
        k, v = part.split(':', 1)
        k, v = k.strip(), v.strip()
        if k:
            decls.append(f'{camel(k.lower())}: {template_literal(v) if TOKEN.search(v) else js_string(v)}')
    if not decls:
        return None
    custom = any(d.startswith('"--') for d in decls)
    obj = '{ ' + ', '.join(decls) + ' }'
    return '{' + (obj + ' as React.CSSProperties' if custom else obj) + '}'


def attr_jsx(tag, name, value, in_svg):
    if name.startswith('on'):
        return None  # inline handlers never appear in the crawl's markup; never carry them over
    if in_svg and name in SVG_CASE:
        name = SVG_CASE[name]
    elif in_svg and '-' in name and not name.startswith(('data-', 'aria-')):
        name = camel(name)
    elif name in ('value',) and tag in ('input', 'textarea', 'select') and not TOKEN.search(value or ''):
        name = 'defaultValue'
    elif name == 'checked' and tag == 'input':
        return 'defaultChecked'
    elif name == 'style':
        obj = style_object(value or '')
        return f'style={obj}' if obj else None
    else:
        name = RENAME.get(name, name)

    if value is None or (name.lower() in BOOLEAN and value in ('', name.lower())):
        return name if name.lower() in BOOLEAN or name in RENAME.values() else f'{name}=""'
    if TOKEN.fullmatch(value):
        return f'{name}={{{TOKEN.fullmatch(value).group(1)}}}'
    if TOKEN.search(value):
        return f'{name}={{{template_literal(value)}}}'
    if '"' in value or '\\' in value or '{' in value or '}' in value:
        return f'{name}={{{js_string(value)}}}'
    return f'{name}="{value}"'


def is_inline(node):
    return isinstance(node, str) and node.strip() or (isinstance(node, Node) and node.tag in INLINE)


def text_jsx(text):
    """One text node as JSX pieces: tokens become expressions, the rest stays literal"""
    out = []
    for i, part in enumerate(TOKEN.split(text)):
        if i % 2:
            out.append('{' + part + '}')
        elif part:
            safe = part.strip() == part and not re.search(r'[{}<>& ]', part) and part.strip()
            out.append(part if safe else '{' + js_string(part) + '}')
    return out


def render(node, depth, in_svg=False):
    pad = '  ' * depth
    if isinstance(node, str):
        return [pad + piece for piece in text_jsx(node)]
    svg = in_svg or node.tag == 'svg'
    attrs = [a for a in (attr_jsx(node.tag, n, v, svg) for n, v in node.attrs) if a]
    open_tag = '<' + node.tag + (' ' + ' '.join(attrs) if attrs else '')
    kids = render_children(node, depth + 1, svg)
    if not kids:
        return [pad + open_tag + ' />']
    return [pad + open_tag + '>'] + kids + [pad + f'</{node.tag}>']


def render_children(node, depth, in_svg=False):
    kids = node.children
    out = []
    for i, child in enumerate(kids):
        if isinstance(child, str):
            text = re.sub(r'[ \t\r\n\f]+', ' ', child)
            if text == ' ' or text == '':
                prev = kids[i - 1] if i > 0 else None
                nxt = kids[i + 1] if i + 1 < len(kids) else None
                if text == ' ' and (is_inline(prev) or is_inline(nxt)):
                    out.append('  ' * depth + "{' '}")
                continue
            out.extend(render(text, depth, in_svg))
        else:
            out.extend(render(child, depth, in_svg))
    return out


def to_jsx(html, depth=2):
    """JSX for an HTML fragment (one or more top-level nodes)"""
    root = parse(html)
    lines = render_children(root, depth)
    elements = [c for c in root.children if isinstance(c, Node) or c.strip()]
    if len(elements) > 1:
        pad = '  ' * (depth - 1)
        return '\n'.join([pad + '<>'] + lines + [pad + '</>'])
    return '\n'.join(lines)


def tokens_in(html):
    return list(dict.fromkeys(TOKEN.findall(html)))
