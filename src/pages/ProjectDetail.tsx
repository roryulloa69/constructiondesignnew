import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Square, Bed, Droplets, Check, CalendarDays, Award, Wallet, Download, Maximize2, Filter, FileText } from "lucide-react";
import { getProjectById } from "@/data/projects";
import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ImageWithWatermark } from "@/components/ImageWithWatermark";
import { useAuth } from "@/contexts/AuthContext";
import { ReorderableGallery } from "@/components/admin/ReorderableGallery";
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
  const { isAdmin } = useAuth();
  const project = id ? getProjectById(id) : undefined;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [dbImages, setDbImages] = useState<ProjectImage[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'before-after'>('all');
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (heroImgRef.current) {
      heroImgRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroImgRef.current.style.transition = 'transform 0.1s ease-out';
    }
  }, [scrollY]);

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

  // Filter gallery images based on selected filter
  const filteredImages = useMemo(() => {
    if (galleryFilter === 'all') return allImages;
    return allImages.filter((img, idx) => getImageLabel(img, idx) !== null);
  }, [allImages, galleryFilter]);

  // Download image helper
  const downloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Timeline visualization helper
  const getTimelineSteps = (duration: string | undefined) => {
    if (!duration) return [];
    const months = parseInt(duration);
    if (isNaN(months)) return [];
    
    const steps = [];
    if (months <= 6) {
      steps.push({ label: 'START', month: 0 });
      steps.push({ label: 'COMPLETION', month: months });
    } else if (months <= 12) {
      steps.push({ label: 'START', month: 0 });
      steps.push({ label: 'MID-POINT', month: Math.floor(months / 2) });
      steps.push({ label: 'COMPLETION', month: months });
    } else {
      steps.push({ label: 'START', month: 0 });
      steps.push({ label: 'Q2', month: Math.floor(months / 3) });
      steps.push({ label: 'Q3', month: Math.floor(months * 2 / 3) });
      steps.push({ label: 'COMPLETION', month: months });
    }
    return steps;
  };

  const timelineSteps = project?.duration ? getTimelineSteps(project.duration) : [];

  // Enhanced keyboard navigation with section jump shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Lightbox navigation
      if (selectedImageIndex !== null) {
        if (e.key === "Escape") {
          setSelectedImageIndex(null);
        } else if (e.key === "ArrowLeft") {
          setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : (prev ?? 0) - 1);
        } else if (e.key === "ArrowRight") {
          setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : (prev ?? 0) + 1);
        } else if (e.key === "f" || e.key === "F") {
          // F for fullscreen
          document.documentElement.requestFullscreen?.();
        }
        return;
      }
      
      // Section navigation shortcuts (when not in lightbox)
      if (e.key === "1") {
        document.getElementById("overview")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (e.key === "2") {
        document.getElementById("videos")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (e.key === "3") {
        document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, allImages.length]);

  // Touch gesture support for lightbox
  useEffect(() => {
    if (selectedImageIndex === null) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientX);
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStart === null) return;
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart - touchEnd;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          // Swipe left - next image
          setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : (prev ?? 0) + 1);
        } else {
          // Swipe right - previous image
          setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : (prev ?? 0) - 1);
        }
      }
      setTouchStart(null);
    };
    
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [selectedImageIndex, allImages.length, touchStart]);
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
      <div ref={heroRef} className="relative h-[50vh] sm:h-[60vh] w-full overflow-hidden bg-black">
        <img ref={heroImgRef} src={heroImage} alt={project.title} className="w-full h-full object-contain hero-image scale-110" />
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">

        {/* Project Details Section */}
        <div id="overview" className="mb-24 scroll-mt-20">
          {/* Section Header with Decorative Number */}
          <div className="mb-8">
            <button 
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="font-playfair text-7xl lg:text-8xl text-accent/10 hover:text-accent/20 font-light leading-none block -mb-4 lg:-mb-6 transition-colors cursor-pointer focus:outline-none focus:text-accent/30"
              aria-label="Jump to overview section"
              title="Press 1 to jump here"
            >
              01
            </button>
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

          {/* Stats Row with Timeline */}
          {hasStats && <div className="mb-8">
            {/* Timeline Visualization */}
            {project.duration && timelineSteps.length > 0 && (
              <div className="mb-8 pb-8 border-b border-border/30">
                <p className="font-inter text-xs tracking-[0.2em] text-muted-foreground uppercase mb-4">Project Timeline</p>
                <div className="relative">
                  {/* Timeline bar */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent/20 -translate-y-1/2" />
                  <div className="relative flex justify-between">
                    {timelineSteps.map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-accent mb-2 relative z-10 ring-4 ring-background" />
                        <span className="font-inter text-xs text-accent font-medium">{step.label}</span>
                        <span className="font-inter text-xs text-muted-foreground mt-1">{step.month}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 py-6">
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
            </div>
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
        {project.description && <div className="mb-24">
          <p className="font-inter text-muted-foreground leading-relaxed max-w-3xl text-left">
            {project.description}
          </p>
        </div>}

        {/* Videos Section */}
        {videos.length > 0 && <div id="videos" className="mb-24 scroll-mt-20">
          <div className="mb-8">
            <button 
              onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="font-playfair text-7xl lg:text-8xl text-accent/10 hover:text-accent/20 font-light leading-none block -mb-4 lg:-mb-6 transition-colors cursor-pointer focus:outline-none focus:text-accent/30"
              aria-label="Jump to videos section"
              title="Press 2 to jump here"
            >
              02
            </button>
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
        {allImages.length > 0 && <div id="gallery" className="mb-24 scroll-mt-20">
          <div className="mb-8">
            <button 
              onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="font-playfair text-7xl lg:text-8xl text-accent/10 hover:text-accent/20 font-light leading-none block -mb-4 lg:-mb-6 transition-colors cursor-pointer focus:outline-none focus:text-accent/30"
              aria-label="Jump to gallery section"
              title="Press 3 to jump here"
            >
              {videos.length > 0 ? '03' : '02'}
            </button>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-inter text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Photography</p>
                <h3 className="font-playfair text-2xl lg:text-3xl text-foreground">Gallery</h3>
                <p className="font-inter text-sm text-muted-foreground mt-1">
                  {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
                </p>
              </div>
              
              {/* Gallery Filter Buttons */}
              {allImages.some((img, idx) => getImageLabel(img, idx) !== null) && (
                <div className="flex gap-2">
                  <Button
                    variant={galleryFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGalleryFilter('all')}
                    className="text-xs"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    All
                  </Button>
                  <Button
                    variant={galleryFilter === 'before-after' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGalleryFilter('before-after')}
                    className="text-xs"
                  >
                    Before & After
                  </Button>
                </div>
              )}
            </div>
            {isAdmin && <p className="font-inter text-xs text-accent mt-2">Admin: drag images to reorder</p>}
          </div>
          <div className="w-12 h-[1px] bg-accent mb-8" />

          {/* Admin reorderable gallery */}
          {isAdmin && validDbImages.length > 0 ? (
            <ReorderableGallery
              dbImages={validDbImages.map(img => ({ id: img.id, image_url: img.image_url, display_order: img.display_order }))}
              projectTitle={project.title}
              onImageClick={(index) => setSelectedImageIndex(index)}
              onReorder={(newImages) => {
                setDbImages(prev => {
                  const updated = [...prev];
                  newImages.forEach((ni, i) => {
                    const idx = updated.findIndex(img => img.id === ni.id);
                    if (idx !== -1) updated[idx] = { ...updated[idx], display_order: i };
                  });
                  return updated.sort((a, b) => a.display_order - b.display_order);
                });
              }}
            />
          ) : (
            <>
              {/* Cover Photo - First Image */}
              {filteredImages.length > 0 && <ImageWithWatermark key={`${filteredImages[0]}-cover`}>
                <button
                  onClick={() => setSelectedImageIndex(allImages.indexOf(filteredImages[0]))}
                  className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-card border border-border group cursor-pointer transition-all hover:shadow-xl hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent/50 mb-8"
                >
                  {/* Blurred background frame */}
                  <img
                    src={filteredImages[0]}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
                    aria-hidden="true"
                  />
                  <img
                    src={filteredImages[0]}
                    alt={`${project.title} - Cover`}
                    loading="lazy"
                    className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 gallery-image"
                    onLoad={() => setImagesLoaded(prev => new Set([...prev, 0]))}
                  />
                </button>
              </ImageWithWatermark>}

              {/* Remaining Gallery Images */}
              {filteredImages.length > 1 && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.slice(1).map((image, index) => {
                  const actualIndex = allImages.indexOf(image);
                  const label = getImageLabel(image, actualIndex);
                  return <ImageWithWatermark key={`${image}-${actualIndex}`}>
                    <button onClick={() => setSelectedImageIndex(actualIndex)} className="relative aspect-square overflow-hidden rounded-lg bg-card border border-border group cursor-pointer transition-all hover:shadow-xl hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent/50 w-full">
                      {/* Blurred background frame */}
                      <img
                        src={image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 scale-110"
                        aria-hidden="true"
                      />
                      <img 
                        src={image} 
                        alt={`${project.title} - Image ${actualIndex + 1}`} 
                        loading="lazy"
                        className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 gallery-image"
                        onLoad={() => setImagesLoaded(prev => new Set([...prev, actualIndex]))}
                      />
                      {label && <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded ${label === "Before" ? "bg-amber-500/90" : "bg-emerald-500/90"}`}>
                        {label}
                      </span>}
                    </button>
                  </ImageWithWatermark>;
                })}
              </div>}
            </>
          )}
        </div>}

        {/* Documents Section */}
        {documents.length > 0 && <div id="documents" className="mb-24 scroll-mt-20">
          <div className="mb-8">
            <span className="font-playfair text-7xl lg:text-8xl text-accent/10 font-light leading-none block -mb-4 lg:-mb-6">
              {videos.length > 0 ? '04' : allImages.length > 0 ? '03' : '02'}
            </span>
            <p className="font-inter text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Resources</p>
            <h3 className="font-playfair text-2xl lg:text-3xl text-foreground">Project Documents</h3>
          </div>
          <div className="w-12 h-[1px] bg-accent mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map(doc => (
              <a
                key={doc.id}
                href={doc.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:border-accent/30 hover:shadow-lg transition-all group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm font-medium text-foreground truncate">
                    {doc.title || doc.file_name}
                  </p>
                  <p className="font-inter text-xs text-muted-foreground mt-1">
                    {doc.file_name.split('.').pop()?.toUpperCase() || 'Document'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>}
      </div>
    </div>

    {/* Enhanced Lightbox Modal */}
    {selectedImageIndex !== null && <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setSelectedImageIndex(null)}>
      {/* Top Controls Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-base font-light">
          {selectedImageIndex + 1} / {allImages.length}
        </div>
        
        <div className="flex gap-2">
          {/* Download button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              downloadImage(allImages[selectedImageIndex], `${project.title}-${selectedImageIndex + 1}.jpg`);
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30" 
            aria-label="Download image"
            title="Download image"
          >
            <Download className="h-5 w-5" />
          </button>
          
          {/* Fullscreen button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              document.documentElement.requestFullscreen?.();
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30" 
            aria-label="Fullscreen"
            title="Fullscreen (F)"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
          
          {/* Close button */}
          <button 
            onClick={() => setSelectedImageIndex(null)} 
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30" 
            aria-label="Close"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Previous button - larger touch target for mobile */}
      <button onClick={e => {
        e.stopPropagation();
        setSelectedImageIndex(selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1);
      }} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 p-4 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Previous image" title="Previous (←)">
        <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      {/* Next button - larger touch target for mobile */}
      <button onClick={e => {
        e.stopPropagation();
        setSelectedImageIndex(selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1);
      }} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 p-4 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Next image" title="Next (→)">
        <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      {/* Image */}
      <div className="flex flex-col items-center justify-center h-full pt-20 pb-4 px-4 sm:px-8" onClick={e => e.stopPropagation()}>
        <ImageWithWatermark>
          <div className="relative mb-4">
            <img 
              src={allImages[selectedImageIndex]} 
              alt={`${project.title} - Image ${selectedImageIndex + 1}`} 
              className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg shadow-2xl animate-scale-in gallery-image" 
            />
            {getImageLabel(allImages[selectedImageIndex], selectedImageIndex) && <span className={`absolute top-4 right-4 px-3 py-2 text-sm font-semibold text-white rounded-lg ${getImageLabel(allImages[selectedImageIndex], selectedImageIndex) === "Before" ? "bg-amber-500/90" : "bg-emerald-500/90"}`}>
              {getImageLabel(allImages[selectedImageIndex], selectedImageIndex)}
            </span>}
          </div>
        </ImageWithWatermark>
        
        {/* Thumbnail Strip */}
        <div className="w-full max-w-4xl overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 justify-center min-w-min px-4">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(idx);
                }}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  idx === selectedImageIndex 
                    ? 'border-accent shadow-lg scale-110' 
                    : 'border-white/20 hover:border-white/40 opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile swipe hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/50 text-xs font-light sm:hidden animate-fade-in">
        Swipe to navigate
      </div>
    </div>}
  </>;
};
export default ProjectDetail;