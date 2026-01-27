import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, X, DollarSign, Plane as PlaneIcon, ArrowUpDown } from 'lucide-react';
import { 
  setPriceRange, 
  toggleStop, 
  toggleAirline, 
  setSortBy, 
  setSearchQuery,
  resetFilters 
} from '../store/store';
import Button from './Button';

const FilterPanel = ({ airlines = {}, availableAirlines = [] }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filter);

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    dispatch(setPriceRange(newRange));
  };

  const stopOptions = [
    { value: 'direct', label: 'Direct' },
    { value: '1-stop', label: '1 Stop' },
    { value: '2+-stops', label: '2+ Stops' },
  ];

  const sortOptions = [
    { value: 'price', label: 'Price (Low to High)' },
    { value: 'duration', label: 'Duration (Short to Long)' },
    { value: 'departure', label: 'Departure Time' },
  ];

  const activeFiltersCount = 
    filters.stops.length + 
    filters.airlines.length + 
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== filters.maxPrice ? 1 : 0);

  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <Filter className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {activeFiltersCount} active
              </p>
            )}
          </div>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <ArrowUpDown className="w-4 h-4" />
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <DollarSign className="w-4 h-4" />
          Price Range
        </label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                min="0"
                max={filters.maxPrice}
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Min"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="flex-1">
              <input
                type="number"
                min={filters.priceRange[0]}
                max={filters.maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Max"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={filters.maxPrice}
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(1, e.target.value)}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Stops */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <PlaneIcon className="w-4 h-4" />
          Number of Stops
        </label>
        <div className="space-y-2">
          {stopOptions.map(option => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover cursor-pointer transition-colors duration-200"
            >
              <input
                type="checkbox"
                checked={filters.stops.includes(option.value)}
                onChange={() => dispatch(toggleStop(option.value))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      {availableAirlines.length > 0 && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <PlaneIcon className="w-4 h-4" />
            Airlines
          </label>
          
          {/* Search Airlines */}
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search airlines..."
            className="w-full px-4 py-2.5 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />

          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {availableAirlines
              .filter(code => {
                const name = airlines[code] || code;
                return name.toLowerCase().includes(filters.searchQuery.toLowerCase());
              })
              .map(code => (
                <label
                  key={code}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover cursor-pointer transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={filters.airlines.includes(code)}
                    onChange={() => dispatch(toggleAirline(code))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {airlines[code] || code}
                  </span>
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;