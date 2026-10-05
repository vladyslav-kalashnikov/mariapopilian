import type { SiteContent } from "@/content/siteContent";

/** Сторінку «Медіа» ховаємо з меню, поки в CMS немає жодної публікації чи статті */
export function hasMediaContent(content: SiteContent) {
  return content.press.items.length > 0 || content.journal.items.length > 0;
}

export function visibleNavLinks(content: SiteContent) {
  return content.navigation.links.filter((link) => link.id !== "press" || hasMediaContent(content));
}
