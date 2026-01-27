import React from 'react';
import { Plane, TrendingUp, Shield, Clock } from 'lucide-react';

const Hero = () => {
  return (
    <section id="search" className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-400 to-primary-800 animate-gradient"></div>
      
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

     
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
            Find Your Perfect
            <span className="block bg-clip-text text-transparent bg-gradient-to-r text-white ">
              Flight Journey
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Search, compare, and book flights with real-time pricing and advanced filters. 
            Your next adventure starts here.
          </p>

          
          
        </div>
      </div>

      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;