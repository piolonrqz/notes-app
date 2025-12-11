import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

/**
 * StatusBadge component - Displays transaction status with color coding
 * @param {Object} props - Component props
 * @param {String} props.status - Status: 'confirmed', 'pending', or 'failed'
 * @param {String} props.size - Size: 'sm', 'md', 'lg' (default: 'md')
 * @returns {JSX.Element}
 */
const StatusBadge = ({ status, size = 'md' }) => {
  // Normalize status to lowercase
  const normalizedStatus = status?.toLowerCase() || 'pending';

  // Status configuration
  const statusConfig = {
    confirmed: {
      label: 'Confirmed',
      icon: CheckCircle2,
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
      textColor: 'text-green-400',
      iconColor: 'text-green-400',
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      textColor: 'text-yellow-400',
      iconColor: 'text-yellow-400',
    },
    failed: {
      label: 'Failed',
      icon: XCircle,
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      textColor: 'text-red-400',
      iconColor: 'text-red-400',
    },
  };

  // Get config for current status (default to pending if unknown)
  const config = statusConfig[normalizedStatus] || statusConfig.pending;
  const Icon = config.icon;

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'px-2 py-0.5 text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1',
    },
    md: {
      container: 'px-2.5 py-1 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-1.5',
    },
    lg: {
      container: 'px-3 py-1.5 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2',
    },
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`
        inline-flex items-center ${sizeClass.gap} ${sizeClass.container}
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border rounded-full font-medium
        transition-all duration-200
      `}
    >
      <Icon className={`${sizeClass.icon} ${config.iconColor}`} />
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;

