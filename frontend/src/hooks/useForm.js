import { useState } from 'react';

export const useForm = (initialValues, onSubmit) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } catch (err) {
            setErrors(err.response?.data?.detail || { global: 'An unexpected error occurred' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return { values, errors, isSubmitting, handleChange, handleSubmit };
};
