import { format, parseISO } from 'date-fns';


export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};


export const formatDuration = (duration) => {
  if (!duration) return 'N/A';
  
  const matches = duration.match(/PT(\d+H)?(\d+M)?/);
  if (!matches) return duration;
  
  const hours = matches[1] ? parseInt(matches[1]) : 0;
  const minutes = matches[2] ? parseInt(matches[2]) : 0;
  
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};


export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM dd, HH:mm');
  } catch {
    return dateString;
  }
};


export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'HH:mm');
  } catch {
    return dateString;
  }
};


export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};


export const getStopsCount = (segments) => {
  if (!segments || segments.length === 0) return 0;
  return segments.length - 1;
};


export const getStopsCategory = (stopsCount) => {
  if (stopsCount === 0) return 'direct';
  if (stopsCount === 1) return '1-stop';
  return '2+-stops';
};


export const getDurationInMinutes = (duration) => {
  if (!duration) return 0;
  
  const matches = duration.match(/PT(\d+H)?(\d+M)?/);
  if (!matches) return 0;
  
  const hours = matches[1] ? parseInt(matches[1]) : 0;
  const minutes = matches[2] ? parseInt(matches[2]) : 0;
  
  return hours * 60 + minutes;
};


export const sortFlights = (flights, sortBy) => {
  const sorted = [...flights];
  
  switch (sortBy) {
    case 'price':
      return sorted.sort((a, b) => 
        parseFloat(a.price.total) - parseFloat(b.price.total)
      );
    
    case 'duration':
      return sorted.sort((a, b) => {
        const durationA = getDurationInMinutes(a.itineraries[0]?.duration);
        const durationB = getDurationInMinutes(b.itineraries[0]?.duration);
        return durationA - durationB;
      });
    
    case 'departure':
      return sorted.sort((a, b) => {
        const timeA = a.itineraries[0]?.segments[0]?.departure?.at;
        const timeB = b.itineraries[0]?.segments[0]?.departure?.at;
        return new Date(timeA) - new Date(timeB);
      });
    
    default:
      return sorted;
  }
};


export const filterFlights = (flights, filters) => {
  return flights.filter(flight => {
    const price = parseFloat(flight.price.total);
    const segments = flight.itineraries[0]?.segments || [];
    const stopsCount = getStopsCount(segments);
    const stopsCategory = getStopsCategory(stopsCount);
    const airline = flight.validatingAirlineCodes?.[0];

    
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    
    if (filters.stops.length > 0 && !filters.stops.includes(stopsCategory)) {
      return false;
    }

    
    if (filters.airlines.length > 0 && !filters.airlines.includes(airline)) {
      return false;
    }

    return true;
  });
};


export const searchFlightsByAirline = (flights, searchQuery, airlines) => {
  if (!searchQuery) return flights;
  
  const query = searchQuery.toLowerCase();
  
  return flights.filter(flight => {
    const airlineCode = flight.validatingAirlineCodes?.[0];
    const airlineName = airlines[airlineCode]?.toLowerCase() || airlineCode.toLowerCase();
    
    return airlineName.includes(query) || airlineCode.toLowerCase().includes(query);
  });
};


export const generatePriceChartData = (flights) => {
  if (!flights || flights.length === 0) return [];


  const priceRanges = {
    '0-200': 0,
    '200-400': 0,
    '400-600': 0,
    '600-800': 0,
    '800-1000': 0,
    '1000+': 0,
  };

  flights.forEach(flight => {
    const price = parseFloat(flight.price.total);
    
    if (price < 200) priceRanges['0-200']++;
    else if (price < 400) priceRanges['200-400']++;
    else if (price < 600) priceRanges['400-600']++;
    else if (price < 800) priceRanges['600-800']++;
    else if (price < 1000) priceRanges['800-1000']++;
    else priceRanges['1000+']++;
  });

  return Object.entries(priceRanges).map(([range, count]) => ({
    range,
    count,
    price: range.split('-')[0],
  }));
};


export const getUniqueAirlines = (flights) => {
  const airlines = new Set();
  flights.forEach(flight => {
    if (flight.validatingAirlineCodes?.[0]) {
      airlines.add(flight.validatingAirlineCodes[0]);
    }
  });
  return Array.from(airlines);
};


export const getPriceRange = (flights) => {
  if (!flights || flights.length === 0) return [0, 1000];
  
  const prices = flights.map(f => parseFloat(f.price.total));
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
};