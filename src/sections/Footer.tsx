import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";

interface FooterProps {
    onPortfolioClick?: () => void;
}

export const Footer = ({ onPortfolioClick }: FooterProps) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-charcoal text-white pt-32 pb-16 border-t border-white/[0.05] relative overflow-hidden">
            {/* Aesthetic background accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block mb-10 group">
                            <span className="font-playfair text-3xl tracking-tight text-white transition-all duration-500 group-hover:tracking-tighter">
                                MICHAEL<span className="text-gold italic">CHANDLER</span>
                            </span>
                        </Link>
                        <p className="font-inter text-white/40 text-base font-light leading-relaxed max-w-md mb-10">
                            Strategic Construction Leader with over 37 years of experience steering
                            multimillion-dollar developments from conception to handover across
                            the United States and international markets.
                        </p>
                        <div className="flex gap-8">
                            <a href="#" className="text-white/20 hover:text-gold transition-all duration-300 hover:-translate-y-1" aria-label="Instagram">
                                <Instagram size={22} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="text-white/20 hover:text-gold transition-all duration-300 hover:-translate-y-1" aria-label="LinkedIn">
                                <Linkedin size={22} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="text-white/20 hover:text-gold transition-all duration-300 hover:-translate-y-1" aria-label="Facebook">
                                <Facebook size={22} strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-6 h-px bg-gold/50" />
                            <h4 className="font-inter text-[10px] tracking-[0.4em] text-gold uppercase font-semibold">Navigation</h4>
                        </div>
                        <ul className="space-y-5 font-inter text-[13px] tracking-wider text-white/40 uppercase font-light">
                            <li>
                                <Link to="/" className="hover:text-white transition-colors duration-300 flex items-center group">
                                    <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-3 transition-all duration-300" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => onPortfolioClick ? onPortfolioClick() : window.location.hash = 'portfolio'}
                                    className="hover:text-white transition-colors duration-300 flex items-center group text-left"
                                >
                                    <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-3 transition-all duration-300" />
                                    Portfolio
                                </button>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white transition-colors duration-300 flex items-center group">
                                    <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-3 transition-all duration-300" />
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/design" className="hover:text-white transition-colors duration-300 flex items-center group">
                                    <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-3 transition-all duration-300" />
                                    Design & Civil
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-6 h-px bg-gold/50" />
                            <h4 className="font-inter text-[10px] tracking-[0.4em] text-gold uppercase font-semibold">Inquiries</h4>
                        </div>
                        <ul className="space-y-8 font-inter text-sm text-white/40 font-light">
                            <li className="flex items-start gap-5 group">
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-charcoal transition-all duration-500">
                                    <Phone size={16} strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Call Us</p>
                                    <p className="group-hover:text-white transition-colors transition-colors">+1 (435) 237-7373</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-5 group">
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-charcoal transition-all duration-500">
                                    <Mail size={16} strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Email Us</p>
                                    <p className="group-hover:text-white transition-colors">mike.rcccon@yahoo.com</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-5 group">
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-charcoal transition-all duration-500">
                                    <MapPin size={16} strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Visit Us</p>
                                    <p className="group-hover:text-white transition-colors">Spring, Texas 77379</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="font-inter text-[10px] tracking-[0.3em] text-white/20 uppercase">
                        © {currentYear} Michael Chandler. Strategic Construction Execution.
                    </p>
                    <div className="flex gap-12 font-inter text-[10px] tracking-[0.3em] text-white/20 uppercase">
                        <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
