import React from 'react'

import { SignalMarkup } from '@/site/SignalDocument'
import { workPage } from '@/site/work'

export default async function WorkPage() {
  return <SignalMarkup {...await workPage()} />
}
