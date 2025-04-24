import React from 'react';
import { Mail, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer id="about" className="w-full py-12 bg-legacy-cream">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="font-playfair text-xl font-bold text-legacy-green mb-4">Legacy Locker</h3>
            <p className="text-legacy-dark/70 mb-4 max-w-md">
              We transform meaningful stories into collectible works of art, delivered when they matter most.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/legacylockerco" target="_blank" rel="noopener noreferrer" className="text-legacy-green hover:text-legacy-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-playfair font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="text-legacy-dark/70 hover:text-legacy-green">How It Works</a></li>
              <li><a href="#signature-editions" className="text-legacy-dark/70 hover:text-legacy-green">Editions</a></li>
              <li><a href="#story-selector" className="text-legacy-dark/70 hover:text-legacy-green">Pricing</a></li>
              <li><a href="#" className="text-legacy-dark/70 hover:text-legacy-green">Terms of Service</a></li>
              <li><a href="#" className="text-legacy-dark/70 hover:text-legacy-green">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-legacy-gold" />
                <a href="mailto:hello@legacylockerco.com" className="text-legacy-dark/70 hover:text-legacy-green">
                  hello@legacylockerco.com
                </a>
              </li>
            </ul>
            <p className="mt-4 text-sm text-legacy-dark/60">
              A project born from our love of stories. Based in California.
            </p>
          </div>
        </div>
        
        <Separator className="my-8 bg-legacy-dark/10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-legacy-dark/60">
            &copy; {new Date().getFullYear()} Legacy Locker. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-legacy-dark/60 hover:text-legacy-green">Privacy Policy</a>
            <a href="#" className="text-sm text-legacy-dark/60 hover:text-legacy-green">Terms of Service</a>
            <a href="#" className="text-sm text-legacy-dark/60 hover:text-legacy-green">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
