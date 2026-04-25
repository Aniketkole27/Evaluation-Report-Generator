const HowToStart = () => {
  const steps = [
    {
      id: '01',
      name: 'Connect Data',
      description: 'Link your existing data sources or upload files directly to our secure platform.',
    },
    {
      id: '02',
      name: 'Configure Metrics',
      description: 'Select the key performance indicators and evaluation metrics that matter most.',
    },
    {
      id: '03',
      name: 'Generate Report',
      description: 'With a single click, compile a comprehensive, beautiful report ready for presentation.',
    },
  ];

  return (
    <section id="start" className="py-24 bg-bg-primary border-t border-border-subtle relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-border-subtle to-transparent blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight sm:text-4xl">
              From raw data to insights in three simple steps.
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              We've streamlined the entire evaluation process. No steep learning curves, no complicated setups. Just plug in and let the platform do the heavy lifting.
            </p>
            <div className="mt-8">
              <button className="bg-btn-bg text-btn-text px-6 py-3 rounded-full font-medium hover:bg-btn-hover transition-colors">
                Read the Documentation
              </button>
            </div>
          </div>

          <div className="mt-16 lg:mt-0">
            <div className="space-y-12">
              {steps.map((step) => (
                <div key={step.id} className="relative flex group">
                  <div className="flex-shrink-0 mr-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full border border-border-strong bg-bg-secondary text-text-primary font-bold text-lg group-hover:border-text-primary transition-colors duration-300">
                      {step.id}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-text-secondary transition-colors">{step.name}</h3>
                    <p className="text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToStart;
