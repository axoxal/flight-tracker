-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Flights table
CREATE TABLE flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin VARCHAR(3) NOT NULL,
  destination VARCHAR(3) NOT NULL,
  origin_city VARCHAR(255),
  destination_city VARCHAR(255),
  origin_country VARCHAR(100),
  destination_country VARCHAR(100),
  departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  airline VARCHAR(100),
  provider VARCHAR(50) NOT NULL,
  direct_flight BOOLEAN DEFAULT false,
  duration_minutes INTEGER,
  stops INTEGER DEFAULT 0,
  booking_link TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Geospatial data
  origin_location GEOGRAPHY(POINT, 4326),
  destination_location GEOGRAPHY(POINT, 4326)
);

-- Price history table
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR(255) NOT NULL UNIQUE,
  home_airport VARCHAR(3),
  preferred_destinations TEXT[], -- Array of airport codes
  max_price DECIMAL(10, 2),
  alert_enabled BOOLEAN DEFAULT true,
  notify_price_drop BOOLEAN DEFAULT true,
  notify_threshold DECIMAL(5, 2) DEFAULT 20.00, -- Notify on X% price drop
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price alerts table
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR(255) NOT NULL,
  origin VARCHAR(3) NOT NULL,
  destination VARCHAR(3) NOT NULL,
  target_price DECIMAL(10, 2),
  flexible_dates BOOLEAN DEFAULT false,
  date_range_start DATE,
  date_range_end DATE,
  alert_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  triggered_at TIMESTAMP WITH TIME ZONE
);

-- Airport data table
CREATE TABLE airports (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  location GEOGRAPHY(POINT, 4326),
  timezone VARCHAR(50)
);

-- Scraping jobs log
CREATE TABLE scraping_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'running', 'completed', 'failed'
  routes_scraped INTEGER DEFAULT 0,
  flights_found INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_flights_origin_dest ON flights(origin, destination);
CREATE INDEX idx_flights_departure_date ON flights(departure_date);
CREATE INDEX idx_flights_price ON flights(price);
CREATE INDEX idx_flights_last_updated ON flights(last_updated);
CREATE INDEX idx_price_history_flight_id ON price_history(flight_id);
CREATE INDEX idx_price_alerts_user_email ON price_alerts(user_email);
CREATE INDEX idx_flights_origin_location ON flights USING GIST(origin_location);
CREATE INDEX idx_flights_destination_location ON flights USING GIST(destination_location);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_preferences
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to track price changes
CREATE OR REPLACE FUNCTION track_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.price IS DISTINCT FROM NEW.price THEN
        INSERT INTO price_history (flight_id, price, recorded_at)
        VALUES (NEW.id, NEW.price, NOW());
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for price tracking
CREATE TRIGGER track_flight_price_changes
    AFTER UPDATE ON flights
    FOR EACH ROW
    EXECUTE FUNCTION track_price_change();

-- View for cheapest flights by route
CREATE VIEW cheapest_flights_by_route AS
SELECT DISTINCT ON (origin, destination)
    id, origin, destination, origin_city, destination_city,
    origin_country, destination_country, departure_date, return_date,
    price, currency, airline, provider, direct_flight, booking_link,
    last_updated
FROM flights
ORDER BY origin, destination, price ASC;

-- View for trending price drops
CREATE VIEW trending_price_drops AS
SELECT 
    f.id,
    f.origin,
    f.destination,
    f.origin_city,
    f.destination_city,
    f.price as current_price,
    ph.price as previous_price,
    ROUND(((ph.price - f.price) / ph.price * 100)::numeric, 2) as price_drop_percentage,
    f.departure_date,
    f.airline,
    f.booking_link,
    f.last_updated
FROM flights f
JOIN LATERAL (
    SELECT price
    FROM price_history
    WHERE flight_id = f.id
    AND recorded_at < NOW() - INTERVAL '7 days'
    ORDER BY recorded_at DESC
    LIMIT 1
) ph ON true
WHERE f.price < ph.price
AND ((ph.price - f.price) / ph.price) > 0.15  -- 15% drop threshold
ORDER BY price_drop_percentage DESC;
