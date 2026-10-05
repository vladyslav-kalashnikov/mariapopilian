import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import manifestData from "@/content/photoManifest.json";
import { defaultSiteContent, mergeSiteContent, type SiteContent } from "@/content/siteContent";

export type PhotoSlotManifestItem = {
  slotId: string;
  page: string;
  pageLabel: string;
  section: string;
  sectionLabel: string;
  label: string;
  description: string;
  seedImage: string;
  altText: string;
  sortOrder: number;
};

export type PhotoSlot = PhotoSlotManifestItem & {
  imageUrl: string;
  updatedAt: string | null;
};

type SiteContentContextValue = {
  items: PhotoSlot[];
  photos: Record<string, PhotoSlot>;
  content: SiteContent;
  contentUpdatedAt: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

type PublicSitePayload = {
  items?: PhotoSlot[];
  content?: unknown;
  contentUpdatedAt?: string | null;
};

const photoManifest = manifestData as PhotoSlotManifestItem[];

// Фото лежать у src/images і доступні як /seed-images/<шлях>: у dev і на Render їх роздає
// CMS-сервер, у статичному білді (Netlify) — копія в dist/seed-images (див. vite.config.ts)
const seedImageUrl = (file: string) => `/seed-images/${file}`;

function buildFallbackItems() {
  return photoManifest
    .map<PhotoSlot>((slot) => ({
      ...slot,
      imageUrl: seedImageUrl(slot.seedImage),
      updatedAt: null,
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

const fallbackItems = buildFallbackItems();

function toPhotoMap(items: PhotoSlot[]) {
  return items.reduce<Record<string, PhotoSlot>>((accumulator, item) => {
    accumulator[item.slotId] = item;
    return accumulator;
  }, {});
}

function mergeItems(nextItems: PhotoSlot[]) {
  const nextMap = toPhotoMap(nextItems);

  return fallbackItems.map((item) => ({
    ...item,
    ...(nextMap[item.slotId] ?? {}),
  }));
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

async function fetchSiteContent() {
  const response = await fetch("/api/public/site-content");
  if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Не вдалося завантажити контент із сервера.");
  }

  return (await response.json()) as PublicSitePayload;
}

export function SiteContentProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<PhotoSlot[]>(fallbackItems);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [contentUpdatedAt, setContentUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await fetchSiteContent();
      setItems(mergeItems(Array.isArray(payload.items) ? payload.items : []));
      setContent(mergeSiteContent(payload.content));
      setContentUpdatedAt(payload.contentUpdatedAt ?? null);
      setError(null);
    } catch (err) {
      setItems(fallbackItems);
      setContent(defaultSiteContent);
      setContentUpdatedAt(null);
      setError(err instanceof Error ? err.message : "Не вдалося оновити контент.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      items,
      photos: toPhotoMap(items),
      content,
      contentUpdatedAt,
      loading,
      error,
      refresh,
    }),
    [content, contentUpdatedAt, error, items, loading, refresh],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used inside SiteContentProvider.");
  }
  return context;
}
