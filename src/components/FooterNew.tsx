import React, { useMemo, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Design", href: "/design" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "/contact" },
];

export const FooterNew = React.memo(() => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
        navigate("/", { state: { scrollTo: href.replace("#", "") } });
        return;
      }

      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [navigate, location]
  );

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/10">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-24">
          {/* Brand Column */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="font-playfair text-3xl font-semibold text-gold tracking-wider">
                MC
              </span>
            </Link>
            <p className="font-inter text-white/50 text-sm leading-relaxed max-w-sm">
              Strategic Construction Executive with 37+ years of experience 
              delivering multimillion-dollar developments. Portfolio exceeding 
              $500M across 12 US states and 4 countries.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-inter text-xs tracking-[0.2em] text-white/40 uppercase mb-6">
              Navigation
            </h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.name)}
                  className="font-inter text-sm text-white/60 hover:text-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-inter text-xs tracking-[0.2em] text-white/40 uppercase mb-6">
              Contact
            </h4>
            <div className="space-y-3">
              <p className="font-inter text-sm text-white/60">
                Spring, Texas 77379
              </p>
              <a
                href="tel:+14352377373"
                className="block font-inter text-sm text-white/60 hover:text-gold transition-colors"
              >
                +1 (435) 237-7373
              </a>
              <a
                href="mailto:mike.rcccon@yahoo.com"
                className="block font-inter text-sm text-white/60 hover:text-gold transition-colors"
              >
                mike.rcccon@yahoo.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-inter text-xs text-white/40">
              © {currentYear} Michael Chandler Fine Construction & Design. All
              rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 font-inter text-xs text-white/40 hover:text-gold transition-colors group"
            >
              Back to top
              <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
});

FooterNew.displayName = "FooterNew";
