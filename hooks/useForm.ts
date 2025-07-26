// hooks/useForm.ts
import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  resetForm: (newValues?: T) => void;
  validateField: (field: keyof T) => Promise<string | null>;
  validateForm: () => Promise<boolean>;
}

export default function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = null;
      return acc;
    }, {} as Record<keyof T, string | null>)
  );
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed properties
  const isValid = useMemo(() => {
    return Object.values(errors).every(error => error === null);
  }, [errors]);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  // Validate single field
  const validateField = useCallback(async (field: keyof T): Promise<string | null> => {
    if (!validationSchema) return null;

    try {
      // Create a partial schema for just this field
      const fieldSchema = validationSchema.pick({ [field]: true } as any);
      await fieldSchema.parseAsync({ [field]: values[field] });
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || 'Validation error';
      }
      return 'Validation error';
    }
  }, [validationSchema, values]);

  // Validate entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true;

    try {
      await validationSchema.parseAsync(values);
      setErrors(Object.keys(initialValues).reduce((acc, key) => {
        acc[key as keyof T] = null;
        return acc;
      }, {} as Record<keyof T, string | null>));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = { ...errors };
        
        // Reset all errors first
        Object.keys(newErrors).forEach(key => {
          newErrors[key as keyof T] = null;
        });

        // Set new errors
        error.errors.forEach(err => {
          const field = err.path[0] as keyof T;
          if (field) {
            newErrors[field] = err.message;
          }
        });

        setErrors(newErrors);
      }