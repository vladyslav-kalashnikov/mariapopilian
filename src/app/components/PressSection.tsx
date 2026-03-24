import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

// Додано поле "url" для кожної публікації
const pressItems = [
    {
        year: "2026",
        magazine: "VOGUE UKRAINE",
        title: "Нове обличчя української моди: Шлях до корони",
        category: "Cover Story",
        url: "https://vogue.ua/" // Замініть на реальне посилання
    },
    {
        year: "2025",
        magazine: "L'OFFICIEL",
        title: "Мистецтво позування та режисура дефіле",
        category: "Interview",
        url: "https://lofficiel.ua/" // Замініть на реальне посилання
    },
    {
        year: "2025",
        magazine: "HARPER'S BAZAAR",
        title: "10 найвпливовіших моделей року за версією редакції",
        category: "Editorial",
        url: "https://harpersbazaar.com.ua/" // Замініть на реальне посилання
    },
    {
        year: "2024",
        magazine: "ELLE",
        title: "Від бекстейджу до подіуму. Історія Марії Попілян",
        category: "Feature",
        url: "https://elle.ua/" // Замініть на реальне посилання
    }
];

export function PressSection() {
    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-[#050505] px-5 py-24 md:px-6 md:py-32">

            {/* Soft luxury glow */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute right-[-10%] top-[30%] h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-[#b39a74]/[0.04] blur-3xl" />
            </div>

            {/* Film grain */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-screen">
                <svg className="h-full w-full">
                    <filter id="noisePress">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noisePress)" />
                </svg>
            </div>

            {/* Moving Watermark */}
            <motion.div
                initial={{ x: "-5%" }}
                animate={{ x: "-15%" }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="pointer-events-none absolute left-0 top-32 z-0 select-none whitespace-nowrap text-white/[0.02]"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(6rem, 20vw, 18vw)", lineHeight: 0.8, fontWeight: 700 }}
            >
                PUBLICATIONS
            </motion.div>

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-16 flex flex-col items-start md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-6 flex items-center gap-4">
                            <div className="h-px w-8 bg-[#B39A74] md:w-12" />
                            <p
                                className="text-[#B39A74]"
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "0.65rem",
                                    fontWeight: 500,
                                    letterSpacing: "0.35em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Визнання
                            </p>
                        </div>

                        <h2
                            className="text-white"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                                lineHeight: 1,
                                fontWeight: 500,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Преса & <span className="text-[#B39A74] italic">Публікації</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Press List */}
                <div className="flex flex-col border-t border-white/10">
                    {pressItems.map((item, index) => (
                        <motion.a
                            // ТУТ НАЛАШТОВАНІ ПОСИЛАННЯ ТА ВІДКРИТТЯ У НОВІЙ ВКЛАДЦІ
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative flex flex-col items-start justify-between border-b border-white/10 py-10 transition-colors duration-500 hover:border-[#B39A74] md:flex-row md:items-center md:py-12"
                        >
                            {/* Hover Highlight (Subtle background) */}
                            <div className="pointer-events-none absolute inset-0 z-[-1] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(90deg,rgba(179,154,116,0.05),transparent_35%,transparent_65%,rgba(179,154,116,0.03))]" />

                            <div className="flex w-full flex-col md:w-1/3 md:flex-row md:items-center gap-4 md:gap-12">
                                <span className="text-white/30 font-serif text-xl md:text-2xl transition-colors duration-500 group-hover:text-[#B39A74]">
                                    {item.year}
                                </span>
                                <h3
                                    className="text-white text-2xl md:text-4xl font-serif tracking-wide transition-colors duration-500 group-hover:text-[#f1e6d6]"
                                >
                                    {item.magazine}
                                </h3>
                            </div>

                            <div className="mt-6 flex w-full flex-col md:mt-0 md:w-5/12">
                                <p
                                    className="text-white/50 text-sm md:text-base font-light leading-relaxed transition-colors duration-500 group-hover:text-white/80"
                                >
                                    {item.title}
                                </p>
                            </div>

                            <div className="mt-6 flex w-full items-center justify-between md:mt-0 md:w-2/12 md:justify-end">
                                <span className="text-[#B39A74] text-[0.6rem] tracking-[0.2em] uppercase border border-[#B39A74]/30 px-3 py-1 rounded-full transition-colors duration-500 group-hover:border-[#B39A74] group-hover:bg-[#B39A74]/10">
                                    {item.category}
                                </span>
                                {/* Іконка стрілочки також реагує на наведення */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-500 group-hover:border-[#B39A74] group-hover:bg-[#B39A74] group-hover:text-black text-white ml-4 hidden md:flex">
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