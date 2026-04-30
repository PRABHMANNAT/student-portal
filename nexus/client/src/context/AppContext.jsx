import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authApi, collectionsApi } from '../api';

const AppContext = createContext(null);

const SESSION_STORAGE_KEY = 'nexus-session';

const demoSession = {
  token: 'demo-token',
  user: {
    id: 'demo-user',
    name: 'Demo Student',
    email: 'demo@nexus.local'
  },
  meta: {
    mode: 'demo',
    guest: true
  }
};

function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : demoSession;
  } catch {
    return demoSession;
  }
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [collections, setCollections] = useState([]);
  const [collectionsMeta, setCollectionsMeta] = useState({ mode: 'demo', provider: 'boot' });
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  const persistSession = useCallback((nextSession) => {
    setSession(nextSession);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
  }, []);

  const refreshCollections = useCallback(async () => {
    setCollectionsLoading(true);
    const response = await collectionsApi.list(session.user.id || 'guest', session.token);
    setCollections(response.collections || []);
    setCollectionsMeta(response.meta || { mode: 'demo', provider: 'client-fallback' });
    setCollectionsLoading(false);
  }, [session.token, session.user.id]);

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  const login = useCallback(
    async (payload) => {
      const response = await authApi.login(payload);
      const nextSession = {
        token: response.token,
        user: response.user,
        meta: {
          ...(response.meta || {}),
          guest: false
        }
      };
      persistSession(nextSession);
      setAuthOpen(false);
      return nextSession;
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      const response = await authApi.register(payload);
      const nextSession = {
        token: response.token,
        user: response.user,
        meta: {
          ...(response.meta || {}),
          guest: false
        }
      };
      persistSession(nextSession);
      setAuthOpen(false);
      return nextSession;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    persistSession(demoSession);
    setAuthOpen(false);
  }, [persistSession]);

  const saveCollection = useCallback(
    async (payload) => {
      const response = await collectionsApi.save(payload, session.token);
      setCollections((current) =>
        [response.collection, ...current].filter(
          (item, index, items) => items.findIndex((entry) => entry.id === item.id) === index
        )
      );
      return response.collection;
    },
    [session.token]
  );

  const removeCollection = useCallback(
    async (id) => {
      await collectionsApi.remove(id, session.token);
      setCollections((current) => current.filter((item) => item.id !== id));
    },
    [session.token]
  );

  const value = useMemo(
    () => ({
      session,
      collections,
      collectionsMeta,
      collectionsLoading,
      authOpen,
      setAuthOpen,
      login,
      register,
      logout,
      saveCollection,
      removeCollection,
      refreshCollections
    }),
    [
      authOpen,
      collections,
      collectionsLoading,
      collectionsMeta,
      login,
      logout,
      refreshCollections,
      register,
      removeCollection,
      saveCollection,
      session
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }

  return context;
}
