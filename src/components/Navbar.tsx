import React, { useState, useEffect } from 'react';
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`w-full py-4 fixed top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-legacy-cream/50 backdrop-blur-md backdrop-saturate-150 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <Logo className="w-32 text-legacy-green" />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="#how-it-works" 
              className="text-legacy-dark hover:text-legacy-green transition-colors"
            >
              How It Works
            </a>
            <a 
              href="#story-series" 
              className="text-legacy-dark hover:text-legacy-green transition-colors"
            >
              Gift Ideas
            </a>
            <a 
              href="#pricing" 
              className="text-legacy-dark hover:text-legacy-green transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#about" 
              className="text-legacy-dark hover:text-legacy-green transition-colors"
            >
              About
            </a>
            
            <Button className="bg-legacy-green hover:bg-legacy-green/90 text-white ml-2">
              Get Started
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-legacy-dark hover:text-legacy-green transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 rounded-lg shadow-lg ${
            scrolled 
              ? 'bg-legacy-cream/50 backdrop-blur-md backdrop-saturate-150' 
              : 'bg-white/90 backdrop-blur-sm'
          }`}>
            <div className="flex flex-col space-y-3">
              <a 
                href="#how-it-works" 
                className="text-legacy-dark hover:text-legacy-green transition-colors py-2 px-3 rounded hover:bg-legacy-cream"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#story-series" 
                className="text-legacy-dark hover:text-legacy-green transition-colors py-2 px-3 rounded hover:bg-legacy-cream"
                onClick={() => setIsMenuOpen(false)}
              >
                Gift Ideas
              </a>
              <a 
                href="#pricing" 
                className="text-legacy-dark hover:text-legacy-green transition-colors py-2 px-3 rounded hover:bg-legacy-cream"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#about" 
                className="text-legacy-dark hover:text-legacy-green transition-colors py-2 px-3 rounded hover:bg-legacy-cream"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              
              <Button 
                className="bg-legacy-green hover:bg-legacy-green/90 text-white w-full mt-2" 
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
