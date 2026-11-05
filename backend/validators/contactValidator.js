import validator from 'validator';

/**
 * Validate and sanitize contact form submission
 * @param {Object} data - Request body containing contact fields
 * @returns {{ isValid: boolean, errors: Record<string, string>, sanitizedData: Object }}
 */
export function validateContactInput(data = {}) {
  const errors = {};

  // Extract and sanitize fields
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const subject = typeof data.subject === 'string' ? data.subject.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';

  // 1. Name validation
  if (!name) {
    errors.name = 'Please enter your name.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  // 2. Email validation
  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  } else if (email.length > 255) {
    errors.email = 'Email address is too long.';
  }

  // 3. Subject validation
  if (!subject) {
    errors.subject = 'Please add a subject.';
  } else if (subject.length < 2) {
    errors.subject = 'Subject must be at least 2 characters.';
  } else if (subject.length > 200) {
    errors.subject = 'Subject cannot exceed 200 characters.';
  }

  // 4. Message validation (optional)
  if (message && message.length > 5000) {
    errors.message = 'Message cannot exceed 5000 characters.';
  }

  // 5. Phone validation (optional)
  if (phone) {
    if (phone.length > 50) {
      errors.phone = 'Phone number cannot exceed 50 characters.';
    } else if (!/^[+0-9\s\-().]{5,30}$/.test(phone)) {
      errors.phone = 'Please enter a valid phone number format.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      name: validator.escape(name),
      email: validator.normalizeEmail(email) || email.toLowerCase(),
      subject: validator.escape(subject),
      message: message ? validator.escape(message) : null,
      phone: phone || null,
    },
  };
}

