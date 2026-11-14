import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAuth } from './AuthContext';
import { apiRequest } from '../services/api';

const ContactsContext = createContext(null);

export function ContactsProvider({ children }) {
  const { token, unlocked } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Busca os contatos cadastrados pela usuária.
  const refreshContacts = useCallback(async () => {
    if (!token || !unlocked) {
      setContacts([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiRequest('/contatos', {
        token,
      });

      const data = result.data || [];

      setContacts(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, unlocked]);

  // Atualiza a lista ao desbloquear a área restrita.
  useEffect(() => {
    if (token && unlocked) {
      refreshContacts().catch(() => {});
    } else {
      setContacts([]);
    }
  }, [token, unlocked, refreshContacts]);

  // Cadastra um contato.
  const addContact = useCallback(
    async (data) => {
      const result = await apiRequest('/contatos', {
        method: 'POST',
        body: data,
        token,
      });

      await refreshContacts();

      return result;
    },
    [token, refreshContacts]
  );

  // Atualiza um contato existente.
  const updateContact = useCallback(
    async (id, data) => {
      const result = await apiRequest(`/contatos/${id}`, {
        method: 'PUT',
        body: data,
        token,
      });

      await refreshContacts();

      return result;
    },
    [token, refreshContacts]
  );

  // Exclui um contato.
  const removeContact = useCallback(
    async (id) => {
      await apiRequest(`/contatos/${id}`, {
        method: 'DELETE',
        token,
      });

      await refreshContacts();
    },
    [token, refreshContacts]
  );

  const value = useMemo(
    () => ({
      contacts,
      loading,
      error,
      refreshContacts,
      addContact,
      updateContact,
      removeContact,
    }),
    [
      contacts,
      loading,
      error,
      refreshContacts,
      addContact,
      updateContact,
      removeContact,
    ]
  );

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);

  if (!context) {
    throw new Error(
      'useContacts deve ser usado dentro de <ContactsProvider>'
    );
  }

  return context;
}