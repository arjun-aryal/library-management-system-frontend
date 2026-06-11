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
