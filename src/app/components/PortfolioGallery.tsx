import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const galleryCardVariants = [
    "aspect-[0.82] sm:aspect-[0.94]",
    "aspect-[1.12] sm:aspect-[1.02]",
    "aspect-[0.94] sm:aspect-[1.14]",
    "aspect-[1.08] sm:aspect-[0.9]",
    "aspect-[0.78] sm:aspect-[1.06]",
    "aspect-[1.16] sm:aspect-[1.1]",
];

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

            <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-5 md:px-10">
                <div className="mb-10 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4 text-[0.62rem] uppercase tracking-[0.34em] text-[#B39A74]/90">
                            {filteredItems.length} фото
                        </motion.p>
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.9rem, 15vw, 6.5rem)", lineHeight: 0.95, fontWeight: 500, letterSpacing: "-0.02em" }}>
                            {section.titleLine1} <br />
                            <span className="text-[#B39A74] italic">{section.titleAccent}</span>
                        </motion.h2>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 pt-1 md:mx-0 md:gap-4 md:px-0 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setSelectedImage(null);
                                }}
                                className={`whitespace-nowrap rounded-full border px-4 py-3 text-[0.58rem] uppercase tracking-[0.28em] transition-all md:text-[0.62rem] ${
                                    selectedCategory === category
                                        ? "border-[#B39A74]/60 bg-[#B39A74]/10 text-[#F0DEBF]"
                                        : "border-white/10 bg-white/[0.02] text-white/45 hover:border-white/20 hover:text-white"
                                }`}
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id || `${item.title}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ delay: index * 0.1, duration: 0.7 }}
                            onClick={() => setSelectedImage(index)}
                            className={`group relative cursor-pointer overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_rgba(0,0,0,0.22)] ${galleryCardVariants[index % galleryCardVariants.length]}`}
                        >
                            <ImageWithFallback src={item.imageUrl} alt={item.altText || item.title} className="h-full w-full object-cover opacity-90 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04] group-hover:opacity-100 md:opacity-75" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-100 transition-opacity duration-500 md:opacity-80 md:group-hover:opacity-100" />
                            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 flex translate-y-0 flex-col justify-end p-3 transition-all duration-500 md:p-5 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                                <div className="rounded-[1.1rem] border border-white/10 bg-black/40 px-3 py-3 backdrop-blur-md md:px-4">
                                    <p className="mb-2 text-[#D3BB97]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase" }}>
                                        {item.category}
                                    </p>
                                    <p className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.15rem, 4vw, 1.8rem)", fontWeight: 400, lineHeight: 1.02 }}>
                                        {item.title}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center text-sm leading-7 text-white/45">
                        Для цієї категорії ще немає фото. Додайте їх у `/admin`, і вони з’являться тут автоматично.
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedImage !== null && filteredItems[selectedImage] && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 p-2 backdrop-blur-sm md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={() => setSelectedImage(null)}>
                        <button className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/50 backdrop-blur-md transition-all hover:bg-white hover:text-black md:right-8 md:top-8" onClick={() => setSelectedImage(null)}>
                            <X className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
                        </button>

                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }} className="relative max-h-[95vh] max-w-full overflow-hidden rounded-[1.5rem] shadow-2xl" onClick={(event) => event.stopPropagation()}>
                            <ImageWithFallback src={filteredItems[selectedImage].imageUrl} alt={filteredItems[selectedImage].altText} className="max-h-[95vh] max-w-full object-contain" />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-4 pb-4 pt-16 md:px-6 md:pb-6">
                                <p className="mb-2 text-[0.55rem] uppercase tracking-[0.34em] text-[#D3BB97]">
                                    {filteredItems[selectedImage].category}
                                </p>
                                <p className="text-2xl text-white md:text-3xl" style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.05 }}>
                                    {filteredItems[selectedImage].title}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
