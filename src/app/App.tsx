import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { AdminPage } from "./admin/AdminPage";
import { SiteContentProvider, useSiteContent } from "./content/SiteContentProvider";
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

function PublicSiteShell({
    pathname,
    currentPage,
    setCurrentPage,
    navigateTo,
}: {
    pathname: string;
    currentPage: string;
    setCurrentPage: (page: string) => void;
    navigateTo: (path: string) => void;
}) {
    const { content } = useSiteContent();

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
                    <div className="min-h-screen bg-[#050505] pt-24">
                        <ContactSection />
                    </div>
                );
            default:
                return <FashionHero setCurrentPage={setCurrentPage} />;
        }
    };

    return (
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
                    <p className="font-['Inter'] text-[0.6rem] uppercase tracking-[0.25em] text-white/30">
                        {content.footer.copyright} •{" "}
                        <button onClick={() => setCurrentPage("contact")} className="hover:text-[#B39A74]">
                            {content.footer.ctaLabel}
                        </button>{" "}
                        •{" "}
                        <button onClick={() => navigateTo("/admin")} className="hover:text-[#B39A74]">
                            {content.footer.cmsLabel}
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
}

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
            <PublicSiteShell
                pathname={pathname}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                navigateTo={navigateTo}
            />
        </SiteContentProvider>
    );
}
