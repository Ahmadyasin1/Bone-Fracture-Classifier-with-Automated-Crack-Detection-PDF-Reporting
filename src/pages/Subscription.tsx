import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '$9.99',
    period: 'month',
    features: [
      '10 X-ray analyses per month',
      'Basic report generation',
      'Email support',
      'Results history'
    ]
  },
  {
    name: 'Professional',
    price: '$29.99',
    period: 'month',
    features: [
      'Unlimited X-ray analyses',
      'Advanced report generation',
      'Priority support',
      'Results history',
      'Bulk upload',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$99.99',
    period: 'month',
    features: [
      'Everything in Professional',
      'Custom integration',
      'Dedicated support',
      'Training sessions',
      'Custom features',
      'SLA guarantee'
    ]
  }
];

export const Subscription = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include our advanced AI-powered
            bone fracture detection technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-slate-800/50 rounded-xl p-8 border ${
                plan.popular
                  ? 'border-amber-400 shadow-lg shadow-amber-400/10'
                  : 'border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-400 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-amber-400 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
                <div className="text-slate-400">per {plan.period}</div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-amber-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-900'
                    : 'bg- slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-amber-400 mb-4">
            Enterprise Solutions
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            Need a custom solution? Contact us for enterprise-grade deployments with
            dedicated support and custom features.
          </p>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-medium">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};