import { type FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, LoaderCircle, LogOut, RefreshCcw, Save, Shield, Upload } from "lucide-react";

import { type PhotoSlot, useSiteContent } from "@/app/content/SiteContentProvider";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

type AdminPageProps = {
  onClose: () => void;
};

type DraftMap = Record<string, { imageUrl: string; altText: string }>;
type StatusMap = Record<string, { tone: "success" | "error" | "idle"; text: string }>;
type FileMap = Record<string, File | null>;

const TOKEN_KEY = "maria-cms-token";

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

function groupByPage(items: PhotoSlot[]) {
  return items.reduce<Record<string, PhotoSlot[]>>((accumulator, item) => {
    if (!accumulator[item.page]) {
      accumulator[item.page] = [];
    }
    accumulator[item.page].push(item);
    return accumulator;
  }, {});
}

async function withJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  const data = (await response.json().catch(() => null)) as T | { error?: string } | null;

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : "Сервер повернув помилку.";
    throw new Error(message);
  }

  return data as T;
}

export function AdminPage({ onClose }: AdminPageProps) {
  const { items, refresh, loading } = useSiteContent();
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authState, setAuthState] = useState<"checking" | "guest" | "ready">("checking");
  const [authError, setAuthError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [slotStatus, setSlotStatus] = useState<StatusMap>({});
  const [selectedFiles, setSelectedFiles] = useState<FileMap>({});
  const [activePage, setActivePage] = useState<string>("all");
  const [busySlotId, setBusySlotId] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  useEffect(() => {
    const nextDrafts = items.reduce<DraftMap>((accumulator, item) => {
      accumulator[item.slotId] = {
        imageUrl: item.imageUrl,
        altText: item.altText,
      };
      return accumulator;
    }, {});

    setDrafts(nextDrafts);
  }, [items]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setAuthState("guest");
      return;
    }

    void (async () => {
      try {
        await fetch("/api/admin/session", {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Сесія завершилась.");
          }
        });

        setAuthToken(savedToken);
        setAuthState("ready");
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
        setAuthState("guest");
      }
    })();
  }, []);

  const groupedPages = useMemo(() => groupByPage(items), [items]);
  const pageEntries = useMemo(() => Object.entries(groupedPages), [groupedPages]);
  const visibleEntries = useMemo(
    () => pageEntries.filter(([page]) => activePage === "all" || activePage === page),
    [activePage, pageEntries],
  );

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingLogin(true);
    setAuthError(null);

    try {
      const data = await withJson<{ token: string }>("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      window.localStorage.setItem(TOKEN_KEY, data.token);
      setAuthToken(data.token);
      setAuthState("ready");
      setPassword("");
      await refresh();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Не вдалося увійти.");
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  async function handleLogout() {
    if (authToken) {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).catch(() => null);
    }

    window.localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setAuthState("guest");
  }

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
    if (!authToken) {
      return;
    }

    const draft = drafts[slot.slotId];
    setBusySlotId(slot.slotId);
    setSlotStatus((current) => ({
      ...current,
      [slot.slotId]: { tone: "idle", text: "Зберігаю..." },
    }));

    try {
      await withJson<{ item: PhotoSlot }>(`/api/admin/photo-slots/${encodeURIComponent(slot.slotId)}`, {
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

      await refresh();
      setSlotStatus((current) => ({
        ...current,
        [slot.slotId]: { tone: "success", text: "URL та alt-текст оновлено." },
      }));
    } catch (error) {
      setSlotStatus((current) => ({
        ...current,
        [slot.slotId]: {
          tone: "error",
          text: error instanceof Error ? error.message : "Не вдалося зберегти зміни.",
        },
      }));
    } finally {
      setBusySlotId(null);
    }
  }

  async function handleUpload(slot: PhotoSlot) {
    if (!authToken) {
      return;
    }

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
      [slot.slotId]: { tone: "idle", text: "Завантажую фото..." },
    }));

    try {
      const formData = new FormData();
      formData.append("file", nextFile);
      formData.append("altText", drafts[slot.slotId]?.altText ?? slot.altText);

      await withJson<{ item: PhotoSlot }>(
        `/api/admin/photo-slots/${encodeURIComponent(slot.slotId)}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        },
      );

      setSelectedFiles((current) => ({
        ...current,
        [slot.slotId]: null,
      }));
      await refresh();
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

  if (authState === "checking") {
    return (
      <div className="min-h-screen bg-[#050505] px-6 py-16 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-24 backdrop-blur-xl">
          <div className="flex items-center gap-4 text-sm uppercase tracking-[0.35em] text-white/55">
            <LoaderCircle className="h-5 w-5 animate-spin text-[#B39A74]" />
            перевіряю сесію
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-4 text-white sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(179,154,116,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="border-b border-white/10 px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.34em] text-white/55 transition-colors hover:text-[#B39A74]"
              >
                <ArrowLeft className="h-4 w-4" />
                назад на сайт
              </button>

              <div>
                <p className="mb-3 text-[0.65rem] uppercase tracking-[0.45em] text-[#B39A74]">
                  Maria Editorial CMS
                </p>
                <h1 className="font-serif text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-white">
                  Керування фото
                  <br />
                  <span className="text-[#d8c3a1] italic">на кожній сторінці</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void refresh()}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.62rem] uppercase tracking-[0.3em] text-white/70 transition hover:border-[#B39A74]/50 hover:text-white"
              >
                <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin text-[#B39A74]" : ""}`} />
                Оновити
              </button>

              {authState === "ready" && (
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="inline-flex items-center gap-2 rounded-full border border-[#B39A74]/25 bg-[#B39A74]/10 px-4 py-3 text-[0.62rem] uppercase tracking-[0.3em] text-[#f5e7d0] transition hover:border-[#B39A74]/60 hover:bg-[#B39A74]/18"
                >
                  <LogOut className="h-4 w-4" />
                  Вийти
                </button>
              )}
            </div>
          </div>
        </div>

        {authState === "guest" ? (
          <div className="grid gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(179,154,116,0.18),rgba(255,255,255,0.04)_45%,rgba(0,0,0,0.2))] p-8 sm:p-10">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#B39A74]/25 bg-black/20 px-4 py-2 text-[0.62rem] uppercase tracking-[0.32em] text-[#E4D1B2]">
                <Shield className="h-4 w-4" />
                Захищений доступ
              </p>
              <h2 className="max-w-xl font-serif text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95] tracking-[-0.03em] text-white">
                Адмін-панель для
                <br />
                <span className="italic text-[#d7c09b]">самостійної заміни фото</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
                Тут можна оновлювати hero, портфоліо, reels, journal та всі інші зображення без редагування коду.
                Фото зберігаються в локальній базі даних, а самі файли завантажуються у внутрішнє сховище сайту.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  "окремі слоти по сторінках",
                  "оновлення через файл або URL",
                  "миттєвий прев'ю-контроль",
                ].map((item) => (
                  <div key={item} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 text-sm uppercase tracking-[0.24em] text-white/60">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={(event) => void handleLogin(event)}
              className="rounded-[1.75rem] border border-white/10 bg-black/30 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            >
              <p className="mb-3 text-[0.62rem] uppercase tracking-[0.34em] text-[#B39A74]">Вхід в CMS</p>
              <h3 className="font-serif text-4xl leading-none text-white">Введіть пароль</h3>
              <p className="mt-4 text-sm leading-7 text-white/55">
                Для безпечного доступу використовується серверний пароль `ADMIN_PASSWORD`.
              </p>

              <label className="mt-10 block">
                <span className="mb-3 block text-[0.62rem] uppercase tracking-[0.28em] text-white/45">
                  Пароль адміністратора
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/25 focus:border-[#B39A74]/60"
                  placeholder="Введіть пароль"
                  autoComplete="current-password"
                />
              </label>

              {authError && <p className="mt-4 text-sm text-[#ffb3b3]">{authError}</p>}

              <button
                type="submit"
                disabled={isSubmittingLogin || !password.trim()}
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#B39A74]/40 bg-[#B39A74]/14 px-5 py-4 text-[0.68rem] uppercase tracking-[0.32em] text-[#F3E7D2] transition hover:border-[#B39A74]/70 hover:bg-[#B39A74]/18 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmittingLogin ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                Увійти в адмінку
              </button>
            </form>
          </div>
        ) : (
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActivePage("all")}
                className={`rounded-full px-4 py-2 text-[0.62rem] uppercase tracking-[0.3em] transition ${
                  activePage === "all"
                    ? "border border-[#B39A74]/40 bg-[#B39A74]/14 text-[#F0DEBF]"
                    : "border border-white/10 bg-white/[0.03] text-white/50 hover:text-white"
                }`}
              >
                Усі сторінки
              </button>

              {pageEntries.map(([page, slotItems]) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setActivePage(page)}
                  className={`rounded-full px-4 py-2 text-[0.62rem] uppercase tracking-[0.3em] transition ${
                    activePage === page
                      ? "border border-[#B39A74]/40 bg-[#B39A74]/14 text-[#F0DEBF]"
                      : "border border-white/10 bg-white/[0.03] text-white/50 hover:text-white"
                  }`}
                >
                  {slotItems[0]?.pageLabel ?? page}
                </button>
              ))}
            </div>

            <div className="space-y-10">
              {visibleEntries.map(([page, slotItems]) => (
                <section key={page} className="space-y-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.34em] text-[#B39A74]">
                        {slotItems[0]?.pageLabel}
                      </p>
                      <h2 className="font-serif text-4xl text-white">{slotItems[0]?.pageLabel}</h2>
                    </div>
                    <p className="text-sm text-white/45">
                      {slotItems.length} фото-слот{slotItems.length > 1 ? "и" : ""}
                    </p>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    {slotItems.map((slot) => {
                      const draft = drafts[slot.slotId] ?? {
                        imageUrl: slot.imageUrl,
                        altText: slot.altText,
                      };
                      const status = slotStatus[slot.slotId];
                      const isBusy = busySlotId === slot.slotId;

                      return (
                        <article
                          key={slot.slotId}
                          className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25"
                        >
                          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
                            <div className="relative min-h-[20rem] overflow-hidden border-b border-white/10 bg-[#0f0f0f] lg:border-b-0 lg:border-r">
                              <ImageWithFallback
                                src={slot.imageUrl}
                                alt={slot.altText}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-5">
                                <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[#D8C3A1]">
                                  {slot.sectionLabel}
                                </p>
                                <h3 className="mt-2 font-serif text-3xl leading-none text-white">{slot.label}</h3>
                              </div>
                            </div>

                            <div className="space-y-5 p-5 sm:p-6">
                              <div>
                                <p className="text-[0.58rem] uppercase tracking-[0.3em] text-white/40">
                                  slot id
                                </p>
                                <p className="mt-2 text-sm text-white/65">{slot.slotId}</p>
                              </div>

                              <p className="text-sm leading-7 text-white/55">{slot.description}</p>

                              <div className="grid gap-4">
                                <label className="block">
                                  <span className="mb-2 block text-[0.58rem] uppercase tracking-[0.28em] text-white/40">
                                    Alt-текст
                                  </span>
                                  <input
                                    type="text"
                                    value={draft.altText}
                                    onChange={(event) => setDraft(slot.slotId, "altText", event.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#B39A74]/50"
                                  />
                                </label>

                                <label className="block">
                                  <span className="mb-2 block text-[0.58rem] uppercase tracking-[0.28em] text-white/40">
                                    URL зображення
                                  </span>
                                  <textarea
                                    rows={3}
                                    value={draft.imageUrl}
                                    onChange={(event) => setDraft(slot.slotId, "imageUrl", event.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#B39A74]/50"
                                  />
                                </label>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                  type="button"
                                  onClick={() => void handleSave(slot)}
                                  disabled={isBusy}
                                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#B39A74]/30 bg-[#B39A74]/12 px-4 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-[#F0DEBF] transition hover:border-[#B39A74]/60 hover:bg-[#B39A74]/18 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                  Зберегти URL
                                </button>

                                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-white/70 transition hover:border-white/20 hover:text-white">
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

                              <button
                                type="button"
                                onClick={() => void handleUpload(slot)}
                                disabled={isBusy}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-white/70 transition hover:border-[#B39A74]/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                Завантажити нове фото
                              </button>

                              <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
                                <span>Останнє оновлення: {formatUpdatedAt(slot.updatedAt)}</span>
                                {status && (
                                  <span
                                    className={
                                      status.tone === "success"
                                        ? "text-[#bfdcb7]"
                                        : status.tone === "error"
                                          ? "text-[#ffb3b3]"
                                          : "text-white/50"
                                    }
                                  >
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
          </div>
        )}
      </div>
    </div>
  );
}
