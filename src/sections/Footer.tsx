import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";
import mcLogo from "@/assets/mc-logo.png";

interface FooterProps {
    onPortfolioClick?: () => void;
}

export const Footer = ({ onPortfolioClick }: FooterProps) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-charcoal text-white pt-32 pb-16 border-t border-white/[0.04] relative overflow-hidden">
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block mb-10 group">
                            <img
                                src={mcLogo}
                                alt="Michael Chandler Construction & Design"
                                className="h-12 w-auto object-contain transition-all duration-500 group-hover:brightness-110"
                            />
                        </Link>
                        <p className="font-inter text-white/35 text-[15px] font-light leading-[1.85] max-w-md mb-10">
                            Strategic Construction Leader with over 37 years of experience steering
                            multimillion-dollar developments from conception to handover across
                            the United States and international markets.
                        </p>
                        <div className="flex gap-8">
                            <a href="#" className="text-white/15 hover:text-gold transition-all duration-500 hover:-translate-y-1" aria-label="Instagram">
                                <Instagram size={20} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="text-white/15 hover:text-gold transition-all duration-500 hover:-translate-y-1" aria-label="LinkedIn">
                                <Linkedin size={20} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="text-white/15 hover:text-gold transition-all duration-500 hover:-translate-y-1" aria-label="Facebook">
                                <Facebook size={20} strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-8 h-px bg-gold/40" />
                            <h4 className="font-inter text-[10px] tracking-[0.4em] text-gold/70 uppercase">Navigation</h4>
                        </div>
                        <ul className="space-y-5 font-inter text-[13px] tracking-wider text-white/35 uppercase font-light">
                            <li>
                                <Link to="/" className="hover:text-white transition-colors duration-500 flex items-center group">
                                    <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-3 transition-all duration-500" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => onPortfolioClick ? onPortfolioClick() : window.location.hash = 'portfolio'}
                                    className="hover:text-white transition-colors duration-500 flex items-center group text-left"
                                >
                                    <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-3 transition-all duration-500" />
                                    Portfolio
                                </button>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white transition-colors duration-500 flex items-center group">
                                    <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-3 transition-all duration-500" />
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/design" className="hover:text-white transition-colors duration-500 flex items-center group">
                                    <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-3 transition-all duration-500" />
                                    Design & Civil
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-8 h-px bg-gold/40" />
                            <h4 className="font-inter text-[10px] tracking-[0.4em] text-gold/70 uppercase">Inquiries</h4>
                        </div>
                        <ul className="space-y-8 font-inter text-sm text-white/35 font-light">
                            <li className="flex items-start gap-5 group">
                                <div className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-gold/60 group-hover:bg-gold group-hover:text-charcoal transition-all duration-500">
                                    <Phone size={15} strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/15 mb-1.5">Call Us</p>
                                    <p className="group-hover:text-white transition-colors duration-500">+1 (435) 237-7373</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-5 group">
                                <div className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-gold/60 group-hover:bg-gold group-hover:text-charcoal transition-all duration-500">
                                    <Mail size={15} strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/15 mb-1.5">Email Us</p>
                                    <p className="group-hover:text-white transition-colors duration-500">mike.rcccon@yahoo.com</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-5 group">
                                <div className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-gold/60 group-hover:bg-gold group-hover:text-charcoal transition-all duration-500">
                                    <MapPin size={15} strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/15 mb-1.5">Visit Us</p>
                                    <p className="group-hover:text-white transition-colors duration-500">Spring, Texas 77379</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="font-inter text-[10px] tracking-[0.3em] text-white/15 uppercase">
                        © {currentYear} Michael Chandler. Strategic Construction Execution.
                    </p>
                    <div className="flex gap-12 font-inter text-[10px] tracking-[0.3em] text-white/15 uppercase">
                        <a href="#" className="hover:text-white/40 transition-colors duration-500">Privacy Policy</a>
                        <a href="#" className="hover:text-white/40 transition-colors duration-500">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
