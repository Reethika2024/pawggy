export interface UserRow {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface PetRow {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  age_months: number | null;
  weight_kg: number | null;
  created_at: string;
}

export interface UserAddressRow {
  id: string;
  user_id: string;
  label: string;
  street_address: string;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: string;
}

export interface BookingRow {
  id: string;
  user_id: string;
  pet_id: string;
  address_id: string;
  provider_id: string;
  service_type: string;
  booking_date: string;
  status: string;
  created_at: string;

  pets?: {
    name: string;
  };

  user_addresses?: {
    label: string;
  };

  service_providers?: {
    name: string;
    provider_type: string;
    city: string;
    rating: number;
  };
}

export interface ServiceProviderRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  provider_type: string;
  city: string;
  rating: number;
  is_verified: boolean;
  created_at: string;
}