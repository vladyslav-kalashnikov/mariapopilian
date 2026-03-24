import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { Readable } from "node:stream";

import {
  getContentDocument,
  getPhotoSlot,
  getUploadsDirectory,
  getWorkspaceRoot,
  listPhotoSlots,
  updateContentDocument,
  updatePhotoSlot,
} from "./database.mjs";

const initialEnvKeys = new Set(Object.keys(process.env));
const workspaceRoot = getWorkspaceRoot();

function loadEnvFile(filename) {
  const envPath = path.join(workspaceRoot, filename);
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const delimiterIndex = trimmed.indexOf("=");
    if (delimiterIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, delimiterIndex).trim();
    const value = trimmed.slice(delimiterIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!key || initialEnvKeys.has(key)) {
      continue;
    }

    process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? "3001");
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const DEFAULT_ADMIN_PASSWORD = "change-me-please";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
const distDir = path.join(workspaceRoot, "dist");
const uploadsDir = getUploadsDirectory();
const seedImagesDir = path.join(workspaceRoot, "src", "images");
const sessions = new Map();

if (ADMIN_PASSWORD === DEFAULT_ADMIN_PASSWORD) {
  console.warn(
    "[cms] ADMIN_PASSWORD is not set. Using the default password 'change-me-please'. Set ADMIN_PASSWORD for real usage.",
  );
}

setInterval(() => {
  const now = Date.now();
  for (const [token, expiresAt] of sessions.entries()) {
    if (expiresAt <= now) {
      sessions.delete(token);
    }
  }
}, 1000 * 60 * 15).unref();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function getMimeType(filePath) {
  return mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(text);
}

function sendNoContent(res) {
  res.writeHead(204);
  res.end();
}

function safeJoin(rootDir, requestedPath) {
  const absolutePath = path.resolve(rootDir, `.${requestedPath}`);
  const relativePath = path.relative(rootDir, absolutePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }
  return absolutePath;
}

function streamFile(res, filePath, cacheControl = "public, max-age=31536000, immutable") {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    sendJson(res, 404, { error: "File not found." });
    return;
  }

  res.writeHead(200, {
    "Content-Type": getMimeType(filePath),
    "Cache-Control": cacheControl,
  });

  fs.createReadStream(filePath).pipe(res);
}

function isSessionValid(token) {
  const expiresAt = token ? sessions.get(token) : undefined;
  if (!expiresAt) {
    return false;
  }
  if (expiresAt <= Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

function requireAdmin(req, res) {
  const token = getBearerToken(req);
  if (!isSessionValid(token)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }
  return token;
}

function createWebRequest(req) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const init = {
    method: req.method,
    headers: req.headers,
  };

  if (req.method && !["GET", "HEAD"].includes(req.method.toUpperCase())) {
    init.body = Readable.toWeb(req);
    init.duplex = "half";
  }

  return new Request(url, init);
}

async function readJson(req) {
  const webRequest = createWebRequest(req);
  return webRequest.json();
}

async function readFormData(req) {
  const webRequest = createWebRequest(req);
  return webRequest.formData();
}

function sanitizeFilename(filename) {
  const ext = path.extname(filename).toLowerCase() || ".bin";
  const base = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "upload"}-${crypto.randomUUID()}${ext}`;
}

async function handleLogin(req, res) {
  try {
    const body = await readJson(req);
    if (!body?.password || body.password !== ADMIN_PASSWORD) {
      sendJson(res, 401, { error: "Невірний пароль." });
      return;
    }

    const token = crypto.randomUUID();
    sessions.set(token, Date.now() + SESSION_TTL_MS);
    sendJson(res, 200, {
      token,
      expiresInMs: SESSION_TTL_MS,
    });
  } catch {
    sendJson(res, 400, { error: "Не вдалося прочитати запит." });
  }
}

function handleSession(req, res) {
  const token = requireAdmin(req, res);
  if (!token) {
    return;
  }

  sessions.set(token, Date.now() + SESSION_TTL_MS);
  sendJson(res, 200, { ok: true });
}

function handleLogout(req, res) {
  const token = getBearerToken(req);
  if (token) {
    sessions.delete(token);
  }
  sendNoContent(res);
}

function handleListPhotoSlots(res) {
  sendJson(res, 200, { items: listPhotoSlots() });
}

function handlePublicSiteContent(res) {
  const document = getContentDocument("site_content");
  sendJson(res, 200, {
    items: listPhotoSlots(),
    content: document?.value ?? null,
    contentUpdatedAt: document?.updatedAt ?? null,
  });
}

async function handleUpdatePhotoSlot(req, res, slotId) {
  const token = requireAdmin(req, res);
  if (!token) {
    return;
  }

  try {
    const body = await readJson(req);
    const current = getPhotoSlot(slotId);

    if (!current) {
      sendJson(res, 404, { error: "Слот не знайдено." });
      return;
    }

    const nextImageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : current.imageUrl;
    const nextAltText = typeof body?.altText === "string" ? body.altText.trim() : current.altText;

    if (!nextImageUrl) {
      sendJson(res, 400, { error: "Потрібно вказати URL зображення." });
      return;
    }

    const updated = updatePhotoSlot(slotId, {
      imageUrl: nextImageUrl,
      altText: nextAltText || current.altText,
    });

    sessions.set(token, Date.now() + SESSION_TTL_MS);
    sendJson(res, 200, { item: updated });
  } catch {
    sendJson(res, 400, { error: "Не вдалося оновити слот." });
  }
}

async function handleUpload(req, res, slotId) {
  const token = requireAdmin(req, res);
  if (!token) {
    return;
  }

  const current = getPhotoSlot(slotId);
  if (!current) {
    sendJson(res, 404, { error: "Слот не знайдено." });
    return;
  }

  try {
    const formData = await readFormData(req);
    const file = formData.get("file");
    const altText = formData.get("altText");

    if (!(file instanceof File)) {
      sendJson(res, 400, { error: "Потрібно додати файл." });
      return;
    }

    if (!file.type.startsWith("image/")) {
      sendJson(res, 400, { error: "Можна завантажувати лише зображення." });
      return;
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filename = sanitizeFilename(file.name);
    const targetPath = path.join(uploadsDir, filename);
    fs.writeFileSync(targetPath, fileBuffer);

    const updated = updatePhotoSlot(slotId, {
      imageUrl: `/uploads/${filename}`,
      altText: typeof altText === "string" && altText.trim() ? altText.trim() : current.altText,
    });

    sessions.set(token, Date.now() + SESSION_TTL_MS);
    sendJson(res, 200, { item: updated });
  } catch {
    sendJson(res, 400, { error: "Не вдалося завантажити файл." });
  }
}

async function handleUpdateSiteContent(req, res) {
  const token = requireAdmin(req, res);
  if (!token) {
    return;
  }

  try {
    const body = await readJson(req);
    if (!body || typeof body !== "object" || !("value" in body) || typeof body.value !== "object" || body.value === null) {
      sendJson(res, 400, { error: "Потрібно передати коректний content document." });
      return;
    }

    const updated = updateContentDocument("site_content", body.value);
    sessions.set(token, Date.now() + SESSION_TTL_MS);
    sendJson(res, 200, {
      content: updated?.value ?? null,
      contentUpdatedAt: updated?.updatedAt ?? null,
    });
  } catch {
    sendJson(res, 400, { error: "Не вдалося зберегти контент." });
  }
}

async function handleGenericUpload(req, res) {
  const token = requireAdmin(req, res);
  if (!token) {
    return;
  }

  try {
    const formData = await readFormData(req);
    const file = formData.get("file");

    if (!(file instanceof File)) {
      sendJson(res, 400, { error: "Потрібно додати файл." });
      return;
    }

    if (!file.type.startsWith("image/")) {
      sendJson(res, 400, { error: "Можна завантажувати лише зображення." });
      return;
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filename = sanitizeFilename(file.name);
    const targetPath = path.join(uploadsDir, filename);
    fs.writeFileSync(targetPath, fileBuffer);

    sessions.set(token, Date.now() + SESSION_TTL_MS);
    sendJson(res, 200, {
      imageUrl: `/uploads/${filename}`,
      filename,
    });
  } catch {
    sendJson(res, 400, { error: "Не вдалося завантажити файл." });
  }
}

function serveFrontend(res, requestedPathname) {
  const indexPath = path.join(distDir, "index.html");
  const assetPath = safeJoin(distDir, requestedPathname);

  if (assetPath && fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
    streamFile(res, assetPath, "public, max-age=3600");
    return;
  }

  if (fs.existsSync(indexPath)) {
    streamFile(res, indexPath, "no-store");
    return;
  }

  sendText(
    res,
    404,
    "Frontend build not found. Run `npm run dev` for development or `npm run build` before `npm run start`.",
  );
}

const server = http.createServer(async (req, res) => {
  const method = req.method?.toUpperCase() ?? "GET";
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const pathname = url.pathname;

  if (pathname === "/api/public/photo-slots" && method === "GET") {
    handleListPhotoSlots(res);
    return;
  }

  if (pathname === "/api/public/site-content" && method === "GET") {
    handlePublicSiteContent(res);
    return;
  }

  if (pathname === "/api/admin/login" && method === "POST") {
    await handleLogin(req, res);
    return;
  }

  if (pathname === "/api/admin/logout" && method === "POST") {
    handleLogout(req, res);
    return;
  }

  if (pathname === "/api/admin/session" && method === "GET") {
    handleSession(req, res);
    return;
  }

  if (pathname === "/api/admin/site-content" && method === "PUT") {
    await handleUpdateSiteContent(req, res);
    return;
  }

  if (pathname === "/api/admin/uploads" && method === "POST") {
    await handleGenericUpload(req, res);
    return;
  }

  if (pathname.startsWith("/api/admin/photo-slots/")) {
    const slotId = decodeURIComponent(pathname.replace("/api/admin/photo-slots/", "").replace(/\/upload$/, ""));

    if (pathname.endsWith("/upload") && method === "POST") {
      await handleUpload(req, res, slotId);
      return;
    }

    if (method === "PUT") {
      await handleUpdatePhotoSlot(req, res, slotId);
      return;
    }
  }

  if (pathname.startsWith("/uploads/")) {
    const filePath = safeJoin(uploadsDir, pathname.replace("/uploads", ""));
    if (!filePath) {
      sendJson(res, 400, { error: "Invalid path." });
      return;
    }
    streamFile(res, filePath);
    return;
  }

  if (pathname.startsWith("/seed-images/")) {
    const filePath = safeJoin(seedImagesDir, pathname.replace("/seed-images", ""));
    if (!filePath) {
      sendJson(res, 400, { error: "Invalid path." });
      return;
    }
    streamFile(res, filePath);
    return;
  }

  serveFrontend(res, pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`[cms] server listening at http://${HOST}:${PORT}`);
});
