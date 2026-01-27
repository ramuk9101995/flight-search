import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftRight, Calendar, Users, Search } from 'lucide-react';

import Button from './Button';
import {
  setOrigin,
  setDestination,
  setDepartureDate,
  setReturnDate,
  setPassengers,
  setCabinClass,
  toggleTripType,
  swapLocations,
} from '../store/store';
import CitySearchInput from './Citysearchinput';

const SearchForm = ({ onSearch }) => {
  const dispatch = useDispatch();
  const searchParams = useSelector((state) => state.search);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!searchParams.origin) {
      newErrors.origin = 'Please select origin';
    }
    if (!searchParams.destination) {
      newErrors.destination = 'Please select destination';
    }
    if (!searchParams.departureDate) {
      newErrors.departureDate = 'Please select departure date';
    }
    if (searchParams.isRoundTrip && !searchParams.returnDate) {
      newErrors.returnDate = 'Please select return date';
    }
    if (searchParams.origin === searchParams.destination) {
      newErrors.destination = 'Origin and destination must be different';
    }
    if (searchParams.returnDate && searchParams.departureDate) {
      if (new Date(searchParams.returnDate) < new Date(searchParams.departureDate)) {
        newErrors.returnDate = 'Return date must be after departure';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch(searchParams);
    }
  };

  const handleSwap = () => {
    dispatch(swapLocations());
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="card animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-6">
       
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => dispatch(toggleTripType())}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              !searchParams.isRoundTrip
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300'
            }`}
          >
            One Way
          </button>
          <button
            type="button"
            onClick={() => dispatch(toggleTripType())}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              searchParams.isRoundTrip
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300'
            }`}
          >
            Round Trip
          </button>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <CitySearchInput
            value={searchParams.origin}
            onChange={(code) => dispatch(setOrigin(code))}
            placeholder="From where?"
            label="Origin"
            error={errors.origin}
          />

          
          <button
            type="button"
            onClick={handleSwap}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-white dark:bg-dark-card border-2 border-primary-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:rotate-180 hidden md:block"
            aria-label="Swap locations"
          >
            <ArrowLeftRight className="w-5 h-5 text-primary-600" />
          </button>

          <CitySearchInput
            value={searchParams.destination}
            onChange={(code) => dispatch(setDestination(code))}
            placeholder="To where?"
            label="Destination"
            error={errors.destination}
          />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Departure Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={searchParams.departureDate}
                onChange={(e) => dispatch(setDepartureDate(e.target.value))}
                min={getTodayDate()}
                className={`input-field pl-12 ${errors.departureDate ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.departureDate && (
              <p className="mt-1 text-sm text-red-600">{errors.departureDate}</p>
            )}
          </div>

          {searchParams.isRoundTrip && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Return Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={searchParams.returnDate}
                  onChange={(e) => dispatch(setReturnDate(e.target.value))}
                  min={searchParams.departureDate || getTodayDate()}
                  className={`input-field pl-12 ${errors.returnDate ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.returnDate && (
                <p className="mt-1 text-sm text-red-600">{errors.returnDate}</p>
              )}
            </div>
          )}
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="1"
                max="9"
                value={searchParams.passengers}
                onChange={(e) => dispatch(setPassengers(parseInt(e.target.value)))}
                className="input-field pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cabin Class
            </label>
            <select
              value={searchParams.cabinClass}
              onChange={(e) => dispatch(setCabinClass(e.target.value))}
              className="input-field"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>
        </div>

        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          icon={<Search className="w-5 h-5" />}
        >
          Search Flights
        </Button>
      </form>
    </div>
  );
};

export default SearchForm;