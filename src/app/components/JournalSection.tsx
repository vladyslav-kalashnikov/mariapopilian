import { motion } from "motion/react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function JournalSection() {
    const { photos } = useSiteContent();
    const articles = [
        { photo: photos["press.journal.1"], date: "12 Березня, 2026", title: "Секрети ідеального позування: як знайти свої ракурси" },
        { photo: photos["press.journal.2"], date: "05 Березня, 2026", title: "Щоденник підготовки до конкурсу Красуня України" },
        { photo: photos["press.journal.3"], date: "28 Лютого, 2026", title: "За лаштунками Ukrainian Fashion Week 2026" },
    ];

    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-[#030303] px-5 py-24 md:px-6 md:py-32">
            <div className="relative z-10 mx-auto max-w-7xl">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
                    <h2 className="text-white font-serif text-[clamp(3.5rem,8vw,5.5rem)] leading-none">
                        The <span className="text-[#B39A74] italic">Journal</span>
                    </h2>
                    <p className="mt-6 text-[#B39A74] text-[0.65rem] font-medium tracking-[0.35em] uppercase">За лаштунками та Інсайди</p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
                    {articles.map((article, index) => (
                        <motion.a
                            href="#"
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="group flex flex-col"
                        >
                            <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-[#111]">
                                <ImageWithFallback
                                    src={article.photo.imageUrl}
                                    alt={article.photo.altText || article.title}
                                    className="h-full w-full object-cover grayscale-[20%] transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                                />
                            </div>
                            <p className="mb-3 text-[#B39A74] text-[0.6rem] tracking-[0.2em] uppercase">{article.date}</p>
                            <h3 className="mb-4 font-serif text-xl text-white transition-colors group-hover:text-[#B39A74] md:text-2xl">{article.title}</h3>
                            <div className="mt-auto flex items-center gap-3">
                                <span className="text-white/50 text-[0.65rem] tracking-[0.2em] uppercase">Читати статтю</span>
                                <div className="h-px w-8 bg-white/20 transition-all duration-300 group-hover:w-16 group-hover:bg-[#B39A74]" />
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
