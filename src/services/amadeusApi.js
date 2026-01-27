import axios from 'axios';

const API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
const API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;
const API_URL = import.meta.env.VITE_AMADEUS_API_URL;

let accessToken = null;
let tokenExpiry = null;


const getAccessToken = async () => {
 
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      `${API_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: API_KEY,
        client_secret: API_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = response.data.access_token;
    
    tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
    
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to authenticate with Amadeus API');
  }
};


export const searchLocations = async (keyword) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${API_URL}/v1/reference-data/locations`,
      {
        params: {
          subType: 'CITY,AIRPORT',
          keyword: keyword,
          'page[limit]': 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data || [];
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};


export const searchFlights = async (searchParams) => {
  try {
    const token = await getAccessToken();
    
    const params = {
      originLocationCode: searchParams.origin,
      destinationLocationCode: searchParams.destination,
      departureDate: searchParams.departureDate,
      adults: searchParams.passengers || 1,
      travelClass: searchParams.cabinClass || 'ECONOMY',
      currencyCode: 'USD',
      max: 50,
    };

    
    if (searchParams.returnDate) {
      params.returnDate = searchParams.returnDate;
    }

    const response = await axios.get(
      `${API_URL}/v2/shopping/flight-offers`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    if (error.response?.data?.errors) {
      throw new Error(error.response.data.errors[0]?.detail || 'Failed to search flights');
    }
    throw new Error('Failed to search flights');
  }
};


export const getAirlineName = async (airlineCode) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${API_URL}/v1/reference-data/airlines`,
      {
        params: {
          airlineCodes: airlineCode,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data?.[0]?.businessName || airlineCode;
  } catch (error) {
    console.error('Error getting airline name:', error);
    return airlineCode;
  }
};


export const getMockFlightData = () => {
  return {
    data: [
      {
        id: '1',
        price: { total: '450.00', currency: 'USD' },
        itineraries: [
          {
            duration: 'PT5H30M',
            segments: [
              {
                departure: {
                  iataCode: 'DEL',
                  at: '2024-03-15T08:00:00',
                },
                arrival: {
                  iataCode: 'BOM',
                  at: '2024-03-15T13:30:00',
                },
                carrierCode: 'AI',
                number: '101',
                aircraft: { code: '320' },
              },
            ],
          },
        ],
        numberOfBookableSeats: 5,
        validatingAirlineCodes: ['AI'],
      },
      {
        id: '2',
        price: { total: '520.00', currency: 'USD' },
        itineraries: [
          {
            duration: 'PT6H15M',
            segments: [
              {
                departure: {
                  iataCode: 'DEL',
                  at: '2024-03-15T10:30:00',
                },
                arrival: {
                  iataCode: 'HYD',
                  at: '2024-03-15T12:45:00',
                },
                carrierCode: '6E',
                number: '201',
                aircraft: { code: '321' },
              },
              {
                departure: {
                  iataCode: 'HYD',
                  at: '2024-03-15T14:30:00',
                },
                arrival: {
                  iataCode: 'BOM',
                  at: '2024-03-15T16:45:00',
                },
                carrierCode: '6E',
                number: '202',
                aircraft: { code: '320' },
              },
            ],
          },
        ],
        numberOfBookableSeats: 9,
        validatingAirlineCodes: ['6E'],
      },
      {
        id: '3',
        price: { total: '380.00', currency: 'USD' },
        itineraries: [
          {
            duration: 'PT4H45M',
            segments: [
              {
                departure: {
                  iataCode: 'DEL',
                  at: '2024-03-15T14:00:00',
                },
                arrival: {
                  iataCode: 'BOM',
                  at: '2024-03-15T18:45:00',
                },
                carrierCode: 'SG',
                number: '301',
                aircraft: { code: '738' },
              },
            ],
          },
        ],
        numberOfBookableSeats: 12,
        validatingAirlineCodes: ['SG'],
      },
    ],
    dictionaries: {
      carriers: {
        'AI': 'Air India',
        '6E': 'IndiGo',
        'SG': 'SpiceJet',
      },
    },
  };
};

export default {
  searchLocations,
  searchFlights,
  getAirlineName,
  getMockFlightData,
};