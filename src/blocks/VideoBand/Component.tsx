import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import React from 'react'

import type { VideoBandBlock as VideoBandBlockProps } from '@/payload-types'

import { Button } from '@/components/ui/button'

const heightClasses = {
  '50': 'min-h-[50vh]',
  '70': 'min-h-[70vh]',
  '100': 'min-h-screen',
}

/** Renders as a plain band when no video is set, so the section can exist before the footage does */
export const VideoBandBlock: React.FC<VideoBandBlockProps> = ({
  backgroundVideo,
  externalVideoUrl,
  heading,
  height,
  playLabel,
  poster,
}) => {
  const video = backgroundVideo && typeof backgroundVideo === 'object' ? backgroundVideo : null
  const posterImage = poster && typeof poster === 'object' ? poster : null

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        heightClasses[height || '70'],
        video && 'text-paper',
      )}
    >
      {video?.url && (
        <>
          <video
            aria-hidden="true"
            autoPlay
            className="absolute inset-0 size-full object-cover"
            loop
            muted
            playsInline
            poster={
              posterImage?.url ? getMediaUrl(posterImage.url, posterImage.updatedAt) : undefined
            }
            preload="metadata"
            src={getMediaUrl(video.url, video.updatedAt)}
          />
          <div className="absolute inset-0 bg-ink/40" />
        </>
      )}

      <div className="container relative flex flex-col items-center gap-8 py-16 text-center">
        {heading && <h2 className="text-h2">{heading}</h2>}
        {externalVideoUrl && (
          <Button asChild size="lg" variant="pill">
            <a href={externalVideoUrl} rel="noopener noreferrer" target="_blank">
              {playLabel || 'Play Video'}
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
