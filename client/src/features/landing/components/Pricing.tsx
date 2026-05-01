import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for trying out the platform and small projects.',
      features: ['Up to 3 reports/month', 'Basic templates', 'Standard support', '7-day data retention'],
      cta: 'Start for Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$49',
      description: 'Ideal for professionals needing advanced capabilities.',
      features: ['Unlimited reports', 'Premium templates', 'Priority support', 'Unlimited data retention', 'Custom branding'],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Dedicated solutions for large teams and organizations.',
      features: ['Everything in Pro', 'Dedicated account manager', 'SSO integration', 'Custom API access', 'SLA guarantee'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-bg-primary border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-text-primary sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-text-secondary mx-auto">
            Choose the plan that best fits your evaluation needs. No hidden fees.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                tier.popular ? 'border-text-primary bg-bg-secondary shadow-xl shadow-border-subtle transform lg:-translate-y-4' : 'border-border-subtle bg-bg-primary'
              } transition-transform duration-300 hover:border-border-strong`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 -mt-4 mr-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-btn-bg text-btn-text">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-text-primary">{tier.name}</h3>
                <p className="mt-4 flex items-baseline text-text-primary">
                  <span className="text-5xl font-extrabold tracking-tight">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="ml-1 text-xl font-semibold text-text-secondary">/mo</span>}
                </p>
                <p className="mt-4 text-text-secondary">{tier.description}</p>
              </div>
              
              <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-text-primary" aria-hidden="true" />
                    </div>
                    <p className="ml-3 text-base text-text-secondary">{feature}</p>
                  </li>
                ))}
              </ul>
              
              <Link
                to="/login"
                className={`mt-auto w-full py-4 px-8 border rounded-full text-center text-base font-medium transition-colors inline-block ${
                  tier.popular
                    ? 'bg-btn-bg text-btn-text hover:bg-btn-hover border-transparent'
                    : 'bg-transparent text-text-primary border-border-strong hover:bg-bg-secondary'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
