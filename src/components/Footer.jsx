import React from 'react';
import { Plane, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-400 p-2.5 rounded-xl shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold gradient-text">
                  Spotter
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Flight Search Engine
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Find the best flight deals with real-time pricing, advanced filters, and intuitive search. Your journey starts here.
            </p>
          </div>

          
          <div>
            <h3 className="font-display font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#search" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  Search Flights
                </a>
              </li>
              <li>
                <a 
                  href="#results" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  View Results
                </a>
              </li>
              
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Connect
            </h3>
            <div className="flex gap-4">
              
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-200 dark:bg-dark-hover rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@spotter.com"
                className="p-3 bg-gray-200 dark:bg-dark-hover rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-300 group"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

       
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {currentYear} <span className="font-semibold text-primary-600">Rahul</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-primary-600 transition-colors duration-200">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary-600 transition-colors duration-200">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary-600 transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;