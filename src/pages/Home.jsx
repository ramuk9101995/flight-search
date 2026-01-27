import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { Loader2 } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import FlightList from '../components/FlightList';
import FilterPanel from '../components/FilterPanel';
import PriceChart from '../components/PriceChart';
import { searchFlights } from '../services/amadeusApi';
import { setMaxPrice, resetFilters } from '../store/store';
import { getPriceRange, getUniqueAirlines } from '../utils/helpers';
import Hero from './Hero';

const Home = () => {
  const dispatch = useDispatch();
  const [showResults, setShowResults] = useState(false);

  const { data, isPending: isLoading, error, mutate } = useMutation({
    mutationFn: searchFlights,
    retry: 1,
  });

  const flights = data?.data || [];
  const airlines = data?.dictionaries?.carriers || {};
  const availableAirlines = getUniqueAirlines(flights);

  
  useEffect(() => {
    if (flights.length > 0) {
      const [min, max] = getPriceRange(flights);
      dispatch(setMaxPrice(max));
      dispatch(resetFilters());
    }
  }, [flights, dispatch]);

  const handleSearch = (params) => {
    setShowResults(true);
    mutate(params);
    
    
    setTimeout(() => {
      const resultsSection = document.getElementById('results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen">
      
      <Hero/>

      
      <section className="relative -mt-32 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      
      {showResults && (
        <section id="results" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-16 h-16 text-primary-600 animate-spin mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Searching for flights...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This may take a few moments
                </p>
              </div>
            )}

           
            {error && (
              <div className="card bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Error searching flights
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  {error.message || 'An error occurred while searching for flights. Please try again.'}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Please try different search parameters or try again later.
                </p>
              </div>
            )}

            
            {!isLoading && !error && flights.length > 0 && (
              <div>
                
                <div className="mb-8">
                  <PriceChart flights={flights} />
                </div>

               
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  <div className="lg:col-span-1 order-2 lg:order-1">
                    <div className="lg:sticky lg:top-24">
                      <FilterPanel 
                        airlines={airlines}
                        availableAirlines={availableAirlines}
                      />
                    </div>
                  </div>

                 
                  <div className="lg:col-span-3 order-1 lg:order-2">
                    <FlightList flights={flights} airlines={airlines} />
                  </div>
                </div>
              </div>
            )}

            
            {!isLoading && !error && showResults && flights.length === 0 && (
              <div className="card text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No flights found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search parameters
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;