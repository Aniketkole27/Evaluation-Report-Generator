import { ArrowRight } from 'lucide-react';
import heroImage from '../../../assets/hero_image.png';

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-text-secondary ring-1 ring-inset ring-border-strong mb-6">
              <span className="flex h-2 w-2 rounded-full bg-btn-bg mr-2"></span>
              Introducing the Future of Evaluation
            </div>
            <h1 className="text-5xl tracking-tight font-extrabold text-text-primary sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl">
              <span className="block">Generate</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-text-secondary to-text-primary">
                Better Reports
              </span>
            </h1>
            <p className="mt-6 text-base text-text-secondary sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Transform your raw data into stunning, actionable evaluation reports in seconds. Built for teams that demand precision, speed, and elegance.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-btn-text bg-btn-bg hover:bg-btn-hover md:py-4 md:text-lg md:px-10 transition-all duration-300 hover:scale-105">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="flex items-center justify-center px-8 py-4 border border-border-strong text-base font-medium rounded-full text-text-primary hover:bg-border-subtle md:py-4 md:text-lg md:px-10 transition-all duration-300">
                  View Demo
                </button>
              </div>
            </div>
          </div>
          <div className="mt-16 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-2xl shadow-lg lg:max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-bg-primary to-text-secondary rounded-2xl blur opacity-20"></div>
              <img
                className="relative w-full rounded-2xl object-cover transform hover:scale-[1.02] transition-transform duration-500"
                src={heroImage}
                alt="Abstract evaluation technology"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
