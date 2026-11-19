import { createClient } from '@supabase/supabase-js';

// Major airports data
const AIRPORTS = [
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', latitude: 40.6413, longitude: -73.7781, timezone: 'America/New_York' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', latitude: 33.9416, longitude: -118.4085, timezone: 'America/Los_Angeles' },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543, timezone: 'Europe/London' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479, timezone: 'Europe/Paris' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2532, longitude: 55.3657, timezone: 'Asia/Dubai' },
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', latitude: 35.5494, longitude: 139.7798, timezone: 'Asia/Tokyo' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', latitude: 35.7720, longitude: 140.3929, timezone: 'Asia/Tokyo' },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', latitude: -33.9399, longitude: 151.1753, timezone: 'Australia/Sydney' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', latitude: 1.3644, longitude: 103.9915, timezone: 'Asia/Singapore' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622, timezone: 'Europe/Berlin' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', latitude: 52.3105, longitude: 4.7683, timezone: 'Europe/Amsterdam' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', latitude: 37.4602, longitude: 126.4407, timezone: 'Asia/Seoul' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', latitude: 22.3080, longitude: 113.9185, timezone: 'Asia/Hong_Kong' },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States', latitude: 41.9742, longitude: -87.9073, timezone: 'America/Chicago' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', latitude: 33.6407, longitude: -84.4277, timezone: 'America/New_York' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States', latitude: 32.8998, longitude: -97.0403, timezone: 'America/Chicago' },
  { code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'United States', latitude: 39.8561, longitude: -104.6737, timezone: 'America/Denver' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', latitude: 37.6213, longitude: -122.3790, timezone: 'America/Los_Angeles' },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States', latitude: 47.4502, longitude: -122.3088, timezone: 'America/Los_Angeles' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', latitude: 25.7959, longitude: -80.2870, timezone: 'America/New_York' },
  { code: 'BOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'United States', latitude: 42.3656, longitude: -71.0096, timezone: 'America/New_York' },
  { code: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'United States', latitude: 36.0840, longitude: -115.1537, timezone: 'America/Los_Angeles' },
  { code: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'United States', latitude: 28.4312, longitude: -81.3081, timezone: 'America/New_York' },
  { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Rome', country: 'Italy', latitude: 41.8003, longitude: 12.2389, timezone: 'Europe/Rome' },
  { code: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', latitude: 41.2974, longitude: 2.0833, timezone: 'Europe/Madrid' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', latitude: 40.4983, longitude: -3.5676, timezone: 'Europe/Madrid' },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', latitude: 53.4213, longitude: -6.2701, timezone: 'Europe/Dublin' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', latitude: 47.4582, longitude: 8.5559, timezone: 'Europe/Zurich' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', latitude: 55.6180, longitude: 12.6508, timezone: 'Europe/Copenhagen' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', latitude: 41.2753, longitude: 28.7519, timezone: 'Europe/Istanbul' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', latitude: 13.6900, longitude: 100.7501, timezone: 'Asia/Bangkok' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', latitude: 2.7456, longitude: 101.7099, timezone: 'Asia/Kuala_Lumpur' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India', latitude: 28.5562, longitude: 77.1000, timezone: 'Asia/Kolkata' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', latitude: 19.0896, longitude: 72.8656, timezone: 'Asia/Kolkata' },
  { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico', latitude: 19.4363, longitude: -99.0721, timezone: 'America/Mexico_City' },
  { code: 'CUN', name: 'Cancún International Airport', city: 'Cancún', country: 'Mexico', latitude: 21.0365, longitude: -86.8771, timezone: 'America/Cancun' },
  { code: 'GRU', name: 'São Paulo-Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', latitude: -23.4356, longitude: -46.4731, timezone: 'America/Sao_Paulo' },
  { code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina', latitude: -34.8222, longitude: -58.5358, timezone: 'America/Argentina/Buenos_Aires' },
  { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', latitude: -26.1392, longitude: 28.2460, timezone: 'Africa/Johannesburg' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', latitude: 30.1219, longitude: 31.4056, timezone: 'Africa/Cairo' },
];

async function seedAirports() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Seeding airports...');

  for (const airport of AIRPORTS) {
    const { error } = await supabase
      .from('airports')
      .upsert({
        ...airport,
        location: `POINT(${airport.longitude} ${airport.latitude})`,
      }, {
        onConflict: 'code',
      });

    if (error) {
      console.error(`Error inserting ${airport.code}:`, error);
    } else {
      console.log(`✓ ${airport.code} - ${airport.city}`);
    }
  }

  console.log(`\n✅ Successfully seeded ${AIRPORTS.length} airports`);
}

seedAirports().catch(console.error);
