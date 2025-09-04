import { checkoutAction } from '@/lib/payments/actions'
import { Check, X } from 'lucide-react'
import { SubmitButton } from './submit-button'

// Example feature matrix
const features = [
  'Unlimited Workouts',
  'AI Coaching',
  'Team Collaboration',
  '24/7 Support',
  'Exclusive Content',
]

const plans = [
  {
    name: 'Free',
    price: 0,
    interval: 'month',
    trialDays: 0,
    features: [true, false, false, false, false],
    highlight: false,
  },
  {
    name: 'Silver',
    price: 9,
    interval: 'month',
    trialDays: 7,
    features: [true, true, false, false, false],
    highlight: false,
  },
  {
    name: 'Gold',
    price: 29,
    interval: 'month',
    trialDays: 14,
    features: [true, true, true, true, false],
    highlight: false,
  },
  {
    name: 'Emerald',
    price: 59,
    interval: 'month',
    trialDays: 14,
    features: [true, true, true, true, true],
    highlight: true,
  },
]

export const revalidate = 3600

export default function PricingPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
          Choose the right plan for your journey
        </h1>
        <p className="mt-2 text-muted-foreground">
          Start free, upgrade as you grow. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>
    </main>
  )
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features: planFeatures,
  highlight,
}: {
  name: string
  price: number
  interval: string
  trialDays: number
  features: boolean[]
  highlight?: boolean
}) {
  return (
    <div
      className={`flex flex-col rounded-3xl border p-6 shadow-sm ${
        highlight
          ? 'border-primary shadow-lg ring-2 ring-primary/50'
          : 'border-border'
      }`}
    >
      <h2 className="text-2xl font-semibold text-foreground mb-2">{name}</h2>
      <p className="text-muted-foreground mb-4">
        {trialDays > 0
          ? `Includes ${trialDays}-day free trial`
          : 'No trial included'}
      </p>
      <p className="text-4xl font-bold text-foreground mb-6">
        {price === 0 ? 'Free' : `$${price}`}
        {price > 0 && (
          <span className="text-base font-normal text-muted-foreground">
            / {interval}
          </span>
        )}
      </p>

      <ul className="flex-1 space-y-4 mb-6">
        {features.map((feature, idx) => (
          <li key={feature} className="flex items-center">
            {planFeatures[idx] ? (
              <Check className="h-5 w-5 text-primary mr-2" />
            ) : (
              <X className="h-5 w-5 text-muted-foreground mr-2" />
            )}
            <span
              className={`${
                planFeatures[idx]
                  ? 'text-foreground'
                  : 'text-muted-foreground line-through'
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <form action={checkoutAction}>
        <input type="hidden" name="plan" value={name} />
        <SubmitButton
          className={`w-full rounded-full ${
            highlight
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : ''
          }`}
        />
      </form>
    </div>
  )
}
