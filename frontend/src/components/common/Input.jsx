import React from 'react';

/**
 * Reusable Input component with DaisyUI styling
 * @param {Object} props - Component props
 * @param {String} props.label - Input label
 * @param {String} props.type - Input type (text, email, password, etc.)
 * @param {String} props.placeholder - Placeholder text
 * @param {String} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {String} props.error - Error message
 * @param {Boolean} props.required - Required field
 * @param {Boolean} props.disabled - Disable input
 * @param {String} props.className - Additional CSS classes
 * @param {String} props.size - Input size (xs, sm, md, lg)
 * @returns {JSX.Element}
 */
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  size = 'md',
  ...rest
}) => {
  const inputClasses = [
    'input',
    'input-bordered',
    `input-${size}`,
    'w-full',
    error && 'input-error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...rest}
      />
      
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

/**
 * Textarea variant of Input component
 */
export const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  rows = 4,
  ...rest
}) => {
  const textareaClasses = [
    'textarea',
    'textarea-bordered',
    'w-full',
    error && 'textarea-error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        className={textareaClasses}
        {...rest}
      />
      
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default Input;

