import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

import { AdminPage } from "./admin/AdminPage";
import { SiteContentProvider, useSiteContent } from "./content/SiteContentProvider";
import { LuxuryBackdrop } from "./components/LuxuryBackdrop";
import { SiteNav } from "./site/SiteNav";
import { Hero, Marquee } from "./site/Hero";
import { AboutIntro, ContactCta, FeaturedWork, QuoteBand, Services } from "./site/HomeSections";
import { Charity, Timeline, Values } from "./site/AboutSections";
import { PortfolioGrid, Reels } from "./site/PortfolioSections";
import { ContactPage, Journal, PressList, SiteFooter } from "./site/MediaContact";
import { PageHeader } from "./site/primitives";
import { hasMediaContent } from "./site/navLinks";
import { isAdminPath, normalizePageId, pageToPath, pathnameToPage, valueSlugFromPath, type PublicPageId } from "./lib/routes";
import { ValuePage } from "./site/ValuePage";

const pageTitles: Record<PublicPageId, string> = {
    home: "Марія Попілян — модель, хореограф, Красуня України 2026",
    about: "Про Марію — Марія Попілян",
    portfolio: "Портфоліо — Марія Попілян",
    press: "Щоденник — Марія Попілян",
    contact: "Контакти та співпраця — Марія Попілян",
};

function PublicSiteShell({
    pathname,
    currentPage,
    setCurrentPage,
}: {
    pathname: string;
    currentPage: PublicPageId;
    setCurrentPage: (page: string) => void;
}) {
    const { content } = useSiteContent();

    useEffect(() => {
        if (!valueSlugFromPath(pathname)) document.title = pageTitles[currentPage];
    }, [currentPage, pathname]);

    const valueSlug = valueSlugFromPath(pathname);

    const renderPage = () => {
        if (valueSlug) {
            return <ValuePage slug={valueSlug} onNavigate={setCurrentPage} />;
        }
        switch (currentPage) {
            case "about":
                return (
                    <>
                        <PageHeader eyebrow={content.about.eyebrow} line="Про" accent="Марію" />
                        <AboutIntro compact />
                        <Values onNavigate={setCurrentPage} />
                        <Timeline />
                        <Charity onNavigate={setCurrentPage} />
                        <ContactCta onNavigate={setCurrentPage} />
                    </>
                );
            case "portfolio":
                return (
                    <>
                        <PageHeader eyebrow="Портфоліо" line={content.portfolio.titleLine1} accent={content.portfolio.titleAccent} />
                        <PortfolioGrid />
                        <Reels />
                        <ContactCta onNavigate={setCurrentPage} />
                    </>
                );
            case "press":
                return (
                    <>
                        <PageHeader eyebrow={content.press.eyebrow} line={content.press.titleLine1} accent={content.press.titleAccent} />
                        {hasMediaContent(content) ? (
                            <>
                                <PressList />
                                <Journal />
                            </>
                        ) : (
                            <p className="mx-auto max-w-[1440px] px-5 pb-36 text-lg text-stone md:px-10">Публікації з'являться тут найближчим часом.</p>
                        )}
                        <ContactCta onNavigate={setCurrentPage} />
                    </>
                );
            case "contact":
                return <ContactPage />;
            default:
                return (
                    <>
                        <Hero onNavigate={setCurrentPage} />
                        <Marquee items={[content.hero.badge, ...content.hero.roles]} />
                        <AboutIntro onNavigate={setCurrentPage} />
                        <FeaturedWork onNavigate={setCurrentPage} />
                        <Services />
                        <QuoteBand />
                        <ContactCta onNavigate={setCurrentPage} />
                    </>
                );
        }
    };

    return (
        <MotionConfig reducedMotion="user">
            <div className="relative min-h-screen overflow-x-clip font-sans text-ink antialiased selection:bg-gold selection:text-night">
                <style>{`html, body { scroll-behavior: smooth; background: #050505; }
                    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #000; } ::-webkit-scrollbar-thumb { background: #B39A74; }`}</style>
                {/* Золоті світіння на чорному — фон з оригінального дизайну */}
                <LuxuryBackdrop />

                <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-night">
                    До змісту
                </a>

                <SiteNav currentPage={currentPage} onNavigate={setCurrentPage} />

                <AnimatePresence mode="wait">
                    <motion.main
                        id="main"
                        key={pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                        {renderPage()}
                    </motion.main>
                </AnimatePresence>

                <SiteFooter onNavigate={setCurrentPage} />
            </div>
        </MotionConfig>
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

    // Приймає id сторінки ("about") або готовий шлях ("/values/vpevnenist")
    const setCurrentPage = (page: string) => {
        navigateTo(page.startsWith("/") ? page : pageToPath(normalizePageId(page)));
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
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
            <PublicSiteShell pathname={pathname} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </SiteContentProvider>
    );
}
