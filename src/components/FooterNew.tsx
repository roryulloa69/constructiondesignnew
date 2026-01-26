import React, { useMemo, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, MapPin, ArrowRight } from "lucide-react";
const studioLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Portfolio",
    href: "#portfolio",
  },
  {
    name: "Design",
    href: "/design",
  },
  {
    name: "Services",
    href: "#services",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];
export const FooterNew = React.memo(() => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const navigate = useNavigate();
  const location = useLocation();
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, name: string) => {
      e.preventDefault();
      if (name === "Home") {
        navigate("/");
        return;
      }
      if (name === "Design") {
        navigate("/design");
        return;
      }
      if (name === "Contact") {
        navigate("/contact");
        return;
      }
      if (location.pathname !== "/") {
        navigate("/", {
          state: {
            scrollTo: href.replace("#", ""),
          },
        });
        return;
      }
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
    },
    [navigate, location],
  );
  return (
    <footer className="bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Large MC Watermark */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none">
        <span className="font-playfair text-[20rem] font-bold text-white/[0.02] leading-none tracking-tighter">MC</span>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Column 1 - Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-playfair text-4xl font-bold text-gold tracking-wider">MC</span>
            </Link>
            <h3 className="font-inter text-xs tracking-[0.25em] text-gold/80 uppercase mb-6">MICHAEL CHANDLER</h3>
            <p className="font-playfair italic text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
              "Crafting legacy environments through 37 years of uncompromising design and master building."
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 - Studio */}
          <div>
            <h4 className="font-inter text-xs tracking-[0.25em] text-white/40 uppercase mb-8">Studio</h4>
            <nav className="flex flex-col gap-4">
              {studioLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.name)}
                  className="font-inter text-sm text-white/60 hover:text-gold transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3 - Inquiries */}
          <div>
            <h4 className="font-inter text-xs tracking-[0.25em] text-white/40 uppercase mb-8">Inquiries</h4>
            <div className="space-y-6">
              <div>
                <p className="font-inter text-xs tracking-[0.15em] text-white/30 uppercase mb-2">Direct Line</p>
                <a
                  href="tel:+14352377373"
                  className="font-inter text-sm text-white/60 hover:text-gold transition-colors duration-300"
                >
                  (435) 237-7373
                </a>
              </div>
              <div>
                <p className="font-inter text-xs tracking-[0.15em] text-white/30 uppercase mb-2">Email</p>
                <a
                  href="mailto:mike.rcccon@yahoo.com"
                  className="font-inter text-sm text-white/60 hover:text-gold transition-colors duration-300"
                >
                  mike.rcccon@yahoo.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 4 - Location */}
          <div>
            <h4 className="font-inter text-xs tracking-[0.25em] text-white/40 uppercase mb-8">Location</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-inter text-sm text-white/60 leading-relaxed">Spring, TX 77379</p>
                </div>
              </div>
              <p className="font-inter text-xs text-white/40 italic">Available Worldwide</p>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 font-inter text-xs tracking-[0.15em] text-white/40 uppercase hover:text-gold transition-colors duration-300 group"
              >
                Internal Portal Registry
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="font-inter text-xs tracking-[0.1em] text-white/40 uppercase hover:text-gold transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="font-inter text-xs tracking-[0.1em] text-white/40 uppercase hover:text-gold transition-colors"
              >
                Terms
              </Link>
            </div>
            <p className="font-inter text-xs tracking-[0.1em] text-white/40 uppercase">
              © {currentYear} Michael Chandler Design | Built for Legacy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});
FooterNew.displayName = "FooterNew";
