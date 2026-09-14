import api from './api';

// Rich Verified PG Data for demonstration/fallback
const MOCK_PGS = [
  {
    id: 1,
    title: "Stanza Living Dublin House",
    slug: "stanza-living-dublin-house",
    description: "Premium fully managed single and double sharing rooms for boys near Manyata Tech Park. Includes high-speed WiFi, daily professional housekeeping, delicious 3-time meals, and modern lounge spaces.",
    price: 9500,
    address: "24, Near Gate 5, Manyata Tech Park Road, Hebbal",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560045",
    genderType: "MALE",
    sharingType: "DOUBLE",
    latitude: 13.0489,
    longitude: 77.6200,
    rating: 4.8,
    reviewsCount: 34,
    rules: "No outside guests after 10 PM. Silent hours from 11 PM to 6 AM. ID verification mandatory. No pets allowed.",
    images: [
      { url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", isPrimary: false }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "3 Meals Daily", icon: "Coffee" },
      { name: "Power Backup", icon: "Zap" },
      { name: "Housekeeping", icon: "Sparkles" },
      { name: "Gym", icon: "Dumbbell" }
    ],
    nearbyPlaces: [
      { name: "Manyata Tech Park", distance: "0.2 km", type: "OFFICE" },
      { name: "Hebbal Metro Station", distance: "1.5 km", type: "METRO" },
      { name: "Aster CMI Hospital", distance: "2.1 km", type: "HOSPITAL" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 2,
    title: "Zolo Stay Nest Girls PG",
    slug: "zolo-stay-nest-girls-pg",
    description: "Secure and elegant girls-only PG accommodation situated in HSR Layout Sector 3. High-class security, biometric access, fully furnished spacious rooms, high-speed WiFi, laundry services, and home-style veg/non-veg meals.",
    price: 12000,
    address: "562, 17th Cross Road, Sector 3, HSR Layout",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560102",
    genderType: "FEMALE",
    sharingType: "SINGLE",
    latitude: 12.9116,
    longitude: 77.6389,
    rating: 4.7,
    reviewsCount: 22,
    rules: "In-time 10:30 PM. No male visitors allowed in room area. Maintain cleanliness in common kitchen. Rent to be paid by 5th.",
    images: [
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", isPrimary: false }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Biometric Security", icon: "Shield" },
      { name: "Laundry Service", icon: "Shirt" },
      { name: "Kitchen Access", icon: "ChefHat" },
      { name: "TV Lounge", icon: "Tv" }
    ],
    nearbyPlaces: [
      { name: "NIFT College", distance: "0.6 km", type: "COLLEGE" },
      { name: "HSR Metro Station", distance: "1.0 km", type: "METRO" },
      { name: "Narayana Multispeciality Hospital", distance: "1.2 km", type: "HOSPITAL" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 3,
    title: "CoHo Premium Unisex Living",
    slug: "coho-premium-unisex-living",
    description: "Co-living space in Sector 48 near Cyber City. Perfect for working professionals. Offers studio rooms with pantry, smart TV, gaming zone, weekly community events, washing machine, and dedicated workspace.",
    price: 15500,
    address: "Plot 89, Sector 48, Near Sohna Road",
    city: "Gurugram",
    state: "Haryana",
    zipCode: "122001",
    genderType: "UNISEX",
    sharingType: "SINGLE",
    latitude: 28.4239,
    longitude: 77.0396,
    rating: 4.9,
    reviewsCount: 41,
    rules: "Respect community members. Keep pet policy strictly validated. No loud noise after midnight. Smoking in designated areas only.",
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", isPrimary: false }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Dedicated Desk", icon: "Laptop" },
      { name: "Game Room", icon: "Gamepad2" },
      { name: "Washing Machine", icon: "WashingMachine" },
      { name: "CCTV Security", icon: "Camera" }
    ],
    nearbyPlaces: [
      { name: "Sohna Road IT Parks", distance: "0.4 km", type: "OFFICE" },
      { name: "HUDA City Centre Metro", distance: "3.5 km", type: "METRO" },
      { name: "Medanta Medicity", distance: "2.8 km", type: "HOSPITAL" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 4,
    title: "Saraswati Boys Hostels",
    slug: "saraswati-boys-hostels",
    description: "Affordable shared PG accommodation for students near Delhi University North Campus. High frequency transport connection, nutritious meals, study rooms, 24x7 water and power backup.",
    price: 6800,
    address: "Block C, 14, Kamla Nagar",
    city: "Delhi",
    state: "Delhi",
    zipCode: "110007",
    genderType: "MALE",
    sharingType: "TRIPLE",
    latitude: 28.6802,
    longitude: 77.2023,
    rating: 4.3,
    reviewsCount: 15,
    rules: "Entry close by 10 PM. No alcohol permitted inside premises. Keep study areas quiet. Clean beds daily.",
    images: [
      { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", isPrimary: false }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Study Tables", icon: "BookOpen" },
      { name: "3 Meals Daily", icon: "Coffee" },
      { name: "Purified Water", icon: "Droplet" },
      { name: "Power Backup", icon: "Zap" }
    ],
    nearbyPlaces: [
      { name: "Delhi University North Campus", distance: "0.5 km", type: "COLLEGE" },
      { name: "Vishwavidyalaya Metro Station", distance: "0.8 km", type: "METRO" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 5,
    title: "Livio Elite Co-Living Spaces",
    slug: "livio-elite-co-living-powai",
    description: "Luxury unisex co-living in Powai near IIT Bombay and Hiranandani Business Park. High-end interiors, gymnasium, housekeeping, gourmet kitchen, and scenic lake views.",
    price: 18000,
    address: "Tower B, Central Avenue, Hiranandani Gardens, Powai",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400076",
    genderType: "UNISEX",
    sharingType: "SINGLE",
    latitude: 19.1176,
    longitude: 72.9060,
    rating: 4.9,
    reviewsCount: 28,
    rules: "Maintain tranquility. Visitors permitted in common areas.",
    images: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", isPrimary: false }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Gym", icon: "Dumbbell" },
      { name: "Biometric Security", icon: "Shield" },
      { name: "Housekeeping", icon: "Sparkles" },
      { name: "Kitchen Access", icon: "ChefHat" }
    ],
    nearbyPlaces: [
      { name: "Hiranandani Business Park", distance: "0.3 km", type: "OFFICE" },
      { name: "IIT Bombay", distance: "1.1 km", type: "COLLEGE" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 6,
    title: "Oxford Student PG & Hostel",
    slug: "oxford-student-pg-pune",
    description: "Premier student living near Symbiosis in Viman Nagar. Ergonomic study desks, high-speed fiber internet, cafeteria with North & South Indian meals, and round-the-clock security.",
    price: 8500,
    address: "Plot 42, Clover Park, Viman Nagar",
    city: "Pune",
    state: "Maharashtra",
    zipCode: "411014",
    genderType: "MALE",
    sharingType: "DOUBLE",
    latitude: 18.5679,
    longitude: 73.9143,
    rating: 4.6,
    reviewsCount: 19,
    rules: "Curfew 10 PM for 1st year students. Silent hours in study hall.",
    images: [
      { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80", isPrimary: true }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Study Tables", icon: "BookOpen" },
      { name: "3 Meals Daily", icon: "Coffee" },
      { name: "Laundry Service", icon: "Shirt" },
      { name: "CCTV Security", icon: "Camera" }
    ],
    nearbyPlaces: [
      { name: "Symbiosis International University", distance: "0.8 km", type: "COLLEGE" },
      { name: "Phoenix Marketcity", distance: "1.2 km", type: "MALL" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 7,
    title: "Sri Sai Balaji Executive PG",
    slug: "sri-sai-balaji-executive-pg-hyderabad",
    description: "Top-rated executive accommodation in Madhapur / Hitech City. Walking distance to Mindspace IT Park and Cyber Towers. 3 meals daily, daily cleaning, 24-hr power backup.",
    price: 8000,
    address: "1-90/B, Silicon Valley, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    zipCode: "500081",
    genderType: "MALE",
    sharingType: "DOUBLE",
    latitude: 17.4483,
    longitude: 78.3915,
    rating: 4.5,
    reviewsCount: 18,
    rules: "Gates lock at 11 PM. ID verification mandatory.",
    images: [
      { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80", isPrimary: true }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "3 Meals Daily", icon: "Coffee" },
      { name: "Power Backup", icon: "Zap" },
      { name: "Housekeeping", icon: "Sparkles" }
    ],
    nearbyPlaces: [
      { name: "Mindspace IT Park", distance: "0.5 km", type: "OFFICE" },
      { name: "Hitech City Metro Station", distance: "0.7 km", type: "METRO" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 8,
    title: "Royal Palms Luxury PG for Women",
    slug: "royal-palms-luxury-women-pg-koramangala",
    description: "Exclusive boutique accommodation for female professionals in Koramangala 4th Block. High-speed WiFi, air-conditioned rooms, full biometric access, CCTV, organic food options.",
    price: 14500,
    address: "102, 80 Feet Road, 4th Block, Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560034",
    genderType: "FEMALE",
    sharingType: "SINGLE",
    latitude: 12.9352,
    longitude: 77.6245,
    rating: 4.9,
    reviewsCount: 31,
    rules: "Security protocols strictly enforced. 24x7 female warden present.",
    images: [
      { url: "https://images.unsplash.com/photo-1540518614846-7ede433c4b69?auto=format&fit=crop&w=800&q=80", isPrimary: true }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Biometric Security", icon: "Shield" },
      { name: "3 Meals Daily", icon: "Coffee" },
      { name: "Housekeeping", icon: "Sparkles" },
      { name: "CCTV Security", icon: "Camera" }
    ],
    nearbyPlaces: [
      { name: "Sony World Signal", distance: "0.4 km", type: "TRANSIT" },
      { name: "Wipro Park", distance: "0.6 km", type: "PARK" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 9,
    title: "Metro View Executive PG",
    slug: "metro-view-executive-pg-delhi",
    description: "Spacious co-living space right outside Hauz Khas Metro Station. Ideal for professionals working in South Delhi and Gurgaon. AC, high-speed WiFi, furnished kitchen.",
    price: 13500,
    address: "C-12, Hauz Khas Enclave",
    city: "Delhi",
    state: "Delhi",
    zipCode: "110016",
    genderType: "UNISEX",
    sharingType: "SINGLE",
    latitude: 28.5494,
    longitude: 77.2001,
    rating: 4.8,
    reviewsCount: 16,
    rules: "Smoking in balcony only. Peaceful co-living.",
    images: [
      { url: "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=800&q=80", isPrimary: true }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Kitchen Access", icon: "ChefHat" },
      { name: "Power Backup", icon: "Zap" },
      { name: "Washing Machine", icon: "WashingMachine" }
    ],
    nearbyPlaces: [
      { name: "Hauz Khas Metro Station", distance: "0.1 km", type: "METRO" },
      { name: "IIT Delhi", distance: "1.0 km", type: "COLLEGE" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 10,
    title: "Shiv Shakti Mens PG",
    slug: "shiv-shakti-mens-pg-pune",
    description: "Affordable gents PG in Hinjewadi Phase 1 near Infosys and Wipro circle. Homely food, hot water 24/7, daily cleaning, and bike parking.",
    price: 6500,
    address: "Behind Blue Ridge, Hinjewadi Phase 1",
    city: "Pune",
    state: "Maharashtra",
    zipCode: "411057",
    genderType: "MALE",
    sharingType: "TRIPLE",
    latitude: 18.5913,
    longitude: 73.7389,
    rating: 4.4,
    reviewsCount: 20,
    rules: "No smoking inside rooms. Rent due on 1st.",
    images: [
      { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80", isPrimary: true }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "3 Meals Daily", icon: "Coffee" },
      { name: "Purified Water", icon: "Droplet" },
      { name: "Power Backup", icon: "Zap" },
      { name: "CCTV Security", icon: "Camera" }
    ],
    nearbyPlaces: [
      { name: "Infosys Hinjewadi", distance: "0.8 km", type: "OFFICE" },
      { name: "Wipro Circle", distance: "1.1 km", type: "OFFICE" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 11,
    title: "Serenity Co-Living & PG",
    slug: "serenity-co-living-andheri-mumbai",
    description: "Modern air-conditioned co-living near MIDC and SEEPZ in Andheri East. Fast metro access, gym, weekly laundry, and study workspace.",
    price: 16000,
    address: "Cross Road B, MIDC, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400093",
    genderType: "UNISEX",
    sharingType: "DOUBLE",
    latitude: 19.1197,
    longitude: 72.8688,
    rating: 4.8,
    reviewsCount: 25,
    rules: "Valid ID card required. Quiet hours 11 PM to 7 AM.",
    images: [
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", isPrimary: true }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Air Conditioning", icon: "Wind" },
      { name: "Gym", icon: "Dumbbell" },
      { name: "Laundry Service", icon: "Shirt" },
      { name: "Dedicated Desk", icon: "Laptop" }
    ],
    nearbyPlaces: [
      { name: "SEEPZ IT Zone", distance: "0.6 km", type: "OFFICE" },
      { name: "Chakala Metro Station", distance: "1.2 km", type: "METRO" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  },
  {
    id: 12,
    title: "Comfort Stay Girls Hostel",
    slug: "comfort-stay-girls-hostel-noida",
    description: "Safe, comfortable girls PG accommodation in Sector 62 Noida near institutional tech zone. Delicious 3-time meals, 24x7 security warden, power backup.",
    price: 7800,
    address: "B-Block, Sector 62, Near Fortis Hospital",
    city: "Noida",
    state: "Uttar Pradesh",
    zipCode: "201309",
    genderType: "FEMALE",
    sharingType: "DOUBLE",
    latitude: 28.6280,
    longitude: 77.3649,
    rating: 4.5,
    reviewsCount: 14,
    rules: "Entry by 9:30 PM. CCTV monitored entrances.",
    images: [
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", isPrimary: true }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "3 Meals Daily", icon: "Coffee" },
      { name: "Biometric Security", icon: "Shield" },
      { name: "Power Backup", icon: "Zap" },
      { name: "Study Tables", icon: "BookOpen" }
    ],
    nearbyPlaces: [
      { name: "Fortis Hospital Noida", distance: "0.5 km", type: "HOSPITAL" },
      { name: "Noida Electronic City Metro", distance: "1.1 km", type: "METRO" }
    ],
    owner: { name: "Jane Proprietor", phone: "+91 98765 43211", email: "owner@example.com" }
  }
];

export const pgService = {
  getAll: async () => {
    try {
      const response = await api.get('/pgs');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return MOCK_PGS;
    } catch (error) {
      console.warn("Failed to fetch PGs from API, using fallback data", error);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_PGS;
    }
  },

  search: async (query, filters = {}) => {
    try {
      const params = {};
      if (query && query.trim()) params.query = query.trim();
      if (filters.city && filters.city !== 'ALL') params.city = filters.city;
      if (filters.gender && filters.gender !== 'ALL') params.gender = filters.gender;
      if (filters.sharing && filters.sharing !== 'ALL') params.sharing = filters.sharing;
      if (filters.minPrice !== undefined && filters.minPrice !== '' && !isNaN(Number(filters.minPrice))) {
        params.minPrice = Number(filters.minPrice);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== '' && !isNaN(Number(filters.maxPrice))) {
        params.maxPrice = Number(filters.maxPrice);
      }
      if (filters.amenity && filters.amenity !== 'ALL') params.amenity = filters.amenity;

      const response = await api.get('/search', { params });
      let results = response.data;

      // Sort response if sortBy is active
      if (filters.sortBy && Array.isArray(results) && results.length > 0) {
        if (filters.sortBy === "PRICE_LOW_HIGH") {
          results.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === "PRICE_HIGH_LOW") {
          results.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === "RATING") {
          results.sort((a, b) => (b.rating || 5.0) - (a.rating || 5.0));
        }
      }
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.warn("Search API failed, using client-side search fallback", error);
      await new Promise((resolve) => setTimeout(resolve, 300));
      let results = [...MOCK_PGS];

      // Filter by search query (PG Title / Name, City, Address, State, Landmarks)
      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        results = results.filter(
          (pg) =>
            (pg.title && pg.title.toLowerCase().includes(q)) ||
            (pg.city && pg.city.toLowerCase().includes(q)) ||
            (pg.address && pg.address.toLowerCase().includes(q)) ||
            (pg.state && pg.state.toLowerCase().includes(q)) ||
            (pg.description && pg.description.toLowerCase().includes(q)) ||
            (pg.nearbyPlaces && pg.nearbyPlaces.some((place) => place.name && place.name.toLowerCase().includes(q)))
        );

        // Sort by exact or starting title match first
        results.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          if (aTitle === q) return -1;
          if (bTitle === q) return 1;
          if (aTitle.startsWith(q) && !bTitle.startsWith(q)) return -1;
          if (!aTitle.startsWith(q) && bTitle.startsWith(q)) return 1;
          return 0;
        });
      }

      // Filter by city
      if (filters.city && filters.city !== "ALL") {
        results = results.filter((pg) => pg.city.toLowerCase() === filters.city.toLowerCase());
      }

      // Filter by gender
      if (filters.gender && filters.gender !== "ALL") {
        results = results.filter((pg) => pg.genderType === filters.gender);
      }

      // Filter by sharing
      if (filters.sharing && filters.sharing !== "ALL") {
        results = results.filter((pg) => pg.sharingType === filters.sharing);
      }

      // Filter by price range
      if (filters.minPrice !== undefined && filters.minPrice !== '' && !isNaN(Number(filters.minPrice))) {
        results = results.filter((pg) => pg.price >= Number(filters.minPrice));
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== '' && !isNaN(Number(filters.maxPrice))) {
        results = results.filter((pg) => pg.price <= Number(filters.maxPrice));
      }

      // Filter by amenity
      if (filters.amenity && filters.amenity !== "ALL") {
        const amen = filters.amenity.toLowerCase();
        results = results.filter((pg) =>
          pg.amenities && pg.amenities.some((a) => a.name && a.name.toLowerCase().includes(amen))
        );
      }

      // Sort options
      if (filters.sortBy) {
        if (filters.sortBy === "PRICE_LOW_HIGH") {
          results.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === "PRICE_HIGH_LOW") {
          results.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === "RATING") {
          results.sort((a, b) => (b.rating || 5.0) - (a.rating || 5.0));
        }
      }

      return results;
    }
  },

  getBySlug: async (slug) => {
    try {
      const response = await api.get(`/pgs/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.warn("Get PG by slug API failed, using fallback data", error);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const pg = MOCK_PGS.find((p) => p.slug === slug);
      if (!pg) throw new Error("PG accommodation not found");
      return pg;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/pgs/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Get PG by id API failed, using fallback data", error);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const pg = MOCK_PGS.find((p) => p.id === Number(id));
      if (!pg) throw new Error("PG accommodation not found");
      return pg;
    }
  },

  create: async (pgData) => {
    try {
      const response = await api.post('/pgs', pgData);
      return response.data;
    } catch (error) {
      console.warn("Create PG API failed, using mock return", error);
      return { id: Math.floor(Math.random() * 1000) + 20, ...pgData };
    }
  },

  update: async (id, pgData) => {
    try {
      const response = await api.put(`/pgs/${id}`, pgData);
      return response.data;
    } catch (error) {
      console.warn("Update PG API failed, returning mock", error);
      return { id, ...pgData };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/pgs/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Delete PG API failed, returning mock success", error);
      return { message: "Deleted successfully" };
    }
  }
};

export default pgService;
