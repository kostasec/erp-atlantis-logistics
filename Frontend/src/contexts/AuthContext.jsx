import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Auth Action Types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  SET_USER: 'SET_USER'
};

// Initial auth state
const initialState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: false,
  loading: false,
  error: null
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        token: null
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    
    default:
      return state;
  }
};

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authService.login(email, password);
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.token);
      
      // Get user info with the token
      const userInfo = await authService.getCurrentUser(response.token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: userInfo.user,
          token: response.token
        }
      });

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Verify and load user on app startup
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const userInfo = await authService.getCurrentUser(token);
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: userInfo.user
          });
        } catch (error) {
          // Token invalid or expired
          localStorage.removeItem('authToken');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
    };

    verifyToken();
  }, []);

  // Context value
  const value = {
    ...state,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

// HOC for protecting routes
export const withAuth = (WrappedComponent) => {
  return (props) => {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <LoginPage />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;