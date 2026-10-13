import { useEffect } from "react";

import seo from "@/content/seo.json";

/** Базова адреса сайту для canonical/OG: задається при збиранні (SITE_URL або URL від Netlify) */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || seo.defaultSiteUrl).replace(/\/+$/, "");

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function setMeta(attribute: "name" | "property", key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

/**
 * Метатеги сторінки під час переходів у SPA. Перший показ кожної сторінки вже має
 * правильні теги з пререндеру (scripts/prerender.mjs) — тут вони лише синхронізуються.
 */
export function useSeo({ title, description, path, image, noindex = false }: { title: string; description: string; path: string; image?: string; noindex?: boolean }) {
  useEffect(() => {
    const url = absoluteUrl(path);
    const imageUrl = absoluteUrl(image || seo.ogImage);
    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    setCanonical(url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", imageUrl);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);
  }, [title, description, path, image, noindex]);
}
