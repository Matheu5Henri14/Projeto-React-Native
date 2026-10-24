import { createContext, useContext, useMemo, useState } from 'react';

const RecordsContext = createContext(null);

// Estado em memória, só para o protótipo funcionar.
// TODO: trocar por persistência local protegida seguindo a tabela
// REGISTRO_SIGILOSO do DER (id_registro, id_usuario, descricao, data_registro).
export function RecordsProvider({ children }) {
  const [records, setRecords] = useState([]);

  const value = useMemo(
    () => ({
      records,
      addRecord: (data) =>
        setRecords((prev) => [...prev, { id: String(Date.now()), ...data }]),
      updateRecord: (id, data) =>
        setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r))),
      removeRecord: (id) =>
        setRecords((prev) => prev.filter((r) => r.id !== id)),
    }),
    [records]
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecords() {
  const ctx = useContext(RecordsContext);
  if (!ctx) {
    throw new Error('useRecords deve ser usado dentro de <RecordsProvider>');
  }
  return ctx;
}