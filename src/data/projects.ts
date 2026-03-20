// Project data with URL-based images
import { getPlaceholderImage, getGalleryImages } from "@/lib/images";

export interface ProjectImage {
  url: string;
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  year: string;
  category: string;
  coverImage: string;
  images: ProjectImage[];
  featured?: boolean;
}

// Generate projects with placeholder images
export const projects: Project[] = [
  {
    id: "syracuse-residence",
    title: "Syracuse Residence",
    description: "Luxury custom home featuring Mediterranean-inspired architecture with modern amenities. This estate showcases meticulous craftsmanship with imported materials and custom millwork throughout.",
    location: "Syracuse, NY",
    year: "2023",
    category: "Custom Homes",
    coverImage: getPlaceholderImage("syracuse-cover", "architecture"),
    images: getGalleryImages("syracuse", 10, "architecture").map((url, i) => ({
      url,
      alt: `Syracuse Residence interior ${i + 1}`
    })),
    featured: true,
  },
  {
    id: "carmel-valley",
    title: "Carmel Valley Estate",
    description: "Contemporary estate nestled in the scenic Carmel Valley. Features open floor plans, floor-to-ceiling windows, and seamless indoor-outdoor living spaces.",
    location: "Carmel Valley, CA",
    year: "2022",
    category: "Custom Homes",
    coverImage: getPlaceholderImage("carmel-valley-cover", "architecture"),
    images: getGalleryImages("carmel-valley", 8, "architecture").map((url, i) => ({
      url,
      alt: `Carmel Valley Estate view ${i + 1}`
    })),
    featured: true,
  },
  {
    id: "big-sur-remodel",
    title: "Big Sur Mountain Retreat",
    description: "Complete renovation of a mountainside retreat with panoramic ocean views. The project preserved original character while adding modern luxuries and sustainable features.",
    location: "Big Sur, CA",
    year: "2022",
    category: "Renovations",
    coverImage: getPlaceholderImage("bigsur-cover", "architecture"),
    images: getGalleryImages("bigsur", 15, "architecture").map((url, i) => ({
      url,
      alt: `Big Sur Retreat ${i + 1}`
    })),
    featured: true,
  },
  {
    id: "carmel-knolls",
    title: "Carmel Knolls Residence",
    description: "A stunning hillside home with breathtaking views of the Pacific. Features include custom cabinetry, imported stone, and a state-of-the-art smart home system.",
    location: "Carmel, CA",
    year: "2021",
    category: "Custom Homes",
    coverImage: getPlaceholderImage("carmel-knolls-cover", "architecture"),
    images: getGalleryImages("carmel-knolls", 25, "interior").map((url, i) => ({
      url,
      alt: `Carmel Knolls interior ${i + 1}`
    })),
    featured: true,
  },
  {
    id: "south-coast-estate",
    title: "South Coast Estate",
    description: "Expansive coastal estate featuring Mediterranean architecture, infinity pool, and extensive landscaping. A masterpiece of luxury coastal living.",
    location: "South Coast, CA",
    year: "2021",
    category: "Custom Homes",
    coverImage: getPlaceholderImage("southcoast-cover", "architecture"),
    images: getGalleryImages("southcoast", 20, "architecture").map((url, i) => ({
      url,
      alt: `South Coast Estate ${i + 1}`
    })),
  },
  {
    id: "laguna-grande",
    title: "Laguna Grande Villa",
    description: "Mediterranean-style villa with oceanfront views. Features hand-painted tiles, custom ironwork, and a magnificent courtyard with fountain.",
    location: "Laguna Beach, CA",
    year: "2020",
    category: "Custom Homes",
    coverImage: getPlaceholderImage("laguna-cover", "architecture"),
    images: getGalleryImages("laguna", 6, "architecture").map((url, i) => ({
      url,
      alt: `Laguna Grande Villa ${i + 1}`
    })),
  },
  {
    id: "pacific-grove",
    title: "Pacific Grove Design/Build",
    description: "Complete design-build project featuring coastal contemporary architecture. Sustainable materials and energy-efficient systems throughout.",
    location: "Pacific Grove, CA",
    year: "2020",
    category: "Design/Build",
    coverImage: getPlaceholderImage("pg-cover", "architecture"),
    images: getGalleryImages("pg", 10, "architecture").map((url, i) => ({
      url,
      alt: `Pacific Grove project ${i + 1}`
    })),
  },
  {
    id: "north-florida-renovation",
    title: "North Florida Renovation",
    description: "Major renovation and addition to an existing estate. The project doubled the living space while maintaining the home's original character.",
    location: "Jacksonville, FL",
    year: "2019",
    category: "Renovations",
    coverImage: getPlaceholderImage("north-florida-cover", "architecture"),
    images: getGalleryImages("north-florida", 14, "interior").map((url, i) => ({
      url,
      alt: `North Florida Renovation ${i + 1}`
    })),
  },
  {
    id: "hospitality-pool",
    title: "Hospitality Pool Design",
    description: "Resort-style pool complex featuring infinity edge, spa, cabanas, and outdoor kitchen. A perfect blend of luxury and functionality.",
    location: "Monterey, CA",
    year: "2021",
    category: "Pools & Outdoor",
    coverImage: getPlaceholderImage("pool-cover", "pool"),
    images: getGalleryImages("pool", 17, "pool").map((url, i) => ({
      url,
      alt: `Pool design ${i + 1}`
    })),
  },
  {
    id: "alpine-ranch",
    title: "High Alpine Mountain Ranch",
    description: "Rustic mountain retreat with modern amenities. Features reclaimed timber, stone fireplaces, and stunning mountain views from every room.",
    location: "Montana",
    year: "2020",
    category: "Custom Homes",
    coverImage: getPlaceholderImage("alpine-cover", "architecture"),
    images: getGalleryImages("alpine", 12, "architecture").map((url, i) => ({
      url,
      alt: `Alpine Ranch ${i + 1}`
    })),
    featured: true,
  },
  {
    id: "coastal-restoration",
    title: "Coastal Hillside Restoration",
    description: "Environmental restoration and custom home construction on a sensitive coastal hillside. Features native landscaping and sustainable building practices.",
    location: "Big Sur, CA",
    year: "2019",
    category: "Renovations",
    coverImage: getPlaceholderImage("coastal-restoration-cover", "landscape"),
    images: getGalleryImages("coastal-restoration", 15, "landscape").map((url, i) => ({
      url,
      alt: `Coastal Restoration ${i + 1}`
    })),
  },
  {
    id: "links-estate",
    title: "Links Estate Development",
    description: "Master-planned residential development featuring custom lots, infrastructure, and community amenities. A vision of luxury living.",
    location: "Pebble Beach, CA",
    year: "2018",
    category: "Development",
    coverImage: getPlaceholderImage("links-cover", "construction"),
    images: getGalleryImages("links", 12, "construction").map((url, i) => ({
      url,
      alt: `Links Estate ${i + 1}`
    })),
  },
  {
    id: "abaco-boathouse",
    title: "Abaco Luxe Boat House",
    description: "Waterfront boat house and living quarters in the Bahamas. Features marine-grade materials and tropical design elements.",
    location: "Abaco, Bahamas",
    year: "2019",
    category: "International",
    coverImage: getPlaceholderImage("abaco-cover", "architecture"),
    images: getGalleryImages("abaco", 8, "architecture").map((url, i) => ({
      url,
      alt: `Abaco Boat House ${i + 1}`
    })),
  },
  {
    id: "development-civil",
    title: "Civil Development Project",
    description: "Major civil infrastructure project including roads, utilities, and site preparation for a luxury residential community.",
    location: "California",
    year: "2018",
    category: "Development",
    coverImage: getPlaceholderImage("development-cover", "construction"),
    images: getGalleryImages("development", 14, "construction").map((url, i) => ({
      url,
      alt: `Development project ${i + 1}`
    })),
  },
];

// Helper to get featured projects
export const getFeaturedProjects = () => projects.filter(p => p.featured);

// Helper to get projects by category
export const getProjectsByCategory = (category: string) => {
  if (category === "All" || !category) return projects;
  return projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

// Helper to get a project by ID
export const getProjectById = (id: string) => 
  projects.find(p => p.id === id);

// Categories for filtering
export const categories = [
  "All",
  "Custom Homes",
  "Renovations",
  "Design/Build",
  "Pools & Outdoor",
  "Development",
  "International",
] as const;

export type ProjectCategory = typeof categories[number];

// Export placeholder image for the pool testimonial
export const poolTestimonialImage = getPlaceholderImage("pool-testimonial", "pool");

// Export placeholder for vero beach cover
export const veroBeachCover = getPlaceholderImage("vero-beach", "architecture");
