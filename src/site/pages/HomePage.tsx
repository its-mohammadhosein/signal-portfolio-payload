import React from 'react'

import { loadChrome, type SiteChrome } from '../chrome'
import { FeaturedWorkItem } from '../components/home/FeaturedWorkItem'
import { FeaturedWorkSection } from '../components/home/FeaturedWorkSection'
import { HeroLine } from '../components/home/HeroLine'
import { HeroSection } from '../components/home/HeroSection'
import { HomeMain } from '../components/home/HomeMain'
import { InlineImage } from '../components/home/InlineImage'
import { NoiseSection } from '../components/home/NoiseSection'
import { PlayVideoButton } from '../components/home/PlayVideoButton'
import { ServiceBadge } from '../components/home/ServiceBadge'
import { ServiceCard } from '../components/home/ServiceCard'
import { ServicesSection } from '../components/home/ServicesSection'
import { ShowreelSection } from '../components/home/ShowreelSection'
import { Testimonial } from '../components/home/Testimonial'
import { TestimonialsSection } from '../components/home/TestimonialsSection'
import { VideoBackground } from '../components/home/VideoBackground'
import { PostGridFilters } from '../components/PostGridFilters'
import { SalientImage } from '../components/SalientImage'
import { SiteShell } from '../components/SiteShell'
import { scripts } from '../data/home'
import { loadHomeContent, type HomeContent } from '../home'
import { loadWorkItems, originalCategories } from '../projects'
import type { WorkItem } from '../types'

/** The gradient stop of each original services card's dark layer; cards without one have none */
const cardLayers = [null, 36, 37, 36, null, null]

export async function HomePage() {
  const [content, chrome, allWork] = await Promise.all([
    loadHomeContent(),
    loadChrome(),
    loadWorkItems(),
  ])
  return <HomeView allWork={allWork} chrome={chrome} content={content} />
}

/** The home page for the given content; allWork is every project (newest first) */
export function HomeView({
  allWork,
  chrome,
  content,
}: {
  allWork: WorkItem[]
  chrome: SiteChrome
  content: HomeContent
}) {
  const work = allWork.slice(0, 6) // the original shows the six most recent projects
  const { images, segments } = content.noise

  return (
    <SiteShell chrome={chrome} path="/" scripts={scripts}>
      <HomeMain>
        <HeroSection
          heroLines={content.heroLines.map((text, i) => (
            <HeroLine key={i} text={text} />
          ))}
          heroTrail={content.heroTrail.map((image, i) => (
            <SalientImage
              className="nectar-content-trail__image nectar-aspect-ratio--3-2 nectar-lazy"
              image={image}
              key={i}
              lazy
              priority={i === 0}
            />
          ))}
          metaCenter={content.heroMeta[1]}
          metaLeft={content.heroMeta[0]}
          metaRight={content.heroMeta[2]}
        />

        <ServicesSection
          introCtaHref={content.intro.cta.href}
          introCtaLabel={content.intro.cta.label}
          introText={content.intro.text}
          serviceCards={content.services.map((service, i) => {
            const stop = cardLayers[i % cardLayers.length]
            return (
              <ServiceCard
                badges={service.bullets.map((text, j) => (
                  <ServiceBadge key={j} text={text} />
                ))}
                colorLayer={
                  stop ? (
                    <div
                      className="nectar_color_layer"
                      data-h-opacity="0.2"
                      style={{
                        background: `linear-gradient(0deg, rgb(0,0,0) 0%, rgba(0,0,0,0) ${stop}%)`,
                        opacity: '0.2',
                      }}
                    />
                  ) : null
                }
                imageUrl={service.image}
                key={i}
                rowId={`fws_signal_service_${i}`}
                title={service.title}
              />
            )
          })}
        />

        {/* The words around the inline images, with the original spacing: "In a <img> world full of ..." */}
        <NoiseSection
          noiseContent={segments.map((segment, i) => (
            <React.Fragment key={i}>
              {segment}
              {images[i] && i < segments.length - 1 ? (
                <>
                  {' '}
                  <InlineImage
                    image={
                      <SalientImage
                        className="nectar-lazy nectar-text-inline-images__image"
                        image={images[i]}
                        lazy
                      />
                    }
                  />{' '}
                </>
              ) : null}
            </React.Fragment>
          ))}
        />

        <FeaturedWorkSection
          workFilters={<PostGridFilters order={originalCategories} projects={allWork} />}
          workHeading={content.workHeading}
          workItems={work.map((project) => (
            <FeaturedWorkItem
              categories={project.categories.map((c) => c.slug).join(' ')}
              href={project.href}
              id={project.id}
              image={
                <SalientImage
                  className="nectar-lazy skip-lazy nectar-post-grid-item-bg__media"
                  image={project.image}
                  lazy
                  responsive
                />
              }
              key={project.id}
              title={project.title}
            />
          ))}
        />

        <TestimonialsSection
          testimonials={content.testimonials.map((item, i) => (
            <Testimonial
              icon={item.icon || ''}
              key={i}
              name={item.name}
              quote={item.quote}
              role={item.role}
            />
          ))}
        />

        {/* The showreel section is kept; its video and button only render once set in Payload */}
        <ShowreelSection
          videoBg={content.video.src ? <VideoBackground src={content.video.src} /> : null}
          videoCta={
            content.video.href ? (
              <PlayVideoButton href={content.video.href} label={content.video.label} />
            ) : null
          }
        />
      </HomeMain>
    </SiteShell>
  )
}
