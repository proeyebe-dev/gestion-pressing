import { useState, useEffect } from 'react';
import { getDB } from '../index';
import type { Vetement } from '../../types';
export function useVetements() {
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const fetchVetements = async () => {
    const db = await getDB();
    const all = await db.getAll('vetements');
    setVetements(all);
  };
  useEffect(() => {
    fetchVetements();
  }, []);
  const addVetement = async (vetement: Omit<Vetement, 'id' | 'dateDepot' | 'idStatut'>) => {
    const db = await getDB();
    const newVetement: Vetement = {
      ...vetement,
      id: crypto.randomUUID(),
      dateDepot: new Date().toISOString(),
      idStatut: 'en_attente',
    };
    await db.add('vetements', newVetement);
    await fetchVetements();
  };
  return { vetements, addVetement };
}
