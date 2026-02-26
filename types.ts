
export interface Distributor {
  id: string;
  name: string;
  logoUrl: string;
  department: string;
  city: string;
  address: string;
  phone: string;
  whatsappPhone?: string;
  latitude: number;
  longitude: number;
  description: string;
  googleMapsUrl?: string;
  websiteUrl?: string;
  activo?: boolean;
}
