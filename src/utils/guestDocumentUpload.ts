export const GUEST_DOCUMENT_EXPIRES_IN_MS = 8 * 60 * 1000;

const DB_NAME = "accusum_guest_document_db";
const DB_VERSION = 1;
const STORE_NAME = "guest_documents";
const GUEST_DOCUMENT_ID = "pending_guest_document";

export type PendingGuestDocument = {
  id: string;
  file: File;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: number;
  expiresAt: number;
};

const openGuestDocumentDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Temporary browser storage is unavailable."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const withGuestDocumentStore = async <T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
) => {
  const db = await openGuestDocumentDb();

  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const savePendingGuestDocument = async (file: File) => {
  const now = Date.now();
  const document: PendingGuestDocument = {
    id: GUEST_DOCUMENT_ID,
    file,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    createdAt: now,
    expiresAt: now + GUEST_DOCUMENT_EXPIRES_IN_MS,
  };

  await withGuestDocumentStore("readwrite", (store) => store.put(document));
  return document;
};

export const removePendingGuestDocument = async () => {
  await withGuestDocumentStore("readwrite", (store) =>
    store.delete(GUEST_DOCUMENT_ID)
  );
};

export const getPendingGuestDocument = async () => {
  const document = await withGuestDocumentStore<PendingGuestDocument | undefined>(
    "readonly",
    (store) => store.get(GUEST_DOCUMENT_ID)
  );

  if (!document) return null;

  if (document.expiresAt <= Date.now()) {
    await removePendingGuestDocument();
    return null;
  }

  return document;
};
