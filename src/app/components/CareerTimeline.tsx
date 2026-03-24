import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const achievements = [
    {
        year: "2026",
        title: "Красуня України",
        description: "Національний титул, який закріпив елегантність, публічний статус та сильну професійну присутність.",
        details: "Ця перемога стала кульмінацією років роботи над собою. Титул відкрив двері до міжнародних контрактів, участі у глобальних благодійних ініціативах на рівні ООН та зйомок для обкладинок провідних глянцевих видань. Це не просто корона, а платформа для трансляції української краси та сили на весь світ."
    },
    {
        year: "2025",
        title: "Міжнародні Конкурси",
        description: "Участь у престижних змаганнях краси та розвиток впізнаваної fashion-ідентичності.",
        details: "Представлення України на міжнародній арені вимагало бездоганної підготовки, вивчення протоколів та створення десятків унікальних образів з топовими дизайнерами. Це був етап масштабної трансформації з локальної моделі у впізнавану міжнародну персону."
    },
    {
        year: "2024",
        title: "Модні Проєкти",
        description: "Колаборації, публічні виступи та візуальні зйомки у преміальній естетиці.",
        details: "Серія ексклюзивних контрактів з преміальними брендами. Відкриття показів на Ukrainian Fashion Week, зйомки для масштабних рекламних кампейнів нових колекцій та робота з найкращими fashion-фотографами індустрії."
    },
    {
        year: "2024",
        title: "Editorial Зйомки",
        description: "Фотосесії журнального формату з акцентом на стиль, стайлінг та глибокий образ.",
        details: "Створення концептуальних візуальних історій. Фокус на високу моду (haute couture), артову фотографію та створення глибоких, драматичних образів, що розкривають різні грані особистості перед об'єктивом."
    },
    {
        year: "2023",
        title: "Особистий Бренд",
        description: "Створення впізнаваного імені, розвиток соціальних мереж та публічного іміджу.",
        details: "Стратегічний перехід від звичайного моделінгу до створення власного імені як самостійного бренду. Формування лояльної аудиторії, кристалізація власного стилю та перші великі амбасадорські контракти з beauty-брендами."
    },
    {
        year: "2023",
        title: "Початок Кар'єри",
        description: "Перші кроки в моделінгу, робота над позуванням та професійною самопрезентацією.",
        details: "Перші тестові зйомки, пошук свого унікального стилю та сотні годин роботи в студіях. Закладення фундаментальної дисципліни, вивчення мистецтва дефіле та розуміння того, як працює велика fashion-індустрія зсередини."
    },
];

export function CareerTimeline() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-[#050505] px-5 py-20 md:px-6 md:py-32">
            {/* Soft luxury glow */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute left-[-20%] top-[5%] h-[300px] w-[300px] md:h-[420px] md:w-[420px] rounded-full bg-[#b39a74]/[0.08] blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-20%] h-[250px] w-[250px] md:h-[360px] md:w-[360px] rounded-full bg-white/[0.04] blur-3xl" />
            </div>

            {/* Film Grain */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035] mix-blend-screen">
                <svg className="h-full w-full">
                    <filter id="noiseTimelineLuxury">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseTimelineLuxury)" />
                </svg>
            </div>

            {/* Watermark */}
            <motion.div
                initial={{ x: "3%" }}
                animate={{ x: "-4%" }}
                transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="pointer-events-none absolute right-[-8%] top-16 md:top-24 z-0 select-none whitespace-nowrap text-white/[0.03]"
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(6rem, 22vw, 19vw)",
                    lineHeight: 0.8,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                }}
            >
                HER LEGACY
            </motion.div>

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Heading block */}
                <div className="mb-16 md:mb-24 flex flex-col gap-10 md:grid md:grid-cols-12 md:items-end md:gap-12">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="md:col-span-7">
                        <div className="mb-6 flex items-center gap-4 md:mb-8">
                            <div className="h-px w-10 bg-[#B39A74] md:w-14" />
                            <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.38em", textTransform: "uppercase" }}>
                                Career & Titles
                            </p>
                        </div>
                        <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.5rem, 12vw, 6.8rem)", lineHeight: 0.96, fontWeight: 600, letterSpacing: "-0.04em" }}>
                            Шлях<br /><span className="text-[#B39A74] italic">досягнень</span>
                        </h2>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }} className="border-l border-white/10 pl-5 md:col-span-5 md:pl-10">
                        <p className="mb-8 max-w-md text-white/60 md:mb-10 md:text-white/50" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.8 }}>
                            Історія дисципліни, побудови іміджу та послідовного професійного зростання. Кожен етап підсилює статус, візуальну впізнаваність і бренд Марії.
                        </p>
                        <div className="flex gap-10 md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <p className="mb-1 text-white md:mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.3rem", fontWeight: 600 }}>2026</p>
                                <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase" }}>Головний титул</p>
                            </div>
                            <div>
                                <p className="mb-1 text-white md:mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.3rem", fontWeight: 600 }}>15+</p>
                                <p className="text-[#B39A74]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase" }}>Проєктів</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Interactive Timeline List */}
                <div className="relative">
                    <div className="absolute left-0 right-0 top-0 h-px bg-white/10" />

                    {achievements.map((item, index) => {
                        const isExpanded = expandedIndex === index;

                        return (
                            <motion.div
                                key={`${item.year}-${item.title}`}
                                initial={{ opacity: 0, y: 26 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: index * 0.08 }}
                                className="group relative cursor-pointer"
                                onClick={() => toggleExpand(index)}
                            >
                                {/* Top Line Hover Effect */}
                                <div className={`absolute left-0 right-0 top-0 h-px transition-colors duration-500 ${isExpanded ? "bg-[#B39A74]" : "bg-white/10 group-hover:bg-[#B39A74]/50"}`} />

                                {/* Main Row */}
                                <div className="flex flex-col py-10 md:grid md:grid-cols-12 md:items-center md:gap-10 md:py-12">

                                    {/* Year */}
                                    <div className="md:col-span-3 flex justify-between items-center md:block">
                                        <div className="relative inline-block">
                        <span
                            className={`block transition-all duration-700 ${isExpanded ? "text-[#B39A74] translate-x-2" : "text-white/30 md:text-white/10 md:group-hover:translate-x-2 md:group-hover:text-[#B39A74]"}`}
                            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3.8rem, 12vw, 5.6rem)", lineHeight: 0.9, fontWeight: 600, letterSpacing: "-0.04em" }}
                        >
                          {item.year}
                        </span>
                                        </div>
                                        {/* Mobile Plus/Minus Icon */}
                                        <div className="md:hidden text-white/40">
                                            {isExpanded ? <Minus className="w-8 h-8 text-[#B39A74]" strokeWidth={1} /> : <Plus className="w-8 h-8" strokeWidth={1} />}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="mt-4 md:col-span-4 md:mt-0">
                                        <h3
                                            className={`transition-colors duration-500 ${isExpanded ? "text-[#f1e6d6]" : "text-white md:group-hover:text-[#f1e6d6]"}`}
                                            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 6vw, 2.5rem)", lineHeight: 1.08, fontWeight: 500, letterSpacing: "-0.02em" }}
                                        >
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* Short Description */}
                                    <div className="mt-2 md:col-span-4 md:mt-0">
                                        <p
                                            className={`max-w-xl transition-colors duration-500 ${isExpanded ? "text-white/80" : "text-white/60 md:text-white/40 md:group-hover:text-white/70"}`}
                                            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.8 }}
                                        >
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Desktop Plus/Minus Icon */}
                                    <div className="hidden md:flex md:col-span-1 justify-end items-center text-white/30 transition-colors duration-500 group-hover:text-[#B39A74]">
                                        {isExpanded ? <Minus className="w-8 h-8 text-[#B39A74]" strokeWidth={1} /> : <Plus className="w-8 h-8" strokeWidth={1} />}
                                    </div>
                                </div>

                                {/* Expanded Content (Accordion) */}
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
                                                <div className="md:col-start-4 md:col-span-8 border-l border-[#B39A74]/40 pl-5 md:pl-8">
                                                    <p
                                                        className="text-white/80"
                                                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.9 }}
                                                    >
                                                        {item.details}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Subtle hover background */}
                                <div className={`pointer-events-none absolute inset-0 z-[-1] hidden transition-opacity duration-500 bg-[linear-gradient(90deg,rgba(179,154,116,0.05),transparent_35%,transparent_65%,rgba(179,154,116,0.03))] md:block ${isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                            </motion.div>
                        );
                    })}

                    <div className="h-px bg-white/10" />
                </div>

                {/* Final quote block */}
                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.85, delay: 0.2 }}
                    className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-10 md:mt-20 md:grid md:grid-cols-12 md:items-end md:gap-8 md:pt-12"
                >
                    <div className="md:col-span-7">
                        <p
                            className="text-white"
                            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 6vw, 2.7rem)", fontStyle: "italic", fontWeight: 500, lineHeight: 1.4 }}
                        >
                            “Кожен новий етап — це не просто досягнення, а ще один штрих до образу сильної, елегантної та впізнаваної жінки.”
                        </p>
                    </div>

                    <div className="md:col-span-5 md:pl-10">
                        <p
                            className="text-[#B39A74]"
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase" }}
                        >
                            Maria Popilian
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}