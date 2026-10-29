import type { Block } from 'payload'

import { blockSettings } from '@/fields/blockSettings'

export const VideoBand: Block = {
  slug: 'videoBand',
  interfaceName: 'VideoBandBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional looping, muted background video (mp4).',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional image shown until the background video loads.',
      },
    },
    {
      name: 'externalVideoUrl',
      type: 'text',
      label: 'Video link',
      admin: {
        description:
          'Optional YouTube link opened by the play button. The button is hidden without it.',
      },
    },
    {
      name: 'playLabel',
      type: 'text',
      defaultValue: 'Play Video',
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: '70',
      options: [
        { label: '50% of the screen', value: '50' },
        { label: '70% of the screen', value: '70' },
        { label: 'Full screen', value: '100' },
      ],
    },
    blockSettings(),
  ],
  labels: {
    plural: 'Video bands',
    singular: 'Video band',
  },
}
