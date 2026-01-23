

export interface Property {
  id: string;
  title: string;
  location: string;
  college: string;
  distance: string;
  walkTime: number;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  isVerified: boolean;
  hasMess: boolean;
  roomType: "single" | "shared" | "studio";
  availableFrom: string;
  description: string;
  sentimentScore: number; // 0-100
  coordinates: { lat: number; lng: number };
  aiInsights: string[];
}

export const colleges = [
  "MIT - Massachusetts Institute of Technology",
  "Stanford University",
  "Harvard University",
  "Yale University",
  "Princeton University",
  "Columbia University",
  "UC Berkeley",
  "UCLA",
  "University of Chicago",
  "Duke University",
  "Northwestern University",
  "Caltech",
  "University of Pennsylvania",
  "Cornell University",
  "Brown University",
  "Indira College of Engineering and Management",
  "COEP",
  "IIT Mumbai",
  "JSPM",
];




export const amenityIcons: Record<string, string> = {
  "WiFi": "📶",
  "Laundry": "🧺",
  "Gym": "💪",
  "Study Room": "📚",
  "24/7 Security": "🔐",
  "AC": "❄️",
  "Kitchen": "🍳",
  "Common Area": "🛋️",
  "Parking": "🚗",
  "Rooftop": "🏙️",
  "Concierge": "🛎️",
  "Heating": "🔥",
  "Bike Storage": "🚲",
  "Garden": "🌿",
  "Rooftop Deck": "☀️",
  "Pet Friendly": "🐾",
  "Smart Home": "🏠",
  "Study Pod": "🎧",
  "Fireplace": "🔥",
  "Private Bath": "🚿",
};
