import { Layers, Zap, Shield } from 'lucide-react';

const About = () => {
  const features = [
    {
      name: 'Unmatched Precision',
      description: 'Our algorithms ensure that your evaluation data is analyzed with pinpoint accuracy, leaving no room for error.',
      icon: Layers,
    },
    {
      name: 'Lightning Fast',
      description: 'Generate comprehensive reports in mere seconds. Focus your time on decision-making rather than data compilation.',
      icon: Zap,
    },
    {
      name: 'Enterprise Security',
      description: 'Your data is encrypted and protected with industry-leading security standards. Trust is our top priority.',
      icon: Shield,
    },
  ];

  return (
    <section id="about" className="py-24 bg-bg-primary border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-text-secondary font-semibold tracking-wide uppercase">About EvalGen</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-text-primary sm:text-4xl">
            A better way to understand your data
          </p>
          <p className="mt-4 max-w-2xl text-xl text-text-secondary mx-auto">
            We built EvalGen to solve the most complex reporting challenges. It's the only platform you need to turn raw metrics into compelling narratives.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative p-8 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-border-strong transition-colors duration-300 group">
                <div className="absolute top-0 -mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-icon-bg rounded-xl shadow-lg border border-border-subtle transform group-hover:-translate-y-1 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-text-primary" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg leading-6 font-medium text-text-primary">{feature.name}</h3>
                  <p className="mt-4 text-base text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
