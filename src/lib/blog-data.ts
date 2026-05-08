export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  category: "Adventure" | "Culture" | "Food" | "Guides" | "Photography";
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "top-5-lakes-gilgit-baltistan",
    title: "Crystal Waters: The Top 5 Lakes in Gilgit-Baltistan",
    description: "Discover the most breathtaking high-altitude lakes in northern Pakistan, from the turquoise Attabad to the legendary Saiful Muluk.",
    category: "Adventure",
    author: "Zoya Khan",
    date: "May 15, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1541414779316-956a5084c0d4?q=80&w=2000&auto=format&fit=crop",
    featured: true,
    content: "Gilgit-Baltistan is home to some of the world's most spectacular high-altitude lakes. This guide takes you through the turquoise wonders of Attabad, the serene Satpara, and the mystical Sheosar Lake in Deosai..."
  },
  {
    id: "foodies-guide-to-lahore",
    title: "A Foodie's Guide to Lahore: Beyond the Spice",
    description: "From the historic Gawalmandi to the modern cafes of Gulberg, explore the culinary heart of Pakistan.",
    category: "Food",
    author: "Ali Ahmed",
    date: "May 10, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2000&auto=format&fit=crop",
    content: "Lahore is synonymous with food. Whether it's the morning Nihari at the old city gates or the evening BBQ at Lakshmi Chowk, the city never stops eating..."
  },
  {
    id: "peshawar-ancient-city-streets",
    title: "Walking Through Time: Peshawar's Ancient Streets",
    description: "Experience the history of the oldest city in South Asia, from Qissa Khwani Bazaar to the Mahabat Khan Mosque.",
    category: "Culture",
    author: "Saira Shah",
    date: "May 05, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1627548613747-a296a670e300?q=80&w=2000&auto=format&fit=crop",
    content: "Peshawar is a living museum. As you walk through the Street of Storytellers, you can almost hear the echoes of ancient silk road traders..."
  },
  {
    id: "karachi-coastal-adventures",
    title: "Coastal Calm: Weekend Adventures in Karachi",
    description: "Explore the best beaches and coastal activities in the City of Lights, from crabbing to deep-sea fishing.",
    category: "Adventure",
    author: "Hassan Raza",
    date: "April 28, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1560662105-57f8ad6ece2d?q=80&w=2000&auto=format&fit=crop",
    content: "Karachi's coastline is its greatest asset. Beyond Clifton, discover the hidden gems like Mubarak Village and the turtle nesting grounds at Turtle Beach..."
  }
];
