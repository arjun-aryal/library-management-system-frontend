const emailPattern = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: "Enter a valid email",
};

const passwordMinLength = {
  value: 6,
  message: "Password must be at least 6 characters",
};
const passwordPattern = {
  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
  message: "Password must contain at least one letter and one number",
};

export const loginValidation = {
  email: {
    required: "Email is required",
    pattern: emailPattern,
  },
  password: {
    required: "Password is required",
    minLength: passwordMinLength,
    pattern: passwordPattern,
  },
};

export const registerValidation = {
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
  },
  email: {
    required: "Email is required",
    pattern: emailPattern,
  },
  password: {
    required: "Password is required",
    minLength: passwordMinLength,
    pattern: passwordPattern,
  },
  confirmPassword: {
    required: "Please confirm your password",
  },
};

export const userValidation = {
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
  },
  email: {
    required: "Email is required",
    pattern: emailPattern,
  },
  role: {
    required: "Email is required",
  },
};

export const authorValidation = {
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
  },
  nationality: {
    required: "Nationality is required",
    minLength: {
      value: 2,
      message: "Nationality must be at least 2 characters",
    },
  },
  bio: {
    maxLength: {
      value: 1000,
      message: "Bio cannot exceed 1000 characters",
    },
  },
};

const currentYear = new Date().getFullYear();

export const bookValidation = {
  title: { required: "Title is required" },
  isbn: { required: "ISBN is required" },
  published_year: {
    required: "Published year is required",
    valueAsNumber: true,
    min: {
      value: 1900,
      message: "Year must be 1900 or later",
    },
    max: {
      value: currentYear,
      message: `Year cannot exceed ${currentYear}`,
    },
  },
};
