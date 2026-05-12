import { useState, useEffect } from 'react';
import { getDB } from '../index';
import type { Client } from '../../types';
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const fetchClients = async () => {
    const db = await getDB();
    const all = await db.getAll('clients');
    setClients(all);
  };
  useEffect(() => {
    fetchClients();
  }, []);
  const addClient = async (client: Omit<Client, 'id'>) => {
    const db = await getDB();
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
    };
    await db.add('clients', newClient);
    await fetchClients();
  };
  return { clients, addClient };
}