/**
 * @fileOverview Hand-authored, authoritative facts about the InsightTravelPK
 * website itself — what it is, what each page/section does, and how visitors use
 * it. These complement the data-driven documents (contacts, districts, blog, ...)
 * so the assistant can answer "what is on this site", "where do I find X", and
 * "how do I contact you" questions precisely instead of refusing.
 *
 * Keep these statements factual. If a page changes substantially, update the
 * matching entry here so the assistant stays accurate.
 */

import type { KnowledgeDocument } from './types';

export const SITE_INFO_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'site-overview',
    title: 'About InsightTravelPK',
    url: '/',
    section: 'About the website',
    text: `InsightTravelPK is a digital tourism platform dedicated entirely to travel in Pakistan. Its mission is to modernize and digitize the travel experience in Pakistan and make the country's landscapes, culture, and heritage accessible to the world. The site brings together province and district travel guides, an interactive map, live weather, a smart AI trip planner, a traveler photo gallery, 360 virtual tours, a travel blog, and province-wise emergency and tourism department contacts. It also has a built-in AI travel assistant chatbot that answers questions about destinations, routes, weather, budgets, hotels, safety, and the website itself.`,
    keywords: ['insighttravelpk', 'website', 'platform', 'pakistan tourism', 'about', 'what is this site'],
  },
  {
    id: 'site-assistant',
    title: 'InsightTravelPK Travel Assistant (chatbot)',
    url: '/assistant',
    section: 'About the website',
    text: `The InsightTravelPK Assistant is an AI chatbot available across the site (as a floating chat button on most pages and as a full page at /assistant). You can ask it naturally about Pakistan travel — destinations, routes, best time to visit, weather, budgets, hotels, safety, nearby places, and emergency or tourism contacts — as well as questions about the website itself. It replies in English, Urdu, or Roman Urdu (selectable), offers quick-reply suggestions, and is context aware: when opened from a province or district page it already knows which location you are viewing.`,
    keywords: ['assistant', 'chatbot', 'chat', 'ai', 'help', 'urdu', 'roman urdu', 'languages'],
  },
  {
    id: 'site-navigation',
    title: 'Website pages and navigation',
    url: '/',
    section: 'About the website',
    text: `Main pages on InsightTravelPK: Home (/), About (/about), Provinces and regions (/provinces/[slug] plus district guides at /districts/[slug]), Interactive Map (/map), Smart Trip Planner (/planner), Weather (/weather), Traveler Gallery (/gallery), 360 Virtual Tours (/virtual-tour), Travel Blog (/blog), Emergency & Tourism Contacts (/contact), Partner / business application (/partners), Travel Assistant (/assistant). Account pages: Login (/login), Sign up (/signup), Forgot password (/forgot-password), Dashboard (/dashboard), My Trips (/my-trips) and Saved Trips (/saved-trips). Legal pages: Privacy Policy (/privacy-policy) and Terms of Service (/terms).`,
    keywords: ['pages', 'menu', 'navigation', 'sitemap', 'where', 'find', 'links'],
  },
  {
    id: 'site-contact',
    title: 'Contact information — Emergency & Tourism Contacts page',
    url: '/contact',
    section: 'Contacts',
    text: `The Contacts page (/contact), labelled "Emergency & Tourism Contacts", is where to find how to reach help while travelling. It lists, for every province and region of Pakistan, the emergency numbers (Police, Ambulance, Fire Brigade, Motorway Police) and the official Tourism Department name, phone number, and official website. Visitors are advised to verify numbers before travel because official departments may update their details. Note: the website currently does not publish a personal/operator email address or a "contact us" form — social media links and the newsletter are marked "coming soon". For travel help, use the AI assistant or the Smart Trip Planner; for official help while travelling, use the province contacts on the Contacts page.`,
    keywords: ['contact', 'contact us', 'email', 'phone', 'reach', 'support', 'helpline', 'get in touch', 'emergency'],
  },
  {
    id: 'site-about-page',
    title: 'About page — vision, mission and community',
    url: '/about',
    section: 'About the website',
    text: `The About page explains InsightTravelPK's vision (to become the ultimate digital gateway for tourism in Pakistan, connecting global travelers with authentic local experiences), its belief that Pakistan — from the peaks of K2 to the deserts of Cholistan — is the world's best-kept secret, and its community-driven model. The platform was created because reliable, digitized travel information about Pakistan was hard to find. It uses modern web technology and generative AI to provide district guides and instant smart itineraries. Travelers can contribute by uploading HD photos to the Gallery and writing reviews in the district review sections.`,
    keywords: ['about', 'mission', 'vision', 'story', 'team', 'community', 'contribute'],
  },
  {
    id: 'site-planner',
    title: 'Smart Trip Planner',
    url: '/planner',
    section: 'Features',
    text: `The Smart Trip Planner (/planner) is an AI-powered tool that generates a detailed, personalized Pakistan travel itinerary in seconds. You provide a destination, dates and duration, number of travelers, travel style and pace, budget level, and interests; it produces a day-by-day plan that you can download as a PDF and, when signed in, save to your account (My Trips / Saved Trips).`,
    keywords: ['planner', 'plan', 'itinerary', 'trip', 'smart planner', 'pdf', 'save trip'],
  },
  {
    id: 'site-gallery',
    title: 'Traveler Gallery',
    url: '/gallery',
    section: 'Features',
    text: `The Traveler Gallery (/gallery) is a community photo gallery where visitors can browse high-quality images of Pakistan's destinations and upload their own HD travel photos to share with other travelers. Images are served through ImageKit.`,
    keywords: ['gallery', 'photos', 'images', 'upload', 'pictures'],
  },
  {
    id: 'site-weather',
    title: 'Weather updates',
    url: '/weather',
    section: 'Features',
    text: `The Weather page (/weather) provides current conditions and a multi-day forecast for Pakistani cities and tourist destinations to help travelers plan and pack. Live weather summaries are also surfaced inside destination pages and the AI assistant.`,
    keywords: ['weather', 'forecast', 'temperature', 'climate', 'rain', 'snow'],
  },
  {
    id: 'site-map',
    title: 'Interactive map',
    url: '/map',
    section: 'Features',
    text: `The Map page (/map) is an interactive map of Pakistan that lets travelers explore provinces, districts, and key destinations geographically, with clustering and points of interest.`,
    keywords: ['map', 'interactive map', 'locations', 'explore', 'markers'],
  },
  {
    id: 'site-virtual-tour',
    title: '360 virtual tours',
    url: '/virtual-tour',
    section: 'Features',
    text: `The Virtual Tours page (/virtual-tour) offers immersive 360 degree experiences and videos of iconic Pakistani destinations such as Hunza Valley, Skardu, Faisal Mosque, Badshahi Mosque, Swat Valley, Neelum Valley, Fairy Meadows, and more, so visitors can preview places before they travel.`,
    keywords: ['virtual tour', '360', 'panorama', 'video', 'immersive', 'preview'],
  },
  {
    id: 'site-blog',
    title: 'Travel blog',
    url: '/blog',
    section: 'Features',
    text: `The Travel Blog (/blog) publishes guides and stories about Pakistan across categories such as Adventure, Culture, Food, Guides, and Photography — for example lake guides for Gilgit-Baltistan, a foodie's guide to Lahore, and walks through Peshawar's old city. Each article opens at /blog/[id].`,
    keywords: ['blog', 'articles', 'guides', 'stories', 'read', 'food', 'culture', 'adventure'],
  },
  {
    id: 'site-partners',
    title: 'Partner / business application',
    url: '/partners',
    section: 'For businesses',
    text: `The Partners page (/partners) lets tourism businesses apply to be listed on InsightTravelPK — including hotels, guesthouses, restaurants, cafes, tour guides, and other tourism services. Applicants submit their business details through an onboarding form; submissions are reviewed before being published.`,
    keywords: ['partner', 'partners', 'business', 'list my hotel', 'guesthouse', 'restaurant', 'guide', 'register business', 'apply'],
  },
  {
    id: 'site-account',
    title: 'Accounts, saved trips and dashboard',
    url: '/login',
    section: 'Account',
    text: `Visitors can create an account (/signup), log in (/login), and reset a forgotten password (/forgot-password). Signed-in users get a Dashboard (/dashboard) and can save itineraries generated by the Smart Trip Planner to My Trips (/my-trips) and Saved Trips (/saved-trips).`,
    keywords: ['login', 'signup', 'register', 'account', 'password', 'dashboard', 'my trips', 'saved trips', 'sign in'],
  },
  {
    id: 'site-regions-overview',
    title: 'Provinces and regions covered',
    url: '/',
    section: 'Destinations',
    text: `InsightTravelPK covers all of Pakistan across seven regions: Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Gilgit-Baltistan, Azad Kashmir, and the Islamabad Capital Territory. Each region has its own page (/provinces/[slug]) and individual district travel guides (/districts/[slug]) with descriptions, best time to visit, top attractions, and photo galleries.`,
    keywords: ['provinces', 'regions', 'districts', 'punjab', 'sindh', 'kpk', 'balochistan', 'gilgit', 'kashmir', 'islamabad', 'destinations'],
  },
  {
    id: 'site-legal',
    title: 'Privacy Policy and Terms of Service',
    url: '/terms',
    section: 'Legal',
    text: `InsightTravelPK publishes a Privacy Policy (/privacy-policy) describing how visitor data is handled and a Terms of Service (/terms) governing use of the platform. Both are linked from the footer of every page.`,
    keywords: ['privacy', 'terms', 'policy', 'legal', 'data', 'cookies'],
  },
];
