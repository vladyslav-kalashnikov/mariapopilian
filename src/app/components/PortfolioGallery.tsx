import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function PortfolioGallery() {
    const { content } = useSiteContent();
    const section = content.portfolio;
    const [selectedCategory, setSelectedCategory] = useState("Всі");
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const categories = useMemo(() => ["Всі", ...Array.from(new Set(section.items.map((item) => item.category).filter(Boolean)))], [section.items]);

    const filteredItems = selectedCategory === "Всі"
        ? section.items
        : section.items.filter((item) => item.category === selectedCategory);

    return (
        <section id="portfolio" className="relative overflow-hidden border-t border-white/5 bg-[#050505] py-20 md:py-32">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute right-[-10%] top-[20%] h-[300px] w-[300px] rounded-full bg-[#b39a74]/[0.05] blur-3xl md:h-[500px] md:w-[500px]" />
            </div>

            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-screen">
                <svg className="h-full w-full">
                    <filter id="noisePortfolioLuxury">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noisePortfolioLuxury)" />
                </svg>
            </div>

            <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="mb-12 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 10vw, 6.5rem)", lineHeight: 0.95, fontWeight: 500, letterSpacing: "-0.02em" }}>
                        {section.titleLine1} <br />
                        <span className="text-[#B39A74] italic">{section.titleAccent}</span>
                    </motion.h2>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:gap-8 md:px-0 md:pb-2 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setSelectedImage(null);
                                }}
                                className={`whitespace-nowrap border-b-2 pb-2 text-[0.65rem] uppercase tracking-[0.25em] transition-all md:text-[0.7rem] ${
                                    selectedCategory === category ? "border-[#B39A74] text-[#B39A74]" : "border-transparent text-white/40 hover:text-white"
                                }`}
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-3">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id || `${item.title}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ delay: index * 0.1, duration: 0.7 }}
                            onClick={() => setSelectedImage(index)}
                            className="group relative aspect-[4/5] cursor-pointer overflow-hidden bg-[#0a0a0a]"
                        >
                            <ImageWithFallback src={item.imageUrl} alt={item.altText || item.title} className="h-full w-full object-cover opacity-80 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 group-hover:opacity-100 md:opacity-70" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100" />

                            <div className="absolute inset-0 flex translate-y-0 flex-col justify-end p-6 transition-all duration-500 md:translate-y-4 md:p-8 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                                <p className="mb-3 text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                                    {item.category}
                                </p>
                                <p className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 400, lineHeight: 1.1 }}>
                                    {item.title}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedImage !== null && filteredItems[selectedImage] && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 p-2 backdrop-blur-sm md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={() => setSelectedImage(null)}>
                        <button className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/50 backdrop-blur-md transition-all hover:bg-white hover:text-black md:right-8 md:top-8" onClick={() => setSelectedImage(null)}>
                            <X className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
                        </button>

                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }} className="max-h-[95vh] max-w-full shadow-2xl" onClick={(event) => event.stopPropagation()}>
                            <ImageWithFallback src={filteredItems[selectedImage].imageUrl} alt={filteredItems[selectedImage].altText} className="max-h-[95vh] max-w-full object-contain" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
