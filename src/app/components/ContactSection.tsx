import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";

export function ContactSection() {
    const { content } = useSiteContent();
    const section = content.contact;

    return (
        <section id="contact" className="relative overflow-hidden border-t border-white/5 bg-[#050505] px-5 py-24 md:px-6 md:py-32">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute left-[-10%] top-[40%] h-[300px] w-[300px] rounded-full bg-[#b39a74]/[0.06] blur-3xl md:h-[500px] md:w-[500px]" />
            </div>

            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-screen">
                <svg className="h-full w-full">
                    <filter id="noiseContactLuxury">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseContactLuxury)" />
                </svg>
            </div>

            <motion.div
                initial={{ x: "0%" }}
                animate={{ x: "-10%" }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="pointer-events-none absolute left-0 top-[15%] z-0 select-none whitespace-nowrap text-white/[0.02]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(6rem, 20vw, 18vw)", lineHeight: 0.8, fontWeight: 700, letterSpacing: "-0.04em" }}
            >
                {section.watermark}
            </motion.div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-20 flex flex-col items-center text-center md:mb-32">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center">
                        <div className="mb-6 flex items-center gap-4 md:mb-8">
                            <div className="h-px w-8 bg-[#B39A74] md:w-12" />
                            <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.35em", textTransform: "uppercase" }}>
                                {section.eyebrow}
                            </p>
                            <div className="h-px w-8 bg-[#B39A74] md:w-12" />
                        </div>

                        <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(4.5rem, 12vw, 9rem)", lineHeight: 0.9, fontWeight: 400, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
                            {section.titlePrefix} <span className="text-[#B39A74] italic lowercase">{section.titleAccent}</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="grid gap-16 md:grid-cols-12 md:gap-24">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col gap-12 md:col-span-5 md:gap-16">
                        {section.methods.map((item, index) => (
                            <div key={`${item.label}-${index}`} className="group flex flex-col items-start">
                                <p className="mb-3 text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                                    {item.label}
                                </p>
                                <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} className="relative text-white transition-colors duration-500 group-hover:text-[#f1e6d6]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 400 }}>
                                    {item.value}
                                    <div className="absolute -bottom-1 left-0 h-px w-0 bg-[#B39A74] transition-all duration-500 group-hover:w-full" />
                                </a>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="md:col-span-7">
                        <form className="flex flex-col gap-10">
                            <div className="grid gap-10 md:grid-cols-2">
                                <div className="relative">
                                    <input type="text" placeholder={section.form.namePlaceholder} className="w-full border-b border-white/20 bg-transparent py-4 text-white placeholder:text-white/30 outline-none transition-all duration-500 focus:border-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }} />
                                </div>
                                <div className="relative">
                                    <input type="email" placeholder={section.form.emailPlaceholder} className="w-full border-b border-white/20 bg-transparent py-4 text-white placeholder:text-white/30 outline-none transition-all duration-500 focus:border-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }} />
                                </div>
                            </div>

                            <div className="relative">
                                <textarea rows={4} placeholder={section.form.detailsPlaceholder} className="w-full resize-none border-b border-white/20 bg-transparent py-4 text-white placeholder:text-white/30 outline-none transition-all duration-500 focus:border-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }} />
                            </div>

                            <div className="mt-4 flex justify-start md:justify-end">
                                <button type="submit" className="group flex items-center gap-4 text-white transition-colors duration-500 hover:text-[#B39A74]">
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                                        {section.form.submitLabel}
                                    </span>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-all duration-500 group-hover:border-[#B39A74] group-hover:bg-[#B39A74]/10">
                                        <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
                                    </div>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>

                <div className="mt-32 flex flex-col items-center justify-between border-t border-white/10 pt-10 text-center md:flex-row md:text-left">
                    <p className="text-white/30" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                        {section.footerLeft}
                    </p>
                    <p className="mt-4 text-white/30 md:mt-0" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                        {section.footerRight}
                    </p>
                </div>
            </div>
        </section>
    );
}
