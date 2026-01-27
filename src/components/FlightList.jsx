import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle, Plane } from 'lucide-react';
import FlightCard from './FlightCard';
import { sortFlights, filterFlights, searchFlightsByAirline } from '../utils/helpers';

const FlightList = ({ flights, airlines }) => {
  const filters = useSelector((state) => state.filter);

  const filteredAndSortedFlights = useMemo(() => {
    if (!flights || flights.length === 0) return [];

   
    let filtered = filterFlights(flights, filters);

    
    filtered = searchFlightsByAirline(filtered, filters.searchQuery, airlines);

    
    filtered = sortFlights(filtered, filters.sortBy);

    return filtered;
  }, [flights, filters, airlines]);

  if (!flights || flights.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100 dark:bg-dark-hover rounded-full">
            <Plane className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No flights searched yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Use the search form above to find available flights
        </p>
      </div>
    );
  }

  if (filteredAndSortedFlights.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
            <AlertCircle className="w-12 h-12 text-yellow-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No flights match your filters
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Try adjusting your filters to see more results
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Total flights available: {flights.length}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-gray-100">
            Available Flights
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedFlights.length} of {flights.length} flights
          </p>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {filteredAndSortedFlights.map((flight) => (
          <FlightCard 
            key={flight.id} 
            flight={flight} 
            airlines={airlines}
          />
        ))}
      </div>
    </div>
  );
};

export default FlightList;