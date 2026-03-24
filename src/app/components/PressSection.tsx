import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";

export function PressSection() {
    const { content } = useSiteContent();
    const section = content.press;

    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-[#050505] px-5 py-24 md:px-6 md:py-32">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute right-[-10%] top-[30%] h-[300px] w-[300px] rounded-full bg-[#b39a74]/[0.04] blur-3xl md:h-[500px] md:w-[500px]" />
            </div>

            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-screen">
                <svg className="h-full w-full">
                    <filter id="noisePress">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noisePress)" />
                </svg>
            </div>

            <motion.div
                initial={{ x: "-5%" }}
                animate={{ x: "-15%" }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="pointer-events-none absolute left-0 top-32 z-0 select-none whitespace-nowrap text-white/[0.02]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(6rem, 20vw, 18vw)", lineHeight: 0.8, fontWeight: 700 }}
            >
                {section.watermark}
            </motion.div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-16 flex flex-col items-start md:mb-24">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <div className="mb-6 flex items-center gap-4">
                            <div className="h-px w-8 bg-[#B39A74] md:w-12" />
                            <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.35em", textTransform: "uppercase" }}>
                                {section.eyebrow}
                            </p>
                        </div>

                        <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 8vw, 5.5rem)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.02em" }}>
                            {section.titleLine1} <span className="text-[#B39A74] italic">{section.titleAccent}</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="flex flex-col border-t border-white/10">
                    {section.items.map((item, index) => (
                        <motion.a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={`${item.year}-${item.magazine}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative flex flex-col items-start justify-between border-b border-white/10 py-10 transition-colors duration-500 hover:border-[#B39A74] md:flex-row md:items-center md:py-12"
                        >
                            <div className="pointer-events-none absolute inset-0 z-[-1] bg-[linear-gradient(90deg,rgba(179,154,116,0.05),transparent_35%,transparent_65%,rgba(179,154,116,0.03))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="flex w-full flex-col gap-4 md:w-1/3 md:flex-row md:items-center md:gap-12">
                                <span className="font-serif text-xl text-white/30 transition-colors duration-500 group-hover:text-[#B39A74] md:text-2xl">{item.year}</span>
                                <h3 className="font-serif text-2xl tracking-wide text-white transition-colors duration-500 group-hover:text-[#f1e6d6] md:text-4xl">{item.magazine}</h3>
                            </div>

                            <div className="mt-6 flex w-full flex-col md:mt-0 md:w-5/12">
                                <p className="text-sm font-light leading-relaxed text-white/50 transition-colors duration-500 group-hover:text-white/80 md:text-base">{item.title}</p>
                            </div>

                            <div className="mt-6 flex w-full items-center justify-between md:mt-0 md:w-2/12 md:justify-end">
                                <span className="rounded-full border border-[#B39A74]/30 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-[#B39A74] transition-colors duration-500 group-hover:border-[#B39A74] group-hover:bg-[#B39A74]/10">
                                    {item.category}
                                </span>
                                <div className="ml-4 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-500 group-hover:border-[#B39A74] group-hover:bg-[#B39A74] group-hover:text-black md:flex">
                                    <ArrowUpRight className="h-4 w-4" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
