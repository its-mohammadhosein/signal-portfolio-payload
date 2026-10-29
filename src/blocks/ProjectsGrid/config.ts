import type { Block } from 'payload'

import { blockSettings } from '@/fields/blockSettings'

export const ProjectsGrid: Block = {
  slug: 'projectsGrid',
  interfaceName: 'ProjectsGridBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'showFilters',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show category filters',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'Most recent projects', value: 'all' },
        { label: 'Choose projects', value: 'selection' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'all',
        step: 1,
      },
    },
    {
      name: 'selectedProjects',
      type: 'relationship',
      hasMany: true,
      relationTo: 'projects',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid (3 columns)', value: 'grid' },
        { label: 'Featured (2 columns, larger cards)', value: 'featured' },
      ],
    },
    blockSettings(),
  ],
  labels: {
    plural: 'Projects grids',
    singular: 'Projects grid',
  },
}
