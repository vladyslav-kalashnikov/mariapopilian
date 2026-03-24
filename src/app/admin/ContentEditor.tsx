import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useMemo, useState } from "react";
import { LoaderCircle, Plus, Save, Trash2, Upload } from "lucide-react";

import { type SiteContent, cloneSiteContent } from "@/content/siteContent";

type ContentEditorProps = {
  authToken: string;
  content: SiteContent;
  contentUpdatedAt: string | null;
  onRefresh: () => Promise<void>;
};

type StatusState = {
  tone: "idle" | "success" | "error";
  text: string;
} | null;

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#B39A74]/50";
const textareaClassName =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#B39A74]/50";
const subtleButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-white/70 transition hover:border-[#B39A74]/35 hover:text-white";
const accentButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#B39A74]/30 bg-[#B39A74]/12 px-4 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-[#F0DEBF] transition hover:border-[#B39A74]/60 hover:bg-[#B39A74]/18";

function formatUpdatedAt(value: string | null) {
  if (!value) {
    return "Ще не зберігалось";
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

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
}

async function uploadImage(authToken: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  });

  const data = (await response.json().catch(() => null)) as { imageUrl?: string; error?: string } | null;
  if (!response.ok || !data?.imageUrl) {
    throw new Error(data?.error ?? "Не вдалося завантажити зображення.");
  }

  return data.imageUrl;
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-[0.62rem] uppercase tracking-[0.34em] text-[#B39A74]">{title}</p>
        {description && <p className="mt-2 max-w-3xl text-sm leading-7 text-white/55">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
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

function UploadButton({
  label,
  disabled,
  onFile,
}: {
  label: string;
  disabled?: boolean;
  onFile: (file: File) => void;
}) {
  return (
    <label className={`${subtleButtonClassName} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
      <Upload className="h-4 w-4" />
      {label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFile(file);
          }
          event.currentTarget.value = "";
        }}
      />
    </label>
  );
}

function updateStringList(
  setDraft: Dispatch<SetStateAction<SiteContent>>,
  updater: (draft: SiteContent, items: string[]) => void,
  nextItems: string[],
) {
  setDraft((current) => {
    const next = cloneSiteContent(current);
    updater(next, nextItems);
    return next;
  });
}

function StringListEditor({
  title,
  items,
  placeholder,
  onChange,
}: {
  title: string;
  items: string[];
  placeholder: string;
  onChange: (nextItems: string[]) => void;
}) {
  return (
    <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">{title}</p>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className={subtleButtonClassName}
        >
          <Plus className="h-4 w-4" />
          Додати
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              value={item}
              onChange={(event) => {
                const nextItems = [...items];
                nextItems[index] = event.target.value;
                onChange(nextItems);
              }}
              placeholder={placeholder}
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className={subtleButtonClassName}
            >
              <Trash2 className="h-4 w-4" />
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContentEditor({ authToken, content, contentUpdatedAt, onRefresh }: ContentEditorProps) {
  const [draft, setDraft] = useState<SiteContent>(() => cloneSiteContent(content));
  const [status, setStatus] = useState<StatusState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    setDraft(cloneSiteContent(content));
  }, [content]);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(content),
    [content, draft],
  );

  function mutateDraft(mutator: (next: SiteContent) => void) {
    setDraft((current) => {
      const next = cloneSiteContent(current);
      mutator(next);
      return next;
    });
    setStatus(null);
  }

  async function handleSave() {
    setIsSaving(true);
    setStatus({ tone: "idle", text: "Зберігаю контент..." });

    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: draft }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error ?? "Не вдалося зберегти контент.");
      }

      await onRefresh();
      setStatus({ tone: "success", text: "Усі текстові зміни збережено." });
    } catch (error) {
      setStatus({
        tone: "error",
        text: error instanceof Error ? error.message : "Не вдалося зберегти контент.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageUpload(file: File, key: string, onUploaded: (imageUrl: string) => void) {
    setUploadingKey(key);
    setStatus({ tone: "idle", text: "Завантажую зображення..." });

    try {
      const imageUrl = await uploadImage(authToken, file);
      onUploaded(imageUrl);
      setStatus({ tone: "success", text: "Зображення завантажено. Не забудьте натиснути «Зберегти контент»." });
    } catch (error) {
      setStatus({
        tone: "error",
        text: error instanceof Error ? error.message : "Не вдалося завантажити зображення.",
      });
    } finally {
      setUploadingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-4 z-20 rounded-[1.5rem] border border-white/10 bg-[#0b0b0b]/95 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.34em] text-[#B39A74]">Контент сайту</p>
            <p className="mt-2 text-sm text-white/55">Останнє збереження: {formatUpdatedAt(contentUpdatedAt)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {status && (
              <span className={status.tone === "success" ? "text-sm text-[#bfdcb7]" : status.tone === "error" ? "text-sm text-[#ffb3b3]" : "text-sm text-white/55"}>
                {status.text}
              </span>
            )}
            <button type="button" onClick={() => void handleSave()} disabled={isSaving || !isDirty} className={`${accentButtonClassName} ${isSaving || !isDirty ? "cursor-not-allowed opacity-50" : ""}`}>
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isDirty ? "Зберегти контент" : "Змін немає"}
            </button>
          </div>
        </div>
      </div>

      <SectionCard title="Navigation" description="Лого, назви сторінок і соціальні посилання в шапці сайту.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Logo primary">
            <input value={draft.navigation.logoPrimary} onChange={(event) => mutateDraft((next) => { next.navigation.logoPrimary = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Logo accent">
            <input value={draft.navigation.logoAccent} onChange={(event) => mutateDraft((next) => { next.navigation.logoAccent = event.target.value; })} className={inputClassName} />
          </Field>
        </div>

        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Menu links</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.navigation.links.push({ id: "new-page", label: "New Link" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати лінк
            </button>
          </div>
          {draft.navigation.links.map((link, index) => (
            <div key={`${link.id}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input value={link.id} onChange={(event) => mutateDraft((next) => { next.navigation.links[index].id = event.target.value; })} placeholder="id" className={inputClassName} />
              <input value={link.label} onChange={(event) => mutateDraft((next) => { next.navigation.links[index].label = event.target.value; })} placeholder="label" className={inputClassName} />
              <button type="button" onClick={() => mutateDraft((next) => { next.navigation.links.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Social links</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.navigation.socialLinks.push({ id: "social", label: "Social", url: "https://" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати соцмережу
            </button>
          </div>
          {draft.navigation.socialLinks.map((social, index) => (
            <div key={`${social.id}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
              <input value={social.id} onChange={(event) => mutateDraft((next) => { next.navigation.socialLinks[index].id = event.target.value; })} placeholder="icon id" className={inputClassName} />
              <input value={social.label} onChange={(event) => mutateDraft((next) => { next.navigation.socialLinks[index].label = event.target.value; })} placeholder="label" className={inputClassName} />
              <input value={social.url} onChange={(event) => mutateDraft((next) => { next.navigation.socialLinks[index].url = event.target.value; })} placeholder="url" className={inputClassName} />
              <button type="button" onClick={() => mutateDraft((next) => { next.navigation.socialLinks.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Hero">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Badge">
            <input value={draft.hero.badge} onChange={(event) => mutateDraft((next) => { next.hero.badge = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="CTA">
            <input value={draft.hero.ctaLabel} onChange={(event) => mutateDraft((next) => { next.hero.ctaLabel = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="First name">
            <input value={draft.hero.firstName} onChange={(event) => mutateDraft((next) => { next.hero.firstName = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Last name">
            <input value={draft.hero.lastName} onChange={(event) => mutateDraft((next) => { next.hero.lastName = event.target.value; })} className={inputClassName} />
          </Field>
        </div>

        <StringListEditor
          title="Roles"
          items={draft.hero.roles}
          placeholder="Role"
          onChange={(nextItems) =>
            updateStringList(setDraft, (next, items) => {
              next.hero.roles = items;
            }, nextItems)
          }
        />

        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Highlights cards</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.hero.highlights.push({ label: "New label", value: "New value" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати картку
            </button>
          </div>
          {draft.hero.highlights.map((item, index) => (
            <div key={`${item.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
              <input value={item.label} onChange={(event) => mutateDraft((next) => { next.hero.highlights[index].label = event.target.value; })} placeholder="label" className={inputClassName} />
              <input value={item.value} onChange={(event) => mutateDraft((next) => { next.hero.highlights[index].value = event.target.value; })} placeholder="value" className={inputClassName} />
              <button type="button" onClick={() => mutateDraft((next) => { next.hero.highlights.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="About">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Watermark">
            <input value={draft.about.watermark} onChange={(event) => mutateDraft((next) => { next.about.watermark = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Eyebrow">
            <input value={draft.about.eyebrow} onChange={(event) => mutateDraft((next) => { next.about.eyebrow = event.target.value; })} className={inputClassName} />
          </Field>
        </div>

        <StringListEditor
          title="Headline lines"
          items={draft.about.headlineLines}
          placeholder="Line"
          onChange={(nextItems) =>
            updateStringList(setDraft, (next, items) => {
              next.about.headlineLines = items;
            }, nextItems)
          }
        />

        <StringListEditor
          title="Paragraphs"
          items={draft.about.paragraphs}
          placeholder="Paragraph"
          onChange={(nextItems) =>
            updateStringList(setDraft, (next, items) => {
              next.about.paragraphs = items;
            }, nextItems)
          }
        />

        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Stats</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.about.stats.push({ value: "0", label: "NEW" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати стат
            </button>
          </div>
          {draft.about.stats.map((item, index) => (
            <div key={`${item.value}-${item.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input value={item.value} onChange={(event) => mutateDraft((next) => { next.about.stats[index].value = event.target.value; })} placeholder="value" className={inputClassName} />
              <input value={item.label} onChange={(event) => mutateDraft((next) => { next.about.stats[index].label = event.target.value; })} placeholder="label" className={inputClassName} />
              <button type="button" onClick={() => mutateDraft((next) => { next.about.stats.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Services">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Eyebrow">
            <input value={draft.services.eyebrow} onChange={(event) => mutateDraft((next) => { next.services.eyebrow = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Title line">
            <input value={draft.services.titleLine1} onChange={(event) => mutateDraft((next) => { next.services.titleLine1 = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Accent">
            <input value={draft.services.titleAccent} onChange={(event) => mutateDraft((next) => { next.services.titleAccent = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={draft.services.description} onChange={(event) => mutateDraft((next) => { next.services.description = event.target.value; })} rows={4} className={textareaClassName} />
        </Field>
        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Service items</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.services.items.push({ num: "00", title: "New service", desc: "Description" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати сервіс
            </button>
          </div>
          {draft.services.items.map((item, index) => (
            <div key={`${item.num}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-[120px_1fr_auto]">
              <input value={item.num} onChange={(event) => mutateDraft((next) => { next.services.items[index].num = event.target.value; })} className={inputClassName} />
              <div className="space-y-3">
                <input value={item.title} onChange={(event) => mutateDraft((next) => { next.services.items[index].title = event.target.value; })} placeholder="title" className={inputClassName} />
                <textarea value={item.desc} onChange={(event) => mutateDraft((next) => { next.services.items[index].desc = event.target.value; })} rows={3} className={textareaClassName} />
              </div>
              <button type="button" onClick={() => mutateDraft((next) => { next.services.items.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Personal Brand">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Watermark">
            <input value={draft.personalBrand.watermark} onChange={(event) => mutateDraft((next) => { next.personalBrand.watermark = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Eyebrow">
            <input value={draft.personalBrand.eyebrow} onChange={(event) => mutateDraft((next) => { next.personalBrand.eyebrow = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Title main">
            <input value={draft.personalBrand.titleMain} onChange={(event) => mutateDraft((next) => { next.personalBrand.titleMain = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Accent">
            <input value={draft.personalBrand.titleAccent} onChange={(event) => mutateDraft((next) => { next.personalBrand.titleAccent = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Values</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.personalBrand.values.push({ num: "00", title: "Нова цінність", description: "Опис" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати value
            </button>
          </div>
          {draft.personalBrand.values.map((item, index) => (
            <div key={`${item.num}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-[120px_1fr_auto]">
              <input value={item.num} onChange={(event) => mutateDraft((next) => { next.personalBrand.values[index].num = event.target.value; })} className={inputClassName} />
              <div className="space-y-3">
                <input value={item.title} onChange={(event) => mutateDraft((next) => { next.personalBrand.values[index].title = event.target.value; })} className={inputClassName} />
                <textarea value={item.description} onChange={(event) => mutateDraft((next) => { next.personalBrand.values[index].description = event.target.value; })} rows={3} className={textareaClassName} />
              </div>
              <button type="button" onClick={() => mutateDraft((next) => { next.personalBrand.values.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити
              </button>
            </div>
          ))}
        </div>
        <Field label="Quote">
          <textarea value={draft.personalBrand.quote} onChange={(event) => mutateDraft((next) => { next.personalBrand.quote = event.target.value; })} rows={4} className={textareaClassName} />
        </Field>
        <Field label="Quote author">
          <input value={draft.personalBrand.quoteAuthor} onChange={(event) => mutateDraft((next) => { next.personalBrand.quoteAuthor = event.target.value; })} className={inputClassName} />
        </Field>
      </SectionCard>

      <SectionCard title="Career Timeline">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Watermark">
            <input value={draft.careerTimeline.watermark} onChange={(event) => mutateDraft((next) => { next.careerTimeline.watermark = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Eyebrow">
            <input value={draft.careerTimeline.eyebrow} onChange={(event) => mutateDraft((next) => { next.careerTimeline.eyebrow = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Title line">
            <input value={draft.careerTimeline.titleLine1} onChange={(event) => mutateDraft((next) => { next.careerTimeline.titleLine1 = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Accent">
            <input value={draft.careerTimeline.titleAccent} onChange={(event) => mutateDraft((next) => { next.careerTimeline.titleAccent = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={draft.careerTimeline.description} onChange={(event) => mutateDraft((next) => { next.careerTimeline.description = event.target.value; })} rows={4} className={textareaClassName} />
        </Field>
        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Highlights</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.careerTimeline.highlights.push({ label: "Нове", value: "0" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати highlight
            </button>
          </div>
          {draft.careerTimeline.highlights.map((item, index) => (
            <div key={`${item.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input value={item.value} onChange={(event) => mutateDraft((next) => { next.careerTimeline.highlights[index].value = event.target.value; })} className={inputClassName} />
              <input value={item.label} onChange={(event) => mutateDraft((next) => { next.careerTimeline.highlights[index].label = event.target.value; })} className={inputClassName} />
              <button type="button" onClick={() => mutateDraft((next) => { next.careerTimeline.highlights.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Achievements</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.careerTimeline.achievements.push({ year: "2026", title: "Нова подія", description: "Короткий опис", details: "Детальний опис" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати етап
            </button>
          </div>
          {draft.careerTimeline.achievements.map((item, index) => (
            <div key={`${item.year}-${item.title}-${index}`} className="space-y-3 rounded-2xl border border-white/10 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input value={item.year} onChange={(event) => mutateDraft((next) => { next.careerTimeline.achievements[index].year = event.target.value; })} placeholder="year" className={inputClassName} />
                <input value={item.title} onChange={(event) => mutateDraft((next) => { next.careerTimeline.achievements[index].title = event.target.value; })} placeholder="title" className={inputClassName} />
              </div>
              <textarea value={item.description} onChange={(event) => mutateDraft((next) => { next.careerTimeline.achievements[index].description = event.target.value; })} rows={3} placeholder="short description" className={textareaClassName} />
              <textarea value={item.details} onChange={(event) => mutateDraft((next) => { next.careerTimeline.achievements[index].details = event.target.value; })} rows={5} placeholder="details" className={textareaClassName} />
              <button type="button" onClick={() => mutateDraft((next) => { next.careerTimeline.achievements.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити етап
              </button>
            </div>
          ))}
        </div>
        <Field label="Quote">
          <textarea value={draft.careerTimeline.quote} onChange={(event) => mutateDraft((next) => { next.careerTimeline.quote = event.target.value; })} rows={4} className={textareaClassName} />
        </Field>
        <Field label="Quote author">
          <input value={draft.careerTimeline.quoteAuthor} onChange={(event) => mutateDraft((next) => { next.careerTimeline.quoteAuthor = event.target.value; })} className={inputClassName} />
        </Field>
      </SectionCard>

      <SectionCard title="Charity">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Eyebrow">
            <input value={draft.charity.eyebrow} onChange={(event) => mutateDraft((next) => { next.charity.eyebrow = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Title line">
            <input value={draft.charity.titleLine1} onChange={(event) => mutateDraft((next) => { next.charity.titleLine1 = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Accent">
            <input value={draft.charity.titleAccent} onChange={(event) => mutateDraft((next) => { next.charity.titleAccent = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Button label">
            <input value={draft.charity.buttonLabel} onChange={(event) => mutateDraft((next) => { next.charity.buttonLabel = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
        <StringListEditor
          title="Paragraphs"
          items={draft.charity.paragraphs}
          placeholder="Paragraph"
          onChange={(nextItems) =>
            updateStringList(setDraft, (next, items) => {
              next.charity.paragraphs = items;
            }, nextItems)
          }
        />
      </SectionCard>

      <SectionCard title="Portfolio Gallery" description="Тут можна додавати нові фото в галерею, міняти категорії та назви.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title line">
            <input value={draft.portfolio.titleLine1} onChange={(event) => mutateDraft((next) => { next.portfolio.titleLine1 = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Accent">
            <input value={draft.portfolio.titleAccent} onChange={(event) => mutateDraft((next) => { next.portfolio.titleAccent = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Gallery items</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.portfolio.items.push({ id: makeId("portfolio"), imageUrl: "", altText: "", category: "Нова категорія", title: "Нове фото" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати фото
            </button>
          </div>
          {draft.portfolio.items.map((item, index) => (
            <div key={item.id || index} className="space-y-3 rounded-2xl border border-white/10 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <input value={item.title} onChange={(event) => mutateDraft((next) => { next.portfolio.items[index].title = event.target.value; })} placeholder="title" className={inputClassName} />
                <input value={item.category} onChange={(event) => mutateDraft((next) => { next.portfolio.items[index].category = event.target.value; })} placeholder="category" className={inputClassName} />
                <input value={item.altText} onChange={(event) => mutateDraft((next) => { next.portfolio.items[index].altText = event.target.value; })} placeholder="alt text" className={inputClassName} />
              </div>
              <textarea value={item.imageUrl} onChange={(event) => mutateDraft((next) => { next.portfolio.items[index].imageUrl = event.target.value; })} rows={2} placeholder="image url" className={textareaClassName} />
              <div className="flex flex-wrap gap-3">
                <UploadButton
                  label={uploadingKey === `portfolio-${index}` ? "Завантаження..." : "Завантажити фото"}
                  disabled={uploadingKey !== null}
                  onFile={(file) => void handleImageUpload(file, `portfolio-${index}`, (imageUrl) => mutateDraft((next) => { next.portfolio.items[index].imageUrl = imageUrl; }))}
                />
                <button type="button" onClick={() => mutateDraft((next) => { next.portfolio.items.splice(index, 1); })} className={subtleButtonClassName}>
                  <Trash2 className="h-4 w-4" />
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Reels">
        <div className="grid gap-4 md:grid-cols-5">
          <Field label="Eyebrow">
            <input value={draft.reels.eyebrow} onChange={(event) => mutateDraft((next) => { next.reels.eyebrow = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Title line">
            <input value={draft.reels.titleLine1} onChange={(event) => mutateDraft((next) => { next.reels.titleLine1 = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Accent">
            <input value={draft.reels.titleAccent} onChange={(event) => mutateDraft((next) => { next.reels.titleAccent = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="More label">
            <input value={draft.reels.moreLabel} onChange={(event) => mutateDraft((next) => { next.reels.moreLabel = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="More url">
            <input value={draft.reels.moreUrl} onChange={(event) => mutateDraft((next) => { next.reels.moreUrl = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Reel items</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.reels.items.push({ id: makeId("reel"), imageUrl: "", altText: "", title: "Новий reel", duration: "0:30" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати reel
            </button>
          </div>
          {draft.reels.items.map((item, index) => (
            <div key={item.id || index} className="space-y-3 rounded-2xl border border-white/10 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <input value={item.title} onChange={(event) => mutateDraft((next) => { next.reels.items[index].title = event.target.value; })} placeholder="title" className={inputClassName} />
                <input value={item.duration} onChange={(event) => mutateDraft((next) => { next.reels.items[index].duration = event.target.value; })} placeholder="duration" className={inputClassName} />
                <input value={item.altText} onChange={(event) => mutateDraft((next) => { next.reels.items[index].altText = event.target.value; })} placeholder="alt text" className={inputClassName} />
              </div>
              <textarea value={item.imageUrl} onChange={(event) => mutateDraft((next) => { next.reels.items[index].imageUrl = event.target.value; })} rows={2} placeholder="image url" className={textareaClassName} />
              <div className="flex flex-wrap gap-3">
                <UploadButton label={uploadingKey === `reels-${index}` ? "Завантаження..." : "Завантажити обкладинку"} disabled={uploadingKey !== null} onFile={(file) => void handleImageUpload(file, `reels-${index}`, (imageUrl) => mutateDraft((next) => { next.reels.items[index].imageUrl = imageUrl; }))} />
                <button type="button" onClick={() => mutateDraft((next) => { next.reels.items.splice(index, 1); })} className={subtleButtonClassName}>
                  <Trash2 className="h-4 w-4" />
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Press">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Watermark">
            <input value={draft.press.watermark} onChange={(event) => mutateDraft((next) => { next.press.watermark = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Eyebrow">
            <input value={draft.press.eyebrow} onChange={(event) => mutateDraft((next) => { next.press.eyebrow = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Title line">
            <input value={draft.press.titleLine1} onChange={(event) => mutateDraft((next) => { next.press.titleLine1 = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Accent">
            <input value={draft.press.titleAccent} onChange={(event) => mutateDraft((next) => { next.press.titleAccent = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Press items</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.press.items.push({ year: "2026", magazine: "MAGAZINE", title: "Нова публікація", category: "Feature", url: "https://" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати публікацію
            </button>
          </div>
          {draft.press.items.map((item, index) => (
            <div key={`${item.magazine}-${index}`} className="space-y-3 rounded-2xl border border-white/10 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <input value={item.year} onChange={(event) => mutateDraft((next) => { next.press.items[index].year = event.target.value; })} placeholder="year" className={inputClassName} />
                <input value={item.magazine} onChange={(event) => mutateDraft((next) => { next.press.items[index].magazine = event.target.value; })} placeholder="magazine" className={inputClassName} />
                <input value={item.category} onChange={(event) => mutateDraft((next) => { next.press.items[index].category = event.target.value; })} placeholder="category" className={inputClassName} />
              </div>
              <textarea value={item.title} onChange={(event) => mutateDraft((next) => { next.press.items[index].title = event.target.value; })} rows={3} placeholder="title" className={textareaClassName} />
              <input value={item.url} onChange={(event) => mutateDraft((next) => { next.press.items[index].url = event.target.value; })} placeholder="url" className={inputClassName} />
              <button type="button" onClick={() => mutateDraft((next) => { next.press.items.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Journal">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Title prefix">
            <input value={draft.journal.titlePrefix} onChange={(event) => mutateDraft((next) => { next.journal.titlePrefix = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Title accent">
            <input value={draft.journal.titleAccent} onChange={(event) => mutateDraft((next) => { next.journal.titleAccent = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Eyebrow">
            <input value={draft.journal.eyebrow} onChange={(event) => mutateDraft((next) => { next.journal.eyebrow = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Journal items</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.journal.items.push({ id: makeId("journal"), imageUrl: "", altText: "", date: "01 Січня, 2026", title: "Нова стаття", href: "#", ctaLabel: "Читати статтю" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати статтю
            </button>
          </div>
          {draft.journal.items.map((item, index) => (
            <div key={item.id || index} className="space-y-3 rounded-2xl border border-white/10 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <input value={item.date} onChange={(event) => mutateDraft((next) => { next.journal.items[index].date = event.target.value; })} placeholder="date" className={inputClassName} />
                <input value={item.ctaLabel} onChange={(event) => mutateDraft((next) => { next.journal.items[index].ctaLabel = event.target.value; })} placeholder="cta label" className={inputClassName} />
                <input value={item.altText} onChange={(event) => mutateDraft((next) => { next.journal.items[index].altText = event.target.value; })} placeholder="alt text" className={inputClassName} />
              </div>
              <textarea value={item.title} onChange={(event) => mutateDraft((next) => { next.journal.items[index].title = event.target.value; })} rows={3} placeholder="title" className={textareaClassName} />
              <input value={item.href} onChange={(event) => mutateDraft((next) => { next.journal.items[index].href = event.target.value; })} placeholder="href" className={inputClassName} />
              <textarea value={item.imageUrl} onChange={(event) => mutateDraft((next) => { next.journal.items[index].imageUrl = event.target.value; })} rows={2} placeholder="image url" className={textareaClassName} />
              <div className="flex flex-wrap gap-3">
                <UploadButton label={uploadingKey === `journal-${index}` ? "Завантаження..." : "Завантажити фото"} disabled={uploadingKey !== null} onFile={(file) => void handleImageUpload(file, `journal-${index}`, (imageUrl) => mutateDraft((next) => { next.journal.items[index].imageUrl = imageUrl; }))} />
                <button type="button" onClick={() => mutateDraft((next) => { next.journal.items.splice(index, 1); })} className={subtleButtonClassName}>
                  <Trash2 className="h-4 w-4" />
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Contact & Footer">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Watermark">
            <input value={draft.contact.watermark} onChange={(event) => mutateDraft((next) => { next.contact.watermark = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Eyebrow">
            <input value={draft.contact.eyebrow} onChange={(event) => mutateDraft((next) => { next.contact.eyebrow = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Title prefix">
            <input value={draft.contact.titlePrefix} onChange={(event) => mutateDraft((next) => { next.contact.titlePrefix = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Title accent">
            <input value={draft.contact.titleAccent} onChange={(event) => mutateDraft((next) => { next.contact.titleAccent = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
        <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">Contact methods</p>
            <button type="button" onClick={() => mutateDraft((next) => { next.contact.methods.push({ label: "New", value: "value", href: "https://" }); })} className={subtleButtonClassName}>
              <Plus className="h-4 w-4" />
              Додати метод
            </button>
          </div>
          {draft.contact.methods.map((method, index) => (
            <div key={`${method.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
              <input value={method.label} onChange={(event) => mutateDraft((next) => { next.contact.methods[index].label = event.target.value; })} placeholder="label" className={inputClassName} />
              <input value={method.value} onChange={(event) => mutateDraft((next) => { next.contact.methods[index].value = event.target.value; })} placeholder="value" className={inputClassName} />
              <input value={method.href} onChange={(event) => mutateDraft((next) => { next.contact.methods[index].href = event.target.value; })} placeholder="href" className={inputClassName} />
              <button type="button" onClick={() => mutateDraft((next) => { next.contact.methods.splice(index, 1); })} className={subtleButtonClassName}>
                <Trash2 className="h-4 w-4" />
                Видалити
              </button>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name placeholder">
            <input value={draft.contact.form.namePlaceholder} onChange={(event) => mutateDraft((next) => { next.contact.form.namePlaceholder = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Email placeholder">
            <input value={draft.contact.form.emailPlaceholder} onChange={(event) => mutateDraft((next) => { next.contact.form.emailPlaceholder = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Details placeholder">
            <input value={draft.contact.form.detailsPlaceholder} onChange={(event) => mutateDraft((next) => { next.contact.form.detailsPlaceholder = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Submit label">
            <input value={draft.contact.form.submitLabel} onChange={(event) => mutateDraft((next) => { next.contact.form.submitLabel = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Footer left">
            <input value={draft.contact.footerLeft} onChange={(event) => mutateDraft((next) => { next.contact.footerLeft = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="Footer right">
            <input value={draft.contact.footerRight} onChange={(event) => mutateDraft((next) => { next.contact.footerRight = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Global Footer">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Copyright">
            <input value={draft.footer.copyright} onChange={(event) => mutateDraft((next) => { next.footer.copyright = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="CTA label">
            <input value={draft.footer.ctaLabel} onChange={(event) => mutateDraft((next) => { next.footer.ctaLabel = event.target.value; })} className={inputClassName} />
          </Field>
          <Field label="CMS label">
            <input value={draft.footer.cmsLabel} onChange={(event) => mutateDraft((next) => { next.footer.cmsLabel = event.target.value; })} className={inputClassName} />
          </Field>
        </div>
      </SectionCard>

      <div className="rounded-[1.5rem] border border-dashed border-[#B39A74]/25 bg-[#B39A74]/[0.04] p-5 text-sm leading-7 text-white/55">
        Підказка: після зміни текстів, карток або додавання нових елементів у галерею чи reels натисніть <span className="text-[#F0DEBF]">«Зберегти контент»</span>. Завантаження зображення лише підставляє новий URL у форму, але не публікує зміни без збереження.
      </div>
    </div>
  );
}
