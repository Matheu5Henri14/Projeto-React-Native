import { useCallback } from 'react';

import { useAuth } from './AuthContext';

export default function useQuickExit(navigation) {
  const { lock } = useAuth();

  return useCallback(() => {
    const root = navigation.getParent()?.getParent() ?? navigation;

    lock();

    root.reset({
      index: 0,
      routes: [{ name: 'NotesList' }],
    });
  }, [navigation, lock]);
}
