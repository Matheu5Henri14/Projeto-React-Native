import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login com telefone e senha.
  const login = useCallback(async ({ telefone, senha }) => {
    setLoading(true);

    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
          telefone,
          senha,
        },
      });

      setToken(result.token);
      setUser(result.user);
      setUnlocked(false);

      return result.user;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cadastro de uma nova usuária.
  const register = useCallback(
    async ({ nome, telefone, senha, codigoAcesso }) => {
      setLoading(true);

      try {
        const result = await apiRequest('/auth/register', {
          method: 'POST',
          body: {
            nome,
            telefone,
            senha,
            codigoAcesso,
          },
        });

        setToken(result.token);
        setUser(result.user);
        setUnlocked(false);

        return result.user;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Validação do PIN para liberar a funcionalidade escondida.
  const unlock = useCallback(
    async (codigoAcesso) => {
      if (!token) {
        throw new Error(
          'Faça login antes de desbloquear a área restrita.'
        );
      }

      setLoading(true);

      try {
        const result = await apiRequest('/auth/unlock', {
          method: 'POST',
          body: {
            codigoAcesso,
          },
          token,
        });

        setToken(result.token);
        setUnlocked(result.unlocked === true);

        return result.unlocked === true;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Bloqueia novamente a área restrita.
  const lock = useCallback(async () => {
    const currentToken = token;

    setUnlocked(false);

    if (!currentToken) {
      return;
    }

    apiRequest('/auth/lock', {
      method: 'POST',
      token: currentToken,
    })
      .then((result) => {
        setToken(result.token);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
      });
  }, [token]);

  // Encerra a sessão.
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setUnlocked(false);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      unlocked,
      loading,
      login,
      register,
      unlock,
      lock,
      logout,
    }),
    [
      token,
      user,
      unlocked,
      loading,
      login,
      register,
      unlock,
      lock,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de <AuthProvider>'
    );
  }

  return context;
}