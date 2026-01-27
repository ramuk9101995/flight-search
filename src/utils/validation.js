import { z } from 'zod';

export const searchSchema = z.object({
  origin: z.string().min(3, 'Please select an origin').max(3, 'Invalid airport code'),
  destination: z.string().min(3, 'Please select a destination').max(3, 'Invalid airport code'),
  departureDate: z.string().min(1, 'Please select a departure date'),
  returnDate: z.string().optional(),
  passengers: z.number().min(1, 'At least 1 passenger required').max(9, 'Maximum 9 passengers'),
  cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
  isRoundTrip: z.boolean(),
}).refine((data) => {
  if (data.isRoundTrip && !data.returnDate) {
    return false;
  }
  return true;
}, {
  message: 'Return date is required for round trip',
  path: ['returnDate'],
}).refine((data) => {
  if (data.returnDate && data.departureDate) {
    return new Date(data.returnDate) >= new Date(data.departureDate);
  }
  return true;
}, {
  message: 'Return date must be after departure date',
  path: ['returnDate'],
}).refine((data) => {
  return data.origin !== data.destination;
}, {
  message: 'Origin and destination must be different',
  path: ['destination'],
});


export const validateSearch = (params) => {
  try {
    return searchSchema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      return { errors };
    }
    throw error;
  }
};