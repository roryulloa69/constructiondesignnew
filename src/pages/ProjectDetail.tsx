import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Square, Bed, Droplets, Check, CalendarDays, Award, Wallet, MapPin } from "lucide-react";
import { getProjectById } from "@/data/projects";
import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ImageWithWatermark } from "@/components/ImageWithWatermark";
import { useAuth } from "@/contexts/AuthContext";
import { ReorderableGallery } from "@/components/admin/ReorderableGallery";
import { motion } from "framer-motion";

interface ProjectVideo {
  id: string;
  video_url: string;
  title: string | null;
  description: string | null;
  display_order: number | null;
}
interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  display_order: number;
  is_before: boolean | null;
  is_after: boolean | null;
}
interface ProjectDocument {
  id: string;
  document_url: string;
  file_name: string;
  title: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const SectionHeader = ({ number, label, title }: { number: string; label: string; title: string }) => (
  <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
    <motion.span variants={fadeUp} custom={0} className="font-playfair text-8xl lg:text-9xl text-accent/[0.07] font-extralight leading-none block -mb-6 lg:-mb-8 select-none">
      {number}
    </motion.span>
    <motion.p variants={fadeUp} custom={1} className="font-inter text-[10px] tracking-[0.4em] text-accent uppercase mb-3 font-medium">
      {label}
    </motion.p>
    <motion.h2 variants={fadeUp} custom={2} className="font-playfair text-2xl lg:text-4xl text-foreground font-light tracking-wide">
      {title}
    </motion.h2>
    <motion.div variants={fadeUp} custom={3} className="w-16 h-[2px] bg-gradient-to-r from-accent to-accent/0 mt-6" />
  </motion.div>
);

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const project = id ? getProjectById(id) : undefined;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [dbImages, setDbImages] = useState<ProjectImage[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (heroImgRef.current) {
      heroImgRef.current.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
      heroImgRef.current.style.transition = 'transform 0.1s ease-out';
    }
  }, [scrollY]);

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

  useEffect(() => {
    if (!id) return;
    const fetchVideos = async () => {
      const { data, error } = await supabase.from('project_videos').select('*').eq('project_id', id).order('display_order', { ascending: true });
      if (!error && data) setVideos(data);
    };
    const fetchImages = async () => {
      const { data, error } = await supabase.from('project_images').select('*').eq('project_id', id).order('display_order', { ascending: true });
      if (!error && data) setDbImages(data);
    };
    const fetchDocuments = async () => {
      const { data, error } = await supabase.from('project_documents').select('id, document_url, file_name, title').eq('project_id', id).order('display_order', { ascending: true });
      if (!error && data) setDocuments(data);
    };
    fetchVideos();
    fetchImages();
    fetchDocuments();
  }, [id]);

  const hasStaticImages = project?.images && Array.isArray(project.images) && project.images.length > 0;
  const allImages = useMemo(() => {
    if (hasStaticImages && project?.images) {
      // Handle both string and object image formats
      return project.images
        .filter(img => img != null)
        .map(img => typeof img === 'string' ? img : img.url);
    }
    const validDbImages = dbImages.filter(img => img.image_url && (img.image_url.startsWith('http') || img.image_url.startsWith('https://')));
    if (validDbImages.length > 0) return validDbImages.map(img => img.image_url);
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

  useEffect(() => {
    if (selectedImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImageIndex(null);
      else if (e.key === "ArrowLeft") setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : (prev ?? 0) - 1);
      else if (e.key === "ArrowRight") setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : (prev ?? 0) + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, allImages.length]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4 font-playfair">Project Not Found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  const heroImage = project.coverImage || (allImages.length > 0 ? allImages[0] : '');
  const hasStats = false;
  const hasFeatures = false;
  const hasRole = false;

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Image with Parallax */}
        <div ref={heroRef} className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full overflow-hidden bg-black">
          <img
            ref={heroImgRef}
            src={heroImage}
            alt={project.title}
            className="w-full h-full object-cover hero-image"
            style={{ transform: 'scale(1.1)' }}
          />
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-6 left-6 z-10"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/", { state: { openPortfolio: true } })}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:text-white shadow-lg"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </motion.div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16 z-10">
            <div className="max-w-6xl mx-auto">
              {project.location && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  <p className="text-accent text-xs uppercase tracking-[0.3em] font-inter font-medium">
                    {project.location}
                  </p>
                </motion.div>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-light text-white tracking-tight leading-[1.05]"
              >
                {project.title}
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-24 h-[2px] bg-accent mt-6 origin-left"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Description - Full width, editorial pullquote style */}
          {project.description && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="py-16 lg:py-20 border-b border-border/30"
            >
              <p className="font-playfair text-xl sm:text-2xl lg:text-3xl text-foreground/90 leading-relaxed max-w-4xl font-light italic">
                "{project.description}"
              </p>
            </motion.div>
          )}

          {/* Project Details Section */}
          <div className="py-16 lg:py-20">
            <SectionHeader number="01" label="Project Details" title="Overview" />

            {/* Category & Design Style */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 mb-12"
            >
              <motion.div variants={fadeUp} custom={0} className="border-l-2 border-accent/40 pl-6 py-4">
                <p className="font-inter text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-2 font-medium">Category</p>
                <p className="font-playfair text-lg text-foreground">{project.category}</p>
              </motion.div>
              {(project as any).subtitle && (
                <motion.div variants={fadeUp} custom={1} className="border-l-2 border-accent/40 pl-6 py-4">
                  <p className="font-inter text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-2 font-medium">Design Style</p>
                  <p className="font-playfair text-lg text-foreground">{(project as any).subtitle}</p>
                </motion.div>
              )}
              {project.location && (
                <motion.div variants={fadeUp} custom={2} className="border-l-2 border-accent/40 pl-6 py-4">
                  <p className="font-inter text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-2 font-medium">Location</p>
                  <p className="font-playfair text-lg text-foreground">{project.location}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Stats Row */}
            {hasStats && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px mb-12 bg-border/20 rounded-xl overflow-hidden border border-border/30"
              >
                {[
                  (project as any).duration && { icon: CalendarDays, value: (project as any).duration, label: "Duration" },
                  (project as any).sqft && { icon: Square, value: (project as any).sqft.toLocaleString(), label: "Sq Ft" },
                  (project as any).bedrooms && { icon: Bed, value: (project as any).bedrooms, label: "Bedrooms" },
                  (project as any).baths && { icon: Droplets, value: (project as any).baths, label: "Baths" },
                  (project as any).budget && { icon: Wallet, value: (project as any).budget, label: "Budget" },
                ].filter(Boolean).map((stat: any, i) => (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp}
                    custom={i}
                    className="bg-card/50 backdrop-blur-sm p-6 text-center group hover:bg-accent/5 transition-colors duration-300"
                  >
                    <stat.icon className="h-5 w-5 text-accent/70 mx-auto mb-3 group-hover:text-accent transition-colors" />
                    <p className="font-playfair text-xl text-foreground font-medium">{stat.value}</p>
                    <p className="font-inter text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* My Role */}
            {hasRole && (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2 mb-5">
                  <Award className="h-4 w-4 text-accent" />
                  <p className="font-inter text-[10px] tracking-[0.3em] text-muted-foreground uppercase font-medium">My Role</p>
                </motion.div>
                <motion.div variants={fadeUp} custom={1} className="flex flex-wrap gap-2">
                  {(project as any).roles!.split(',').map((role: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-inter bg-accent/5 text-foreground border border-accent/15 hover:border-accent/30 hover:bg-accent/10 transition-all duration-300"
                    >
                      {role.trim()}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Feature Highlights */}
            {hasFeatures && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="pt-8 border-t border-border/20"
              >
                <motion.p variants={fadeUp} custom={0} className="font-inter text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-6 font-medium">
                  Feature Highlights
                </motion.p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                  {(project as any).features!.map((feature: string, index: number) => (
                    <motion.div key={index} variants={fadeUp} custom={index * 0.3} className="flex items-center gap-3 group">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Check className="h-3 w-3 text-accent" />
                      </div>
                      <span className="font-inter text-sm text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Videos Section */}
          {videos.length > 0 && (
            <div className="py-16 lg:py-20 border-t border-border/20">
              <SectionHeader number="02" label="Media" title="Project Videos" />
              <div className="grid md:grid-cols-2 gap-8">
                {videos.map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                    className="bg-card rounded-xl overflow-hidden border border-border/30 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <VideoPlayer url={video.video_url} />
                    {(video.title || video.description) && (
                      <div className="p-5">
                        {video.title && <h4 className="font-playfair font-medium text-foreground mb-1">{video.title}</h4>}
                        {video.description && <p className="font-inter text-sm text-muted-foreground">{video.description}</p>}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {allImages.length > 0 && (
            <div className="py-16 lg:py-20 border-t border-border/20">
              <SectionHeader
                number={videos.length > 0 ? '03' : '02'}
                label="Photography"
                title="Gallery"
              />
              {isAdmin && <p className="font-inter text-xs text-accent -mt-6 mb-8">Admin: drag images to reorder</p>}

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
                  {/* Cover Photo */}
                  {allImages.length > 0 && (
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      custom={0}
                    >
                      <ImageWithWatermark key={`${allImages[0]}-cover`}>
                        <button
                          onClick={() => setSelectedImageIndex(0)}
                          className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-card border border-border/20 group cursor-pointer transition-all duration-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent/50 mb-8"
                        >
                          <img
                            src={allImages[0]}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-15 scale-125"
                            aria-hidden="true"
                          />
                          <img
                            src={allImages[0]}
                            alt={`${project.title} - Cover`}
                            className="relative z-10 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 gallery-image"
                          />
                          <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                        </button>
                      </ImageWithWatermark>
                    </motion.div>
                  )}

                  {/* Gallery Grid - Masonry-like with varied sizes */}
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                      {allImages.slice(1).map((image, index) => {
                        const actualIndex = index + 1;
                        const label = getImageLabel(image, actualIndex);
                        // Create visual interest: every 4th image spans 2 columns on larger screens
                        const isWide = index % 5 === 0 && index > 0;
                        return (
                          <motion.div
                            key={`${image}-${actualIndex}`}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-30px" }}
                            variants={fadeUp}
                            custom={index * 0.1}
                            className={isWide ? "sm:col-span-2" : ""}
                          >
                            <ImageWithWatermark>
                              <button
                                onClick={() => setSelectedImageIndex(actualIndex)}
                                className={`relative overflow-hidden rounded-lg bg-card border border-border/20 group cursor-pointer transition-all duration-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent/50 w-full ${isWide ? 'aspect-[2/1]' : 'aspect-square'}`}
                              >
                                <img
                                  src={image}
                                  alt=""
                                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-15 scale-125"
                                  aria-hidden="true"
                                />
                                <img
                                  src={image}
                                  alt={`${project.title} - Image ${actualIndex + 1}`}
                                  className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 gallery-image"
                                />
                                <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                {label && (
                                  <span className={`absolute top-3 right-3 z-30 px-3 py-1.5 text-xs font-semibold text-white rounded-full backdrop-blur-sm ${label === "Before" ? "bg-amber-500/80" : "bg-emerald-500/80"}`}>
                                    {label}
                                  </span>
                                )}
                              </button>
                            </ImageWithWatermark>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-sm font-inter tracking-wider">
            {selectedImageIndex + 1} <span className="text-white/40">/ </span>{allImages.length}
          </div>

          {/* Nav buttons */}
          <button
            onClick={e => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Image */}
          <div className="flex items-center justify-center h-full p-8 sm:p-16" onClick={e => e.stopPropagation()}>
            <ImageWithWatermark>
              <div className="relative">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  src={allImages[selectedImageIndex]}
                  alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl gallery-image"
                />
                {getImageLabel(allImages[selectedImageIndex], selectedImageIndex) && (
                  <span className={`absolute top-4 right-4 px-3 py-2 text-sm font-semibold text-white rounded-full backdrop-blur-sm ${getImageLabel(allImages[selectedImageIndex], selectedImageIndex) === "Before" ? "bg-amber-500/80" : "bg-emerald-500/80"}`}>
                    {getImageLabel(allImages[selectedImageIndex], selectedImageIndex)}
                  </span>
                )}
              </div>
            </ImageWithWatermark>
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
              <div className="flex gap-2 justify-center overflow-x-auto max-w-3xl mx-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i); }}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                      i === selectedImageIndex
                        ? "border-accent scale-110 opacity-100"
                        : "border-transparent opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};
export default ProjectDetail;
