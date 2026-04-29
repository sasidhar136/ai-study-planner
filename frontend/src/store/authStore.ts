import { create } from 'zustand';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize state from localStorage
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  let parsedUser = null;
  try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Failed to parse user from local storage");
  }

  return {
    token: storedToken,
    user: parsedUser,
    isAuthenticated: !!storedToken,
    
    setAuth: (token: string, user: User) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});
