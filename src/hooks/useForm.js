import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing complex form state, validation, dirtiness, and submissions.
 * 
 * @param {Object} initialValues Initial state object for form fields
 * @param {Function|Object} validateConfig Validation function or validation rules map
 * @param {Function} onSubmit Callback invoked upon successful validation submit
 * @returns {Object} Form control utilities and state variables
 */
export const useForm = (initialValues = {}, validateConfig = null, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [initialState, setInitialState] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute dirty state by comparing current values to initial values
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialState);
  }, [values, initialState]);

  /**
   * Run validation logic against provided values
   */
  const validate = useCallback(
    (currentValues = values) => {
      let validationErrors = {};

      if (typeof validateConfig === 'function') {
        validationErrors = validateConfig(currentValues) || {};
      } else if (validateConfig && typeof validateConfig === 'object') {
        Object.keys(validateConfig).forEach((field) => {
          const rule = validateConfig[field];
          const val = currentValues[field];

          if (rule.required && (val === undefined || val === null || String(val).trim() === '')) {
            validationErrors[field] = rule.requiredMessage || `${field} is required`;
          } else if (rule.min !== undefined && Number(val) < rule.min) {
            validationErrors[field] = rule.minMessage || `${field} must be at least ${rule.min}`;
          } else if (rule.pattern && !rule.pattern.test(val)) {
            validationErrors[field] = rule.patternMessage || `Invalid ${field} format`;
          } else if (rule.custom) {
            const customErr = rule.custom(val, currentValues);
            if (customErr) validationErrors[field] = customErr;
          }
        });
      }

      return validationErrors;
    },
    [validateConfig, values]
  );

  /**
   * Generic input change handler supporting React synthetic events or direct (name, value)
   */
  const handleChange = useCallback((eOrName, valueOverride) => {
    let name, val;

    if (eOrName && eOrName.target) {
      const { type, checked, value } = eOrName.target;
      name = eOrName.target.name;
      val = type === 'checkbox' ? checked : value;
    } else {
      name = eOrName;
      val = valueOverride;
    }

    setValues((prev) => {
      const updated = { ...prev, [name]: val };
      
      // Real-time error clearing when user edits a field
      if (errors[name]) {
        setErrors((prevErr) => {
          const newErr = { ...prevErr };
          delete newErr[name];
          return newErr;
        });
      }

      return updated;
    });
  }, [errors]);

  /**
   * Field blur handler marking field as touched
   */
  const handleBlur = useCallback((eOrName) => {
    const name = eOrName && eOrName.target ? eOrName.target.name : eOrName;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  /**
   * Set specific field value directly
   */
  const setFieldValue = useCallback((name, val) => {
    setValues((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prevErr) => {
        const newErr = { ...prevErr };
        delete newErr[name];
        return newErr;
      });
    }
  }, [errors]);

  /**
   * Set specific field error manually
   */
  const setFieldError = useCallback((name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  }, []);

  /**
   * Reset form to initial or new values
   */
  const resetForm = useCallback((newInitialValues = null) => {
    const targetValues = newInitialValues || initialState;
    setValues(targetValues);
    setInitialState(targetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  /**
   * Form submit handler
   */
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      setIsSubmitting(true);
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // Touch all fields on submit
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      if (Object.keys(validationErrors).length === 0) {
        if (onSubmit) {
          try {
            await onSubmit(values);
          } catch (err) {
            if (err && err.errors) {
              setErrors(err.errors);
            }
          } finally {
            setIsSubmitting(false);
          }
        } else {
          setIsSubmitting(false);
        }
        return true;
      } else {
        setIsSubmitting(false);
        return false;
      }
    },
    [validate, values, onSubmit]
  );

  return {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    setTouched,
    isDirty,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    resetForm,
    handleSubmit,
    validate
  };
};
