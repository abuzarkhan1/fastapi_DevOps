import React from 'react';

export const Input = ({ label, error, ...props }) => {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <input className="form-input" {...props} />
            {error && <span className="text-error">{error}</span>}
        </div>
    );
};
