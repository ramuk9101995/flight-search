import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Moon, Sun, Plane } from 'lucide-react';
import { toggleTheme } from '../store/store';

const Navbar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-dark-bg/90 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-primary-600 to-primary-400 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold gradient-text">
                Spotter
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Flight Search Engine
              </p>
            </div>
          </div>

          
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#search" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200"
            >
              Search
            </a>
            <a 
              href="#results" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200"
            >
              Results
            </a>
            <a 
              href="#about" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200"
            >
              About
            </a>
          </div>

          
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-3 rounded-xl bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover transition-all duration-300 group"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 group-hover:rotate-12 transition-transform duration-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;