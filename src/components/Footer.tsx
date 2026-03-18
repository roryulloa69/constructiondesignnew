import React, { useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AtSign, Smartphone, Navigation } from "lucide-react";
import logo from "@/assets/mc-logo-new.png";

export const Footer = React.memo(() => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback((sectionId: string) => {
    // If on home page, scroll directly
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      // Navigate to home with state to scroll after
      navigate("/", { state: { scrollTo: sectionId } });
    }
  }, [location.pathname, navigate]);

  return (
    <footer id="contact" className="bg-charcoal text-cream">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* Left Column - Brand */}
          <div>
            <div className="mb-4 sm:mb-5">
              <img src={logo} alt="Michael Chandler Logo" className="h-12 w-auto mb-3" />

              <p className="text-cream/80 text-sm sm:text-base font-inter mb-4 leading-relaxed">
                Fine Construction & Design
              </p>
            </div>
            <p className="text-cream/70 text-sm sm:text-base font-inter leading-relaxed">
              37+ years of construction excellence in Spring, Texas. Delivering quality craftsmanship and exceptional service for residential and commercial projects.
            </p>
          </div>

          {/* Middle Column - Services */}
          <div>
            <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 sm:mb-5 leading-tight text-cream">
              Services
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#services"
                  onClick={e => {
                    e.preventDefault();
                    scrollToSection('services');
                  }}
                  className="text-cream/70 hover:text-gold transition-colors text-sm sm:text-base font-inter leading-relaxed"
                >
                  Architectural Design
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={e => {
                    e.preventDefault();
                    scrollToSection('services');
                  }}
                  className="text-cream/70 hover:text-gold transition-colors text-sm sm:text-base font-inter leading-relaxed"
                >
                  Construction Management
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={e => {
                    e.preventDefault();
                    scrollToSection('services');
                  }}
                  className="text-cream/70 hover:text-gold transition-colors text-sm sm:text-base font-inter leading-relaxed"
                >
                  Project Planning
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={e => {
                    e.preventDefault();
                    scrollToSection('services');
                  }}
                  className="text-cream/70 hover:text-gold transition-colors text-sm sm:text-base font-inter leading-relaxed"
                >
                  Quality Assurance
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column - Contact */}
          <div>
            <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-4 sm:mb-5 leading-tight text-cream">
              Contact
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <Navigation className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-cream/70 text-sm sm:text-base font-inter leading-relaxed">
                  Spring, Texas 77379
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+14352377373"
                  className="text-cream/70 hover:text-gold transition-colors text-sm sm:text-base font-inter leading-relaxed"
                >
                  +1 (435) 237-7373
                </a>
              </div>
              <div className="flex items-start gap-3">
                <AtSign className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:mike.rcccon@yahoo.com"
                  className="text-cream/70 hover:text-gold transition-colors text-sm sm:text-base font-inter leading-relaxed break-all"
                >
                  mike.rcccon@yahoo.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-cream/60 text-sm sm:text-base font-inter leading-relaxed">
              © {currentYear} Michael Chandler Fine Construction & Design. All rights reserved.
            </p>

            <div className="flex items-center gap-4 sm:gap-6">
              <nav className="flex gap-4 sm:gap-6">
                <a
                  href="#about"
                  onClick={e => {
                    e.preventDefault();
                    scrollToSection('about');
                  }}
                  className="text-cream/70 hover:text-gold transition-colors text-sm sm:text-base font-inter leading-relaxed"
                >
                  About
                </a>
                <a
                  href="#services"
                  onClick={e => {
                    e.preventDefault();
                    scrollToSection('services');
                  }}
                  className="text-cream/70 hover:text-gold transition-colors text-sm sm:text-base font-inter leading-relaxed"
                >
                  Services
                </a>
                <a
                  href="#contact"
                  onClick={e => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                  className="text-cream/70 hover:text-gold transition-colors text-sm sm:text-base font-inter leading-relaxed"
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
