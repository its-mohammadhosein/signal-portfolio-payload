export type SiteImage = {
  alt: string
  height: number
  src: string
  srcset?: string
  width: number
}

export type SiteLink = { href: string; label: string }

export type Category = { slug: string; title: string }

export type WorkItem = {
  categories: Category[]
  date: string
  href: string
  id: string
  image: SiteImage
  slug: string
  title: string
}

export const formatDate = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC',
        year: 'numeric',
      })
    : ''
