import React from 'react'

import { homePage } from '@/site/home'
import { SignalMarkup } from '@/site/SignalDocument'

export default async function HomePage() {
  return <SignalMarkup {...await homePage()} />
}
