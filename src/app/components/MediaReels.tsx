import { motion } from "motion/react";
import { Play } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function MediaReels() {
    const { content } = useSiteContent();
    const section = content.reels;

    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-[#050505] py-20 md:py-32">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute left-[-15%] top-[30%] h-[300px] w-[300px] rounded-full bg-[#b39a74]/[0.06] blur-3xl md:h-[500px] md:w-[500px]" />
            </div>

            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-screen">
                <svg className="h-full w-full">
                    <filter id="noiseReelsLuxury">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseReelsLuxury)" />
                </svg>
            </div>

            <div className="relative z-10 mx-auto max-w-[1440px]">
                <div className="mb-10 flex flex-col gap-6 px-4 sm:px-5 md:mb-16 md:flex-row md:items-end md:justify-between md:px-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-3xl">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="h-px w-10 bg-[#B39A74] md:w-14" />
                            <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.38em", textTransform: "uppercase" }}>
                                {section.eyebrow}
                            </p>
                        </div>
                        <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 14vw, 6rem)", lineHeight: 0.96, fontWeight: 500, letterSpacing: "-0.02em" }}>
                            {section.titleLine1} <br />
                            <span className="text-[#B39A74] italic">{section.titleAccent}</span>
                        </h2>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="md:mb-3">
                        <a href={section.moreUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-4 py-3 text-[0.6rem] uppercase tracking-[0.28em] text-white/55 transition-all hover:border-[#B39A74]/40 hover:text-[#F0DEBF]">
                            <span>{section.moreLabel}</span>
                            <div className="h-px w-8 bg-white/20 transition-all duration-300 group-hover:w-12 group-hover:bg-[#B39A74]" />
                        </a>
                    </motion.div>
                </div>

                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-6 pt-1 sm:px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-4 md:px-10 md:pb-0 xl:grid-cols-3">
                    {section.items.map((reel, index) => (
                        <motion.div key={reel.id || `${reel.title}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: index * 0.1 }} className="group relative aspect-[9/16] w-[74vw] min-w-[74vw] max-w-[320px] shrink-0 snap-start cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0a0a0a] shadow-[0_32px_80px_rgba(0,0,0,0.24)] sm:w-[48vw] sm:min-w-[48vw] md:w-auto md:min-w-0 md:max-w-none">
                            <ImageWithFallback src={reel.imageUrl} alt={reel.altText || reel.title} className="h-full w-full object-cover opacity-75 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04] group-hover:opacity-90 md:opacity-65" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/20 md:via-black/10 md:to-transparent" />
                            <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-[0.56rem] uppercase tracking-[0.25em] text-[#E0C9A6] backdrop-blur-md">
                                {reel.duration}
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-[#B39A74]/50 group-hover:bg-[#B39A74]/20 group-hover:text-white md:h-20 md:w-20">
                                    <Play className="ml-1 h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} fill="currentColor" />
                                </div>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 translate-y-0 p-3 transition-transform duration-500 md:translate-y-2 md:p-5 md:group-hover:translate-y-0">
                                <div className="rounded-[1.15rem] border border-white/10 bg-black/40 px-4 py-4 backdrop-blur-md">
                                    <h3 className="pr-4 text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.35rem, 5vw, 2.15rem)", lineHeight: 1.05, fontWeight: 400 }}>
                                        {reel.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <p className="mt-4 px-4 text-center text-[0.62rem] uppercase tracking-[0.3em] text-white/30 sm:px-5 md:hidden">
                    Гортай вліво, щоб побачити більше reels
                </p>
            </div>
        </section>
    );
}
