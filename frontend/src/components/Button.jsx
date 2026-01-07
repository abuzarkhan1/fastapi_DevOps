import React from 'react';

export const Button = ({ children, variant = 'primary', ...props }) => {
    return (
        <button className={`btn btn-${variant}`} {...props}>
            {children}
        </button>
    );
};
