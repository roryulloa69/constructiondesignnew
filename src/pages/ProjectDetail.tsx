import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Square, Bed, Droplets, Check, CalendarDays, Award, Wallet } from "lucide-react";
import { getProjectById } from "@/data/projects";
import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ImageWithWatermark } from "@/components/ImageWithWatermark";
interface ProjectVideo {
  id: string;
  video_url: string;
  title: string | null;
  description: string | null;
  display_order: number;
}
interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  display_order: number;
  is_before: boolean;
  is_after: boolean;
}
interface ProjectDocument {
  id: string;
  document_url: string;
  file_name: string;
  title: string | null;
}
const ProjectDetail = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const project = id ? getProjectById(id) : undefined;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [dbImages, setDbImages] = useState<ProjectImage[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Fetch videos, images, and documents for this project
  useEffect(() => {
    if (!id) return;
    const fetchVideos = async () => {
      const {
        data,
        error
      } = await supabase.from('project_videos').select('*').eq('project_id', id).order('display_order', {
        ascending: true
      });
      if (!error && data) {
        setVideos(data);
      }
    };
    const fetchImages = async () => {
      const {
        data,
        error
      } = await supabase.from('project_images').select('*').eq('project_id', id).order('display_order', {
        ascending: true
      });
      if (!error && data) {
        setDbImages(data);
      }
    };
    const fetchDocuments = async () => {
      const {
        data,
        error
      } = await supabase.from('project_documents').select('id, document_url, file_name, title').eq('project_id', id).order('display_order', {
        ascending: true
      });
      if (!error && data) {
        setDocuments(data);
      }
    };
    fetchVideos();
    fetchImages();
    fetchDocuments();
  }, [id]);
  const hasStaticImages = project?.images && Array.isArray(project.images) && project.images.length > 0;
  const allImages = useMemo(() => {
    if (hasStaticImages && project?.images) {
      return project.images.filter(img => img != null);
    }
    const validDbImages = dbImages.filter(img => img.image_url && (img.image_url.startsWith('http') || img.image_url.startsWith('https://')));
    if (validDbImages.length > 0) {
      return validDbImages.map(img => img.image_url);
    }
    return [];
  }, [hasStaticImages, project?.images, dbImages]);
  const validDbImages = dbImages.filter(img => img.image_url && (img.image_url.startsWith('http') || img.image_url.startsWith('https://')));
  const getImageLabel = (imageUrl: string, index: number): string | null => {
    const dbImage = validDbImages.find(img => img.image_url === imageUrl);
    if (dbImage?.is_before) return "Before";
    if (dbImage?.is_after) return "After";
    const fileName = imageUrl.toLowerCase();
    if (fileName.includes("before")) return "Before";
    if (fileName.includes("after")) return "After";
    return null;
  };

  // Keyboard navigation
  useEffect(() => {
    if (selectedImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : (prev ?? 0) - 1);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : (prev ?? 0) + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, allImages.length]);
  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>;
  }
  const heroImage = allImages.length > 0 ? allImages[0] : project.image;
  const hasStats = project.sqft || project.bedrooms || project.baths || project.duration || project.budget;
  const hasFeatures = project.features && project.features.length > 0;
  const hasRole = project.roles && project.roles.trim().length > 0;
  return <>
      <div className="min-h-screen bg-background">
        {/* Hero Image with Parallax */}
        <div ref={heroRef} className="relative h-[50vh] sm:h-[60vh] w-full overflow-hidden">
          <img src={heroImage} alt={project.title} className="w-full h-full object-cover hero-image scale-110" style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: 'transform 0.1s ease-out'
        }} />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Back button overlay */}
          <div className="absolute top-4 left-4 z-10">
            <Button variant="outline" onClick={() => navigate("/", {
            state: {
              openPortfolio: true
            }
          })} className="bg-white/90 backdrop-blur-sm border-charcoal/20 text-charcoal hover:bg-white shadow-md" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Project Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10">
            <div className="max-w-5xl mx-auto">
              <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-2 animate-fade-in">
                {project.title}
              </h1>
              <p className="text-white/80 text-sm sm:text-base uppercase tracking-[0.2em] animate-fade-in delay-100">
                {project.location}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          {/* Project Details Section */}
          <div className="mb-16">
            {/* Section Header with Decorative Number */}
            <div className="mb-8">
              <span className="font-playfair text-7xl lg:text-8xl text-accent/10 font-light leading-none block -mb-4 lg:-mb-6">01</span>
              <p className="font-inter text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Project Details</p>
              <h2 className="font-playfair text-2xl lg:text-3xl text-foreground">Overview</h2>
            </div>

            <div className="w-12 h-[1px] bg-accent mb-8" />

            {/* Category & Design Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div className="border-l-2 border-accent/30 pl-6">
                <p className="font-inter text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">Category</p>
                <p className="font-playfair text-lg text-foreground">{project.category}</p>
              </div>
              {project.subtitle && <div className="border-l-2 border-accent/30 pl-6">
                  <p className="font-inter text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">Design Style</p>
                  <p className="font-playfair text-lg text-foreground">{project.subtitle}</p>
                </div>}
            </div>

            {/* Stats Row */}
            {hasStats && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 py-6 border-y border-border/30">
                {project.duration && <div className="text-center">
                    <CalendarDays className="h-5 w-5 text-accent mx-auto mb-2" />
                    <p className="font-playfair text-lg text-foreground">{project.duration}</p>
                    <p className="font-inter text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
                  </div>}
                {project.sqft && <div className="text-center">
                    <Square className="h-5 w-5 text-accent mx-auto mb-2" />
                    <p className="font-playfair text-lg text-foreground">{project.sqft.toLocaleString()}</p>
                    <p className="font-inter text-xs text-muted-foreground uppercase tracking-wider">Sq Ft</p>
                  </div>}
                {project.bedrooms && <div className="text-center">
                    <Bed className="h-5 w-5 text-accent mx-auto mb-2" />
                    <p className="font-playfair text-lg text-foreground">{project.bedrooms}</p>
                    <p className="font-inter text-xs text-muted-foreground uppercase tracking-wider">Bedrooms</p>
                  </div>}
                {project.baths && <div className="text-center">
                    <Droplets className="h-5 w-5 text-accent mx-auto mb-2" />
                    <p className="font-playfair text-lg text-foreground">{project.baths}</p>
                    <p className="font-inter text-xs text-muted-foreground uppercase tracking-wider">Baths</p>
                  </div>}
                {project.budget && <div className="text-center">
                    <Wallet className="h-5 w-5 text-accent mx-auto mb-2" />
                    <p className="font-playfair text-lg text-foreground">{project.budget}</p>
                    <p className="font-inter text-xs text-muted-foreground uppercase tracking-wider">Budget</p>
                  </div>}
              </div>}

            {/* My Role Section */}
            {hasRole && <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-4 w-4 text-accent" />
                  <p className="font-inter text-xs tracking-[0.2em] text-muted-foreground uppercase">My Role</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.roles!.split(',').map((role, index) => <span key={index} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-inter bg-accent/5 text-foreground border border-accent/20">
                      {role.trim()}
                    </span>)}
                </div>
              </div>}

            {/* Feature Highlights */}
            {hasFeatures && <div className="pt-6 border-t border-border/30">
                <p className="font-inter text-xs tracking-[0.2em] text-muted-foreground uppercase mb-4">Feature Highlights</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
                  {project.features!.map((feature, index) => <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="font-inter text-sm text-muted-foreground">{feature}</span>
                    </div>)}
                </div>
              </div>}
          </div>

          {/* Project Description */}
          {project.description && <div className="mb-16">
              <p className="font-inter text-muted-foreground leading-relaxed max-w-3xl text-left">
                {project.description}
              </p>
            </div>}

          {/* Videos Section */}
          {videos.length > 0 && <div className="mb-16">
              <div className="mb-8">
                <span className="font-playfair text-7xl lg:text-8xl text-accent/10 font-light leading-none block -mb-4 lg:-mb-6">02</span>
                <p className="font-inter text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Media</p>
                <h3 className="font-playfair text-2xl lg:text-3xl text-foreground">Project Videos</h3>
              </div>
              <div className="w-12 h-[1px] bg-accent mb-8" />
              <div className="grid md:grid-cols-2 gap-6">
                {videos.map(video => <div key={video.id} className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
                    <VideoPlayer url={video.video_url} />
                    {(video.title || video.description) && <div className="p-4">
                        {video.title && <h4 className="font-playfair font-semibold text-foreground mb-1">{video.title}</h4>}
                        {video.description && <p className="font-inter text-sm text-muted-foreground">{video.description}</p>}
                      </div>}
                  </div>)}
              </div>
            </div>}

          {/* Gallery Grid */}
          {allImages.length > 0 && <div className="mb-16">
              <div className="mb-8">
                <span className="font-playfair text-7xl lg:text-8xl text-accent/10 font-light leading-none block -mb-4 lg:-mb-6">{videos.length > 0 ? '03' : '02'}</span>
                <p className="font-inter text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Photography</p>
                <h3 className="font-playfair text-2xl lg:text-3xl text-foreground">Gallery</h3>
              </div>
              <div className="w-12 h-[1px] bg-accent mb-8" />
              
              {/* Cover Photo - First Image */}
              {allImages.length > 0 && <ImageWithWatermark key={`${allImages[0]}-cover`}>
                  <button 
                    onClick={() => setSelectedImageIndex(0)} 
                    className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-card border border-border group cursor-pointer transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50 mb-6"
                  >
                    <img 
                      src={allImages[0]} 
                      alt={`${project.title} - Cover`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 gallery-image" 
                    />
                  </button>
                </ImageWithWatermark>}

              {/* Remaining Gallery Images */}
              {allImages.length > 1 && <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {allImages.slice(1).map((image, index) => {
              const actualIndex = index + 1;
              const label = getImageLabel(image, actualIndex);
              return <ImageWithWatermark key={`${image}-${actualIndex}`}>
                        <button onClick={() => setSelectedImageIndex(actualIndex)} className="relative aspect-square overflow-hidden rounded-lg bg-card border border-border group cursor-pointer transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50 w-full">
                          <img src={image} alt={`${project.title} - Image ${actualIndex + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 gallery-image" />
                          {label && <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded ${label === "Before" ? "bg-amber-500/90" : "bg-emerald-500/90"}`}>
                              {label}
                            </span>}
                        </button>
                      </ImageWithWatermark>;
            })}
                </div>}
            </div>}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setSelectedImageIndex(null)}>
          {/* Close button */}
          <button onClick={() => setSelectedImageIndex(null)} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30" aria-label="Close">
            <X className="h-6 w-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-light">
            {selectedImageIndex + 1} / {allImages.length}
          </div>

          {/* Previous button */}
          <button onClick={e => {
        e.stopPropagation();
        setSelectedImageIndex(selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1);
      }} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30" aria-label="Previous image">
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Next button */}
          <button onClick={e => {
        e.stopPropagation();
        setSelectedImageIndex(selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1);
      }} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30" aria-label="Next image">
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Image */}
          <div className="flex items-center justify-center h-full p-8 sm:p-16" onClick={e => e.stopPropagation()}>
            <ImageWithWatermark>
              <div className="relative">
                <img src={allImages[selectedImageIndex]} alt={`${project.title} - Image ${selectedImageIndex + 1}`} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-scale-in gallery-image" />
                {getImageLabel(allImages[selectedImageIndex], selectedImageIndex) && <span className={`absolute top-4 right-4 px-3 py-2 text-sm font-semibold text-white rounded-lg ${getImageLabel(allImages[selectedImageIndex], selectedImageIndex) === "Before" ? "bg-amber-500/90" : "bg-emerald-500/90"}`}>
                    {getImageLabel(allImages[selectedImageIndex], selectedImageIndex)}
                  </span>}
              </div>
            </ImageWithWatermark>
          </div>
        </div>}
    </>;
};
export default ProjectDetail;