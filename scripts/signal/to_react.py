"""
One-off conversion of the crawled Signal markup into React components (src/site/components).

    python scripts/signal/to_react.py

It was run once to create the components; they are maintained by hand from then on.
Re-running overwrites the converted files listed in COMPONENTS, nothing else.
Each component keeps the original DOM (elements, attributes, classes, whitespace);
every editable spot is a typed prop.
"""

import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import extract as X  # noqa: E402
from html2jsx import to_jsx, tokens_in  # noqa: E402

X.take = lambda rel: X.public_url(rel)[0]  # conversion only, assets are handled by extract.py
OUT = os.path.join(X.APP, 'src', 'site', 'components')

NODE_PROPS = {
    'badges', 'categoryLinks', 'children', 'colorLayer', 'columns', 'expertises', 'galleryRows', 'heroLines',
    'heroTrail', 'image', 'menuItems', 'noiseContent', 'otherFilters', 'otherItems', 'serviceCards', 'services',
    'socials', 'testimonials', 'videoBg', 'videoCta', 'workFilters', 'workItems',
}
# Original token names -> clearer prop names
RENAMES = {'heroMeta1': 'metaLeft', 'heroMeta2': 'metaCenter', 'heroMeta3': 'metaRight'}

written = []


def component(path, name, html, doc):
    for old, new in RENAMES.items():
        html = html.replace('{{' + old + '}}', '{{' + new + '}}')
    # Whitespace around a list placeholder sat between block items in the original: not rendered, drop it
    lists = '|'.join(sorted(NODE_PROPS - {'image'}))
    html = re.sub(r'[ \t\r\n]*(\{\{(?:' + lists + r')\}\})[ \t\r\n]*', r'\1', html)
    props = tokens_in(html)
    jsx = to_jsx(html, depth=2)
    types = '; '.join(f'{p}{"" if p == "children" else ""}: {"React.ReactNode" if p in NODE_PROPS else "string"}' for p in props)
    signature = f'{{ {", ".join(props)} }}: {{ {types} }}' if props else ''
    src = f"""import React from 'react'

/** {doc} */
export function {name}({signature}) {{
  return (
{jsx}
  )
}}
"""
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, 'w', encoding='utf-8', newline='\n').write(src)
    written.append(full)


def el(h, pattern, start=0):
    a, b = X.find_el(h, pattern, start)
    return h[a:b]


def replace_el(h, pattern, token):
    a, b = X.find_el(h, pattern)
    return h[:a] + '{{' + token + '}}' + h[b:]


def without_img(tpl, token='image'):
    imgs = re.findall(r'<img[^>]*>', tpl)
    assert len(imgs) == 1, len(imgs)
    return tpl.replace(imgs[0], '{{' + token + '}}')


def same(templates):
    first = templates[0]
    assert all(t == first for t in templates), 'templates differ beyond the image'
    return first


def inner_children(h, pattern):
    """(wrapper with {{children}}, [child html]) for the element matching pattern"""
    a, b = X.find_el(h, pattern)
    ia, ib = X.inner(h, a, b)
    kids = [h[x:y] for x, y in X.children(h, ia, ib)]
    return h[:ia] + '{{children}}' + h[ib:], kids


pages = {name: X.extract_page(name, rel, fn) for name, rel, fn in X.PAGES}
home, work = pages['home'], pages['work']
m = home['markup']

# ---------------------------------------------------------------- shared chrome
component('SkipLink.tsx', 'SkipLink', el(m, r'<nav aria-label="Skip links"'), 'The skip-to-content link at the top of every page')
component('SiteHeader.tsx', 'SiteHeader', el(m, r'<div id="header-outer"'), 'The transparent header: logo, "Get Started" button and the menu toggle')

ajax = el(m, r'<div id="ajax-content-wrap">')
footer = el(ajax, r'<div class="nectar-global-section nectar_hook_global_section_footer"') + el(ajax, r'<div id="footer-outer"')
# WordPress-only hidden form fields (post id, nonce, referer)
footer = re.sub(r"<input type=['\"]hidden['\"][^>]*>", '', footer)
component('SiteFooter.tsx', 'SiteFooter', footer, 'The contact section (form, "Say Hello", "Get Social") and the SIGNAL wordmark')
component('SocialLink.tsx', 'SocialLink', home['templates']['social'], 'One "Get Social" link')
component('OffCanvasMenu.tsx', 'OffCanvasMenu', el(ajax, r'<div id="slide-out-widget-area-bg"') + el(ajax, r'<div id="slide-out-widget-area" '), 'The menu that slides in from the right')

# ---------------------------------------------------------------- home
T = home['templates']
wrapper, rows = inner_children(el(ajax, r'<div class="container-wrap"'), r'<div class="row')
assert len(rows) == 6, len(rows)
component('home/HomeMain.tsx', 'HomeMain', wrapper, 'The home page content area; the sections are its children')
component('home/HeroSection.tsx', 'HeroSection', rows[0], '"WE CREATE / THE HYPE" with the three labels and the image trail that follows the cursor')
component('home/HeroLine.tsx', 'HeroLine', T['heroLine'], 'One line of the hero headline (revealed letter by letter)')
component('home/ServicesSection.tsx', 'ServicesSection', rows[1], 'The intro sentence with its link, and the auto-scrolling ticker of service cards')
cards = [re.sub(r'id="fws_\w+"', 'id="{{rowId}}"', c) for c in T['serviceCards']]
layer = re.compile(r'<div class="nectar_color_layer"[^>]*></div>')
cards = [c.replace('data-nectar-img-src="{{image}}"', 'data-nectar-img-src="{{imageUrl}}"') for c in cards]
card = layer.sub('{{colorLayer}}', cards[1])
assert all(layer.sub('', c).replace('{{colorLayer}}', '') == card.replace('{{colorLayer}}', '') for c in cards)
component('home/ServiceCard.tsx', 'ServiceCard', card, 'One card of the services ticker')
component('home/ServiceBadge.tsx', 'ServiceBadge', T['badges'][0][0], 'One pill under a service card title')
component('home/NoiseSection.tsx', 'NoiseSection', rows[2], 'The statement whose words fade in on scroll, with images between the words')
component('home/InlineImage.tsx', 'InlineImage', without_img(T['inlineImage']), 'An image between the words of the statement')
component('home/FeaturedWorkSection.tsx', 'FeaturedWorkSection', rows[3], 'Featured Work: the filterable project list')
component('home/FeaturedWorkItem.tsx', 'FeaturedWorkItem', same([without_img(t) for t in T['workItem']]), 'One project in the Featured Work list')
component('home/TestimonialsSection.tsx', 'TestimonialsSection', rows[4], 'The testimonial slider')
component('home/Testimonial.tsx', 'Testimonial', T['testimonial'], 'One testimonial slide')
component('home/ShowreelSection.tsx', 'ShowreelSection', rows[5], 'The showreel band: background video and "Play Video" button when set')
component('home/VideoBackground.tsx', 'VideoBackground', T['videoBg'], 'The looping background video of the showreel')
component('home/PlayVideoButton.tsx', 'PlayVideoButton', T['videoCta'], 'The "Play Video" button, opens the video in a lightbox')

# ---------------------------------------------------------------- work
W = work['templates']
component('work/WorkMain.tsx', 'WorkMain', el(el(work['markup'], r'<div id="ajax-content-wrap">'), r'<div class="container-wrap"'), 'The work page: every project in the stacked full-screen grid')
component('work/WorkGridItem.tsx', 'WorkGridItem', same([without_img(t) for t in W['workItem']]), 'One project of the work page grid')

# ---------------------------------------------------------------- portfolio
for slug, Name in (('crystal-vibes', 'CrystalVibes'), ('radiant', 'Radiant')):
    P = pages['portfolio-' + slug]
    pajax = el(P['markup'], r'<div id="ajax-content-wrap">')
    end = pajax.index('<div class="nectar-global-section nectar_hook_global_section_footer"')
    start = pajax.index('>') + 1
    component(f'portfolio/{Name}Main.tsx', f'{Name}Main', pajax[start:end], f'The {slug} case study layout: title row, image rows and Other Work')

# Gallery rows: each case study keeps its own markup (Crystal Vibes' half columns lack vc_col-xs-6)
for slug, Name in (('crystal-vibes', 'CrystalVibes'), ('radiant', 'Radiant')):
    P = pages['portfolio-' + slug]['templates']
    assert without_img(P['rowFull']) == without_img(P['rowFullFirst'])
    component(f'portfolio/{Name}GalleryRowFull.tsx', f'{Name}GalleryRowFull', without_img(P['rowFull']), f'A full-width image row of the {slug} layout')
    component(f'portfolio/{Name}GalleryRowHalf.tsx', f'{Name}GalleryRowHalf', P['rowHalf'], f'A row of two half-width images in the {slug} layout')
    component(f'portfolio/{Name}GalleryHalfColumn.tsx', f'{Name}GalleryHalfColumn', without_img(P['halfColumn']), f'One half-width image of a row in the {slug} layout')
component('portfolio/OtherWorkItem.tsx', 'OtherWorkItem', same([without_img(t) for t in pages['portfolio-radiant']['templates']['otherItem']]), 'One project in the Other Work list')
assert same([without_img(t) for t in pages['portfolio-crystal-vibes']['templates']['otherItem']]) == same([without_img(t) for t in pages['portfolio-radiant']['templates']['otherItem']])

subprocess.run(['npx', 'prettier', '--write', *written], cwd=X.APP, shell=os.name == 'nt', check=True, stdout=subprocess.DEVNULL)
print('\n'.join(os.path.relpath(w, X.APP) for w in written))
