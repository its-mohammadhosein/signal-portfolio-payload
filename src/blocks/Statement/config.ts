import type { Block } from 'payload'

import { blockSettings } from '@/fields/blockSettings'
import { linkGroup } from '@/fields/linkGroup'

export const Statement: Block = {
  slug: 'statement',
  interfaceName: 'StatementBlock',
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    linkGroup({
      appearances: ['pill', 'pillOutline'],
      overrides: {
        maxRows: 1,
      },
    }),
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    {
      name: 'revealOnScroll',
      type: 'checkbox',
      label: 'Reveal word by word on scroll',
    },
    {
      name: 'trailImages',
      type: 'upload',
      hasMany: true,
      relationTo: 'media',
      admin: {
        description: 'Decorative images that follow the cursor over the statement.',
      },
    },
    blockSettings(),
  ],
  labels: {
    plural: 'Statements',
    singular: 'Statement',
  },
}
