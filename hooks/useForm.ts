import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
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

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => error === null);
  }, [errors]);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  const validateField = useCallback(async (field: keyof T): Promise<string | null> => {
    if (!validationSchema) return null;

    try {
      const fieldValue = values[field];
      await validationSchema.parseAsync({ ...values, [field]: fieldValue });
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find(err => err.path[0] === field);
        return fieldError?.message || null;
      }
      return 'Validation error';
    }
  }, [validationSchema, values]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true;

    try {
      await validationSchema.parseAsync(values);
      
      const clearedErrors = Object.keys(initialValues).reduce((acc, key) => {
        acc[key as keyof T] = null;
        return acc;
      }, {} as Record<keyof T, string | null>);
      setErrors(clearedErrors);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = Object.keys(initialValues).reduce((acc, key) => {
          acc[key as keyof T] = null;
          return acc;
        }, {} as Record<keyof T, string | null>);

        error.issues.forEach(err => {
          const field = err.path[0] as keyof T;
          if (field && field in newErrors) {
            newErrors[field] = err.message;
          }
        });

        setErrors(newErrors);
      }
      return false;
    }
  }, [validationSchema, values, initialValues]);

  const handleChange = useCallback((field: keyof T) => async (value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    if (validateOnChange) {
      const error = await validateField(field);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [validateOnChange, validateField]);

  const handleBlur = useCallback((field: keyof T) => async () => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (validateOnBlur) {
      const error = await validateField(field);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [validateOnBlur, validateField]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);

    try {
      const isFormValid = await validateForm();
      
      if (isFormValid && onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, values]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, touched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: touched }));
  }, []);

  const resetForm = useCallback((newValues?: T) => {
    const resetValues = newValues || initialValues;
    setValues(resetValues);
    
    const clearedErrors = Object.keys(resetValues).reduce((acc, key) => {
      acc[key as keyof T] = null;
      return acc;
    }, {} as Record<keyof T, string | null>);
    setErrors(clearedErrors);

    const clearedTouched = Object.keys(resetValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>);
    setTouched(clearedTouched);
    
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm,
  };
}