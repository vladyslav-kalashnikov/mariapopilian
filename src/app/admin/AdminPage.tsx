import { type FormEvent, useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle, LogOut, Palette, RefreshCcw, Shield, Type } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { ContentEditor } from "@/app/admin/ContentEditor";
import { PhotoSlotsEditor } from "@/app/admin/PhotoSlotsEditor";

type AdminPageProps = {
  onClose: () => void;
};

const TOKEN_KEY = "maria-cms-token";

export function AdminPage({ onClose }: AdminPageProps) {
  const { items, content, contentUpdatedAt, refresh, loading } = useSiteContent();
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authState, setAuthState] = useState<"checking" | "guest" | "ready">("checking");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "photos">("content");

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setAuthState("guest");
      return;
    }

    void (async () => {
      try {
        const response = await fetch("/api/admin/session", {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Сесія завершилась.");
        }

        setAuthToken(savedToken);
        setAuthState("ready");
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
        setAuthState("guest");
      }
    })();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingLogin(true);
    setAuthError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json().catch(() => null)) as { token?: string; error?: string } | null;
      if (!response.ok || !data?.token) {
        throw new Error(data?.error ?? "Не вдалося увійти.");
      }

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
              <button type="button" onClick={onClose} className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.34em] text-white/55 transition-colors hover:text-[#B39A74]">
                <ArrowLeft className="h-4 w-4" />
                назад на сайт
              </button>

              <div>
                <p className="mb-3 text-[0.65rem] uppercase tracking-[0.45em] text-[#B39A74]">Maria Editorial CMS</p>
                <h1 className="font-serif text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-white">
                  Повне керування
                  <br />
                  <span className="italic text-[#d8c3a1]">контентом і фото</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => void refresh()} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.62rem] uppercase tracking-[0.3em] text-white/70 transition hover:border-[#B39A74]/50 hover:text-white">
                <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin text-[#B39A74]" : ""}`} />
                Оновити
              </button>

              {authState === "ready" && (
                <button type="button" onClick={() => void handleLogout()} className="inline-flex items-center gap-2 rounded-full border border-[#B39A74]/25 bg-[#B39A74]/10 px-4 py-3 text-[0.62rem] uppercase tracking-[0.3em] text-[#f5e7d0] transition hover:border-[#B39A74]/60 hover:bg-[#B39A74]/18">
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
                Тепер вона може
                <br />
                <span className="italic text-[#d7c09b]">міняти весь сайт сама</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
                CMS тепер редагує тексти по всіх секціях, додає нові фото в галерею, нові reels, press, journal і окремо керує головними фото-слотами сайту.
              </p>
            </div>

            <form onSubmit={(event) => void handleLogin(event)} className="rounded-[1.75rem] border border-white/10 bg-black/30 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="mb-3 text-[0.62rem] uppercase tracking-[0.34em] text-[#B39A74]">Вхід в CMS</p>
              <h3 className="font-serif text-4xl leading-none text-white">Введіть пароль</h3>
              <p className="mt-4 text-sm leading-7 text-white/55">Для безпечного доступу використовується серверний пароль `ADMIN_PASSWORD`.</p>

              <label className="mt-10 block">
                <span className="mb-3 block text-[0.62rem] uppercase tracking-[0.28em] text-white/45">Пароль адміністратора</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/25 focus:border-[#B39A74]/60" placeholder="Введіть пароль" autoComplete="current-password" />
              </label>

              {authError && <p className="mt-4 text-sm text-[#ffb3b3]">{authError}</p>}

              <button type="submit" disabled={isSubmittingLogin || !password.trim()} className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#B39A74]/40 bg-[#B39A74]/14 px-5 py-4 text-[0.68rem] uppercase tracking-[0.32em] text-[#F3E7D2] transition hover:border-[#B39A74]/70 hover:bg-[#B39A74]/18 disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmittingLogin ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                Увійти в адмінку
              </button>
            </form>
          </div>
        ) : (
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => setActiveTab("content")} className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-[0.62rem] uppercase tracking-[0.3em] transition ${activeTab === "content" ? "border border-[#B39A74]/40 bg-[#B39A74]/14 text-[#F0DEBF]" : "border border-white/10 bg-white/[0.03] text-white/50 hover:text-white"}`}>
                <Type className="h-4 w-4" />
                Контент
              </button>
              <button type="button" onClick={() => setActiveTab("photos")} className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-[0.62rem] uppercase tracking-[0.3em] transition ${activeTab === "photos" ? "border border-[#B39A74]/40 bg-[#B39A74]/14 text-[#F0DEBF]" : "border border-white/10 bg-white/[0.03] text-white/50 hover:text-white"}`}>
                <Palette className="h-4 w-4" />
                Фото-слоти
              </button>
            </div>

            {authToken && activeTab === "content" && (
              <ContentEditor authToken={authToken} content={content} contentUpdatedAt={contentUpdatedAt} onRefresh={refresh} />
            )}

            {authToken && activeTab === "photos" && (
              <PhotoSlotsEditor authToken={authToken} items={items} onRefresh={refresh} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
