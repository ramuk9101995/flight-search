import React from 'react';
import { Plane, Clock, Users, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDuration, formatTime, getStopsCount } from '../utils/helpers';
import Button from './Button';

const FlightCard = ({ flight, airlines }) => {
  const itinerary = flight.itineraries[0];
  const segments = itinerary.segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const stopsCount = getStopsCount(segments);
  const airlineCode = flight.validatingAirlineCodes?.[0];
  const airlineName = airlines[airlineCode] || airlineCode;

  return (
    <div className="card card-hover group">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Flight Details */}
        <div className="flex-1 space-y-4">
          {/* Airline */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <Plane className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {airlineName}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {airlineCode} {firstSegment.number}
              </p>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center justify-between gap-4">
            {/* Departure */}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(firstSegment.departure.at)}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {firstSegment.departure.iataCode}
              </p>
            </div>

            {/* Duration & Stops */}
            <div className="flex-1 relative px-4">
              <div className="text-center mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(itinerary.duration)}
                </p>
              </div>
              <div className="relative">
                <div className="h-0.5 bg-gray-300 dark:bg-gray-600 w-full"></div>
                {stopsCount > 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white dark:bg-dark-card">
                    <span className="text-xs font-medium text-primary-600">
                      {stopsCount} stop{stopsCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              {stopsCount === 0 && (
                <p className="text-center text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                  Direct flight
                </p>
              )}
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(lastSegment.arrival.at)}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {lastSegment.arrival.iataCode}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {flight.numberOfBookableSeats} seats left
            </span>
            {segments.length > 1 && (
              <span>
                Via: {segments.slice(0, -1).map(s => s.arrival.iataCode).join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="lg:w-48 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:border-l border-gray-200 dark:border-gray-700 lg:pl-6">
          <div className="text-center lg:text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Price
            </p>
            <p className="text-3xl font-bold text-primary-600">
              {formatCurrency(parseFloat(flight.price.total), flight.price.currency)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              per person
            </p>
          </div>
          
          <Button
            variant="primary"
            size="md"
            className="w-full lg:w-auto"
            onClick={() => alert('Booking functionality would go here')}
          >
            Select Flight
          </Button>
        </div>
      </div>

      {/* Expandable Segment Details (can be added later) */}
    </div>
  );
};

export default FlightCard;