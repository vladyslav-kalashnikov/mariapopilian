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

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col px-5 md:mb-20 md:flex-row md:items-end md:justify-between md:px-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <div className="mb-6 flex items-center gap-4">
                            <div className="h-px w-10 bg-[#B39A74] md:w-14" />
                            <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.38em", textTransform: "uppercase" }}>
                                {section.eyebrow}
                            </p>
                        </div>
                        <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 0.96, fontWeight: 500, letterSpacing: "-0.02em" }}>
                            {section.titleLine1} <br />
                            <span className="text-[#B39A74] italic">{section.titleAccent}</span>
                        </h2>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-8 md:mt-0">
                        <a href={section.moreUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-white/50 transition-all hover:text-[#B39A74]">
                            <span>{section.moreLabel}</span>
                            <div className="h-px w-8 bg-white/20 transition-all duration-300 group-hover:w-12 group-hover:bg-[#B39A74]" />
                        </a>
                    </motion.div>
                </div>

                <div className="flex snap-x snap-mandatory overflow-x-auto px-5 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-3 md:px-10 md:pb-0">
                    {section.items.map((reel, index) => (
                        <motion.div key={reel.id || `${reel.title}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: index * 0.1 }} className="group relative mr-4 aspect-[9/16] w-[85vw] min-w-[85vw] shrink-0 snap-center cursor-pointer overflow-hidden bg-[#0a0a0a] md:mr-0 md:w-auto md:min-w-0">
                            <ImageWithFallback src={reel.imageUrl} alt={reel.altText || reel.title} className="h-full w-full object-cover opacity-70 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-90 md:opacity-60" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/20 md:via-black/10 md:to-transparent" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-[#B39A74]/50 group-hover:bg-[#B39A74]/20 group-hover:text-white md:h-20 md:w-20">
                                    <Play className="ml-1 h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} fill="currentColor" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 flex translate-y-0 items-end justify-between p-6 transition-transform duration-500 md:translate-y-2 md:p-8 md:group-hover:translate-y-0">
                                <h3 className="pr-4 text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.1, fontWeight: 400 }}>
                                    {reel.title}
                                </h3>
                                <span className="mb-1 shrink-0 text-[#B39A74] md:mb-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.2em" }}>
                                    {reel.duration}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-4 flex justify-center gap-2 md:hidden">
                    {section.items.map((item, index) => (
                        <div key={item.id || index} className={`h-1 rounded-full bg-[#B39A74] ${index === 0 ? "w-6 opacity-100" : "w-1.5 opacity-30"}`} />
                    ))}
                </div>
            </div>
        </section>
    );
}
