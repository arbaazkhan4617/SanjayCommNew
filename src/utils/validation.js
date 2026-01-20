// Email validation regex
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (basic)
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Format backend validation errors
export const formatValidationError = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Handle Spring validation errors
  if (error.response?.data?.message) {
    const message = error.response.data.message;
    // Extract field-specific errors
    if (message.includes('email')) {
      return 'Please enter a valid email address';
    }
    if (message.includes('password')) {
      return 'Password is required';
    }
    return message;
  }
  
  // Handle network errors
  if (error.message === 'Network Error') {
    return 'Cannot connect to server. Please check your connection.';
  }
  
  return error.message || 'An error occurred';
};
