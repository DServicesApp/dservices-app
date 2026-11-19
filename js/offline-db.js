/* ==========================================
   DSERVICES - OFFLINE DATABASE
   INDEXEDDB CORE
   VERSION 2
========================================== */

const DB_NAME = "DServicesOfflineDB";
const DB_VERSION = 2;

let offlineDB = null;

/* ==========================================
   1. KUFUNGUA DATABASE
========================================== */

function openOfflineDB() {

  if (offlineDB) {
    return Promise.resolve(offlineDB);
  }

  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = event => {

      const db = event.target.result;
      const transaction = event.target.transaction;

      /* RECORDS */
      let records;

      if (!db.objectStoreNames.contains("records")) {

        records = db.createObjectStore("records", {
          keyPath: "localId"
        });

      } else {

        records = transaction.objectStore("records");

      }

      if (!records.indexNames.contains("accountId")) {
        records.createIndex("accountId", "accountId");
      }

      if (!records.indexNames.contains("serviceId")) {
        records.createIndex("serviceId", "serviceId");
      }

      if (!records.indexNames.contains("status")) {
        records.createIndex("status", "status");
      }

      if (!records.indexNames.contains("createdAt")) {
        records.createIndex("createdAt", "createdAt");
      }

      /* CACHE */
      if (!db.objectStoreNames.contains("cache")) {

        db.createObjectStore("cache", {
          keyPath: "key"
        });

      }

      /* SETTINGS */
      if (!db.objectStoreNames.contains("settings")) {

        db.createObjectStore("settings", {
          keyPath: "key"
        });

      }

    };

    request.onsuccess = event => {

      offlineDB = event.target.result;

      offlineDB.onversionchange = () => {
        offlineDB.close();
        offlineDB = null;
      };

      console.log("DServices IndexedDB imefunguliwa.");

      resolve(offlineDB);

    };

    request.onerror = () => {

      console.error(
        "IndexedDB error:",
        request.error
      );

      reject(request.error);

    };

    request.onblocked = () => {

      console.warn(
        "IndexedDB imezuiwa na connection nyingine."
      );

    };

  });

}


/* ==========================================
   2. KUTENGENEZA LOCAL ID
========================================== */

function createLocalId() {

  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {

    return window.crypto.randomUUID();

  }

  return (
    "DS-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substring(2, 12)
  );

}


/* ==========================================
   3. KUHIFADHI TAARIFA
   LOCAL FIRST
========================================== */

async function saveOfflineRecord(data) {

  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["records"],
      "readwrite"
    );

    const store = transaction.objectStore("records");

    const record = {

      localId: createLocalId(),

      accountId: data.accountId || "",
      serviceId: data.serviceId || "",
      moduleId: data.moduleId || "",

      action: data.action || "",

      payload: data.payload || {},

      status: "PENDING",

      attempts: 0,

      error: null,

      serverId: null,

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString()

    };

    store.add(record);

    transaction.oncomplete = () => {

      resolve(record);

    };

    transaction.onerror = () => {

      reject(transaction.error);

    };

    transaction.onabort = () => {

      reject(transaction.error);

    };

  });

}


/* ==========================================
   4. KUPATA TAARIFA ZINAZOSUBIRI SYNC
========================================== */

async function getPendingRecords(accountId) {

  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["records"],
      "readonly"
    );

    const store = transaction.objectStore("records");

    const request = store.index("status").getAll("PENDING");

    request.onsuccess = () => {

      const records = request.result.filter(record => {

        return !accountId ||
          record.accountId === accountId;

      });

      records.sort((a, b) => {

        return new Date(a.createdAt) -
          new Date(b.createdAt);

      });

      resolve(records);

    };

    request.onerror = () => {

      reject(request.error);

    };

  });

}


/* ==========================================
   5. KUBADILISHA HALI YA TAARIFA
========================================== */

async function updateOfflineRecord(
  localId,
  status,
  error = null,
  serverId = null
) {

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

      if (!record) return;

      record.status = status;

      record.error = error;

      record.updatedAt = new Date().toISOString();

      if (serverId !== null) {
        record.serverId = serverId;
      }

      if (status === "SYNCING") {
        record.attempts++;
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


/* ==========================================
   6. KUPATA TAARIFA MOJA
========================================== */

async function getOfflineRecord(localId) {

  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["records"],
      "readonly"
    );

    const request = transaction
      .objectStore("records")
      .get(localId);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };

  });

}


/* ==========================================
   7. KUHIFADHI CACHE
========================================== */

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

    transaction.oncomplete = () => {
      resolve(true);
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

  });

}


/* ==========================================
   8. KUSOMA CACHE
========================================== */

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

      resolve(
        request.result
          ? request.result.value
          : null
      );

    };

    request.onerror = () => {
      reject(request.error);
    };

  });

}


/* ==========================================
   9. KUHIFADHI SETTINGS
========================================== */

async function saveOfflineSetting(key, value) {

  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["settings"],
      "readwrite"
    );

    transaction.objectStore("settings").put({

      key: key,

      value: value,

      updatedAt: new Date().toISOString()

    });

    transaction.oncomplete = () => {
      resolve(true);
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

  });

}


/* ==========================================
   10. KUSOMA SETTINGS
========================================== */

async function getOfflineSetting(key) {

  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      ["settings"],
      "readonly"
    );

    const request = transaction
      .objectStore("settings")
      .get(key);

    request.onsuccess = () => {

      resolve(
        request.result
          ? request.result.value
          : null
      );

    };

    request.onerror = () => {
      reject(request.error);
    };

  });

}


/* ==========================================
   11. KUANZISHA DATABASE
========================================== */

openOfflineDB()
  .then(() => {

    console.log(
      "DServices Offline Database iko tayari."
    );

  })
  .catch(error => {

    console.error(
      "DServices Offline Database imeshindwa:",
      error
    );

  });