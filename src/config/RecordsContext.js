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

const RecordsContext = createContext(null);

export function RecordsProvider({ children }) {
  const { token, unlocked } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Consulta os registros sigilosos da usuária.
  const refreshRecords = useCallback(async () => {
    if (!token || !unlocked) {
      setRecords([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiRequest('/registros', {
        token,
      });

      const data = result.data || [];

      setRecords(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, unlocked]);

  // Atualiza os registros ao desbloquear a área restrita.
  useEffect(() => {
    if (token && unlocked) {
      refreshRecords().catch(() => {});
    } else {
      setRecords([]);
    }
  }, [token, unlocked, refreshRecords]);

  // Cria um novo registro.
  const addRecord = useCallback(
    async (data) => {
      const result = await apiRequest('/registros', {
        method: 'POST',
        body: data,
        token,
      });

      await refreshRecords();

      return result;
    },
    [token, refreshRecords]
  );

  // Atualiza um registro.
  const updateRecord = useCallback(
    async (id, data) => {
      const result = await apiRequest(`/registros/${id}`, {
        method: 'PUT',
        body: data,
        token,
      });

      await refreshRecords();

      return result;
    },
    [token, refreshRecords]
  );

  // Exclui um registro.
  const removeRecord = useCallback(
    async (id) => {
      await apiRequest(`/registros/${id}`, {
        method: 'DELETE',
        token,
      });

      await refreshRecords();
    },
    [token, refreshRecords]
  );

  const value = useMemo(
    () => ({
      records,
      loading,
      error,
      refreshRecords,
      addRecord,
      updateRecord,
      removeRecord,
    }),
    [
      records,
      loading,
      error,
      refreshRecords,
      addRecord,
      updateRecord,
      removeRecord,
    ]
  );

  return (
    <RecordsContext.Provider value={value}>
      {children}
    </RecordsContext.Provider>
  );
}

export function useRecords() {
  const context = useContext(RecordsContext);

  if (!context) {
    throw new Error(
      'useRecords deve ser usado dentro de <RecordsProvider>'
    );
  }

  return context;
}