import React, { useCallback, useState, useEffect } from "react";
import { AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, useLocation, Link } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Design", href: "/design" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "/contact" },
];

interface HeaderNewProps {
  onPortfolioClick?: () => void;
}

export const HeaderNew = React.memo(({ onPortfolioClick }: HeaderNewProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, itemName: string) => {
      e.preventDefault();
      setMobileMenuOpen(false); // Close mobile menu on any click

      // 1. HOME
      if (itemName === "Home") {
        if (location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          // Clear hash if any
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
        } else {
          navigate("/");
        }
        return;
      }

      // 2. PORTFOLIO
      if (itemName === "Portfolio") {
        if (location.pathname === "/") {
          // If we are already home, trigger the prop directly
          if (onPortfolioClick) onPortfolioClick();
        } else {
          // If elsewhere, navigate home with state
          navigate("/", { state: { openPortfolio: true } });
        }
        return;
      }

      // 3. DESIGN & CONTACT (Simple pages)
      if (itemName === "Design" || itemName === "Contact") {
        navigate(href);
        return;
      }

      // 4. SERVICES (Scroll to section)
      if (itemName === "Services") {
        if (location.pathname !== "/") {
          // If not home, navigate home with scroll instruction
          navigate("/", { state: { scrollTo: "services" } });
        } else {
          // If home, scroll to it
          const element = document.getElementById("services");
          if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
            window.history.pushState(null, "", "#services");
          }
        }
        return;
      }

      // Fallback for generic anchors (if any added later)
      if (href.startsWith("#")) {
        const targetId = href.replace("#", "");
        const element = document.getElementById(targetId);
        if (element) {
          const offsetTop = element.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }
    },
    [onPortfolioClick, navigate, location]
  );

  const isActive = (item: { name: string; href: string }) => {
    // Exact path matches
    if (item.href === location.pathname) return true;

    // Hash matches (for Services/Portfolio on Home page)
    if (location.pathname === "/" && item.href.startsWith("#")) {
      return location.hash === item.href;
    }

    // Home active only if no hash and at root
    if (item.name === "Home" && location.pathname === "/" && !location.hash) return true;

    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-charcoal/95 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
        }`}
    >
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo - MC monogram */}
          <Link to="/" className="flex items-center group">
            <span className="font-playfair text-2xl sm:text-3xl font-semibold text-gold tracking-wider">
              MC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.name)}
                className={`relative font-inter text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${isActive(item)
                    ? "text-white after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-gold"
                    : "text-white/70 hover:text-white"
                  }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <AlignJustify className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-charcoal border-white/10">
              <div className="flex flex-col gap-6 mt-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.name)}
                    className={`font-inter text-sm tracking-[0.15em] uppercase transition-colors ${isActive(item) ? "text-white font-medium" : "text-white/80 hover:text-gold"
                      }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
});

HeaderNew.displayName = "HeaderNew";
