import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { FormBlock, type FormBlockType } from '@/blocks/Form/Component'

/** The contact form shown directly above the footer on every page. Configured in the footer global. */
export async function ContactSection() {
  const { contact } = await getCachedGlobal('footer', 1)()

  const form = contact?.form
  if (!contact?.enabled || !form || typeof form !== 'object') return null

  return (
    <section className="py-24 md:py-32" data-section-theme="paperAlt" id="contact">
      <div className="container">
        {/* The source heading is visually hidden, so it stays screen-reader only unless one is set */}
        <h2 className={contact.heading ? 'text-h2 mb-12 text-center' : 'sr-only'}>
          {contact.heading || 'Contact'}
        </h2>
        <FormBlock enableIntro={false} form={form as unknown as FormBlockType['form']} />
      </div>
    </section>
  )
}
