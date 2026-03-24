import { motion } from "motion/react";

const brandValues = [
    {
        num: "01",
        title: "Впевненість",
        description: "Сильна присутність, побудована на елегантності, вірі в себе та незабутньому візуальному образі.",
    },
    {
        num: "02",
        title: "Елегантність",
        description: "Витончений стиль, професійна преміальна естетика та увага до кожної деталі образу.",
    },
    {
        num: "03",
        title: "Дисципліна",
        description: "Системність, бездоганна підготовка та серйозне ставлення до кожної публічної появи.",
    },
    {
        num: "04",
        title: "Розвиток",
        description: "Постійне прагнення до досконалості та готовність до масштабних творчих проєктів.",
    },
];

export function PersonalBrand() {
    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-[#050505] px-5 py-20 md:px-6 md:py-32">

            {/* Soft luxury glow */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute left-[40%] top-[20%] h-[300px] w-[300px] md:h-[500px] md:w-[500px] -translate-x-1/2 rounded-full bg-[#b39a74]/[0.05] blur-3xl" />
            </div>

            {/* Film grain */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-screen">
                <svg className="h-full w-full">
                    <filter id="noiseBrandLuxury">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseBrandLuxury)" />
                </svg>
            </div>

            {/* Moving Watermark */}
            <motion.div
                initial={{ x: "-5%" }}
                animate={{ x: "-15%" }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="pointer-events-none absolute left-0 top-32 z-0 select-none whitespace-nowrap text-white/[0.02]"
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(6rem, 20vw, 18vw)",
                    lineHeight: 0.8,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                }}
            >
                PHILOSOPHY
            </motion.div>

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 flex flex-col items-center text-center md:mb-24"
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
                            Позиціонування
                        </p>
                        <div className="h-px w-8 bg-[#B39A74] md:w-12" />
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
                        Цінності & <span className="text-[#B39A74] italic">Візія</span>
                    </h2>
                </motion.div>

                {/* Grid without cheap boxes - Editorial Style */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
                    {brandValues.map((value, index) => (
                        <motion.div
                            key={value.num}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: index * 0.1 }}
                            className="group relative flex flex-col pt-10"
                        >
                            {/* Top elegant line */}
                            <div className="absolute left-0 right-0 top-0 h-px bg-white/10 transition-colors duration-500 group-hover:bg-[#B39A74]/50" />

                            {/* Huge Background Number */}
                            <span
                                className="pointer-events-none absolute -top-8 left-0 select-none text-white/5 transition-colors duration-700 group-hover:text-[#B39A74]/15"
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "6rem",
                                    fontWeight: 600,
                                    lineHeight: 1,
                                }}
                            >
                                {value.num}
                            </span>

                            <div className="relative z-10 mt-4">
                                <h3
                                    className="mb-4 text-white transition-colors duration-500 group-hover:text-[#f1e6d6]"
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: "1.8rem",
                                        fontWeight: 500,
                                    }}
                                >
                                    {value.title}
                                </h3>

                                <p
                                    className="text-white/50 transition-colors duration-500 group-hover:text-white/80"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "0.95rem",
                                        fontWeight: 300,
                                        lineHeight: 1.8,
                                    }}
                                >
                                    {value.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Ultra-minimalist Quote Block */}
                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mx-auto mt-24 max-w-4xl text-center md:mt-32"
                >
                    <p
                        className="mb-8 text-white/90"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                            fontStyle: "italic",
                            fontWeight: 400,
                            lineHeight: 1.5,
                        }}
                    >
                        “Мій бренд — це більше, ніж зовнішність. Це присутність, елегантність,
                        впевненість і здатність залишати сильне враження.”
                    </p>

                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-[20px] w-px bg-[#B39A74]/50" />
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
                            Maria Popilian
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}