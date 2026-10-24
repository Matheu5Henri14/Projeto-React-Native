import { createContext, useContext, useMemo, useState } from 'react';

const ContactsContext = createContext(null);

// Estado em memória, só para o protótipo funcionar.
// TODO: trocar por persistência local (ex.: expo-sqlite) seguindo a tabela
// CONTATO_APOIO do DER (id_contato, id_usuario, nome_contato, telefone_contato).
export function ContactsProvider({ children }) {
  const [contacts, setContacts] = useState([]);

  const value = useMemo(
    () => ({
      contacts,
      addContact: (data) =>
        setContacts((prev) => [...prev, { id: String(Date.now()), ...data }]),
      updateContact: (id, data) =>
        setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c))),
      removeContact: (id) =>
        setContacts((prev) => prev.filter((c) => c.id !== id)),
    }),
    [contacts]
  );

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

export function useContacts() {
  const ctx = useContext(ContactsContext);
  if (!ctx) {
    throw new Error('useContacts deve ser usado dentro de <ContactsProvider>');
  }
  return ctx;
}