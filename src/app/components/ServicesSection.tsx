import { motion } from "motion/react";

const services = [
    { num: "01", title: "Fashion Modeling", desc: "Участь у рекламних кампаніях, лукбуках та editorial-зйомках для преміум брендів." },
    { num: "02", title: "Runway Shows", desc: "Професійне дефіле для тижнів моди та ексклюзивних показів дизайнерів." },
    { num: "03", title: "Choreography", desc: "Постановка дефіле, режисура показів та майстер-класи з професійного позування." },
    { num: "04", title: "Ambassadorship", desc: "Представництво брендів, інтеграції та створення іміджевого контенту." }
];

export function ServicesSection() {
    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-black px-5 py-24 md:px-6 md:py-32">
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-20 grid gap-12 md:grid-cols-2 md:gap-24">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="mb-6 flex items-center gap-4">
                            <div className="h-px w-12 bg-[#B39A74]" />
                            <p className="text-[#B39A74] text-[0.65rem] font-medium tracking-[0.35em] uppercase">Експертиза</p>
                        </div>
                        <h2 className="text-white font-serif text-[clamp(3rem,8vw,5.5rem)] leading-none font-medium">
                            Напрямки <br/><span className="text-[#B39A74] italic">Співпраці</span>
                        </h2>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex items-end pb-4">
                        <p className="max-w-md text-white/50 text-base font-light leading-relaxed">
                            Від подіуму до режисури — комплексний професійний підхід до кожного проєкту у сфері fashion та beauty індустрії.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
                    {services.map((srv, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }}
                            className="group relative bg-black p-10 hover:bg-[#050505] transition-colors duration-500"
                        >
                            <p className="text-[#B39A74] font-serif text-4xl mb-8 opacity-50 transition-opacity duration-500 group-hover:opacity-100">{srv.num}</p>
                            <h3 className="text-white font-serif text-2xl mb-4">{srv.title}</h3>
                            <p className="text-white/40 text-sm font-light leading-relaxed">{srv.desc}</p>

                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#B39A74] transition-all duration-500 group-hover:w-full" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}