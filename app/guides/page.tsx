import { Metadata } from 'next'
import { getAllGuides } from '@/lib/guides'
import { GuidesClient } from '@/components/guides-client'

export const metadata: Metadata = {
  title: 'Plain-English Senior Guides: Social Security, Medicare, & Scams | SimplyBigNews',
  description:
    'Calm, jargon-free explanations of Social Security COLA, Medicare Part A & B, top phone scams, tax rules, and family finances written for everyday seniors.',
  openGraph: {
    title: 'Plain-English Senior Guides | SimplyBigNews',
    description:
      'Clear, calm explanations of Social Security, Medicare, scams, and family money without confusing jargon.',
  },
}

export default function GuidesPage() {
  const guides = getAllGuides()

  return <GuidesClient guides={guides} />
}
