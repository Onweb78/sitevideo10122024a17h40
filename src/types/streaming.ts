export interface StreamingService {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface StreamingOption {
  type: 'subscription' | 'rental' | 'purchase';
  services: StreamingService[];
  price?: number;
}

export interface StreamingAvailability {
  subscription: StreamingService[];
  rental: {
    service: StreamingService;
    price: number;
  }[];
  purchase: {
    service: StreamingService;
    price: number;
  }[];
}