import { configureStore, createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: localStorage.getItem('theme') || 'light',
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
  },
});


const searchSlice = createSlice({
  name: 'search',
  initialState: {
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'ECONOMY',
    isRoundTrip: false,
  },
  reducers: {
    setSearchParams: (state, action) => {
      return { ...state, ...action.payload };
    },
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setDepartureDate: (state, action) => {
      state.departureDate = action.payload;
    },
    setReturnDate: (state, action) => {
      state.returnDate = action.payload;
    },
    setPassengers: (state, action) => {
      state.passengers = action.payload;
    },
    setCabinClass: (state, action) => {
      state.cabinClass = action.payload;
    },
    toggleTripType: (state) => {
      state.isRoundTrip = !state.isRoundTrip;
      if (!state.isRoundTrip) {
        state.returnDate = '';
      }
    },
    swapLocations: (state) => {
      const temp = state.origin;
      state.origin = state.destination;
      state.destination = temp;
    },
    resetSearch: (state) => {
      state.origin = '';
      state.destination = '';
      state.departureDate = '';
      state.returnDate = '';
      state.passengers = 1;
      state.cabinClass = 'ECONOMY';
      state.isRoundTrip = false;
    },
  },
});


const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    priceRange: [0, 10000],
    maxPrice: 10000,
    stops: [],
    airlines: [],
    sortBy: 'price',
    searchQuery: '',
  },
  reducers: {
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    toggleStop: (state, action) => {
      const stop = action.payload;
      const index = state.stops.indexOf(stop);
      if (index > -1) {
        state.stops.splice(index, 1);
      } else {
        state.stops.push(stop);
      }
    },
    toggleAirline: (state, action) => {
      const airline = action.payload;
      const index = state.airlines.indexOf(airline);
      if (index > -1) {
        state.airlines.splice(index, 1);
      } else {
        state.airlines.push(airline);
      }
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.priceRange = [0, state.maxPrice];
      state.stops = [];
      state.airlines = [];
      state.sortBy = 'price';
      state.searchQuery = '';
    },
  },
});


export const { toggleTheme, setTheme } = themeSlice.actions;
export const {
  setSearchParams,
  setOrigin,
  setDestination,
  setDepartureDate,
  setReturnDate,
  setPassengers,
  setCabinClass,
  toggleTripType,
  swapLocations,
  resetSearch,
} = searchSlice.actions;
export const {
  setPriceRange,
  setMaxPrice,
  toggleStop,
  toggleAirline,
  setSortBy,
  setSearchQuery,
  resetFilters,
} = filterSlice.actions;


export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    search: searchSlice.reducer,
    filter: filterSlice.reducer,
  },
});