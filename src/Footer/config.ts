import type { GlobalConfig } from 'payload'

import { revalidateFooter } from './hooks/revalidateFooter'

export const socialPlatforms = [
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'X', value: 'x' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Dribbble', value: 'dribbble' },
  { label: 'Behance', value: 'behance' },
]

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contact',
      type: 'group',
      admin: {
        description: 'The contact section shown directly above the footer on every page.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Say Hello email',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Get Social links',
      admin: {
        initCollapsed: true,
        description: 'The "Get Social" column is hidden while this list is empty.',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: socialPlatforms,
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'wordmark',
      type: 'text',
      defaultValue: 'SIGNAL',
      admin: {
        description: 'Large decorative sign-off at the bottom of the footer.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
