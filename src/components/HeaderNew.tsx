import React, { useCallback, useState, useEffect } from "react";
import { AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, useLocation, Link } from "react-router-dom";

const navigation = [
  { name: "Portfolio", href: "#portfolio" },
  { name: "Design", href: "/design" },
  { name: "About", href: "#about" },
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

  // Ensure the mobile menu never stays open after navigation.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, itemName: string) => {
      e.preventDefault();
      setMobileMenuOpen(false);

      if (itemName === "Portfolio") {
        if (location.pathname === "/" && onPortfolioClick) {
          onPortfolioClick();
        } else {
          navigate("/", { state: { openPortfolio: true } });
        }
        return;
      }

      if (itemName === "Design") {
        navigate("/design");
        return;
      }

      if (itemName === "Contact") {
        navigate("/contact");
        return;
      }

      if (itemName === "About") {
        if (location.pathname !== "/") {
          navigate("/", { state: { scrollTo: "about" } });
          return;
        }
      }

      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    },
    [location.pathname, navigate, onPortfolioClick]
  );

  const isActive = (itemName: string) => {
    if (itemName === "Design" && location.pathname === "/design") return true;
    if (itemName === "Contact" && location.pathname === "/contact") return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
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

          {/* Menu Trigger - visible on all screen sizes */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <AlignJustify className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-charcoal border-white/10 w-72">
              <div className="flex flex-col gap-8 mt-12">
                {navigation.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.name)}
                    className={`font-inter text-lg tracking-[0.15em] uppercase transition-all duration-300 transform ${
                      mobileMenuOpen 
                        ? "opacity-100 translate-x-0" 
                        : "opacity-0 -translate-x-4"
                    } ${
                      isActive(item.name)
                        ? "text-gold"
                        : "text-white/80 hover:text-gold"
                    }`}
                    style={{ 
                      transitionDelay: mobileMenuOpen ? `${150 + index * 75}ms` : "0ms" 
                    }}
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
