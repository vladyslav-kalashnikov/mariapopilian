import { motion } from "motion/react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function ProfessionalAbout() {
    const { content, photos } = useSiteContent();
    const section = content.about;
    const aboutPhoto = photos["about.identity"];

    return (
        <section id="about" className="relative overflow-hidden bg-black px-5 pb-24 pt-16 md:pb-32 md:pt-24">
            <div className="absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay pointer-events-none">
                <svg className="h-full w-full">
                    <filter id="noiseAbout">
                        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseAbout)" />
                </svg>
            </div>

            <motion.div
                initial={{ x: "-5%" }}
                animate={{ x: "-15%" }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="absolute left-0 top-10 z-0 select-none whitespace-nowrap text-white/[0.02] pointer-events-none"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "22vw", lineHeight: 0.8, fontWeight: 700 }}
            >
                {section.watermark}
            </motion.div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="grid items-center gap-12 md:grid-cols-12">
                    <div className="space-y-10 md:col-span-5">
                        <div>
                            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="mb-8 flex items-center gap-4">
                                <div className="h-px w-12 bg-[#B39A74]" />
                                <p className="text-[#B39A74] text-[0.65rem] font-medium uppercase tracking-[0.4em]">{section.eyebrow}</p>
                            </motion.div>

                            <div className="mb-10 flex flex-col gap-1">
                                {section.headlineLines.map((word, index) => (
                                    <div key={`${word}-${index}`} className="overflow-hidden pb-2">
                                        <motion.h2 initial={{ y: "110%" }} whileInView={{ y: "0%" }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 1, ease: [0.2, 0.65, 0.3, 1], delay: index * 0.15 }} className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 5vw, 4.5rem)", lineHeight: 1 }}>
                                            {word}
                                        </motion.h2>
                                    </div>
                                ))}
                            </div>

                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} className="space-y-6 text-white/50 font-light" style={{ fontSize: "0.95rem", lineHeight: 1.9 }}>
                                {section.paragraphs.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    <div className="relative mt-10 md:col-span-7 md:mt-0">
                        <motion.div initial={{ scale: 1.25, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.9 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }} className="relative aspect-[3/4] overflow-hidden bg-[#111] md:aspect-[4/5]">
                            <ImageWithFallback src={aboutPhoto.imageUrl} alt={aboutPhoto.altText} className="h-full w-full object-cover grayscale-[15%]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.6 }} className="absolute -bottom-6 -left-6 flex gap-8 border border-[#B39A74]/20 bg-black/40 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md md:-left-12 md:gap-12 md:p-10">
                            {section.stats.map((item, index) => (
                                <div key={`${item.value}-${item.label}`} className="text-center">
                                    <motion.p initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }} className="mb-2 font-serif text-3xl text-[#B39A74] md:text-5xl">
                                        {item.value}
                                    </motion.p>
                                    <p className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40">{item.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
