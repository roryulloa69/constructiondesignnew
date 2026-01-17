import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight, MapPin, Download } from "lucide-react";
import { getProjectById, projects } from "@/data/projects";
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
  const { id } = useParams();
  const navigate = useNavigate();
  const project = id ? getProjectById(id) : undefined;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [dbImages, setDbImages] = useState<ProjectImage[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Get next project for navigation
  const currentIndex = projects.findIndex((p) => p.id === id);
  const nextProject = currentIndex >= 0 && currentIndex < projects.length - 1 
    ? projects[currentIndex + 1] 
    : projects[0];

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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch videos, images, and documents for this project
  useEffect(() => {
    if (!id) return;
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('project_videos')
        .select('*')
        .eq('project_id', id)
        .order('display_order', { ascending: true });
      if (!error && data) {
        setVideos(data);
      }
    };
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', id)
        .order('display_order', { ascending: true });
      if (!error && data) {
        setDbImages(data);
      }
    };
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from('project_documents')
        .select('id, document_url, file_name, title')
        .eq('project_id', id)
        .order('display_order', { ascending: true });
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4 text-foreground">Project Not Found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const heroImage = allImages.length > 0 ? allImages[0] : project.image;

  // Build services list from project data
  const services: string[] = [];
  if (project.category) services.push(project.category);
  if (project.subtitle) services.push(project.subtitle);
  if (project.roles) {
    project.roles.split(',').forEach(role => services.push(role.trim()));
  }

  return (
    <>
      <div className="min-h-screen bg-background dark:bg-[hsl(var(--charcoal))]">
        {/* Full-bleed Hero Image */}
        <div ref={heroRef} className="relative h-[70vh] lg:h-[80vh] w-full overflow-hidden">
          <img
            src={heroImage}
            alt={project.title}
            className="w-full h-full object-cover hero-image"
            style={{
              transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))] via-black/30 to-transparent" />
          
          {/* Back button overlay */}
          <div className="absolute top-6 left-6 z-10">
            <Button
              variant="ghost"
              onClick={() => navigate("/", { state: { openPortfolio: true } })}
              className="bg-[hsl(var(--charcoal))]/80 backdrop-blur-sm text-white hover:bg-[hsl(var(--charcoal))] border border-[hsl(var(--border))]/30"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-8 left-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--charcoal))]/90 backdrop-blur-sm rounded-sm">
              <MapPin className="h-3 w-3 text-accent" />
              <span className="text-xs font-inter uppercase tracking-widest text-white">
                {project.location}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left Column - Title & Description */}
            <div className="lg:col-span-2">
              <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-8 animate-fade-in">
                {project.title}
              </h1>

              {/* Description paragraphs */}
              {project.description && (
                <div className="space-y-6 text-[hsl(var(--muted-foreground))] font-inter leading-relaxed text-base lg:text-lg">
                  {project.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Quote/Testimonial */}
              {project.testimonial && (
                <blockquote className="mt-12 pl-6 border-l-2 border-accent/50">
                  <p className="font-playfair text-lg lg:text-xl text-white/90 italic leading-relaxed">
                    "{project.testimonial}"
                  </p>
                </blockquote>
              )}
            </div>

            {/* Right Column - Project Data Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[hsl(var(--card))]/5 border border-[hsl(var(--border))]/20 rounded-sm p-6 lg:p-8 sticky top-24">
                <h2 className="font-playfair text-xl text-white mb-6">Project Data</h2>
                
                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <p className="font-inter text-xs uppercase tracking-widest text-accent mb-1">Location</p>
                    <p className="font-inter text-white">{project.location}</p>
                  </div>

                  {/* Year/Duration */}
                  {project.duration && (
                    <div>
                      <p className="font-inter text-xs uppercase tracking-widest text-accent mb-1">Duration</p>
                      <p className="font-inter text-white">{project.duration}</p>
                    </div>
                  )}

                  {/* Area/Gallons */}
                  {project.sqft && (
                    <div>
                      <p className="font-inter text-xs uppercase tracking-widest text-accent mb-1">
                        {project.category === "Hospitality" ? "Gallons" : "Area"}
                      </p>
                      <p className="font-inter text-white">
                        {project.sqft.toLocaleString()}{project.category !== "Hospitality" && " ft²"}
                      </p>
                    </div>
                  )}

                  {/* Budget */}
                  {project.budget && (
                    <div>
                      <p className="font-inter text-xs uppercase tracking-widest text-accent mb-1">Budget</p>
                      <p className="font-inter text-white">{project.budget}</p>
                    </div>
                  )}

                  {/* Bedrooms/Baths */}
                  {(project.bedrooms || project.baths) && (
                    <div>
                      <p className="font-inter text-xs uppercase tracking-widest text-accent mb-1">Details</p>
                      <p className="font-inter text-white">
                        {project.bedrooms && `${project.bedrooms} Bedrooms`}
                        {project.bedrooms && project.baths && " · "}
                        {project.baths && `${project.baths} Baths`}
                      </p>
                    </div>
                  )}

                  {/* Services */}
                  {services.length > 0 && (
                    <div>
                      <p className="font-inter text-xs uppercase tracking-widest text-accent mb-2">Services</p>
                      <ul className="space-y-1">
                        {services.slice(0, 4).map((service, idx) => (
                          <li key={idx} className="font-inter text-white text-sm">{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Features */}
                  {project.features && project.features.length > 0 && (
                    <div>
                      <p className="font-inter text-xs uppercase tracking-widest text-accent mb-2">Features</p>
                      <ul className="space-y-1">
                        {project.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="font-inter text-white/80 text-sm">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Documents Download */}
                  {documents.length > 0 && (
                    <div className="pt-4 border-t border-[hsl(var(--border))]/20">
                      {documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-inter text-sm"
                        >
                          <Download className="h-4 w-4" />
                          {doc.title || doc.file_name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        {videos.length > 0 && (
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-16">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-accent" />
                <h2 className="font-playfair text-2xl lg:text-3xl text-white">Project Videos</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-[hsl(var(--card))]/10 rounded-sm overflow-hidden border border-[hsl(var(--border))]/20">
                  <VideoPlayer url={video.video_url} />
                  {(video.title || video.description) && (
                    <div className="p-4">
                      {video.title && <h4 className="font-playfair font-semibold text-white mb-1">{video.title}</h4>}
                      {video.description && <p className="font-inter text-sm text-[hsl(var(--muted-foreground))]">{video.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Narrative Gallery Section */}
        {allImages.length > 1 && (
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-accent" />
                <h2 className="font-playfair text-2xl lg:text-3xl text-white">Visual Narrative</h2>
              </div>
            </div>

            {/* Asymmetric Gallery Grid - matching reference design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First row - two tall images */}
              {allImages.slice(1, 3).map((image, index) => {
                const actualIndex = index + 1;
                const label = getImageLabel(image, actualIndex);
                return (
                  <ImageWithWatermark key={`${image}-${actualIndex}`}>
                    <button
                      onClick={() => setSelectedImageIndex(actualIndex)}
                      className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-[hsl(var(--card))]/10 group cursor-pointer transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      <img
                        src={image}
                        alt={`${project.title} - Image ${actualIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 gallery-image"
                      />
                      {label && (
                        <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white rounded-sm ${label === "Before" ? "bg-amber-500/90" : "bg-emerald-500/90"}`}>
                          {label}
                        </span>
                      )}
                    </button>
                  </ImageWithWatermark>
                );
              })}
            </div>

            {/* Second row - three smaller images */}
            {allImages.length > 3 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {allImages.slice(3, 6).map((image, index) => {
                  const actualIndex = index + 3;
                  const label = getImageLabel(image, actualIndex);
                  return (
                    <ImageWithWatermark key={`${image}-${actualIndex}`}>
                      <button
                        onClick={() => setSelectedImageIndex(actualIndex)}
                        className="relative w-full aspect-square overflow-hidden rounded-sm bg-[hsl(var(--card))]/10 group cursor-pointer transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                      >
                        <img
                          src={image}
                          alt={`${project.title} - Image ${actualIndex + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 gallery-image"
                        />
                        {label && (
                          <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white rounded-sm ${label === "Before" ? "bg-amber-500/90" : "bg-emerald-500/90"}`}>
                            {label}
                          </span>
                        )}
                      </button>
                    </ImageWithWatermark>
                  );
                })}
              </div>
            )}

            {/* Remaining images in standard grid */}
            {allImages.length > 6 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {allImages.slice(6).map((image, index) => {
                  const actualIndex = index + 6;
                  const label = getImageLabel(image, actualIndex);
                  return (
                    <ImageWithWatermark key={`${image}-${actualIndex}`}>
                      <button
                        onClick={() => setSelectedImageIndex(actualIndex)}
                        className="relative w-full aspect-square overflow-hidden rounded-sm bg-[hsl(var(--card))]/10 group cursor-pointer transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                      >
                        <img
                          src={image}
                          alt={`${project.title} - Image ${actualIndex + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 gallery-image"
                        />
                        {label && (
                          <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white rounded-sm ${label === "Before" ? "bg-amber-500/90" : "bg-emerald-500/90"}`}>
                            {label}
                          </span>
                        )}
                      </button>
                    </ImageWithWatermark>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Next Project Navigation */}
        {nextProject && (
          <div className="border-t border-[hsl(var(--border))]/20">
            <Link
              to={`/projects/${nextProject.id}`}
              className="group block max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-16 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-inter text-xs uppercase tracking-widest text-accent mb-2">Next Project</p>
                  <h3 className="font-playfair text-2xl lg:text-4xl text-white group-hover:text-accent transition-colors">
                    {nextProject.title}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full border border-[hsl(var(--border))]/30 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all">
                  <ArrowRight className="h-5 w-5 text-white group-hover:text-white" />
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-light">
            {selectedImageIndex + 1} / {allImages.length}
          </div>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Main image */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 lg:p-16">
            <img
              src={allImages[selectedImageIndex]}
              alt={`${project.title} - Image ${selectedImageIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl gallery-image"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;
