/**
 * Чорний фон із м'якими золотими світіннями.
 * Статичні радіальні градієнти замість анімованих blur-плям: вигляд той самий,
 * але без постійного перемальовування (на телефонах blur 150px давав сильні лаги).
 */
export function LuxuryBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-[#030303]"
      style={{
        backgroundImage: [
          "radial-gradient(42rem 32rem at 8% 12%, rgba(179,154,116,0.13), transparent 70%)",
          "radial-gradient(46rem 36rem at 96% 34%, rgba(125,108,83,0.13), transparent 70%)",
          "radial-gradient(40rem 30rem at 40% 105%, rgba(255,255,255,0.04), transparent 70%)",
          "radial-gradient(circle at top, #1b1610 0%, #050505 45%, #020202 100%)",
        ].join(", "),
      }}
    />
  );
}
