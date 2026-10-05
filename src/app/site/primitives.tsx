import { useState, type ImgHTMLAttributes, type PropsWithChildren, type ReactNode } from "react";
import { motion } from "motion/react";

export const easeLuxe = [0.22, 1, 0.36, 1] as const;

/** Плавна поява блоку при прокрутці */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: PropsWithChildren<{ delay?: number; y?: number; className?: string }>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: easeLuxe }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, tone = "gold", className = "" }: { children: ReactNode; tone?: "gold" | "light" | "muted"; className?: string }) {
  const color = tone === "gold" ? "text-gold" : tone === "light" ? "text-gold-soft" : "text-stone";
  return (
    <p className={`eyebrow flex items-center gap-4 ${color} ${className}`}>
      <span aria-hidden className="h-px w-10 bg-current opacity-60" />
      {children}
    </p>
  );
}

/** Заголовок секції: звичайний рядок + курсивний акцент */
export function SectionTitle({
  line,
  accent,
  as: Tag = "h2",
  className = "",
  size = "clamp(2.6rem, 7vw, 5.75rem)",
}: {
  line: ReactNode;
  accent?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  size?: string;
}) {
  return (
    <Tag className={`display ${className}`} style={{ fontSize: size }}>
      {line}
      {accent ? (
        <>
          {" "}
          <em className="italic text-gold">{accent}</em>
        </>
      ) : null}
    </Tag>
  );
}

/** Мініатюра (720px) для фото з /seed-images; для завантажених через CMS (/uploads) мініатюр немає */
export function thumbUrl(src?: string) {
  if (!src || !src.startsWith("/seed-images/") || src.startsWith("/seed-images/thumbs/")) return null;
  return src.replace("/seed-images/", "/seed-images/thumbs/");
}

/** Адаптивні атрибути: телефон бере мініатюру, великий екран — повне фото */
export function responsiveSrc(src: string | undefined, sizes: string) {
  const thumb = thumbUrl(src);
  if (!src || !thumb) return { src };
  return { src: thumb, srcSet: `${thumb} 720w, ${src} 1440w`, sizes };
}

/** Фото з лінивим завантаженням, мініатюрою і тихим фолбеком, якщо файл не відкрився */
export function Photo({
  src,
  alt,
  className = "",
  eager = false,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);

  if (!src || failed) {
    return <div role="img" aria-label={alt} className={`bg-sand ${className}`} />;
  }

  const responsive = useOriginal ? { src } : responsiveSrc(src, sizes);

  return (
    <img
      {...responsive}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...(eager ? { fetchpriority: "high" } : {})}
      // Немає мініатюри (напр. нове фото з CMS) — пробуємо оригінал, потім заглушка
      onError={() => (useOriginal || !thumbUrl(src) ? setFailed(true) : setUseOriginal(true))}
      className={className}
      {...rest}
    />
  );
}

export function PageHeader({ eyebrow, line, accent, intro }: { eyebrow: string; line: string; accent?: string; intro?: string }) {
  return (
    <header className="mx-auto max-w-[1440px] px-5 pb-14 pt-36 md:px-10 md:pb-20 md:pt-48">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <SectionTitle as="h1" line={line} accent={accent} className="mt-6 text-ink" size="clamp(3.2rem, 11vw, 9rem)" />
      </Reveal>
      {intro ? (
        <Reveal delay={0.16}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-stone md:text-lg">{intro}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
