import { useState } from 'react';

/**
 * Custom Hook: useForm
 * Owner: Tharindu (Product Create/Edit & Validation Engine)
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, errors, handleChange, setValues, setErrors };
};

export default useForm;
