import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function ContactSection() {
    return (
        <section id="contact" className="relative overflow-hidden border-t border-white/5 bg-[#050505] px-5 py-24 md:px-6 md:py-32">

            {/* Soft luxury glow */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute left-[-10%] top-[40%] h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-[#b39a74]/[0.06] blur-3xl" />
            </div>

            {/* Film grain */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-screen">
                <svg className="h-full w-full">
                    <filter id="noiseContactLuxury">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseContactLuxury)" />
                </svg>
            </div>

            {/* Moving Watermark */}
            <motion.div
                initial={{ x: "0%" }}
                animate={{ x: "-10%" }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="pointer-events-none absolute left-0 top-[15%] z-0 select-none whitespace-nowrap text-white/[0.02]"
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(6rem, 20vw, 18vw)",
                    lineHeight: 0.8,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                }}
            >
                COLLABORATE
            </motion.div>

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-20 flex flex-col items-center text-center md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <div className="mb-6 flex items-center gap-4 md:mb-8">
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
                                Співпраця
                            </p>
                            <div className="h-px w-8 bg-[#B39A74] md:w-12" />
                        </div>

                        <h2
                            className="text-white"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(4.5rem, 12vw, 9rem)",
                                lineHeight: 0.9,
                                fontWeight: 400,
                                letterSpacing: "-0.02em",
                                textTransform: "uppercase"
                            }}
                        >
                            Let's <span className="text-[#B39A74] italic lowercase">Work</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="grid gap-16 md:grid-cols-12 md:gap-24">

                    {/* Left Column: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-12 md:col-span-5 md:gap-16"
                    >
                        {[
                            { label: "Management", value: "maria@example.com", href: "mailto:maria@example.com" },
                            { label: "Direct", value: "+380 99 123 45 67", href: "tel:+380991234567" },
                            { label: "Socials", value: "Instagram ↗", href: "https://instagram.com" }
                        ].map((item, i) => (
                            <div key={i} className="group flex flex-col items-start">
                                <p
                                    className="mb-3 text-[#B39A74]"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "0.65rem",
                                        fontWeight: 500,
                                        letterSpacing: "0.25em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {item.label}
                                </p>
                                <a
                                    href={item.href}
                                    target={item.label === "Socials" ? "_blank" : undefined}
                                    rel={item.label === "Socials" ? "noreferrer" : undefined}
                                    className="relative text-white transition-colors duration-500 group-hover:text-[#f1e6d6]"
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                                        fontWeight: 400,
                                    }}
                                >
                                    {item.value}
                                    {/* Animated Hover Line */}
                                    <div className="absolute -bottom-1 left-0 h-px w-0 bg-[#B39A74] transition-all duration-500 group-hover:w-full" />
                                </a>
                            </div>
                        ))}
                    </motion.div>

                    {/* Right Column: Minimalist Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:col-span-7"
                    >
                        <form className="flex flex-col gap-10">
                            <div className="grid gap-10 md:grid-cols-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ваше ім'я"
                                        className="w-full border-b border-white/20 bg-transparent py-4 text-white placeholder:text-white/30 outline-none transition-all duration-500 focus:border-[#B39A74]"
                                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }}
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full border-b border-white/20 bg-transparent py-4 text-white placeholder:text-white/30 outline-none transition-all duration-500 focus:border-[#B39A74]"
                                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    rows={4}
                                    placeholder="Деталі проєкту..."
                                    className="w-full resize-none border-b border-white/20 bg-transparent py-4 text-white placeholder:text-white/30 outline-none transition-all duration-500 focus:border-[#B39A74]"
                                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem" }}
                                />
                            </div>

                            {/* Luxury Submit Button */}
                            <div className="mt-4 flex justify-start md:justify-end">
                                <button
                                    type="submit"
                                    className="group flex items-center gap-4 text-white transition-colors duration-500 hover:text-[#B39A74]"
                                >
                                    <span
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "0.65rem",
                                            fontWeight: 600,
                                            letterSpacing: "0.25em",
                                            textTransform: "uppercase"
                                        }}
                                    >
                                        Надіслати Запит
                                    </span>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-all duration-500 group-hover:border-[#B39A74] group-hover:bg-[#B39A74]/10">
                                        <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
                                    </div>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Footer / Copyright */}
                <div className="mt-32 flex flex-col items-center justify-between border-t border-white/10 pt-10 text-center md:flex-row md:text-left">
                    <p
                        className="text-white/30"
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.6rem",
                            fontWeight: 500,
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                        }}
                    >
                        © 2026 MARIA POPILIAN
                    </p>
                    <p
                        className="mt-4 text-white/30 md:mt-0"
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.6rem",
                            fontWeight: 500,
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                        }}
                    >
                        Premium Portfolio
                    </p>
                </div>
            </div>
        </section>
    );
}