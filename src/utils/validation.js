const validator = require('validator');

/**
 * Validates signup form data and throws error if validation fails
 * @param {Object} data - The request body containing user data
 * @param {string} data.firstName - User's first name
 * @param {string} data.lastName - User's last name
 * @param {string} data.emailId - User's email address
 * @param {string} data.password - User's password
 * @throws {Error} - Throws error with validation message if validation fails
 */
function validateSignupData(data) {
  const errors = [];
  const { firstName, lastName, emailId, password } = data;

  // Helper function to check if field exists and is not empty
  const isFieldEmpty = (field, fieldName) => {
    if (!field || typeof field !== 'string' || validator.isEmpty(field.trim())) {
      errors.push(`${fieldName} is required`);
      return true;
    }
    return false;
  };

  // Validate firstName
  if (!isFieldEmpty(firstName, 'First name')) {
    const trimmedfirstName = firstName.trim();
    
    if (trimmedfirstName.length < 2) {
      errors.push('First name must be at least 2 characters long');
    }
    
    if (trimmedfirstName.length > 20) {
      errors.push('First name must not exceed 50 characters');
    }
    
    if (!validator.isAlpha(trimmedfirstName.replace(/\s/g, ''))) {
      errors.push('First name can only contain letters and spaces');
    }
  }

  // Validate lastName
  if (!isFieldEmpty(lastName, 'Last name')) {
    const trimmedlastName = lastName.trim();
    
    if (trimmedlastName.length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }
    
    if (trimmedlastName.length > 50) {
      errors.push('Last name must not exceed 50 characters');
    }
    
    if (!validator.isAlpha(trimmedlastName.replace(/\s/g, ''))) {
      errors.push('Last name can only contain letters and spaces');
    }
  }

  // Validate email
  if (!isFieldEmpty(emailId, 'Email')) {
    const trimmedEmail = emailId.trim().toLowerCase();
    
    if (!validator.isEmail(trimmedEmail)) {
      errors.push('Please provide a valid email address');
    }
    
    if (trimmedEmail.length > 254) {
      errors.push('Email address is too long');
    }
  }

  // Validate password
  if (!isFieldEmpty(password, 'Password')) {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must not exceed 128 characters');
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak passwords
    const commonPasswords = ['password', '12345678', 'qwerty123', 'abc123456'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common, please choose a stronger password');
    }
  }

    // Throw error if validation fails
  if (errors.length > 0) {
    throw new Error(errors.join('. '));
  }
}

module.exports = { validateSignupData };