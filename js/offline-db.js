/* =====================================
   DSERVICES OFFLINE DATABASE
   INDEXEDDB CORE
===================================== */

const DB_NAME = "DServicesOfflineDB";
const DB_VERSION = 1;

let offlineDB = null;


/* FUNGUA DATABASE */
function openOfflineDB() {

  return new Promise((resolve, reject) => {

    if (offlineDB) {
      resolve(offlineDB);
      return;
    }

    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB haipatikani."));
      return;
    }

    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onupgradeneeded = event => {

      const db = event.target.result;

      // TAARIFA ZINAZOSUBIRI KUTUMWA
      if (!db.objectStoreNames.contains("records")) {

        const store = db.createObjectStore(
          "records",
          { keyPath: "localId" }
        );

        store.createIndex(
          "accountId",
          "accountId",
          { unique: false }
        );

        store.createIndex(
          "serviceId",
          "serviceId",
          { unique: false }
        );

        store.createIndex(
          "status",
          "status",
          { unique: false }
        );

        store.createIndex(
          "createdAt",
          "createdAt",
          { unique: false }
        );
      }

      // DATA ZILIZOHIFADHIWA KWENYE SIMU
      if (!db.objectStoreNames.contains("cache")) {

        db.createObjectStore(
          "cache",
          { keyPath: "key" }
        );
      }

      // MIPANGILIO YA OFFLINE
      if (!db.objectStoreNames.contains("settings")) {

        db.createObjectStore(
          "settings",
          { keyPath: "key" }
        );
      }
    };

    request.onsuccess = () => {

      offlineDB = request.result;

      resolve(offlineDB);

    };

    request.onerror = () => {

      reject(request.error);

    };

  });

}


/* KUHIFADHI TAARIFA OFFLINE */
async function saveOfflineRecord(data) {

  const db = await openOfflineDB();

  const localId =
    crypto.randomUUID
      ? crypto.randomUUID()
      : "DS-" + Date.now() + "-" +
        Math.random().toString(36).slice(2);

  const record = {

    localId: localId,

    accountId: data.accountId || "",

    serviceId: data.serviceId || "",

    moduleId: data.moduleId || "",

    action: data.action || "",

    payload: data.payload || {},

    status: "PENDING",

    createdAt: new Date().toISOString(),

    syncedAt: null,

    error: null

  };

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["records"],
      "readwrite"
    );

    transaction.objectStore("records").add(record);

    transaction.oncomplete = () => {

      resolve(record);

    };

    transaction.onerror = () => {

      reject(transaction.error);

    };

  });

}


/* KUPATA TAARIFA ZISIZOPELEKWA SERVER */
async function getPendingRecords(accountId) {

  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["records"],
      "readonly"
    );

    const store = transaction.objectStore("records");

    const request = store.getAll();

    request.onsuccess = () => {

      const records = request.result.filter(record => {

        return (
          record.status !== "SYNCED" &&
          record.accountId === accountId
        );

      });

      resolve(records);

    };

    request.onerror = () => {

      reject(request.error);

    };

  });

}


/* KUBADILISHA HALI YA TAARIFA */
async function updateOfflineRecord(localId, status, error = null) {

  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["records"],
      "readwrite"
    );

    const store = transaction.objectStore("records");

    const request = store.get(localId);

    request.onsuccess = () => {

      const record = request.result;

      if (!record) {
        resolve(false);
        return;
      }

      record.status = status;

      record.error = error;

      if (status === "SYNCED") {
        record.syncedAt = new Date().toISOString();
      }

      store.put(record);

    };

    transaction.oncomplete = () => {

      resolve(true);

    };

    transaction.onerror = () => {

      reject(transaction.error);

    };

  });

}


/* KUHIFADHI DATA ZA MUDA */
async function saveOfflineCache(key, value) {

  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["cache"],
      "readwrite"
    );

    transaction.objectStore("cache").put({

      key: key,

      value: value,

      updatedAt: new Date().toISOString()

    });

    transaction.oncomplete = () => resolve(true);

    transaction.onerror = () => reject(transaction.error);

  });

}


/* KUSOMA DATA ZA MUDA */
async function getOfflineCache(key) {

  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["cache"],
      "readonly"
    );

    const request = transaction
      .objectStore("cache")
      .get(key);

    request.onsuccess = () => {

      resolve(request.result?.value ?? null);

    };

    request.onerror = () => reject(request.error);

  });

}


/* KUANZISHA DATABASE */
openOfflineDB()
  .then(() => {

    console.log("DServices Offline Database iko tayari.");

  })
  .catch(error => {

    console.error(
      "Offline Database error:",
      error
    );

  });