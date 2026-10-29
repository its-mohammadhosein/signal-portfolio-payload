/** URL prefix of each collection that has public detail pages */
export const collectionPrefixMap = {
  pages: '',
  posts: '/posts',
  projects: '/portfolio',
} as const

export type PrefixedCollection = keyof typeof collectionPrefixMap
