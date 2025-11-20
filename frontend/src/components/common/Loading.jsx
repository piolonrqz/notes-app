import React from 'react';

/**
 * Reusable Loading component with DaisyUI styling
 * @param {Object} props - Component props
 * @param {String} props.size - Spinner size (xs, sm, md, lg)
 * @param {String} props.variant - Spinner variant (spinner, dots, ring, ball, bars, infinity)
 * @param {String} props.text - Loading text message
 * @param {Boolean} props.fullScreen - Display as full screen overlay
 * @param {String} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
const Loading = ({
  size = 'md',
  variant = 'spinner',
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  const spinnerClasses = [
    'loading',
    `loading-${variant}`,
    `loading-${size}`,
    'text-primary'
  ].filter(Boolean).join(' ');

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <span className={spinnerClasses}></span>
      {text && <p className="text-base-content/70">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

/**
 * Inline loading spinner (for buttons, cards, etc.)
 */
export const InlineLoading = ({ size = 'sm', className = '' }) => {
  return (
    <span className={`loading loading-spinner loading-${size} ${className}`}></span>
  );
};

/**
 * Skeleton loading component for content placeholders
 */
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const skeletonClasses = {
    text: 'h-4 w-full bg-base-300 rounded animate-pulse',
    card: 'h-32 w-full bg-base-300 rounded-lg animate-pulse',
    circle: 'h-12 w-12 bg-base-300 rounded-full animate-pulse',
    image: 'h-48 w-full bg-base-300 rounded animate-pulse'
  };

  return <div className={`${skeletonClasses[variant]} ${className}`}></div>;
};

export default Loading;

