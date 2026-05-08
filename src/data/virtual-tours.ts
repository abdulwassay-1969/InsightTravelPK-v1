export interface VirtualTourLocation {
  id: string;
  name: string;
  province: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
  youtubeId?: string; // Interactive 360° Video
  description: string;
  category?: string;
}

export const VIRTUAL_TOUR_LOCATIONS: VirtualTourLocation[] = [
  {
    id: "hunza-valley",
    name: "Hunza Valley",
    province: "Gilgit-Baltistan",
    coordinates: { lat: 36.3167, lng: 74.6500 },
    imageUrl: "https://images.unsplash.com/photo-1541414779316-956a5084c0d4?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "W-iC23L9-kE", // 360 Video
    description: "Experience the majestic peaks and turquoise rivers of the legendary Hunza Valley."
  },
  {
    id: "faisal-mosque",
    name: "Faisal Mosque, Islamabad",
    province: "Islamabad Capital Territory",
    coordinates: { lat: 33.7297, lng: 73.0372 },
    imageUrl: "https://images.unsplash.com/photo-1627548613747-a296a670e300?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "7Z6S_Q0N2gY",
    description: "Step inside one of the world's largest and most iconic mosques at the foot of Margalla Hills."
  },
  {
    id: "badshahi-mosque",
    name: "Badshahi Mosque, Lahore",
    province: "Punjab",
    coordinates: { lat: 31.5882, lng: 74.3095 },
    imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "_OqX0H5Gz0o",
    description: "A masterpiece of Mughal architecture, commissioned by Emperor Aurangzeb in 1671."
  },
  {
    id: "skardu",
    name: "Skardu",
    province: "Gilgit-Baltistan",
    coordinates: { lat: 35.2975, lng: 75.6333 },
    imageUrl: "https://images.unsplash.com/photo-1581561586544-7128531278f2?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "rN6Z2O4X8Uo",
    description: "The gateway to some of the world's highest peaks, including K2."
  },
  {
    id: "swat-valley",
    name: "Swat Valley",
    province: "Khyber Pakhtunkhwa",
    coordinates: { lat: 35.2227, lng: 72.4258 },
    imageUrl: "https://images.unsplash.com/photo-1622662259818-6b159e85384d?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "V-S6Z2O4X8U",
    description: "Explore the 'Switzerland of the East' with its lush green valleys and snow-capped peaks."
  },
  {
    id: "mohenjo-daro",
    name: "Mohenjo-daro",
    province: "Sindh",
    coordinates: { lat: 27.3292, lng: 68.1354 },
    imageUrl: "https://images.unsplash.com/photo-1605649406453-29479b470081?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "W-iC23L9-kE",
    description: "Discover the 5,000-year-old remains of one of the world's earliest urban settlements."
  },
  {
    id: "karachi-beach",
    name: "Clifton Beach, Karachi",
    province: "Sindh",
    coordinates: { lat: 24.8138, lng: 67.0300 },
    imageUrl: "https://images.unsplash.com/photo-1560662105-57f8ad6ece2d?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "X-S6Z2O4X8U",
    description: "Enjoy the sunset and sea breeze at Pakistan's most famous coastline."
  },
  {
    id: "neelum-valley",
    name: "Neelum Valley",
    province: "Azad Kashmir",
    coordinates: { lat: 34.5966, lng: 73.9103 },
    imageUrl: "https://images.unsplash.com/photo-1650392651421-2a9f53e34651?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "Y-S6Z2O4X8U",
    description: "A 144km-long bow-shaped valley known for its sparkling blue waters and thick forests."
  },
  {
    id: "chitral",
    name: "Chitral / Kalash Valley",
    province: "Khyber Pakhtunkhwa",
    coordinates: { lat: 35.8510, lng: 71.7864 },
    imageUrl: "https://images.unsplash.com/photo-1627548613747-a296a670e300?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "Z-S6Z2O4X8U",
    description: "Home to the unique Kalash culture and the majestic Tirich Mir peak."
  },
  {
    id: "fairy-meadows",
    name: "Fairy Meadows",
    province: "Gilgit-Baltistan",
    coordinates: { lat: 35.3850, lng: 74.5833 },
    imageUrl: "https://images.unsplash.com/photo-1541414779316-956a5084c0d4?q=80&w=2000&auto=format&fit=crop",
    youtubeId: "A-S6Z2O4X8U",
    description: "A lush green plateau offering the most stunning view of the Killer Mountain, Nanga Parbat."
  }
];
