import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { AdminPage } from "./admin/AdminPage";
import { SiteContentProvider } from "./content/SiteContentProvider";
import { Navigation } from "./components/Navigation";
import { LuxuryBackdrop } from "./components/LuxuryBackdrop";
import { FashionHero } from "./components/FashionHero";
import { ProfessionalAbout } from "./components/ProfessionalAbout";
import { ServicesSection } from "./components/ServicesSection";
import { CareerTimeline } from "./components/CareerTimeline";
import { PressSection } from "./components/PressSection";
import { PortfolioGallery } from "./components/PortfolioGallery";
import { MediaReels } from "./components/MediaReels";
import { JournalSection } from "./components/JournalSection";
import { CharitySection } from "./components/CharitySection";
import { PersonalBrand } from "./components/PersonalBrand";
import { ContactSection } from "./components/ContactSection";
import { isAdminPath, normalizePageId, pageToPath, pathnameToPage } from "./lib/routes";

export default function App() {
    const [pathname, setPathname] = useState(() => window.location.pathname);

    useEffect(() => {
        const handlePopState = () => setPathname(window.location.pathname);
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const adminMode = isAdminPath(pathname);
    const currentPage = pathnameToPage(pathname);

    const navigateTo = (nextPath: string) => {
        if (window.location.pathname !== nextPath) {
            window.history.pushState({}, "", nextPath);
            setPathname(nextPath);
        }
    };

    const setCurrentPage = (page: string) => {
        navigateTo(pageToPath(normalizePageId(page)));
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return (
                    <>
                        <FashionHero setCurrentPage={setCurrentPage} />
                        <ProfessionalAbout />
                        <ServicesSection />
                    </>
                );
            case "about":
                return (
                    <div className="pt-24">
                        <ProfessionalAbout />
                        <PersonalBrand />
                        <CareerTimeline />
                        <CharitySection />
                    </div>
                );
            case "portfolio":
                return (
                    <div className="pt-24">
                        <PortfolioGallery />
                        <MediaReels />
                    </div>
                );
            case "press":
                return (
                    <div className="pt-24">
                        <PressSection />
                        <JournalSection />
                    </div>
                );
            case "contact":
                return (
                    <div className="pt-24 min-h-screen bg-[#050505]">
                        <ContactSection />
                    </div>
                );
            default:
                return <FashionHero setCurrentPage={setCurrentPage} />;
        }
    };

    if (adminMode) {
        return (
            <SiteContentProvider>
                <LuxuryBackdrop />
                <AdminPage onClose={() => navigateTo(pageToPath("home"))} />
            </SiteContentProvider>
        );
    }

    return (
        <SiteContentProvider>
            <div className="relative overflow-x-hidden bg-black text-white selection:bg-[#B39A74] selection:text-black">
                <LuxuryBackdrop />

                <style>{`
                    html { scroll-behavior: smooth; background: black; }
                    body { background: black; -webkit-font-smoothing: antialiased; }
                    ::-webkit-scrollbar { width: 4px; }
                    ::-webkit-scrollbar-track { background: #000; }
                    ::-webkit-scrollbar-thumb { background: #B39A74; }
                `}</style>

                <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        {renderPage()}
                    </motion.div>
                </AnimatePresence>

                {currentPage !== "contact" && (
                    <div className="border-t border-white/5 bg-black/35 py-10 text-center backdrop-blur-sm">
                        <p className="text-white/30 text-[0.6rem] tracking-[0.25em] uppercase font-['Inter']">
                            © 2026 MARIA POPILIAN •{" "}
                            <button onClick={() => setCurrentPage("contact")} className="hover:text-[#B39A74]">
                                WORK WITH ME
                            </button>{" "}
                            •{" "}
                            <button onClick={() => navigateTo("/admin")} className="hover:text-[#B39A74]">
                                CMS
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </SiteContentProvider>
    );
}
