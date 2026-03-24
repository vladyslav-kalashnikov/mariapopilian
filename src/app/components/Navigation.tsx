import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X, Instagram, Facebook, MapPin } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";

function getSocialIcon(id: string) {
    if (id === "facebook") {
        return Facebook;
    }
    if (id === "location") {
        return MapPin;
    }
    return Instagram;
}

export function Navigation({ currentPage, setCurrentPage }: { currentPage: string, setCurrentPage: (page: string) => void }) {
    const { content } = useSiteContent();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavigate = (id: string) => {
        setCurrentPage(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header
                className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
                    isScrolled ? "border-b border-white/5 bg-black/80 py-4 backdrop-blur-md" : "bg-transparent py-6"
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                    <button onClick={() => handleNavigate("home")} className="text-white font-serif text-xl tracking-widest uppercase">
                        {content.navigation.logoPrimary}<span className="text-[#B39A74]">{content.navigation.logoAccent}</span>
                    </button>

                    <nav className="hidden items-center gap-10 md:flex">
                        {content.navigation.links.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavigate(link.id)}
                                className={`text-[0.65rem] font-medium uppercase tracking-[0.3em] transition-colors hover:text-[#B39A74] ${
                                    currentPage === link.id ? "border-b border-[#B39A74] pb-1 text-[#B39A74]" : "text-white/70"
                                }`}
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-6 md:flex">
                        {content.navigation.socialLinks.slice(0, 1).map((social) => {
                            const Icon = getSocialIcon(social.id);
                            return (
                                <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="text-white/60 transition hover:text-[#B39A74]">
                                    <Icon className="h-4 w-4" />
                                </a>
                            );
                        })}
                    </div>

                    <button className="text-white md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="h-6 w-6" strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed inset-0 z-[100] flex flex-col bg-[#050505] px-6 py-8"
                    >
                        <div className="mb-16 flex items-center justify-between">
                            <span className="text-white font-serif text-xl tracking-widest uppercase">
                                {content.navigation.logoPrimary}<span className="text-[#B39A74]">{content.navigation.logoAccent}</span>
                            </span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                                <X className="h-8 w-8" strokeWidth={1} />
                            </button>
                        </div>

                        <div className="flex flex-grow flex-col items-center justify-center gap-8">
                            {content.navigation.links.map((link, index) => (
                                <motion.button
                                    key={link.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                                    onClick={() => handleNavigate(link.id)}
                                    className={`text-3xl font-serif uppercase tracking-widest ${
                                        currentPage === link.id ? "text-[#B39A74] italic" : "text-white"
                                    }`}
                                >
                                    {link.label}
                                </motion.button>
                            ))}
                        </div>

                        <div className="mt-auto flex justify-center gap-8 pb-10">
                            {content.navigation.socialLinks.map((social) => {
                                const Icon = getSocialIcon(social.id);
                                return (
                                    <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="text-white/50 hover:text-[#B39A74]">
                                        <Icon className="h-6 w-6" />
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
