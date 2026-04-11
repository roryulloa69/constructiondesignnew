// Placeholder image helper - returns unsplash placeholder based on category
export function getPlaceholderImage(name: string, category: string = "architecture"): string {
  const categoryMap: Record<string, string> = {
    architecture: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    construction: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
    landscape: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    interior: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
  };
  return categoryMap[category] || categoryMap.architecture;
}
