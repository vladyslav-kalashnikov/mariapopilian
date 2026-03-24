import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X, Instagram, Facebook, MapPin } from "lucide-react";

const links = [
    { id: "home", label: "Home" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "press", label: "Press & Media" },
    { id: "contact", label: "Contact" },
];

export function Navigation({ currentPage, setCurrentPage }: { currentPage: string, setCurrentPage: (page: string) => void }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Додаємо ефект фону при скролі
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
                    isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                    {/* Логотип */}
                    <button
                        onClick={() => handleNavigate("home")}
                        className="text-white font-serif text-xl tracking-widest uppercase"
                    >
                        M<span className="text-[#B39A74]">P</span>
                    </button>

                    {/* Десктопне меню */}
                    <nav className="hidden md:flex items-center gap-10">
                        {links.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavigate(link.id)}
                                className={`text-[0.65rem] font-medium tracking-[0.3em] transition-colors hover:text-[#B39A74] uppercase ${
                                    currentPage === link.id ? "text-[#B39A74] border-b border-[#B39A74] pb-1" : "text-white/70"
                                }`}
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-6">
                        <a href="#" className="text-white/60 transition hover:text-[#B39A74]"><Instagram className="h-4 w-4" /></a>
                    </div>

                    {/* Кнопка мобільного меню */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            {/* Люксове повноекранне мобільне меню */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed inset-0 z-[100] flex flex-col bg-[#050505] px-6 py-8"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <span className="text-white font-serif text-xl tracking-widest uppercase">M<span className="text-[#B39A74]">P</span></span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                                <X className="h-8 w-8" strokeWidth={1} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-8 items-center justify-center flex-grow">
                            {links.map((link, i) => (
                                <motion.button
                                    key={link.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                                    onClick={() => handleNavigate(link.id)}
                                    className={`text-3xl font-serif uppercase tracking-widest ${
                                        currentPage === link.id ? "text-[#B39A74] italic" : "text-white"
                                    }`}
                                >
                                    {link.label}
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex justify-center gap-8 mt-auto pb-10">
                            <a href="#" className="text-white/50 hover:text-[#B39A74]"><Instagram className="h-6 w-6" /></a>
                            <a href="#" className="text-white/50 hover:text-[#B39A74]"><Facebook className="h-6 w-6" /></a>
                            <a href="#" className="text-white/50 hover:text-[#B39A74]"><MapPin className="h-6 w-6" /></a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}