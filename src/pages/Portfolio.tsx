import Layout from "@/components/layout/Layout";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { projects, categories } from "@/data/projects";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const Portfolio = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [activeFilter, setActiveFilter] = useState(categoryFromUrl || "All");
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    if (categoryFromUrl && (categories as readonly string[]).includes(categoryFromUrl)) {
      setActiveFilter(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <Layout>
      {/* Hero - Full Split Layout */}
      <section ref={heroRef} className="min-h-screen flex flex-col lg:flex-row">
        {/* Left - Dark Hero */}
        <div className="relative flex-1 bg-charcoal flex items-center justify-center overflow-hidden min-h-[60vh] lg:min-h-screen">
          {/* Parallax Project Photo Collage Background */}
          <motion.div 
            className="absolute inset-0"
            style={{ y: backgroundY, scale: backgroundScale }}
          >
            <div className="grid h-full w-full grid-cols-3 grid-rows-3">
              {projects.slice(0, 9).map((p, i) => (
                <img
                  key={p.id}
                  src={p.coverImage}
                  alt=""
                  aria-hidden="true"
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover opacity-25 grayscale"
                />
              ))}
            </div>
          </motion.div>
          <div className="absolute inset-0 bg-charcoal/70" />

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-transparent to-charcoal/80 z-0" />

          {/* MC Logo */}
          <div className="absolute top-12 left-12 z-20">
            <div className="w-10 h-10 border border-gold/50 flex items-center justify-center">
              <span className="font-serif text-sm font-medium text-gold">MC</span>
            </div>
          </div>

          {/* Vertical Side Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-16 left-12 hidden lg:block z-20"
          >
            <p
              className="text-[9px] tracking-[0.35em] text-cream/30 font-light uppercase"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              Design & Construction
            </p>
          </motion.div>
        </div>

        {/* Right - Content Section */}
        <div className="relative flex-1 bg-background flex flex-col">
          {/* Minimal Corner Accent */}
          <div className="absolute top-16 right-16 w-20 h-20 border-t border-r border-border hidden lg:block" />

          {/* Header Area */}
          <div className="flex justify-between items-center px-12 lg:px-20 py-12">
            <div className="w-8 h-8 bg-gold flex items-center justify-center">
              <span className="font-serif text-[10px] font-medium text-charcoal">MC</span>
            </div>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground font-light uppercase">
              Est. 1987
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center px-12 lg:px-20 py-16">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all mb-16 self-start group text-[11px] tracking-[0.15em] uppercase font-light"
            >
              <span className="text-sm group-hover:-translate-x-1 transition-transform">←</span>
              Back
            </motion.button>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-foreground mb-8 tracking-tight leading-[1.1]"
            >
              Project<br />Collection
            </motion.h2>

            {/* Subtle Gold Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="h-[1px] bg-gold mb-10"
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-sm leading-relaxed text-muted-foreground max-w-md mb-20 font-light"
            >
              A curated selection of residential, commercial, and hospitality projects 
              showcasing 37 years of design excellence and meticulous craftsmanship.
            </motion.p>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-16 mt-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="block font-serif text-6xl md:text-7xl font-light text-gold leading-none mb-4">
                  {projects.length}
                </span>
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-light uppercase">
                  Signature Projects
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <span className="block font-serif text-6xl md:text-7xl font-light text-gold leading-none mb-4">
                  37
                </span>
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-light uppercase">
                  Years of Excellence
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-background py-10 border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-12 lg:px-20">
          <div className="flex flex-wrap gap-6">
            {(categories as readonly string[]).map((cat, index) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + (index * 0.1) }}
                onClick={() => setActiveFilter(cat)}
                className={`text-[11px] tracking-[0.2em] uppercase font-light transition-all duration-300 pb-2 border-b ${
                  activeFilter === cat
                    ? "text-foreground border-gold"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-background min-h-screen">
        <div className="container mx-auto px-12 lg:px-20">
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={project.id}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="group block overflow-hidden"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted mb-5">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
                    </div>
                    
                    {/* Text Content */}
                    <div className="space-y-2">
                      <p className="text-[10px] tracking-[0.2em] text-gold uppercase font-light">
                        {project.category}
                      </p>
                      <h3 className="font-serif text-xl text-foreground group-hover:text-gold transition-colors duration-300 font-light">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-light">
                        {project.location}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-charcoal text-charcoal hover:bg-charcoal hover:text-cream transition-all duration-500 text-[11px] tracking-[0.2em] uppercase font-light px-10 py-6"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 ml-3" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
