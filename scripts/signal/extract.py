"""
Extracts the legacy Signal site (../signal-portfolio, a static crawl of the Salient theme) into this app.

    python scripts/signal/extract.py

For every page below it writes:
  src/styles/signal/<page>.ts       imports of that page's stylesheets and inline <style>s, in document order
  src/styles/signal/files/*.css     the stylesheets themselves (shared between pages)
  public/signal/wp/**               the fonts, icons, images and scripts they reference
  src/site/generated/<page>.ts      the original <body> markup with {{tokens}} where Payload content goes,
                                    item templates for repeated parts, the original content as defaults,
                                    and the original <body> class

Re-run it after changing it; it overwrites its outputs.
"""

import html as htmllib
import json
import os
import re
import shutil
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.normpath(os.path.join(HERE, '..', '..'))
SRC = os.path.normpath(os.path.join(APP, '..', 'signal-portfolio'))
STYLES = os.path.join(APP, 'src', 'styles', 'signal')
PUBLIC = os.path.join(APP, 'public', 'signal', 'wp')
GENERATED = os.path.join(APP, 'src', 'site', 'generated')
LIVE = 'https://themenectar.com/salient/signal/'

copied = set()
missing = []


# ---------------------------------------------------------------- assets

def public_url(rel):
    """rel is a path inside the crawl, e.g. wp-content/uploads/x.jpg -> /signal/wp/uploads/x.jpg"""
    rel = rel.replace('\\', '/')
    if rel.startswith('wp-content/'):
        sub = rel[len('wp-content/'):]
    elif rel.startswith('wp-includes/'):
        sub = 'includes/' + rel[len('wp-includes/'):]
    else:
        raise ValueError(rel)
    return '/signal/wp/' + sub, os.path.join(PUBLIC, sub)


def take(rel):
    """Copy (or download, for files the crawl only hot-linked) and return the public URL"""
    url, dest = public_url(rel)
    if rel not in copied:
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        local = os.path.join(SRC, rel)
        if os.path.exists(local):
            shutil.copy(local, dest)
        elif not os.path.exists(dest):
            print('  downloading', rel)
            request = urllib.request.Request(LIVE + rel, headers={'User-Agent': 'Mozilla/5.0'})
            try:
                with urllib.request.urlopen(request, timeout=60) as response:
                    open(dest, 'wb').write(response.read())
            except Exception as error:  # reported at the end, the page still renders without it
                missing.append(f'{rel} ({error})')
        copied.add(rel)
    return url


def strip_query(ref):
    return re.split(r'[?#]', ref)[0]


# ---------------------------------------------------------------- styles

css_files = {}  # crawl path -> file name in styles/files (shared by pages)


def build_styles(page, doc, page_dir):
    os.makedirs(os.path.join(STYLES, 'files'), exist_ok=True)
    url_re = re.compile(r'url\(\s*([\'"]?)([^)\'"]+)\1\s*\)')
    head = doc[: doc.index('<body')]
    body = doc[doc.index('<body'):]

    def rewrite(css, base_rel_dir):
        def fix(m):
            q, ref = m.group(1), m.group(2).strip()
            if ref.startswith(('data:', 'http:', 'https:', '//', '#', '/')):
                return m.group(0)
            target = os.path.normpath(os.path.join(base_rel_dir, strip_query(ref))).replace('\\', '/')
            if not os.path.exists(os.path.join(SRC, target)):
                return m.group(0)
            return f'url({q}{take(target)}{ref[len(strip_query(ref)):]}{q})'

        return url_re.sub(fix, css)

    # <head> links and inline styles in order, then the stylesheets Salient loads late from <body>
    entries = [m for m in re.finditer(r'<link([^>]*)>|<style([^>]*)>([\s\S]*?)</style>', head)]
    entries += [m for m in re.finditer(r'<link([^>]*)>', body) if 'stylesheet' in m.group(1)]
    imports = []

    for m in entries:
        if m.group(0).startswith('<link'):
            attrs = m.group(1)
            if 'stylesheet' not in attrs:
                continue
            href = re.search(r'href=["\']([^"\']+)', attrs).group(1)
            rel = os.path.normpath(os.path.join(page_dir, strip_query(href))).replace('\\', '/')
            if rel not in css_files:
                name = re.sub(r'__ver=.*$', '', os.path.basename(rel))
                name = re.sub(r'\.css$', '', name)
                # same base name from different folders (e.g. two style.css)
                while f'{name}.css' in css_files.values():
                    name += '-' + os.path.basename(os.path.dirname(rel))
                css_files[rel] = f'{name}.css'
                css = open(os.path.join(SRC, rel), encoding='utf-8').read()
                open(os.path.join(STYLES, 'files', css_files[rel]), 'w', encoding='utf-8', newline='\n').write(rewrite(css, os.path.dirname(rel)))
            imports.append(css_files[rel])
        else:
            ident = re.search(r'id=["\']([^"\']+)', m.group(2) or '')
            name = f'{page}--{ident.group(1) if ident else "inline-" + str(len(imports))}.css'
            open(os.path.join(STYLES, 'files', name), 'w', encoding='utf-8', newline='\n').write(rewrite(m.group(3), page_dir))
            imports.append(name)

    with open(os.path.join(STYLES, f'{page}.ts'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(f'// Generated by scripts/signal/extract.py: the legacy styles of the {page} page, in document order\n')
        for n in imports:
            f.write(f"import './files/{n}'\n")
    return len(imports)


# ---------------------------------------------------------------- markup helpers

def end_of(h, i):
    tag = re.match(r'<(\w+)', h[i:]).group(1)
    depth = 0
    for m in re.compile(r'<(/?)' + tag + r'\b[^>]*?(/?)>').finditer(h, i):
        if m.group(1):
            depth -= 1
        elif not m.group(2):
            depth += 1
        if depth == 0:
            return m.end()
    raise ValueError('unclosed ' + tag)


def find_el(h, pattern, start=0):
    m = re.compile(pattern).search(h, start)
    assert m, pattern
    return m.start(), end_of(h, m.start())


def inner(h, start, end):
    return h.index('>', start) + 1, h.rindex('<', start, end)


def children(h, a, b):
    """Top-level elements between a and b"""
    out, i = [], a
    while True:
        m = re.compile(r'<(\w+)').search(h, i, b)
        if not m:
            return out
        e = end_of(h, m.start())
        out.append((m.start(), e))
        i = e


def once(h, old, new):
    assert h.count(old) == 1, (h.count(old), old[:80])
    return h.replace(old, new)


def text(x):
    return htmllib.unescape(re.sub(r'<[^>]+>', '', x)).strip()


def img_info(tag):
    g = lambda k: (re.search(k + r'="([^"]*)"', tag) or [None, ''])[1]
    info = {'src': g('data-nectar-img-src') or g('src'), 'width': int(g('width') or 0), 'height': int(g('height') or 0), 'alt': g('alt')}
    srcset = g('data-nectar-img-srcset') or g('srcset')
    if srcset:
        info['srcset'] = srcset
    return info


def tokenize_img(tag):
    """Turn one <img> (lazy or not) into a template with {{src}} {{srcset}} {{width}} {{height}} {{alt}}"""
    tag = re.sub(r'data-nectar-img-src="[^"]*"', 'data-nectar-img-src="{{src}}"', tag)
    tag = re.sub(r'data-nectar-img-srcset="[^"]*"', 'data-nectar-img-srcset="{{srcset}}"', tag)
    tag = re.sub(r'(?<![\w-])srcset="[^"]*"', 'srcset="{{srcset}}"', tag)
    if 'src="data:' not in tag:
        tag = re.sub(r'(?<![\w-])src="[^"]*"', 'src="{{src}}"', tag)
    tag = re.sub(r"viewBox%3D(&#039;|')0%200%20\d+%20\d+(&#039;|')", r"viewBox%3D\g<1>0%200%20{{width}}%20{{height}}\g<2>", tag)
    tag = re.sub(r'(?<![\w-])width="\d+"', 'width="{{width}}"', tag)
    tag = re.sub(r'(?<![\w-])height="\d+"', 'height="{{height}}"', tag)
    tag = re.sub(r'sizes="\(max-width: \d+px\) 100vw, \d+px"', 'sizes="(max-width: {{width}}px) 100vw, {{width}}px"', tag)
    tag = re.sub(r'alt="[^"]*"', 'alt="{{alt}}"', tag)
    return tag


def replace_range(h, a, b, new):
    return h[:a] + new + h[b:]


# ---------------------------------------------------------------- body

def rewrite_urls(h):
    """Point every asset at /signal/wp and every page link at this app"""

    def asset(m):
        return take(strip_query(m.group(1)))

    h = re.sub(r'(?:https://themenectar\.com/salient/signal/|(?:\.\./)+)?((?:wp-content|wp-includes)/[^\s"\'<>)]+?\.(?:jpe?g|png|webp|gif|svg|mp4|woff2?|js))(?:\?[^\s"\'<>)]*)?(?=[\s"\'<>),])', asset, h)
    h = re.sub(r'https://themenectar\.com/salient/signal/portfolio/([\w-]+)/', r'/portfolio/\1', h)
    h = re.sub(r'(?<=["\'])/salient/signal/portfolio/([\w-]+)/', r'/portfolio/\1', h)
    h = re.sub(r'https://themenectar\.com/salient/signal/project-type/[\w-]+/', '/work', h)
    h = h.replace('https://themenectar.com/salient/signal/work/', '/work')
    h = h.replace('https://themenectar.com/salient/signal/#', '/#')
    h = h.replace('https://themenectar.com/salient/signal/wp-admin/admin-ajax.php', '/api/signal/ajax')
    h = re.sub(r'https://themenectar\.com/salient/signal/?(?=["\'])', '/', h)
    h = re.sub(r'href="(?:\.\./)*index\.html"', 'href="/"', h)
    return h


def prepare_body(doc):
    body = doc[doc.index('<body'):doc.index('</body>')]
    body = body[body.index('>') + 1:]
    # Drop what only works against WordPress: FluentForm's ajax submit and its config, prefetch rules
    body = re.sub(r'<script[^>]*>\s*window\.fluent_form_ff_form_instance[\s\S]*?</script>', '', body)
    body = re.sub(r'<script type="speculationrules">[\s\S]*?</script>', '', body)
    body = re.sub(r'<script[^>]*id=["\']fluent-form-submission-js-extra["\'][^>]*>[\s\S]*?</script>', '', body)
    body = re.sub(r'<script[^>]*id=["\']fluent-form-submission-js["\'][^>]*></script>', '', body)
    body = re.sub(r'<link[^>]*stylesheet[^>]*>', '', body)  # moved into the style bundle
    return rewrite_urls(body)


def chrome(body, T, D):
    """Header, off-canvas menu, contact form and footer: the same on every page"""
    m = re.search(r'(<a id="logo"[^>]*>)\s*(Salient)\s*(</a>)', body)
    D['logoText'] = m.group(2)
    body = replace_range(body, m.start(), m.end(), m.group(1) + '{{logoText}}' + m.group(3))

    hs, he = find_el(body, r'<div id="header-outer"')
    header = body[hs:he].replace('Get Started', '{{ctaLabel}}').replace('href="#contact"', 'href="{{ctaHref}}"')
    D['ctaLabel'], D['ctaHref'] = 'Get Started', '#contact'
    body = replace_range(body, hs, he, header)

    ms, me = find_el(body, r'<div id="slide-out-widget-area" ')
    menu_html = body[ms:me]
    cs = [m.start() for m in re.finditer(r'<div class="off-canvas-menu-container"', menu_html)][-1]
    us, ue = find_el(menu_html, r'<ul class="menu">', cs)
    ia, ib = inner(menu_html, us, ue)
    D['menu'] = [{'label': text(x), 'href': re.search(r'href="([^"]*)"', x).group(1)} for x in re.findall(r'<li[\s\S]*?</li>', menu_html[ia:ib])]
    T['menuItem'] = '<li class="menu-item menu-item-type-custom menu-item-object-custom{{current}}"><a href="{{href}}"{{ariaCurrent}}>{{label}}</a></li>'
    body = replace_range(body, ms, me, replace_range(menu_html, ia, ib, '{{menuItems}}'))

    body = re.sub(r'<form ([^>]*id="fluentform_3")', r'<form data-signal-form="{{contactFormId}}" \1', body, count=1)
    assert '{{contactFormId}}' in body

    D['email'] = 'info@themenectar.com'
    es = body.rindex('<div class="nectar-cta ', 0, body.index(D['email']))
    ee = end_of(body, es)
    body = replace_range(body, es, ee, body[es:ee].replace(D['email'], '{{email}}').replace('href="#"', 'href="{{emailHref}}"'))

    socials = list(re.finditer(r'<div class="nectar-cta [^>]*>(?:(?!<div class="nectar-cta ).)*?data-text="(LinkedIn|Facebook|Instagram)"', body, re.S))
    assert len(socials) == 3, len(socials)
    s0, s_end = socials[0].start(), end_of(body, socials[-1].start())
    T['social'] = body[s0:end_of(body, s0)].replace('LinkedIn', '{{label}}').replace('href=""', 'href="{{href}}"')
    D['socials'] = [{'label': s.group(1), 'href': ''} for s in socials]
    body = replace_range(body, s0, s_end, '{{socials}}')

    body = once(body, '<h1 >SIGNAL</h1>', '<h1 >{{wordmark}}</h1>')
    D['wordmark'] = 'SIGNAL'
    return body


def grid_items(body, T, D, key, grid_pattern):
    """A Salient post grid: its items become {{<key>Items}} rendered from one item template"""
    gs, ge = find_el(body, grid_pattern)
    ia, ib = inner(body, gs, ge)
    items = children(body, ia, ib)
    D[key] = []
    for a, b in items:
        x = body[a:b]
        cats = re.findall(r'<a class="([\w-]+) style-[^"]*" href="[^"]*">([^<]*)</a>', x)
        date = re.search(r'<span class="meta-date">([^<]*)</span>', x)
        D[key].append({
            'title': text(re.search(r'class="post-heading"><span>([^<]*)</span>', x).group(1)),
            'href': re.search(r'class="nectar-post-grid-link" href="([^"]*)"', x).group(1),
            'image': img_info(re.search(r'<img[^>]*>', x).group(0)),
            'categories': [slug for slug, _ in cats],
            'date': date.group(1) if date else '',
        })
    T[key + 'Item'] = []
    for (a, b), item in zip(items, D[key]):
        tpl = body[a:b]
        title = htmllib.escape(item['title'], quote=False)
        tpl = re.sub(r'data-post-id="\d+"', 'data-post-id="{{id}}" data-signal-categories="{{categories}}"', tpl)
        tpl = re.sub(r'(class="nectar-post-grid-link" href=")[^"]*"', r'\1{{href}}"', tpl)
        tpl = tpl.replace('<span class="screen-reader-text">' + title + '</span>', '<span class="screen-reader-text">{{title}}</span>')
        tpl = tpl.replace('class="post-heading"><span>' + title + '</span>', 'class="post-heading"><span>{{title}}</span>')
        img = re.search(r'<img[^>]*>', tpl).group(0)
        tpl = tpl.replace(img, tokenize_img(img))
        meta = re.search(r'<span class="meta-category">[\s\S]*?</span>', tpl)
        if meta:
            link = re.search(r'<a class="[\w-]+ (style-[^"]*)" href="[^"]*">[^<]*</a>', meta.group(0))
            T[key + 'Category'] = '<a class="{{slug}} ' + link.group(1) + '" href="/work">{{label}}</a>'
            tpl = tpl.replace(meta.group(0), '<span class="meta-category">{{categoryLinks}}</span>')
        tpl = re.sub(r'<span class="meta-date">[^<]*</span>', '<span class="meta-date">{{date}}</span>', tpl)
        T[key + 'Item'].append(tpl)
    return replace_range(body, ia, ib, '{{' + key + 'Items}}')


def grid_filters(body, T, key):
    fs, fe = find_el(body, r'<div class="nectar-post-grid-filters"')
    ia, ib = inner(body, fs, fe)
    T['filterAll'] = '<a href="#" class="active all-filter" data-filter="-1" data-total-count="{{count}}">{{label}}</a>'
    T['filter'] = '<a href="#" data-filter="{{slug}}" data-total-count="{{count}}">{{label}}</a>'
    return replace_range(body, ia, ib, '<div>{{' + key + 'Filters}}</div>')


CATEGORIES = [{'slug': 'art-culture', 'title': 'Art & Culture'}, {'slug': 'concepts', 'title': 'Concepts'}, {'slug': 'ecommerce', 'title': 'eCommerce'}, {'slug': 'websites', 'title': 'Websites'}]
PROJECT_CATEGORIES = {'crystal-vibes': ['art-culture', 'concepts'], 'into-the-heat': ['concepts', 'websites'], 'radiant': ['art-culture', 'concepts'], 'framework': ['art-culture', 'concepts'], 'balanced': ['ecommerce', 'websites']}


# ---------------------------------------------------------------- pages

def home(body, T, D):
    heads = list(re.finditer(r'<div class="nectar-split-heading  font_size_14vw[^>]*>\s*<h1 >([^<]*)</h1>\s*</div>', body))
    assert len(heads) == 2
    D['heroLines'] = [h.group(1) for h in heads]
    T['heroLine'] = heads[0].group(0).replace('>' + heads[0].group(1) + '<', '>{{text}}<')
    body = replace_range(body, heads[0].start(), heads[1].end(), '{{heroLines}}')

    D['heroMeta'] = ['Based in New York', 'A boutique marketing + creative agency', 'Established 2013']
    for i, label in enumerate(D['heroMeta']):
        body = once(body, label, '{{heroMeta%d}}' % (i + 1))

    ts, te = find_el(body, r'<div class="nectar-content-trail__list"')
    ia, ib = inner(body, ts, te)
    imgs = re.findall(r'<img[^>]*>', body[ia:ib])
    D['heroTrail'] = [img_info(x) for x in imgs]
    T['trailImage'] = [tokenize_img(x) for x in imgs]
    body = replace_range(body, ia, ib, '{{heroTrail}}')

    D['introText'] = 'From strategy to spotlight, we make brands shine'
    body = once(body, '<h2>' + D['introText'] + '</h2>', '<h2>{{introText}}</h2>')
    D['introCtaLabel'], D['introCtaHref'] = 'Start a Project', '#contact'
    ss, se = find_el(body, r'<div id="services"')
    services = body[ss:se].replace('Start a Project', '{{introCtaLabel}}').replace('href="#contact"', 'href="{{introCtaHref}}"')
    fs, fe = find_el(services, r'<div class="flickity-slider"')
    ia, ib = inner(services, fs, fe)
    T['serviceCards'], D['services'] = [], []
    for a, b in children(services, ia, ib):
        card = services[a:b]
        title = re.search(r'<h3>([^<]*)</h3>', card).group(1)
        image = re.search(r'data-nectar-img-src="([^"]*)"', card).group(1)
        badges = re.findall(r'<div class="nectar-badge [\s\S]*?</div></div>', card)
        D['services'].append({'title': htmllib.unescape(title), 'image': image, 'bullets': [text(x) for x in badges]})
        # one template per badge position: a few badges use a different (equivalent) colour notation
        T.setdefault('badges', []).append([re.sub(r'<div class="nectar-badge__inner">[^<]*</div>', '<div class="nectar-badge__inner">{{text}}</div>', x) for x in badges])
        tpl = card.replace('<h3>' + title + '</h3>', '<h3>{{title}}</h3>').replace('data-nectar-img-src="' + image + '"', 'data-nectar-img-src="{{image}}"')
        tpl = tpl[: tpl.index(badges[0])] + '{{badges}}' + tpl[tpl.index(badges[-1]) + len(badges[-1]):]
        T['serviceCards'].append(tpl)
    body = replace_range(body, ss, se, replace_range(services, ia, ib, '{{serviceCards}}'))

    hs_, he_ = find_el(body, r'<h2 style="text-align: center">In a')
    ia, ib = inner(body, hs_, he_)
    content = body[ia:ib]
    marker_re = r'<span class="nectar-text-inline-images__marker"[\s\S]*?</span>'
    markers = re.findall(marker_re, content)
    img0 = re.search(r'<img[^>]*>', markers[0]).group(0)
    T['inlineImage'] = markers[0].replace(img0, tokenize_img(img0))
    D['noise'] = {'segments': [htmllib.unescape(p).strip() for p in re.split(marker_re, content)], 'images': [img_info(re.search(r'<img[^>]*>', x).group(0)) for x in markers]}
    body = replace_range(body, ia, ib, '{{noiseContent}}')

    body = once(body, '>Featured Work<', '>{{workHeading}}<')
    D['workHeading'] = 'Featured Work'
    body = grid_filters(body, T, 'work')
    body = grid_items(body, T, D, 'work', r'<div class="nectar-post-grid ')
    for item in D['work']:
        item['categories'] = PROJECT_CATEGORIES[item['href'].rstrip('/').split('/')[-1]]
    D['categories'] = CATEGORIES

    ts, te = find_el(body, r'<div class="slides">')
    ia, ib = inner(body, ts, te)
    quotes = children(body, ia, ib)
    D['testimonials'] = []
    for a, b in quotes:
        x = body[a:b]
        D['testimonials'].append({
            'quote': text(re.search(r'<span class="open-quote">[^<]*</span>([\s\S]*?)<span class="close-quote">', x).group(1)),
            'name': text(re.search(r'<span class="testimonial-name">([^<]*)</span>', x).group(1)),
            'role': text(re.search(r'<span class="title">([^<]*)</span>', x).group(1)),
            'icon': re.search(r'data-nectar-img-src="([^"]*)"', x).group(1),
        })
    x = body[quotes[0][0]:quotes[0][1]]
    x = re.sub(r'data-nectar-img-src="[^"]*"', 'data-nectar-img-src="{{icon}}"', x)
    x = re.sub(r'(<span class="open-quote">[^<]*</span>)[\s\S]*?(<span class="close-quote">)', r'\1{{quote}}\2', x)
    x = re.sub(r'(<span class="testimonial-name">)[^<]*', r'\1{{name}}', x)
    x = re.sub(r'(<span class="title">)[^<]*', r'\1{{role}}', x)
    T['testimonial'] = x
    body = replace_range(body, ia, ib, '{{testimonials}}')

    # The showreel section stays; the video and its button only render when set in Payload
    vs, ve = find_el(body, r'<div class="nectar-video-wrap')
    T['videoBg'] = re.sub(r'data-nectar-video-src="[^"]*"', 'data-nectar-video-src="{{src}}"', body[vs:ve])
    body = replace_range(body, vs, ve, '{{videoBg}}')
    cs_, ce_ = find_el(body, r'<div class="nectar-cta [^"]*"[^>]*data-style="text-reveal"[^>]*data-text-color="custom"')
    cta = body[cs_:ce_]
    D['video'] = {'label': 'Play Video', 'href': re.search(r'href="([^"]*)"', cta).group(1)}
    T['videoCta'] = cta.replace(D['video']['href'], '{{href}}').replace('Play Video', '{{label}}')
    return replace_range(body, cs_, ce_, '{{videoCta}}')


def work(body, T, D):
    body = grid_filters(body, T, 'work')
    body = grid_items(body, T, D, 'work', r'<div class="nectar-post-grid ')
    D['categories'] = CATEGORIES
    return body


def portfolio(body, T, D):
    # -- title row: two columns, text on the left and the meta lists on the right
    rs, re_ = find_el(body, r'<div id="portfolio-extra">')
    first_row_start = re.search(r'<div id="fws_', body[rs:]).start() + rs
    row_end = end_of(body, first_row_start)
    row = body[first_row_start:row_end]
    blocks = re.findall(r'<div class="nectar-responsive-text[^"]*"[^>]*>([\s\S]*?)\n?</div>', row)
    left = [b for b in blocks if not re.search(r'<p>(Expertises|Services)</p>', b)]
    # Crystal Vibes: <p>title</p><h1>tagline</h1>; Radiant: <h1>title</h1><h2>tagline</h2>
    D['title'], D['tagline'], D['body'] = text(left[0]), text(left[1]), text(left[2])
    for value, token in ((left[0], 'title'), (left[1], 'tagline'), (left[2], 'body')):
        tag = re.match(r'<(\w+)>', value).group(1)
        row = once(row, value, f'<{tag}>{{{{{token}}}}}</{tag}>')
    lists = re.findall(r'(<span class="nectar-meta-category-el [^>]*>)([\s\S]*?)(</span>)(?=<div|\s*</div>)', row)
    assert len(lists) == 2, len(lists)
    D['expertises'] = [text(x) for x in re.findall(r'<span>[^<]*</span>', lists[0][1])]
    D['services'] = [text(x) for x in re.findall(r'<span>[^<]*</span>', lists[1][1])]
    for (open_tag, items, close), token in zip(lists, ('expertises', 'services')):
        row = once(row, open_tag + items + close, open_tag + '{{' + token + '}}' + close)
    T['metaItem'] = '<span>{{text}}</span>'
    body = replace_range(body, first_row_start, row_end, row)

    # -- image rows inside the section: full width (one column) or two halves
    ss, se = find_el(body, r'<section id="fws_')
    sa, sb = inner(body, ss, se)
    wrap_s = re.search(r'<div class="row_col_wrap_12', body[sa:sb]).start() + sa
    wa, wb = inner(body, wrap_s, end_of(body, wrap_s))
    rows = children(body, wa, wb)
    D['gallery'] = []
    for a, b in rows:
        x = body[a:b]
        imgs = [img_info(i) for i in re.findall(r'<img[^>]*>', x)]
        layout = 'half' if 'vc_col-sm-6' in x else 'full'
        for img in imgs:
            D['gallery'].append({'layout': layout, 'image': img})
        if layout == 'full' and 'rowFull' not in T:
            img = re.search(r'<img[^>]*>', x).group(0)
            T['rowFullFirst'] = re.sub(r'id="fws_\w+"', 'id="{{id}}"', x.replace(img, tokenize_img(img)))
            T['rowFull'] = re.sub(r'id="fws_\w+"', 'id="{{id}}"', x.replace(img, tokenize_img(re.sub(r' fetchpriority="high"', '', img))))
        if layout == 'half' and 'rowHalf' not in T:
            cols = re.findall(r'<div\s+class="vc_col-sm-6', x)
            col_starts = [m.start() for m in re.finditer(r'<div\s+class="vc_col-sm-6', x)]
            c0 = x[col_starts[0]:end_of(x, col_starts[0])]
            img = re.search(r'<img[^>]*>', c0).group(0)
            T['halfColumn'] = c0.replace(img, tokenize_img(img))
            row_tpl = x[:col_starts[0]] + '{{columns}}' + x[end_of(x, col_starts[-1]):]
            T['rowHalf'] = re.sub(r'id="fws_\w+"', 'id="{{id}}"', row_tpl)
    body = replace_range(body, wa, wb, '{{galleryRows}}')

    # -- other work
    body = once(body, '<p>Other Work</p>', '<p>{{otherWorkHeading}}</p>')
    D['otherWorkHeading'] = 'Other Work'
    body = body.replace('<a  class="link_text" role="button" href="">', '<a  class="link_text" role="button" href="/work">', 1)
    if '<div class="nectar-post-grid-filters"' in body:
        body = grid_filters(body, T, 'other')
    return grid_items(body, T, D, 'other', r'<div class="nectar-post-grid ')


PAGES = [
    ('home', 'index.html', home),
    ('work', 'work/index.html', work),
    ('portfolio-crystal-vibes', 'portfolio/crystal-vibes/index.html', portfolio),
    ('portfolio-radiant', 'portfolio/radiant/index.html', portfolio),
]


def build(page, rel, fn):
    doc = open(os.path.join(SRC, rel), encoding='utf-8').read()
    page_dir = os.path.dirname(rel)
    styles = build_styles(page, doc, page_dir)
    body_tag = re.search(r'<body([^>]*)>', doc).group(1)
    body_class = re.search(r'class="([^"]*)"', body_tag).group(1)
    body_attributes = {k: v for k, v in re.findall(r'([\w-]+)="([^"]*)"', body_tag) if k != 'class'}
    T, D = {}, {}
    body = chrome(prepare_body(doc), T, D)
    body = fn(body, T, D)

    js = re.search(r'<script[^>]*src="/signal/wp/includes/js/jquery/jquery\.min', body).start()
    markup, scripts = body[:js], body[js:] + '\n<script src="/signal/site.js"></script>\n'

    with open(os.path.join(GENERATED, f'{page}.ts'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(f'/* eslint-disable */\n// Generated by scripts/signal/extract.py from signal-portfolio/{rel}. Do not edit by hand.\n\n')
        f.write('export const bodyClass = ' + json.dumps(body_class) + '\n\n')
        f.write('export const bodyAttributes: Record<string, string> = ' + json.dumps(body_attributes, indent=2) + '\n\n')
        f.write('export const markup = ' + json.dumps(markup, ensure_ascii=False) + '\n\n')
        f.write('export const scripts = ' + json.dumps(scripts, ensure_ascii=False) + '\n\n')
        f.write('export const templates = ' + json.dumps(T, ensure_ascii=False, indent=2) + ' as const\n\n')
        f.write('export const defaults = ' + json.dumps(D, ensure_ascii=False, indent=2) + '\n')
    left = sorted(set(re.findall(r'\{\{(\w+)\}\}', markup)))
    print(f'{page}: {styles} styles, tokens {left}')


if __name__ == '__main__':
    shutil.rmtree(STYLES, ignore_errors=True)
    shutil.rmtree(GENERATED, ignore_errors=True)
    os.makedirs(GENERATED)
    for page, rel, fn in PAGES:
        build(page, rel, fn)
    print('assets copied:', len(copied))
    if missing:
        print('could not fetch:', *missing, sep='\n  ')
