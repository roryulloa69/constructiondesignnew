import React, { useCallback, useState, useEffect } from "react";
import { AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, useLocation, Link } from "react-router-dom";
import mcLogo from "@/assets/mc-logo.png";

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

      if (itemName === "Home") {
        navigate("/");
        return;
      }

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

      if (itemName === "Services" && location.pathname !== "/") {
        navigate("/", { state: { scrollTo: "services" } });
        return;
      }

      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    },
    [onPortfolioClick, navigate, location]
  );

  const isActive = (itemName: string) => {
    if (itemName === "Home" && location.pathname === "/") return true;
    if (itemName === "Design" && location.pathname === "/design") return true;
    if (itemName === "Contact" && location.pathname === "/contact") return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-gradient-to-b from-charcoal/50 to-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={mcLogo}
              alt="Michael Chandler Construction & Design"
              className="h-10 lg:h-12 w-auto object-contain transition-all duration-500 group-hover:brightness-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.name)}
                className={`relative font-inter text-[11px] tracking-[0.18em] uppercase transition-all duration-500 ${
                  isActive(item.name)
                    ? "text-gold after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[1px] after:bg-gold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
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
              <div className="flex flex-col gap-8 mt-12">
                <img
                  src={mcLogo}
                  alt="MC Logo"
                  className="h-10 w-auto object-contain self-start mb-4"
                />
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.name)}
                    className={`font-inter text-sm tracking-[0.18em] uppercase transition-colors duration-300 ${
                      isActive(item.name) ? "text-gold" : "text-white/70 hover:text-gold"
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
