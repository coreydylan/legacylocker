import React, { useState, useEffect } from 'react';
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { useStorySelector } from '@/hooks/useStorySelector';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openStorySelector } = useStorySelector();

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
      className={cn(
        "w-full py-4 fixed top-0 z-50 transition-all duration-300",
        scrolled 
          ? 'bg-legacy-cream/50 backdrop-blur-md backdrop-saturate-150 shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <Logo className="w-28 sm:w-32 text-legacy-green" />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="#how-it-works" 
              className="text-legacy-dark hover:text-legacy-green transition-colors"
            >
              how it works
            </a>
            <a 
              href="#signature-editions" 
              className="text-legacy-dark hover:text-legacy-green transition-colors"
            >
              editions
            </a>
            <a 
              href="#story-selector" 
              className="text-legacy-dark hover:text-legacy-green transition-colors"
            >
              pricing
            </a>
            
            <Button 
              className="bg-legacy-green hover:bg-legacy-green/90 text-white ml-2"
              onClick={() => {
                const openSelector = (window as any).openStorySelectorDialog;
                if (typeof openSelector === 'function') {
                  openSelector();
                } else {
                  openStorySelector();
                }
              }}
            >
              start a story
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-legacy-dark hover:text-legacy-green transition-colors rounded-lg hover:bg-legacy-cream/50"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={cn(
            "md:hidden mt-4 rounded-xl overflow-hidden",
            "bg-legacy-cream/80 backdrop-blur-lg backdrop-saturate-150",
            "border border-legacy-cream/20 shadow-lg",
            "transform transition-all duration-200 ease-in-out"
          )}>
            <div className="flex flex-col p-4 space-y-4">
              <a 
                href="#how-it-works" 
                className="text-legacy-dark hover:text-legacy-green transition-colors py-2 px-4 rounded-lg hover:bg-legacy-cream/50"
                onClick={() => setIsMenuOpen(false)}
              >
                how it works
              </a>
              <a 
                href="#signature-editions" 
                className="text-legacy-dark hover:text-legacy-green transition-colors py-2 px-4 rounded-lg hover:bg-legacy-cream/50"
                onClick={() => setIsMenuOpen(false)}
              >
                editions
              </a>
              <a 
                href="#story-selector" 
                className="text-legacy-dark hover:text-legacy-green transition-colors py-2 px-4 rounded-lg hover:bg-legacy-cream/50"
                onClick={() => setIsMenuOpen(false)}
              >
                pricing
              </a>
              
              <Button 
                className="bg-legacy-green hover:bg-legacy-green/90 text-white w-full mt-2 py-6" 
                onClick={() => {
                  setIsMenuOpen(false);
                  const openSelector = (window as any).openStorySelectorDialog;
                  if (typeof openSelector === 'function') {
                    openSelector();
                  } else {
                    openStorySelector();
                  }
                }}
              >
                start a story
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
