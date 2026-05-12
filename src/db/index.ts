import { openDB } from 'idb';
let db: any;
export async function getDB() {
  if (!db) {
    db = await openDB('gestion-pressing', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('clients')) {
          db.createObjectStore('clients', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('vetements')) {
          db.createObjectStore('vetements', { keyPath: 'id' });
        }
      },
    });
  }
  return db;
}