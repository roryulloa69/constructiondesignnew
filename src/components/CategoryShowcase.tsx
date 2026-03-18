import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import residentialImg from "@/assets/category-residential.webp";
import commercialImg from "@/assets/category-commercial.webp";
import hospitalityImg from "@/assets/category-hospitality.webp";
import designBuildImg from "@/assets/category-design-build.webp";
import pacificGroveImg from "@/assets/category-pacific-grove.webp";
const categories = [{
  id: "residential",
  title: "Residential Construction",
  description: "Luxury homes and sophisticated living spaces designed for modern lifestyles",
  image: residentialImg,
  color: "gold"
}, {
  id: "civil",
  title: "Civil",
  description: "Infrastructure and civil engineering projects that build communities",
  image: commercialImg,
  color: "steelBlue"
}, {
  id: "hospitality",
  title: "Hospitality",
  description: "Elegant dining and entertainment venues that create memorable experiences",
  image: hospitalityImg,
  color: "burgundy"
}, {
  id: "design-build",
  title: "Design Build",
  description: "Comprehensive design-build solutions combining creative vision with expert construction",
  image: designBuildImg,
  color: "gold"
}];
interface CategoryShowcaseProps {
  onViewProjects: (category: string) => void;
}
export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  onViewProjects
}) => {
  return <section className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="max-w-3xl mb-16 opacity-0 animate-fade-in">
          
          
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => <div key={category.id} className={`group relative overflow-hidden rounded-sm opacity-0 animate-fade-in-up`} style={{
          animationDelay: `${index * 200}ms`
        }}>
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={category.image} alt={`${category.title} category`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="font-playfair text-3xl font-semibold text-cream mb-3">
                    {category.title}
                  </h3>
                  <p className="font-inter text-cream/90 text-sm leading-relaxed mb-6">
                    {category.description}
                  </p>
                  <Button onClick={() => onViewProjects(category.title)} variant="outline" className="border-gold text-gold hover:bg-gold hover:text-charcoal transition-all duration-300">
                    View Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};