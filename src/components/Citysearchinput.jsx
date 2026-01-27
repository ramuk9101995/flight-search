import React, { useState, useEffect, useRef } from 'react';
import { Plane, MapPin, Loader2 } from 'lucide-react';
import { searchLocations } from '../services/amadeusApi';

const CitySearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Search city or airport',
  icon = <Plane className="w-5 h-5" />,
  error = null,
  label = null,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const wrapperRef = useRef(null);
  // NEW: Track if the update is coming from a selection to prevent re-searching
  const isSelectionRef = useRef(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic
  useEffect(() => {
    // 1. If this change comes from selecting an item, STOP here.
    if (isSelectionRef.current) {
      isSelectionRef.current = false; // Reset the flag
      return;
    }

    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsOpen(false); // Ensure it closes if query is cleared
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchLocations(query);
        // Only open if we still have results and user hasn't selected something in the meantime
        if (results && results.length > 0) {
          setSuggestions(results);
          setIsOpen(true);
        } else {
          setSuggestions([]);
          setIsOpen(false);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (location) => {
    // 2. Set the flag to true so the useEffect knows to ignore this update
    isSelectionRef.current = true;
    
    const displayText = `${location.name} (${location.iataCode})`;
    setQuery(displayText);
    onChange(location.iataCode);
    
    // 3. Close everything immediately
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    // Open dropdown if user starts typing again
    if (newValue.length >= 2) {
      setIsOpen(true);
    }
    if (!newValue) {
      onChange('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            // Only open on focus if we have suggestions ready
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`input-field pl-12 pr-12 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto animate-slide-down">
          {suggestions.map((location) => (
            <button
              key={location.id}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors duration-150 text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {location.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="font-semibold">{location.iataCode}</span>
                  {location.address?.cityName && (
                    <>
                      <span>•</span>
                      <span>{location.address.cityName}</span>
                    </>
                  )}
                  {location.address?.countryName && (
                    <>
                      <span>•</span>
                      <span>{location.address.countryName}</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearchInput;