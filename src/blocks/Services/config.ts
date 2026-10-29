import type { Block } from 'payload'

import { blockSettings } from '@/fields/blockSettings'
import { linkGroup } from '@/fields/linkGroup'

export const Services: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    linkGroup({
      appearances: false,
      overrides: {
        maxRows: 1,
      },
    }),
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'bullets',
          type: 'array',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Decorative image revealed when the service is hovered.',
          },
        },
      ],
    },
    blockSettings(),
  ],
  labels: {
    plural: 'Services',
    singular: 'Services',
  },
}
