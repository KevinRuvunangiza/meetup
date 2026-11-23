/**
 * EXAMPLES SECTION
 * One example creator card + one example campaign card.
 * Both clearly labelled "Example" / "Exemple".
 * No real photos — geometric avatar only.
 */
import { Section, SectionHeader } from '@/components/ui/Section'
import { ExampleCreatorCard, ExampleCampaignCard } from '@/components/ui/Card'
import { useTranslation } from '@/hooks/useTranslation'

interface Platform {
  name: string
  followers: string
}

interface CreatorCardData {
  badge: string
  name: string
  type: string
  niches: string[]
  bio: string
  platforms: Platform[]
  verified: string[]
}

interface CampaignCardData {
  badge: string
  brandName: string
  sector: string
  need: string
  deliverables: string
  deadline: string
  budget: string
  usage: string
  note: string
}

export function Examples() {
  const { t } = useTranslation()

  const creator = (t('examples.creatorCard') as unknown as CreatorCardData) || {}
  const campaign = (t('examples.campaignCard') as unknown as CampaignCardData) || {}

  return (
    <Section id="examples" dark>
      <SectionHeader
        label={t('examples.label')}
        title={t('examples.title')}
        subtitle={t('examples.subtitle')}
        light
      />

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
        <ExampleCreatorCard
          badge={creator.badge}
          name={creator.name}
          type={creator.type}
          niches={creator.niches}
          bio={creator.bio}
          platforms={creator.platforms}
          verified={creator.verified}
        />
        <ExampleCampaignCard
          badge={campaign.badge}
          brandName={campaign.brandName}
          sector={campaign.sector}
          need={campaign.need}
          deliverables={campaign.deliverables}
          deadline={campaign.deadline}
          budget={campaign.budget}
          usage={campaign.usage}
          note={campaign.note}
        />
      </div>
    </Section>
  )
}
