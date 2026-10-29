import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logoText',
      type: 'text',
      defaultValue: 'Signal',
      required: true,
      admin: {
        description: 'Text wordmark shown in the header.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    link({
      appearances: ['pill', 'pillOutline'],
      overrides: {
        name: 'cta',
        label: 'Call to action button',
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
