'use server';

export interface PakistanEvent {
  id: string;
  name: string;
  location: string;
  province: string;
  startDate: string;
  endDate: string;
  description: string;
  category: 'festival' | 'cultural' | 'sports' | 'religious';
  imageUrl?: string;
}

const PAKISTAN_EVENTS: PakistanEvent[] = [
  {
    id: 'shandur-polo-festival',
    name: 'Shandur Polo Festival',
    location: 'Shandur Pass, Chitral',
    province: 'Khyber Pakhtunkhwa',
    startDate: '2025-07-07',
    endDate: '2025-07-09',
    description:
      'Held at the world\'s highest polo ground at 3,700m, this thrilling three-day festival pits teams from Chitral against Gilgit-Baltistan. The event is accompanied by folk music, dance performances, and a spectacular mountain backdrop.',
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1589824778835-f0dc56fc4db8?w=800&q=80',
  },
  {
    id: 'cholistan-desert-jeep-rally',
    name: 'Cholistan Desert Jeep Rally',
    location: 'Derawar Fort, Bahawalpur',
    province: 'Punjab',
    startDate: '2025-02-14',
    endDate: '2025-02-16',
    description:
      'One of South Asia\'s most exciting off-road motorsport events, held in the vast Cholistan Desert. Hundreds of competitors race across sand dunes near the historic Derawar Fort, drawing crowds from across Pakistan and abroad.',
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1547235001-d703406d3f17?w=800&q=80',
  },
  {
    id: 'lok-mela',
    name: 'Lok Mela',
    location: 'Lok Virsa, Islamabad',
    province: 'Islamabad Capital Territory',
    startDate: '2025-10-25',
    endDate: '2025-11-10',
    description:
      'Pakistan\'s grandest cultural fair, organised by the Lok Virsa Heritage Museum. Artisans, craftspeople, musicians, and performers from all four provinces come together to showcase the rich traditions, handicrafts, cuisine, and performing arts of Pakistan.',
    category: 'cultural',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
  },
  {
    id: 'jashn-e-baharan',
    name: 'Jashn-e-Baharan',
    location: 'Lahore',
    province: 'Punjab',
    startDate: '2025-03-20',
    endDate: '2025-03-25',
    description:
      'Lahore\'s beloved spring festival celebrating the arrival of the season with flower exhibitions, kite-flying competitions (basant-style), traditional food stalls, music, and cultural performances across the city\'s historic gardens and parks.',
    category: 'festival',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc38?w=800&q=80',
  },
  {
    id: 'kalash-joshi-spring-festival',
    name: 'Kalash Spring Festival (Joshi)',
    location: 'Kalash Valleys, Chitral',
    province: 'Khyber Pakhtunkhwa',
    startDate: '2025-05-13',
    endDate: '2025-05-16',
    description:
      'The most colourful festival of the ancient Kalash people, Joshi welcomes spring with vibrant dances, traditional songs, offerings of milk and cheese, and the iconic flower-adorned headdresses worn by Kalash women — an unforgettable cultural experience.',
    category: 'cultural',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: 'urs-data-ganj-bakhsh',
    name: 'Urs of Data Ganj Bakhsh',
    location: 'Data Darbar, Lahore',
    province: 'Punjab',
    startDate: '2025-10-10',
    endDate: '2025-10-12',
    description:
      'The annual death anniversary (Urs) of the great Sufi saint Hazrat Ali Hujwiri, also known as Data Ganj Bakhsh. Hundreds of thousands of devotees gather at Data Darbar for Qawwali sessions, prayers, and to pay their respects at one of South Asia\'s most revered shrines.',
    category: 'religious',
    imageUrl: 'https://images.unsplash.com/photo-1542707309-4f9de5fd1d9c?w=800&q=80',
  },
  {
    id: 'hunza-cherry-blossom',
    name: 'Hunza Cherry Blossom Festival',
    location: 'Hunza Valley, Gilgit',
    province: 'Gilgit-Baltistan',
    startDate: '2025-04-01',
    endDate: '2025-04-15',
    description:
      'Every spring, the Hunza Valley transforms into a breathtaking carpet of white and pink cherry blossoms. The local festival celebrates the bloom with cultural shows, traditional music, food fairs, and guided orchard walks against the backdrop of Rakaposhi and Ultar Sar peaks.',
    category: 'festival',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
  },
  {
    id: 'kartarpur-pilgrimages',
    name: 'Kartarpur Corridor Pilgrimages',
    location: 'Gurdwara Darbar Sahib, Narowal',
    province: 'Punjab',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    description:
      'Year-round Sikh pilgrimages to the sacred Gurdwara Darbar Sahib at Kartarpur, the final resting place of Guru Nanak Dev Ji. The Kartarpur Corridor allows visa-free access for Sikh pilgrims from India, making it one of the most significant interfaith peace initiatives in the region.',
    category: 'religious',
    imageUrl: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80',
  },
];

export async function getUpcomingEvents(): Promise<PakistanEvent[]> {
  return PAKISTAN_EVENTS;
}

export async function getEventsByProvince(province: string): Promise<PakistanEvent[]> {
  if (!province || province === 'All') {
    return PAKISTAN_EVENTS;
  }
  return PAKISTAN_EVENTS.filter(
    (event) => event.province.toLowerCase() === province.toLowerCase()
  );
}
