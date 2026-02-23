import { useState } from 'react';
import DOMPurify from 'dompurify';

/**
 * Sanitizes input to prevent XSS attacks
 * @param {any} input - The input to sanitize
 * @returns {any} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input.trim());
};

/**
 * Sanitizes an entire object recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Rate limiting hook functionality
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} - Rate limiting state and functions
 */
export const useRateLimit = (maxAttempts = 5, windowMs = 60000) => {
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  
  const canAttempt = () => {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now - lastAttemptTime > windowMs) {
      setAttempts(0);
      return true;
    }
    
    return attempts < maxAttempts;
  };
  
  const recordAttempt = () => {
    const now = Date.now();
    setAttempts(prev => prev + 1);
    setLastAttemptTime(now);
  };
  
  const reset = () => {
    setAttempts(0);
    setLastAttemptTime(0);
  };
  
  return {
    canAttempt: canAttempt(),
    attemptsLeft: Math.max(0, maxAttempts - attempts),
    recordAttempt,
    reset
  };
};

/**
 * Enhanced error handling for API calls
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response?.status === 400) {
    return 'Invalid data provided. Please check your inputs.';
  } else if (error.response?.status === 401) {
    return 'You are not authorized. Please log in again.';
  } else if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  } else if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  } else if (error.response?.status === 409) {
    return 'This record already exists.';
  } else if (error.response?.status === 422) {
    return 'Validation failed. Please check your inputs.';
  } else if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  } else if (!error.response) {
    return 'Network error. Please check your connection.';
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Validation schemas for common fields
 */
export const commonValidations = {
  taxId: /^\d{8,9}$/,
  zipCode: /^\d{5}$/,
  phone: /^[\d\s\-\+\(\)]*$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  passport: /^[A-Z0-9]+$/,
  registrationTag: /^[A-Z]{2}-\d{3}-[A-Z]{2}$/
};

export default {
  sanitizeInput,
  sanitizeObject,
  useRateLimit,
  handleApiError,
  commonValidations
};