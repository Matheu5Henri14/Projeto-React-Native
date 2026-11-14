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

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const { token, logout } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApiError = useCallback(
    (err) => {
      if (err && err.status === 401) {
        logout();
      }
    },
    [logout]
  );

  const refreshNotes = useCallback(async () => {
    if (!token) {
      setNotes([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiRequest('/notas', { token });
      const data = result.data || [];

      setNotes(data);

      return data;
    } catch (err) {
      setError(err.message);
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, handleApiError]);

  useEffect(() => {
    if (!token) {
      setNotes([]);
      setError(null);
    }
  }, [token]);

  const addNote = useCallback(
    async ({ title, content }) => {
      try {
        const result = await apiRequest('/notas', {
          method: 'POST',
          body: { title, content },
          token,
        });

        await refreshNotes().catch(() => {});

        return result;
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [token, refreshNotes, handleApiError]
  );

  const updateNote = useCallback(
    async (id, { title, content }) => {
      try {
        const result = await apiRequest(`/notas/${id}`, {
          method: 'PUT',
          body: { title, content },
          token,
        });

        await refreshNotes().catch(() => {});

        return result;
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [token, refreshNotes, handleApiError]
  );

  const removeNote = useCallback(
    async (id) => {
      try {
        await apiRequest(`/notas/${id}`, {
          method: 'DELETE',
          token,
        });

        await refreshNotes().catch(() => {});
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [token, refreshNotes, handleApiError]
  );

  const value = useMemo(
    () => ({
      notes,
      loading,
      error,
      refreshNotes,
      addNote,
      updateNote,
      removeNote,
    }),
    [notes, loading, error, refreshNotes, addNote, updateNote, removeNote]
  );

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error(
      'useNotes deve ser usado dentro de <NotesProvider>'
    );
  }

  return context;
}
