import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";

export function CareerTimeline() {
    const { content } = useSiteContent();
    const section = content.careerTimeline;
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-[#050505] px-5 py-20 md:px-6 md:py-32">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute left-[-20%] top-[5%] h-[300px] w-[300px] rounded-full bg-[#b39a74]/[0.08] blur-3xl md:h-[420px] md:w-[420px]" />
                <div className="absolute bottom-[-10%] right-[-20%] h-[250px] w-[250px] rounded-full bg-white/[0.04] blur-3xl md:h-[360px] md:w-[360px]" />
            </div>

            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-screen">
                <svg className="h-full w-full">
                    <filter id="noiseTimelineLuxury">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseTimelineLuxury)" />
                </svg>
            </div>

            <motion.div
                initial={{ x: "3%" }}
                animate={{ x: "-4%" }}
                transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="pointer-events-none absolute right-[-8%] top-16 z-0 select-none whitespace-nowrap text-white/[0.03] md:top-24"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(6rem, 22vw, 19vw)", lineHeight: 0.8, fontWeight: 700, letterSpacing: "-0.04em" }}
            >
                {section.watermark}
            </motion.div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-16 flex flex-col gap-10 md:mb-24 md:grid md:grid-cols-12 md:items-end md:gap-12">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="md:col-span-7">
                        <div className="mb-6 flex items-center gap-4 md:mb-8">
                            <div className="h-px w-10 bg-[#B39A74] md:w-14" />
                            <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.38em", textTransform: "uppercase" }}>
                                {section.eyebrow}
                            </p>
                        </div>
                        <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 12vw, 6.8rem)", lineHeight: 0.96, fontWeight: 600, letterSpacing: "-0.04em" }}>
                            {section.titleLine1}<br /><span className="text-[#B39A74] italic">{section.titleAccent}</span>
                        </h2>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }} className="border-l border-white/10 pl-5 md:col-span-5 md:pl-10">
                        <p className="mb-8 max-w-md text-white/60 md:mb-10 md:text-white/50" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.8 }}>
                            {section.description}
                        </p>
                        <div className="flex gap-10 md:grid md:grid-cols-2 md:gap-8">
                            {section.highlights.map((item) => (
                                <div key={`${item.value}-${item.label}`}>
                                    <p className="mb-1 text-white md:mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.3rem", fontWeight: 600 }}>{item.value}</p>
                                    <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase" }}>{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="relative">
                    <div className="absolute left-0 right-0 top-0 h-px bg-white/10" />

                    {section.achievements.map((item, index) => {
                        const isExpanded = expandedIndex === index;

                        return (
                            <motion.div
                                key={`${item.year}-${item.title}-${index}`}
                                initial={{ opacity: 0, y: 26 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: index * 0.08 }}
                                className="group relative cursor-pointer"
                                onClick={() => toggleExpand(index)}
                            >
                                <div className={`absolute left-0 right-0 top-0 h-px transition-colors duration-500 ${isExpanded ? "bg-[#B39A74]" : "bg-white/10 group-hover:bg-[#B39A74]/50"}`} />

                                <div className="flex flex-col py-10 md:grid md:grid-cols-12 md:items-center md:gap-10 md:py-12">
                                    <div className="flex items-center justify-between md:col-span-3 md:block">
                                        <div className="relative inline-block">
                                            <span
                                                className={`block transition-all duration-700 ${isExpanded ? "translate-x-2 text-[#B39A74]" : "text-white/30 md:text-white/10 md:group-hover:translate-x-2 md:group-hover:text-[#B39A74]"}`}
                                                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.8rem, 12vw, 5.6rem)", lineHeight: 0.9, fontWeight: 600, letterSpacing: "-0.04em" }}
                                            >
                                                {item.year}
                                            </span>
                                        </div>
                                        <div className="text-white/40 md:hidden">
                                            {isExpanded ? <Minus className="h-8 w-8 text-[#B39A74]" strokeWidth={1} /> : <Plus className="h-8 w-8" strokeWidth={1} />}
                                        </div>
                                    </div>

                                    <div className="mt-4 md:col-span-4 md:mt-0">
                                        <h3 className={`transition-colors duration-500 ${isExpanded ? "text-[#f1e6d6]" : "text-white md:group-hover:text-[#f1e6d6]"}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 6vw, 2.5rem)", lineHeight: 1.08, fontWeight: 500, letterSpacing: "-0.02em" }}>
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="mt-2 md:col-span-4 md:mt-0">
                                        <p className={`max-w-xl transition-colors duration-500 ${isExpanded ? "text-white/80" : "text-white/60 md:text-white/40 md:group-hover:text-white/70"}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.8 }}>
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="hidden items-center justify-end text-white/30 transition-colors duration-500 group-hover:text-[#B39A74] md:col-span-1 md:flex">
                                        {isExpanded ? <Minus className="h-8 w-8 text-[#B39A74]" strokeWidth={1} /> : <Plus className="h-8 w-8" strokeWidth={1} />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-10 pt-2 md:grid md:grid-cols-12 md:gap-10 md:pb-12 md:pt-0">
                                                <div className="border-l border-[#B39A74]/40 pl-5 md:col-start-4 md:col-span-8 md:pl-8">
                                                    <p className="text-white/80" style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.9 }}>
                                                        {item.details}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className={`pointer-events-none absolute inset-0 z-[-1] hidden bg-[linear-gradient(90deg,rgba(179,154,116,0.05),transparent_35%,transparent_65%,rgba(179,154,116,0.03))] transition-opacity duration-500 md:block ${isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                            </motion.div>
                        );
                    })}

                    <div className="h-px bg-white/10" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.85, delay: 0.2 }}
                    className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-10 md:mt-20 md:grid md:grid-cols-12 md:items-end md:gap-8 md:pt-12"
                >
                    <div className="md:col-span-7">
                        <p className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 6vw, 2.7rem)", fontStyle: "italic", fontWeight: 500, lineHeight: 1.4 }}>
                            "{section.quote}"
                        </p>
                    </div>

                    <div className="md:col-span-5 md:pl-10">
                        <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase" }}>
                            {section.quoteAuthor}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
