import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { HeaderNew } from "@/components/HeaderNew";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Stats } from "@/sections/Stats";
import { FeaturedProjects } from "@/sections/FeaturedProjects";
import { CTA } from "@/sections/CTA";
import { Services } from "@/sections/Services";
import { Footer } from "@/sections/Footer";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { ScrollToTop } from "@/components/ScrollToTop";
import { BackgroundCollage } from "@/components/BackgroundCollage";

const Index: React.FC = () => {
  const location = useLocation();
  const [bookOpened, setBookOpened] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (location.state?.openPortfolio) {
      setBookOpened(true);
      window.history.replaceState(null, "", "#portfolio");
    } else if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleOpenBook = useCallback(() => {
    if (animating || bookOpened) return;
    setAnimating(true);
    window.history.pushState({ portfolio: true }, "", "#portfolio");

    if (prefersReducedMotion) {
      setBookOpened(true);
      setAnimating(false);
      return;
    }
    setTimeout(() => {
      setBookOpened(true);
      setAnimating(false);
    }, 1500);
  }, [animating, bookOpened, prefersReducedMotion]);

  const handleCloseBook = useCallback(() => {
    if (animating || !bookOpened) return;
    setAnimating(true);
    window.history.back();

    if (prefersReducedMotion) {
      setBookOpened(false);
      setAnimating(false);
      return;
    }
    setTimeout(() => {
      setBookOpened(false);
      setAnimating(false);
    }, 1500);
  }, [animating, bookOpened, prefersReducedMotion]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && bookOpened && !animating) {
        handleCloseBook();
      }
    };
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.portfolio) {
        setBookOpened(true);
      } else {
        setBookOpened(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [bookOpened, animating, handleCloseBook]);

  useEffect(() => {
    if (!animating) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [bookOpened, animating]);

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Book animation overlay */}
      {animating && !prefersReducedMotion && (
        <div
          className="fixed inset-0 z-50 flex"
          role="presentation"
          aria-hidden="true"
        >
          <div
            className={`w-1/2 h-full bg-charcoal origin-right transition-transform ${!bookOpened ? "animate-book-open-left" : "animate-book-close-left"
              }`}
          />
          <div
            className={`w-1/2 h-full bg-charcoal origin-left transition-transform ${!bookOpened
              ? "animate-book-open-right"
              : "animate-book-close-right"
              }`}
          />
        </div>
      )}

      {!bookOpened ? (
        <>
          <HeaderNew onPortfolioClick={handleOpenBook} />
          <Hero onExplorePortfolio={handleOpenBook} />
          <About />
          <Stats />
          <FeaturedProjects onViewAllClick={handleOpenBook} />
          <Services />
          <CTA />
          <Footer onPortfolioClick={handleOpenBook} />
        </>
      ) : (
        <>
          {/* Animated background collage */}
          <BackgroundCollage />

          <PortfolioGrid onClose={handleCloseBook} />
        </>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Index;
