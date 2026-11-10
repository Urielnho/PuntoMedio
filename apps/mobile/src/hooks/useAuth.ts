import { useContext } from 'react';
import { AuthContext } from '../state/AuthProvider';

export function useAuth() {
  const state = useContext(AuthContext);
  if (!state) throw new Error('AuthProvider is required');
  return state;
}
