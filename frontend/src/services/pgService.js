import api from './api';

// Mock PG Data for demonstration/fallback
const MOCK_PGS = [
  {
    id: 1,
    title: "Stanza Living Dublin House",
    slug: "stanza-living-dublin-house",
    description: "Premium fully managed single and double sharing rooms for boys/men near Manyata Tech Park. Includes high-speed WiFi, daily professional housekeeping, delicious 3-time meals, and modern lounge spaces.",
    price: 9500,
    address: "24, Near Gate 5, Manyata Tech Park Road, Hebbal",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560045",
    genderType: "MALE", // MALE, FEMALE, UNISEX
    sharingType: "DOUBLE", // SINGLE, DOUBLE, TRIPLE, QUAD
    rating: 4.8,
    reviewsCount: 34,
    rules: "No outside guests after 10 PM. Silent hours from 11 PM to 6 AM. ID verification mandatory. No pets allowed.",
    images: [
      { url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", isPrimary: false }
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
      { name: "Aster CMI Hospital", distance: "2.1 km", type: "HOSPITAL" },
      { name: "Reva University", distance: "4.5 km", type: "COLLEGE" }
    ],
    owner: {
      name: "Jane Proprietor",
      phone: "+1 987 654 325",
      email: "owner@example.com"
    }
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
    rating: 4.5,
    reviewsCount: 22,
    rules: "In-time 10:30 PM. No male visitors allowed in room area. Maintain cleanliness in common kitchen. Rent to be paid by 5th.",
    images: [
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", isPrimary: false }
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
      { name: "HSR Metro Station (Upcoming)", distance: "1.0 km", type: "METRO" },
      { name: "Narayana Multispeciality Hospital", distance: "1.2 km", type: "HOSPITAL" },
      { name: "Koramangala Tech Parks", distance: "2.0 km", type: "OFFICE" }
    ],
    owner: {
      name: "Jane Proprietor",
      phone: "+1 987 654 325",
      email: "owner@example.com"
    }
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
    rating: 4.9,
    reviewsCount: 41,
    rules: "Respect community members. Keep pet policy strictly validated. No loud noise after midnight. Smoking in designated areas only.",
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", isPrimary: false }
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
      { name: "Medanta Medicity", distance: "2.8 km", type: "HOSPITAL" },
      { name: "GD Goenka University Shuttle", distance: "0.2 km", type: "COLLEGE" }
    ],
    owner: {
      name: "Jane Proprietor",
      phone: "+1 987 654 325",
      email: "owner@example.com"
    }
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
    rating: 4.1,
    reviewsCount: 15,
    rules: "Entry close by 10 PM. No alcohol permitted inside premises. Keep study areas quiet. Clean beds daily.",
    images: [
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", isPrimary: false }
    ],
    amenities: [
      { name: "WiFi", icon: "Wifi" },
      { name: "Study Tables", icon: "BookOpen" },
      { name: "Meals Included", icon: "Coffee" },
      { name: "Purified Water", icon: "Droplet" },
      { name: "Power Backup", icon: "Zap" }
    ],
    nearbyPlaces: [
      { name: "Delhi University (DU) North Campus", distance: "0.5 km", type: "COLLEGE" },
      { name: "Vishwavidyalaya Metro Station", distance: "0.8 km", type: "METRO" },
      { name: "Kamla Nagar Market", distance: "0.1 km", type: "OFFICE" },
      { name: "Hindu Rao Hospital", distance: "2.3 km", type: "HOSPITAL" }
    ],
    owner: {
      name: "Jane Proprietor",
      phone: "+1 987 654 325",
      email: "owner@example.com"
    }
  }
];

export const pgService = {
  getAll: async () => {
    try {
      const response = await api.get('/pgs');
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch PGs from API, using mock data", error);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_PGS;
    }
  },

  search: async (query, filters = {}) => {
    try {
      const params = {
        query,
        gender: filters.gender,
        sharing: filters.sharing,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice
      };
      const response = await api.get('/search', { params });
      let results = response.data;

      // Sort response if sortBy is active
      if (filters.sortBy && results && results.length > 0) {
        if (filters.sortBy === "PRICE_LOW_HIGH") {
          results.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === "PRICE_HIGH_LOW") {
          results.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === "RATING") {
          results.sort((a, b) => (b.rating || 5.0) - (a.rating || 5.0));
        }
      }
      return results;
    } catch (error) {
      console.warn("Search API failed, using mock search", error);
      await new Promise((resolve) => setTimeout(resolve, 600));
      let results = [...MOCK_PGS];

      // Filter by search query
      if (query) {
        const q = query.toLowerCase();
        results = results.filter(
          (pg) =>
            pg.city.toLowerCase().includes(q) ||
            pg.title.toLowerCase().includes(q) ||
            pg.address.toLowerCase().includes(q) ||
            pg.nearbyPlaces.some((place) => place.name.toLowerCase().includes(q))
        );
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
      if (filters.minPrice) {
        results = results.filter((pg) => pg.price >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        results = results.filter((pg) => pg.price <= Number(filters.maxPrice));
      }

      // Sort options
      if (filters.sortBy) {
        if (filters.sortBy === "PRICE_LOW_HIGH") {
          results.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === "PRICE_HIGH_LOW") {
          results.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === "RATING") {
          results.sort((a, b) => b.rating - a.rating);
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
      console.warn("Get PG by slug API failed, using mock data", error);
      await new Promise((resolve) => setTimeout(resolve, 400));
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
      console.warn("Get PG by ID API failed, using mock data", error);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const pg = MOCK_PGS.find((p) => p.id === Number(id));
      if (!pg) throw new Error("PG accommodation not found");
      return pg;
    }
  },

  create: async (pgData) => {
    try {
      const payload = {
        ...pgData,
        owner: { id: pgData.ownerId || 2 } // Default owner seeded id: 2
      };
      const response = await api.post('/pgs', payload);
      return response.data;
    } catch (error) {
      console.warn("Create PG API failed, using mock data:", error);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newPg = {
        ...pgData,
        id: MOCK_PGS.length + 1,
        slug: pgData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        rating: 5.0,
        reviewsCount: 0,
        images: pgData.images || [
          { url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", isPrimary: true }
        ],
        amenities: pgData.amenities || [
          { name: "WiFi", icon: "Wifi" }
        ],
        nearbyPlaces: pgData.nearbyPlaces || [],
        owner: pgData.owner || { name: "Jane Proprietor", phone: "+1 987 654 325", email: "owner@example.com" }
      };
      MOCK_PGS.push(newPg);
      return newPg;
    }
  },

  update: async (id, pgData) => {
    try {
      const response = await api.put(`/pgs/${id}`, pgData);
      return response.data;
    } catch (error) {
      console.warn("Update PG API failed, using mock data:", error);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const index = MOCK_PGS.findIndex((p) => p.id === Number(id));
      if (index === -1) throw new Error("PG listing not found");
      const updatedPg = { ...MOCK_PGS[index], ...pgData };
      MOCK_PGS[index] = updatedPg;
      return updatedPg;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/pgs/${id}`);
      return response.data;
    } catch (error) {
      console.warn("Delete PG API failed, using mock data:", error);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const index = MOCK_PGS.findIndex((p) => p.id === Number(id));
      if (index === -1) throw new Error("PG listing not found");
      MOCK_PGS.splice(index, 1);
      return true;
    }
  },

  submitInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/inquiries', inquiryData);
      return response.data;
    } catch (error) {
      console.warn("Submit Inquiry API failed, using mock data:", error);
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        id: Math.floor(Math.random() * 10000),
        ...inquiryData,
        status: "PENDING",
        createdAt: new Date().toISOString()
      };
    }
  }
};

export default pgService;
