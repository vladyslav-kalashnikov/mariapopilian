import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, Save, Upload } from "lucide-react";

import { type PhotoSlot } from "@/app/content/SiteContentProvider";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

type PhotoSlotsEditorProps = {
  authToken: string;
  items: PhotoSlot[];
  onRefresh: () => Promise<void>;
};

type DraftMap = Record<string, { imageUrl: string; altText: string }>;
type StatusMap = Record<string, { tone: "success" | "error" | "idle"; text: string }>;
type FileMap = Record<string, File | null>;

function groupByPage(items: PhotoSlot[]) {
  return items.reduce<Record<string, PhotoSlot[]>>((accumulator, item) => {
    if (!accumulator[item.page]) {
      accumulator[item.page] = [];
    }
    accumulator[item.page].push(item);
    return accumulator;
  }, {});
}

function formatUpdatedAt(value: string | null) {
  if (!value) {
    return "Ще не редагувалось";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Оновлено щойно";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#B39A74]/50";
const textareaClassName =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#B39A74]/50";
const subtleButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-white/70 transition hover:border-[#B39A74]/35 hover:text-white";
const accentButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#B39A74]/30 bg-[#B39A74]/12 px-4 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-[#F0DEBF] transition hover:border-[#B39A74]/60 hover:bg-[#B39A74]/18";

export function PhotoSlotsEditor({ authToken, items, onRefresh }: PhotoSlotsEditorProps) {
  const managedItems = useMemo(
    () => items.filter((item) => ["home.hero", "about.identity", "about.charity"].includes(item.slotId)),
    [items],
  );
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [slotStatus, setSlotStatus] = useState<StatusMap>({});
  const [selectedFiles, setSelectedFiles] = useState<FileMap>({});
  const [activePage, setActivePage] = useState<string>("all");
  const [busySlotId, setBusySlotId] = useState<string | null>(null);

  useEffect(() => {
    const nextDrafts = managedItems.reduce<DraftMap>((accumulator, item) => {
      accumulator[item.slotId] = {
        imageUrl: item.imageUrl,
        altText: item.altText,
      };
      return accumulator;
    }, {});
    setDrafts(nextDrafts);
  }, [managedItems]);

  const groupedPages = useMemo(() => groupByPage(managedItems), [managedItems]);
  const pageEntries = useMemo(() => Object.entries(groupedPages), [groupedPages]);
  const visibleEntries = useMemo(
    () => pageEntries.filter(([page]) => activePage === "all" || activePage === page),
    [activePage, pageEntries],
  );

  function setDraft(slotId: string, key: "imageUrl" | "altText", value: string) {
    setDrafts((current) => ({
      ...current,
      [slotId]: {
        ...(current[slotId] ?? { imageUrl: "", altText: "" }),
        [key]: value,
      },
    }));
  }

  async function handleSave(slot: PhotoSlot) {
    const draft = drafts[slot.slotId];
    setBusySlotId(slot.slotId);
    setSlotStatus((current) => ({
      ...current,
      [slot.slotId]: { tone: "idle", text: "Зберігаю..." },
    }));

    try {
      const response = await fetch(`/api/admin/photo-slots/${encodeURIComponent(slot.slotId)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: draft?.imageUrl ?? slot.imageUrl,
          altText: draft?.altText ?? slot.altText,
        }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "Не вдалося зберегти слот.");
      }

      await onRefresh();
      setSlotStatus((current) => ({
        ...current,
        [slot.slotId]: { tone: "success", text: "Фото оновлено." },
      }));
    } catch (error) {
      setSlotStatus((current) => ({
        ...current,
        [slot.slotId]: {
          tone: "error",
          text: error instanceof Error ? error.message : "Не вдалося зберегти слот.",
        },
      }));
    } finally {
      setBusySlotId(null);
    }
  }

  async function handleUpload(slot: PhotoSlot) {
    const nextFile = selectedFiles[slot.slotId];
    if (!nextFile) {
      setSlotStatus((current) => ({
        ...current,
        [slot.slotId]: { tone: "error", text: "Спочатку виберіть файл." },
      }));
      return;
    }

    setBusySlotId(slot.slotId);
    setSlotStatus((current) => ({
      ...current,
      [slot.slotId]: { tone: "idle", text: "Завантажую..." },
    }));

    try {
      const formData = new FormData();
      formData.append("file", nextFile);
      formData.append("altText", drafts[slot.slotId]?.altText ?? slot.altText);

      const response = await fetch(`/api/admin/photo-slots/${encodeURIComponent(slot.slotId)}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error ?? "Не вдалося завантажити файл.");
      }

      setSelectedFiles((current) => ({
        ...current,
        [slot.slotId]: null,
      }));
      await onRefresh();
      setSlotStatus((current) => ({
        ...current,
        [slot.slotId]: { tone: "success", text: "Нове фото завантажено." },
      }));
    } catch (error) {
      setSlotStatus((current) => ({
        ...current,
        [slot.slotId]: {
          tone: "error",
          text: error instanceof Error ? error.message : "Не вдалося завантажити файл.",
        },
      }));
    } finally {
      setBusySlotId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setActivePage("all")} className={`${activePage === "all" ? accentButtonClassName : subtleButtonClassName}`}>
          Усі сторінки
        </button>
        {pageEntries.map(([page, slotItems]) => (
          <button key={page} type="button" onClick={() => setActivePage(page)} className={`${activePage === page ? accentButtonClassName : subtleButtonClassName}`}>
            {slotItems[0]?.pageLabel ?? page}
          </button>
        ))}
      </div>

      {visibleEntries.map(([page, slotItems]) => (
        <section key={page} className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.34em] text-[#B39A74]">{slotItems[0]?.pageLabel}</p>
              <h2 className="font-serif text-4xl text-white">{slotItems[0]?.pageLabel}</h2>
            </div>
            <p className="text-sm text-white/45">{slotItems.length} фото-слотів</p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {slotItems.map((slot) => {
              const draft = drafts[slot.slotId] ?? { imageUrl: slot.imageUrl, altText: slot.altText };
              const status = slotStatus[slot.slotId];
              const isBusy = busySlotId === slot.slotId;

              return (
                <article key={slot.slotId} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25">
                  <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="relative min-h-[20rem] overflow-hidden border-b border-white/10 bg-[#0f0f0f] lg:border-b-0 lg:border-r">
                      <ImageWithFallback src={slot.imageUrl} alt={slot.altText} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[#D8C3A1]">{slot.sectionLabel}</p>
                        <h3 className="mt-2 font-serif text-3xl leading-none text-white">{slot.label}</h3>
                      </div>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                      <div>
                        <p className="text-[0.58rem] uppercase tracking-[0.3em] text-white/40">slot id</p>
                        <p className="mt-2 text-sm text-white/65">{slot.slotId}</p>
                      </div>

                      <p className="text-sm leading-7 text-white/55">{slot.description}</p>

                      <Field label="Alt-текст">
                        <input type="text" value={draft.altText} onChange={(event) => setDraft(slot.slotId, "altText", event.target.value)} className={inputClassName} />
                      </Field>

                      <Field label="URL зображення">
                        <textarea rows={3} value={draft.imageUrl} onChange={(event) => setDraft(slot.slotId, "imageUrl", event.target.value)} className={textareaClassName} />
                      </Field>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => void handleSave(slot)} disabled={isBusy} className={`${accentButtonClassName} ${isBusy ? "cursor-not-allowed opacity-50" : ""}`}>
                          {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Зберегти
                        </button>

                        <label className={`${subtleButtonClassName} cursor-pointer`}>
                          <ImagePlus className="h-4 w-4" />
                          {selectedFiles[slot.slotId]?.name ? "Файл вибрано" : "Вибрати файл"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                              setSelectedFiles((current) => ({
                                ...current,
                                [slot.slotId]: event.target.files?.[0] ?? null,
                              }))
                            }
                          />
                        </label>
                      </div>

                      <button type="button" onClick={() => void handleUpload(slot)} disabled={isBusy} className={`${subtleButtonClassName} w-full ${isBusy ? "cursor-not-allowed opacity-50" : ""}`}>
                        {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        Завантажити нове фото
                      </button>

                      <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
                        <span>Останнє оновлення: {formatUpdatedAt(slot.updatedAt)}</span>
                        {status && (
                          <span className={status.tone === "success" ? "text-[#bfdcb7]" : status.tone === "error" ? "text-[#ffb3b3]" : "text-white/50"}>
                            {status.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.58rem] uppercase tracking-[0.28em] text-white/40">{label}</span>
      {children}
    </label>
  );
}
