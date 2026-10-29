import type { CollapsibleField } from 'payload'

export const sectionThemes = ['paper', 'paperAlt', 'ink'] as const

export type SectionTheme = (typeof sectionThemes)[number]

/**
 * Shared settings for every layout block. `anchorId` becomes the section's `id` (for in-page
 * links like `#services`) and `theme` selects the background band, see `RenderBlocks`.
 */
export const blockSettings = (): CollapsibleField => ({
  type: 'collapsible',
  label: 'Section settings',
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: 'anchorId',
      type: 'text',
      label: 'Anchor ID',
      admin: {
        description:
          'Used as the section id, so it can be linked to as /#your-id. Lowercase letters, numbers and dashes.',
      },
      validate: (value: null | string | undefined) =>
        !value || /^[a-z][a-z0-9-]*$/.test(value)
          ? true
          : 'Use lowercase letters, numbers and dashes, starting with a letter.',
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'paper',
      label: 'Background',
      options: [
        { label: 'Paper', value: 'paper' },
        { label: 'Paper (alternate)', value: 'paperAlt' },
        { label: 'Ink (dark)', value: 'ink' },
      ],
    },
  ],
})
