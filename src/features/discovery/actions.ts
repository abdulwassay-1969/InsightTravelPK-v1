'use server';

export interface SearchFilters {
  query?: string;
  budgetMin?: number;
  budgetMax?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  adventureType?: 'trekking' | 'cultural' | 'sports' | 'relaxation' | 'wildlife' | 'historical';
  groupSize?: number;
  wheelchair?: boolean;
  seniorFriendly?: boolean;
  familyFriendly?: boolean;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface SearchResult {
  id: string;
  name: string;
  province: string;
  category: string;
  difficulty: string;
  budgetPerDayPKR: number;
  season: string[];
  tags: string[];
  description: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
  accessible: boolean;
  familyFriendly: boolean;
}

const DESTINATIONS: SearchResult[] = [
  {
    id: 'hunza-valley',
    name: 'Hunza Valley',
    province: 'Gilgit-Baltistan',
    category: 'Mountainous',
    difficulty: 'intermediate',
    budgetPerDayPKR: 6000,
    season: ['spring', 'summer', 'autumn'],
    tags: ['trekking', 'cultural', 'photography', 'historical'],
    description: 'Legendary valley of ancient forts, terraced fields, and towering peaks.',
    imageUrl: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?q=80&w=800',
    coordinates: { lat: 36.3167, lng: 74.65 },
    accessible: false,
    familyFriendly: true,
  },
  {
    id: 'lahore-heritage',
    name: 'Lahore Heritage Trail',
    province: 'Punjab',
    category: 'Cultural',
    difficulty: 'beginner',
    budgetPerDayPKR: 3500,
    season: ['spring', 'autumn', 'winter'],
    tags: ['cultural', 'historical', 'food', 'relaxation'],
    description: 'Mughal monuments, vibrant bazaars, and world-class street food.',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800',
    coordinates: { lat: 31.5204, lng: 74.3587 },
    accessible: true,
    familyFriendly: true,
  },
  {
    id: 'k2-basecamp',
    name: 'K2 Base Camp Trek',
    province: 'Gilgit-Baltistan',
    category: 'Trekking',
    difficulty: 'expert',
    budgetPerDayPKR: 15000,
    season: ['summer'],
    tags: ['trekking', 'adventure', 'mountaineering'],
    description: 'The ultimate Karakoram challenge, approaching the world\'s second highest peak.',
    imageUrl: 'https://images.unsplash.com/photo-1581561586544-7128531278f2?q=80&w=800',
    coordinates: { lat: 35.8825, lng: 76.5133 },
    accessible: false,
    familyFriendly: false,
  },
  {
    id: 'neelum-valley',
    name: 'Neelum Valley',
    province: 'Azad Kashmir',
    category: 'Hill Station',
    difficulty: 'beginner',
    budgetPerDayPKR: 4500,
    season: ['spring', 'summer', 'autumn'],
    tags: ['relaxation', 'wildlife', 'scenic', 'familyFriendly'],
    description: 'Emerald rivers, dense forests and charming wooden villages.',
    imageUrl: 'https://images.unsplash.com/photo-1650392651421-2a9f53e34651?q=80&w=800',
    coordinates: { lat: 34.5966, lng: 73.9103 },
    accessible: false,
    familyFriendly: true,
  },
  {
    id: 'fairy-meadows',
    name: 'Fairy Meadows',
    province: 'Gilgit-Baltistan',
    category: 'Mountainous',
    difficulty: 'intermediate',
    budgetPerDayPKR: 8000,
    season: ['summer', 'autumn'],
    tags: ['trekking', 'camping', 'photography'],
    description: 'Lush alpine meadow with jaw-dropping views of Nanga Parbat.',
    imageUrl: 'https://images.unsplash.com/photo-1622662259818-6b159e85384d?q=80&w=800',
    coordinates: { lat: 35.385, lng: 74.5833 },
    accessible: false,
    familyFriendly: false,
  },
  {
    id: 'mohenjo-daro',
    name: 'Mohenjo-daro',
    province: 'Sindh',
    category: 'Historical',
    difficulty: 'beginner',
    budgetPerDayPKR: 2500,
    season: ['autumn', 'winter', 'spring'],
    tags: ['historical', 'cultural', 'educational'],
    description: '5,000-year-old UNESCO World Heritage city of the Indus Civilization.',
    imageUrl: 'https://images.unsplash.com/photo-1605649406453-29479b470081?q=80&w=800',
    coordinates: { lat: 27.3292, lng: 68.1354 },
    accessible: true,
    familyFriendly: true,
  },
  {
    id: 'khunjerab-pass',
    name: 'Khunjerab Pass',
    province: 'Gilgit-Baltistan',
    category: 'Mountainous',
    difficulty: 'intermediate',
    budgetPerDayPKR: 5000,
    season: ['summer'],
    tags: ['adventure', 'wildlife', 'scenic', 'border'],
    description: 'World\'s highest paved international border — gateway to China.',
    imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800',
    coordinates: { lat: 36.8397, lng: 75.4189 },
    accessible: false,
    familyFriendly: false,
  },
];

export async function advancedSearch(filters: SearchFilters): Promise<SearchResult[]> {
  let results = [...DESTINATIONS];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.province.toLowerCase().includes(q) ||
      d.tags.some(t => t.includes(q)) ||
      d.category.toLowerCase().includes(q)
    );
  }

  if (filters.budgetMin !== undefined) {
    results = results.filter(d => d.budgetPerDayPKR >= filters.budgetMin!);
  }
  if (filters.budgetMax !== undefined) {
    results = results.filter(d => d.budgetPerDayPKR <= filters.budgetMax!);
  }
  if (filters.difficulty) {
    results = results.filter(d => d.difficulty === filters.difficulty);
  }
  if (filters.adventureType) {
    results = results.filter(d => d.tags.includes(filters.adventureType!));
  }
  if (filters.wheelchair) {
    results = results.filter(d => d.accessible);
  }
  if (filters.familyFriendly) {
    results = results.filter(d => d.familyFriendly);
  }
  if (filters.season) {
    results = results.filter(d => d.season.includes(filters.season!));
  }

  return results;
}
