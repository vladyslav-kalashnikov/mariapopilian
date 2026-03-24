import { motion } from "motion/react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function CharitySection() {
    const { photos } = useSiteContent();
    const charityPhoto = photos["about.charity"];

    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-black px-5 py-24 md:px-0 md:py-0">
            <div className="grid min-h-[80vh] md:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-square overflow-hidden bg-[#111] md:aspect-auto"
                >
                    <ImageWithFallback
                        src={charityPhoto.imageUrl}
                        alt={charityPhoto.altText}
                        className="h-full w-full object-cover grayscale opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black" />
                </motion.div>

                <div className="flex flex-col justify-center bg-black px-0 py-16 md:px-20 lg:px-24">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                        <div className="mb-6 flex items-center gap-4">
                            <div className="h-px w-8 bg-[#B39A74]" />
                            <p className="text-[#B39A74] text-[0.65rem] font-medium tracking-[0.35em] uppercase">Соціальна Місія</p>
                        </div>
                        <h2 className="mb-8 text-white font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
                            Краса, що <br /><span className="text-[#B39A74] italic">Змінює світ</span>
                        </h2>
                        <div className="space-y-6 text-[0.95rem] font-light leading-[1.8] text-white/50">
                            <p>
                                Бути публічною особою — це не лише про подіуми та обкладинки журналів. Це відповідальність і можливість привертати увагу до справді важливих речей.
                            </p>
                            <p>
                                Частина мого професійного шляху присвячена підтримці благодійних ініціатив, допомозі дітям та розвитку культурних проєктів в Україні. Справжня краса завжди йде пліч-о-пліч з добрими справами.
                            </p>
                        </div>
                        <button className="mt-12 border-b border-[#B39A74] pb-2 text-[0.65rem] uppercase tracking-[0.3em] text-white transition-all hover:text-[#B39A74]">
                            Дізнатись більше
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
