import React from 'react';

/**
 * Reusable Button component with DaisyUI styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {String} props.variant - Button variant (primary, secondary, accent, ghost, error, success)
 * @param {String} props.size - Button size (xs, sm, md, lg)
 * @param {Boolean} props.loading - Show loading state
 * @param {Boolean} props.disabled - Disable button
 * @param {String} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {String} props.type - Button type (button, submit, reset)
 * @returns {JSX.Element}
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) => {
  // Build button classes
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading && 'loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

