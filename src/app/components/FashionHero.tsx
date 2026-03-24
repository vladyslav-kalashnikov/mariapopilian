import { motion } from "motion/react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function FashionHero({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
    const { content, photos } = useSiteContent();
    const heroPhoto = photos["home.hero"];
    const section = content.hero;

    return (
        <section className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
            <motion.div
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 4, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0"
            >
                <ImageWithFallback src={heroPhoto.imageUrl} alt={heroPhoto.altText} className="h-full w-full object-cover object-center opacity-75" />
            </motion.div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/90" />
            <div className="pointer-events-none absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/60" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay">
                <svg className="h-full w-full">
                    <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" /></filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
            </div>

            <div className="relative z-20 flex h-full items-center justify-center px-6">
                <div className="mt-10 flex w-full max-w-5xl flex-col items-center text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }} className="mb-8 overflow-hidden rounded-full border border-[#B39A74]/30 bg-[#B39A74]/5 px-6 py-2 backdrop-blur-sm">
                        <p className="font-['Inter'] text-[0.65rem] font-medium uppercase tracking-[0.4em] text-[#B39A74]">{section.badge}</p>
                    </motion.div>

                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="overflow-hidden pb-2">
                            <motion.h1 initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, ease: [0.2, 0.65, 0.3, 1], delay: 0.1 }} className="font-serif text-[clamp(4.5rem,12vw,9rem)] font-normal leading-[0.85] tracking-[-0.03em] text-white">
                                {section.firstName}
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden pb-4">
                            <motion.h1 initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, ease: [0.2, 0.65, 0.3, 1], delay: 0.25 }} className="font-serif text-[clamp(4.5rem,12vw,9rem)] font-normal leading-[0.85] tracking-[-0.03em] text-white">
                                {section.lastName}
                            </motion.h1>
                        </div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="mt-8 flex flex-wrap items-center justify-center gap-4 font-['Inter'] text-[0.7rem] font-normal tracking-[0.3em] text-white/50">
                        {section.roles.map((role, index) => (
                            <div key={`${role}-${index}`} className="flex items-center gap-4">
                                {index > 0 && <span className="text-[#B39A74]">•</span>}
                                <span>{role}</span>
                            </div>
                        ))}
                    </motion.div>

                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }} onClick={() => setCurrentPage("portfolio")} className="group mt-16 flex flex-col items-center gap-4">
                        <span className="font-['Inter'] text-[0.65rem] tracking-[0.3em] text-white/50 transition-colors group-hover:text-[#B39A74]">{section.ctaLabel}</span>
                        <div className="h-12 w-[1px] overflow-hidden bg-white/20">
                            <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="h-full w-full bg-[#B39A74]" />
                        </div>
                    </motion.button>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.35 }} className="absolute bottom-7 left-6 right-6 z-20 mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
                {section.highlights.map((item, index) => (
                    <div key={`${item.label}-${index}`} className="border border-white/10 bg-black/25 px-5 py-4 text-left backdrop-blur-md">
                        <p className="text-[0.58rem] uppercase tracking-[0.28em] text-[#B39A74]">{item.label}</p>
                        <p className="mt-3 text-sm leading-6 text-white/65">{item.value}</p>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
