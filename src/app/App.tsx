import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

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
import { isAdminPath, isKnownPath, normalizePageId, pageToPath, pathnameToPage, valueSlugFromPath, type PublicPageId } from "./lib/routes";
import { useSeo } from "./lib/useSeo";
import seo from "@/content/seo.json";
import { ValuePage } from "./site/ValuePage";

// Адмінка важка (~1000 рядків редактора) — окремий чанк, відвідувачам сайту не потрібна
const AdminPage = lazy(() => import("./admin/AdminPage").then((module) => ({ default: module.AdminPage })));

function NotFound({ onNavigate }: { onNavigate: (page: string) => void }) {
    useSeo({ ...seo.pages.notFound, path: "/404", noindex: true });
    return (
        <section className="mx-auto flex min-h-[70svh] max-w-[1440px] flex-col justify-center px-5 pb-24 pt-36 md:px-10">
            <p className="eyebrow text-gold">404</p>
            <h1 className="display mt-6 text-ink" style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}>
                Сторінку <em className="italic text-gold">не знайдено</em>
            </h1>
            <a
                href="/"
                onClick={(event) => {
                    event.preventDefault();
                    onNavigate("home");
                }}
                className="eyebrow mt-12 inline-flex w-fit rounded-full bg-gold px-8 py-5 text-night transition-colors duration-300 hover:bg-gold-soft"
            >
                На головну
            </a>
        </section>
    );
}

/** SEO статичних сторінок (заголовок, опис, canonical, OG) */
function PageSeo({ page }: { page: PublicPageId }) {
    useSeo({ ...seo.pages[page], path: pageToPath(page) });
    return null;
}

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

    const valueSlug = valueSlugFromPath(pathname);

    const renderPage = () => {
        if (valueSlug) {
            return <ValuePage slug={valueSlug} onNavigate={setCurrentPage} />;
        }
        if (!isKnownPath(pathname)) {
            return <NotFound onNavigate={setCurrentPage} />;
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
                        {!valueSlug && isKnownPath(pathname) && <PageSeo page={currentPage} />}
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
                <Suspense fallback={null}>
                    <AdminPage onClose={() => navigateTo(pageToPath("home"))} />
                </Suspense>
            </SiteContentProvider>
        );
    }

    return (
        <SiteContentProvider>
            <PublicSiteShell pathname={pathname} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </SiteContentProvider>
    );
}
