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
import img2 from "@/images/2.png";
import img3 from "@/images/3.png";
import img4 from "@/images/4.png";
import img5 from "@/images/5.png";
import img6 from "@/images/6.png";
import img7 from "@/images/7.png";
import img8 from "@/images/8.png";
import img9 from "@/images/9.png";
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

const seedImageMap: Record<string, string> = {
  "2.png": img2,
  "3.png": img3,
  "4.png": img4,
  "5.png": img5,
  "6.png": img6,
  "7.png": img7,
  "8.png": img8,
  "9.png": img9,
};

function buildFallbackItems() {
  return photoManifest
    .map<PhotoSlot>((slot) => ({
      ...slot,
      imageUrl: seedImageMap[slot.seedImage] ?? img9,
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
  if (!response.ok) {
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
