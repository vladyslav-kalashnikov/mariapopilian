import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const workspaceRoot = process.cwd();
const storageDir = path.join(workspaceRoot, "storage");
const uploadsDir = path.join(storageDir, "uploads");
const databasePath = path.join(storageDir, "cms.sqlite");
const manifestPath = path.join(workspaceRoot, "src", "content", "photoManifest.json");
const siteContentPath = path.join(workspaceRoot, "src", "content", "defaultSiteContent.json");

function ensureStorage() {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function loadManifest() {
  const raw = fs.readFileSync(manifestPath, "utf8");
  return JSON.parse(raw);
}

function loadDefaultSiteContent() {
  const raw = fs.readFileSync(siteContentPath, "utf8");
  return JSON.parse(raw);
}

function createDatabase() {
  ensureStorage();

  const db = new DatabaseSync(databasePath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS photo_slots (
      slot_id TEXT PRIMARY KEY,
      page TEXT NOT NULL,
      page_label TEXT NOT NULL,
      section TEXT NOT NULL,
      section_label TEXT NOT NULL,
      label TEXT NOT NULL,
      description TEXT NOT NULL,
      seed_image TEXT NOT NULL,
      alt_text TEXT NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS content_documents (
      doc_key TEXT PRIMARY KEY,
      json_value TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const manifest = loadManifest();
  const insertSlot = db.prepare(`
    INSERT OR IGNORE INTO photo_slots (
      slot_id,
      page,
      page_label,
      section,
      section_label,
      label,
      description,
      seed_image,
      alt_text,
      image_url,
      sort_order
    ) VALUES (
      $slotId,
      $page,
      $pageLabel,
      $section,
      $sectionLabel,
      $label,
      $description,
      $seedImage,
      $altText,
      $imageUrl,
      $sortOrder
    );
  `);

  const updateMeta = db.prepare(`
    UPDATE photo_slots
    SET
      page = $page,
      page_label = $pageLabel,
      section = $section,
      section_label = $sectionLabel,
      label = $label,
      description = $description,
      seed_image = $seedImage,
      sort_order = $sortOrder
    WHERE slot_id = $slotId;
  `);

  for (const slot of manifest) {
    insertSlot.run({
      slotId: slot.slotId,
      page: slot.page,
      pageLabel: slot.pageLabel,
      section: slot.section,
      sectionLabel: slot.sectionLabel,
      label: slot.label,
      description: slot.description,
      seedImage: slot.seedImage,
      altText: slot.altText,
      imageUrl: `/seed-images/${slot.seedImage}`,
      sortOrder: slot.sortOrder,
    });

    updateMeta.run({
      slotId: slot.slotId,
      page: slot.page,
      pageLabel: slot.pageLabel,
      section: slot.section,
      sectionLabel: slot.sectionLabel,
      label: slot.label,
      description: slot.description,
      seedImage: slot.seedImage,
      sortOrder: slot.sortOrder,
    });
  }

  const defaultSiteContent = loadDefaultSiteContent();
  const insertDocument = db.prepare(`
    INSERT OR IGNORE INTO content_documents (
      doc_key,
      json_value
    ) VALUES (
      $docKey,
      $jsonValue
    );
  `);

  insertDocument.run({
    docKey: "site_content",
    jsonValue: JSON.stringify(defaultSiteContent),
  });

  return db;
}

const db = createDatabase();

const selectAllStatement = db.prepare(`
  SELECT
    slot_id AS slotId,
    page,
    page_label AS pageLabel,
    section,
    section_label AS sectionLabel,
    label,
    description,
    seed_image AS seedImage,
    alt_text AS altText,
    image_url AS imageUrl,
    sort_order AS sortOrder,
    updated_at AS updatedAt
  FROM photo_slots
  ORDER BY sort_order ASC;
`);

const selectByIdStatement = db.prepare(`
  SELECT
    slot_id AS slotId,
    page,
    page_label AS pageLabel,
    section,
    section_label AS sectionLabel,
    label,
    description,
    seed_image AS seedImage,
    alt_text AS altText,
    image_url AS imageUrl,
    sort_order AS sortOrder,
    updated_at AS updatedAt
  FROM photo_slots
  WHERE slot_id = ?;
`);

const updateStatement = db.prepare(`
  UPDATE photo_slots
  SET
    image_url = $imageUrl,
    alt_text = $altText,
    updated_at = CURRENT_TIMESTAMP
  WHERE slot_id = $slotId;
`);

const selectContentStatement = db.prepare(`
  SELECT
    doc_key AS docKey,
    json_value AS jsonValue,
    updated_at AS updatedAt
  FROM content_documents
  WHERE doc_key = ?;
`);

const upsertContentStatement = db.prepare(`
  INSERT INTO content_documents (
    doc_key,
    json_value,
    updated_at
  ) VALUES (
    $docKey,
    $jsonValue,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT(doc_key) DO UPDATE SET
    json_value = excluded.json_value,
    updated_at = CURRENT_TIMESTAMP;
`);

export function listPhotoSlots() {
  return selectAllStatement.all();
}

export function getPhotoSlot(slotId) {
  return selectByIdStatement.get(slotId);
}

export function updatePhotoSlot(slotId, patch) {
  const current = getPhotoSlot(slotId);
  if (!current) {
    return null;
  }

  updateStatement.run({
    slotId,
    imageUrl: patch.imageUrl ?? current.imageUrl,
    altText: patch.altText ?? current.altText,
  });

  return getPhotoSlot(slotId);
}

export function getContentDocument(docKey) {
  const row = selectContentStatement.get(docKey);
  if (!row) {
    return null;
  }

  return {
    docKey: row.docKey,
    value: JSON.parse(row.jsonValue),
    updatedAt: row.updatedAt,
  };
}

export function updateContentDocument(docKey, value) {
  upsertContentStatement.run({
    docKey,
    jsonValue: JSON.stringify(value),
  });

  return getContentDocument(docKey);
}

export function getUploadsDirectory() {
  return uploadsDir;
}

export function getWorkspaceRoot() {
  return workspaceRoot;
}
