import React from 'react'

/** The looping background video of the showreel */
export function VideoBackground({ src }: { src: string }) {
  return (
    <div className="nectar-video-wrap row-bg-layer" data-bg-alignment="">
      <div className="nectar-video-inner">
        {' '}
        <video
          className="nectar-video-bg nectar-lazy-video"
          width="1800"
          height="700"
          preload="auto"
          loop
          autoPlay
          muted
          playsInline
        >
          <source data-nectar-video-src={src} type="video/mp4" />
        </video>{' '}
      </div>
    </div>
  )
}
