import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-text-primary font-bold text-xl tracking-tighter">EVAL<span className="text-text-secondary">GEN</span></span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
              <a href="#about" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
              <a href="#start" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">How it works</a>
              <a href="#pricing" className="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link 
              to="/login"
              className="bg-btn-bg text-btn-text px-5 py-2 rounded-full font-medium text-sm hover:bg-btn-hover transition-colors"
            >
              Get Started
            </Link>
          </div>
          <div className="-mr-2 flex items-center md:hidden space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-border-strong focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-bg-primary border-b border-border-subtle">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="#about" className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">About</a>
            <a href="#start" className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">How it works</a>
            <a href="#pricing" className="text-text-secondary hover:text-text-primary block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
            <Link 
              to="/login"
              className="w-full text-left bg-btn-bg text-btn-text mt-4 px-3 py-2 rounded-md font-medium text-base hover:bg-btn-hover transition-colors inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
