// Image utilities for the project
// Using Unsplash for beautiful placeholder architecture/construction images

// Categories of construction/architecture images
const ARCHITECTURE_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", // Modern house
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80", // Luxury interior
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80", // Modern home exterior
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80", // Estate home
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80", // Modern architecture
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80", // Contemporary house
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80", // Luxury home
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80", // Interior design
];

const INTERIOR_IMAGES = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80", // Living room
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80", // Modern kitchen
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80", // Interior
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80", // Elegant room
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80", // Living space
];

const LANDSCAPE_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80", // Pool
  "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=1200&q=80", // Outdoor space
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80", // Garden
];

const POOL_IMAGES = [
  "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1200&q=80", // Pool
  "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&q=80", // Pool area
  "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=1200&q=80", // Resort pool
];

const CONSTRUCTION_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80", // Architecture blueprint
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80", // Construction site
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80", // Building frame
];

// Get a consistent image based on seed (for repeatable placeholder selection)
export const getPlaceholderImage = (seed: string, category: 'architecture' | 'interior' | 'landscape' | 'pool' | 'construction' = 'architecture'): string => {
  const images = {
    architecture: ARCHITECTURE_IMAGES,
    interior: INTERIOR_IMAGES,
    landscape: LANDSCAPE_IMAGES,
    pool: POOL_IMAGES,
    construction: CONSTRUCTION_IMAGES,
  };
  
  const imageList = images[category];
  // Use simple hash to get consistent index
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % imageList.length;
  return imageList[index];
};

// Get multiple placeholder images for a gallery
export const getGalleryImages = (projectId: string, count: number, category: 'architecture' | 'interior' | 'landscape' | 'pool' | 'construction' = 'architecture'): string[] => {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push(getPlaceholderImage(`${projectId}-${i}`, category));
  }
  return images;
};

// Export all image arrays for direct use
export { ARCHITECTURE_IMAGES, INTERIOR_IMAGES, LANDSCAPE_IMAGES, POOL_IMAGES, CONSTRUCTION_IMAGES };
