import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import axios from 'axios'; // CUSTOM LOADING COMPONENT

import { LoadingProgress } from '../components/loader';
// ==============================================================

// ==============================================================
const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const setSession = accessToken => {
  if (accessToken) {
    localStorage.setItem('authToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        isInitialized: true,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated
      };

    case 'LOGIN':
      return { ...state,
        isAuthenticated: true,
        user: action.payload.user
      };

    case 'LOGOUT':
      return { ...state,
        user: null,
        isAuthenticated: false
      };

    case 'REGISTER':
      return { ...state,
        isAuthenticated: true,
        user: action.payload.user
      };

    default:
      return state;
  }
}; // ==============================================================


// ==============================================================
export const AuthContext = createContext({});
export function AuthProvider({
  children
}) {
  const [state, dispatch] = useReducer(reducer, initialState); // USER LOGIN HANDLER

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const token = response.data.token;
        setSession(token);

        // Use user data from backend response
        const backendUser = response.data.user;
        const firstName = backendUser.firstName || '';
        const lastName = backendUser.lastName || '';
        const fullName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || backendUser.email);
        
        const user = {
          id: backendUser.id,
          userId: backendUser.id,
          firstName: firstName,
          lastName: lastName,
          name: fullName,
          email: backendUser.email,
          avatar: '/static/avatar/020-man-4.svg',
          role: backendUser.role,
          permissions: backendUser.permissions
        };

        dispatch({
          type: 'LOGIN',
          payload: {
            user: user,
            isAuthenticated: true
          }
        });
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }, []); // USER REGISTER HANDLER

  const register = useCallback(async (name, email, password) => {
    const {
      data
    } = await axios.post(`${API_URL}/users`, {
      name,
      email,
      password
    });
    setSession(data.token);
    dispatch({
      type: 'REGISTER',
      payload: {
        user: data,
        isAuthenticated: true
      }
    });
  }, []); // USER LOGOUT HANDLER

  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
      payload: {
        user: null,
        isAuthenticated: false
      }
    });
    // Redirect to login page
    window.location.href = '/login';
  }, []);

  const checkCurrentUser = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('authToken');

      if (accessToken) {
        setSession(accessToken);
        
        // Verify token with backend to get fresh user data
        try {
          const response = await axios.get('http://localhost:5000/auth/verify');
          
          if (response.data.success) {
            const backendUser = response.data.user;
            const firstName = backendUser.firstName || '';
            const lastName = backendUser.lastName || '';
            const fullName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName || backendUser.email);
            
            const user = {
              id: backendUser.id,
              userId: backendUser.id,
              firstName: firstName,
              lastName: lastName,
              name: fullName,
              email: backendUser.email,
              avatar: '/static/avatar/020-man-4.svg',
              role: backendUser.role,
              permissions: backendUser.permissions
            };
            
            dispatch({
              type: 'INIT',
              payload: {
                user: user,
                isAuthenticated: true
              }
            });
          } else {
            // Token is invalid
            setSession(null);
            dispatch({
              type: 'INIT',
              payload: {
                user: null,
                isAuthenticated: false
              }
            });
          }
        } catch (verifyError) {
          // Token verification failed (expired or invalid)
          console.warn('Token verification failed:', verifyError.message);
          setSession(null);
          dispatch({
            type: 'INIT',
            payload: {
              user: null,
              isAuthenticated: false
            }
          });
        }
      } else {
        dispatch({
          type: 'INIT',
          payload: {
            user: null,
            isAuthenticated: false
          }
        });
      }
    } catch (err) {
      console.error('JWT token validation error:', err);
      setSession(null);
      dispatch({
        type: 'INIT',
        payload: {
          user: null,
          isAuthenticated: false
        }
      });
    }
  }, []);
  useEffect(() => {
    checkCurrentUser();
  }, []);
  const contextValue = useMemo(() => ({ ...state,
    method: 'JWT',
    login,
    register,
    logout,
    // Firebase compatibility aliases
    signInWithEmail: login,
    createUserWithEmail: register,
    signInWithGoogle: () => Promise.resolve() // Mock Google login
  }), [state, login, register, logout]);
  if (!state.isInitialized) return <LoadingProgress />;
  return <AuthContext value={contextValue}>{children}</AuthContext>;
}