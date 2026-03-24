import { motion } from "motion/react";

export function LuxuryBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1b1610_0%,#050505_45%,#020202_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.035]" />

      <motion.div
        className="absolute -left-32 top-20 h-[26rem] w-[26rem] rounded-full bg-[#b39a74]/[0.14] blur-[140px]"
        animate={{ x: [0, 60, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-8rem] top-[22%] h-[30rem] w-[30rem] rounded-full bg-[#7d6c53]/[0.14] blur-[160px]"
        animate={{ x: [0, -50, 20, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-12rem] left-[30%] h-[28rem] w-[28rem] rounded-full bg-white/[0.05] blur-[150px]"
        animate={{ x: [0, -30, 40, 0], y: [0, -40, 10, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
