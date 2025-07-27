import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const timesheetEntrySchema = z.object({
  project: z.string().min(1, 'Project is required'),
  workType: z.string().min(1, 'Work type is required'),
  description: z
    .string()
    .min(1, 'Task description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  hours: z
    .number()
    .min(0.5, 'Hours must be at least 0.5')
    .max(24, 'Hours cannot exceed 24 per day'),
  date: z.string().min(1, 'Date is required'),
});

export type TimesheetEntryFormData = z.infer<typeof timesheetEntrySchema>;

export const timesheetWeekSchema = z.object({
  week: z.string().min(1, 'Week is required'),
  entries: z.array(timesheetEntrySchema).min(1, 'At least one entry is required'),
});

export type TimesheetWeekFormData = z.infer<typeof timesheetWeekSchema>;

export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });

  return { success: false, errors };
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one lowercase letter');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one uppercase letter');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one special character');
  }

  return { score, feedback };
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const validateHours = (hours: number): string | null => {
  if (hours < 0) {
    return 'Hours cannot be negative';
  }
  if (hours > 24) {
    return 'Hours cannot exceed 24 per day';
  }
  if (hours % 0.5 !== 0) {
    return 'Hours must be in increments of 0.5';
  }
  return null;
};

export const validateDate = (dateString: string): string | null => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  
  if (date > maxDate) {
    return 'Date cannot be more than 7 days in the future';
  }
  
  const minDate = new Date();
  minDate.setDate(today.getDate() - 30);
  
  if (date < minDate) {
    return 'Date cannot be more than 30 days in the past';
  }
  
  return null;
};

export const validateUniqueEmail = async (email: string): Promise<string | null> => {
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingEmails = ['existing@example.com', 'taken@example.com'];
  
  if (existingEmails.includes(email.toLowerCase())) {
    return 'This email is already registered';
  }
  
  return null;
};