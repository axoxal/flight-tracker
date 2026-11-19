import axios from 'axios';
import { Flight } from '@/types/flight';

const KIWI_API_BASE = 'https://api.tequila.kiwi.com';

interface KiwiSearchParams {
  fly_from: string;
  fly_to: string;
  date_from: string;
  date_to: string;
  return_from?: string;
  return_to?: string;
  curr: string;
  limit: number;
}

export class KiwiScraper {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchFlights(params: {
    origin: string;
    destination: string;
    dateFrom: string;
    dateTo: string;
    returnFrom?: string;
    returnTo?: string;
    limit?: number;
  }): Promise<Partial<Flight>[]> {
    try {
      const searchParams: KiwiSearchParams = {
        fly_from: params.origin,
        fly_to: params.destination,
        date_from: params.dateFrom,
        date_to: params.dateTo,
        curr: 'USD',
        limit: params.limit || 50,
      };

      if (params.returnFrom && params.returnTo) {
        searchParams.return_from = params.returnFrom;
        searchParams.return_to = params.returnTo;
      }

      const response = await axios.get(`${KIWI_API_BASE}/v2/search`, {
        params: searchParams,
        headers: {
          'apikey': this.apiKey,
        },
      });

      return response.data.data.map((flight: any) => ({
        origin: flight.flyFrom,
        destination: flight.flyTo,
        origin_city: flight.cityFrom,
        destination_city: flight.cityTo,
        origin_country: flight.countryFrom?.name || '',
        destination_country: flight.countryTo?.name || '',
        departure_date: new Date(flight.dTime * 1000).toISOString(),
        return_date: flight.return ? new Date(flight.return * 1000).toISOString() : undefined,
        price: flight.price,
        currency: flight.currency || 'USD',
        airline: flight.airlines?.join(', ') || 'Multiple',
        provider: 'kiwi',
        direct_flight: flight.route.length === 1,
        duration_minutes: Math.floor(flight.duration.total / 60),
        stops: flight.route.length - 1,
        booking_link: flight.deep_link,
        origin_location: {
          latitude: flight.cityFrom && flight.mapIdFrom ? parseFloat(flight.mapIdFrom.split(':')[1]) : null,
          longitude: flight.cityFrom && flight.mapIdFrom ? parseFloat(flight.mapIdFrom.split(':')[2]) : null,
        },
        destination_location: {
          latitude: flight.cityTo && flight.mapIdTo ? parseFloat(flight.mapIdTo.split(':')[1]) : null,
          longitude: flight.cityTo && flight.mapIdTo ? parseFloat(flight.mapIdTo.split(':')[2]) : null,
        },
      }));
    } catch (error) {
      console.error('Kiwi API error:', error);
      return [];
    }
  }

  async getPopularDestinations(origin: string): Promise<any[]> {
    try {
      const response = await axios.get(`${KIWI_API_BASE}/v2/search`, {
        params: {
          fly_from: origin,
          fly_to: 'anywhere',
          date_from: new Date().toISOString().split('T')[0],
          date_to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          curr: 'USD',
          limit: 100,
          sort: 'price',
        },
        headers: {
          'apikey': this.apiKey,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Kiwi popular destinations error:', error);
      return [];
    }
  }
}
