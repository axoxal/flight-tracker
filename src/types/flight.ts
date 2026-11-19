export interface Flight {
  id: string;
  origin: string;
  destination: string;
  origin_city: string;
  destination_city: string;
  origin_country: string;
  destination_country: string;
  departure_date: string;
  return_date?: string;
  price: number;
  currency: string;
  airline: string;
  provider: string;
  direct_flight: boolean;
  duration_minutes?: number;
  stops: number;
  booking_link?: string;
  last_updated: string;
  created_at: string;
  origin_location?: {
    latitude: number;
    longitude: number;
  };
  destination_location?: {
    latitude: number;
    longitude: number;
  };
}

export interface PriceAlert {
  id: string;
  user_email: string;
  origin: string;
  destination: string;
  target_price?: number;
  flexible_dates: boolean;
  date_range_start?: string;
  date_range_end?: string;
  alert_sent: boolean;
  created_at: string;
  triggered_at?: string;
}

export interface UserPreferences {
  id: string;
  user_email: string;
  home_airport?: string;
  preferred_destinations: string[];
  max_price?: number;
  alert_enabled: boolean;
  notify_price_drop: boolean;
  notify_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface FlightDeal {
  flight: Flight;
  price_drop_percentage?: number;
  is_trending: boolean;
}
