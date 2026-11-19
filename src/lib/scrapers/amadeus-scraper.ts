import axios from 'axios';
import { Flight } from '@/types/flight';

const AMADEUS_API_BASE = 'https://test.api.amadeus.com/v2';

export class AmadeusScraper {
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.apiKey,
          client_secret: this.apiSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry to 5 minutes before actual expiry
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Amadeus token error:', error);
      throw error;
    }
  }

  async searchFlights(params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults?: number;
    max?: number;
  }): Promise<Partial<Flight>[]> {
    try {
      const token = await this.getAccessToken();

      const searchParams: any = {
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.departureDate,
        adults: params.adults || 1,
        max: params.max || 50,
        currencyCode: 'USD',
      };

      if (params.returnDate) {
        searchParams.returnDate = params.returnDate;
      }

      const response = await axios.get(`${AMADEUS_API_BASE}/shopping/flight-offers`, {
        params: searchParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data.map((offer: any) => {
        const outbound = offer.itineraries[0];
        const segments = outbound.segments;
        const firstSegment = segments[0];
        const lastSegment = segments[segments.length - 1];

        const totalDuration = this.parseDuration(outbound.duration);

        return {
          origin: firstSegment.departure.iataCode,
          destination: lastSegment.arrival.iataCode,
          origin_city: '', // Need to be enriched from airport data
          destination_city: '',
          origin_country: '',
          destination_country: '',
          departure_date: firstSegment.departure.at,
          return_date: offer.itineraries[1] ? offer.itineraries[1].segments[0].departure.at : undefined,
          price: parseFloat(offer.price.total),
          currency: offer.price.currency,
          airline: firstSegment.carrierCode,
          provider: 'amadeus',
          direct_flight: segments.length === 1,
          duration_minutes: totalDuration,
          stops: segments.length - 1,
          booking_link: undefined, // Amadeus doesn't provide direct booking links
        };
      });
    } catch (error) {
      console.error('Amadeus search error:', error);
      return [];
    }
  }

  private parseDuration(duration: string): number {
    // Parse ISO 8601 duration (e.g., "PT2H30M")
    const matches = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!matches) return 0;

    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;

    return hours * 60 + minutes;
  }

  async getFlightInspiration(origin: string): Promise<any[]> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${AMADEUS_API_BASE}/shopping/flight-destinations`,
        {
          params: {
            origin,
            maxPrice: 500,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Amadeus inspiration error:', error);
      return [];
    }
  }
}
