// components/ui/toggle-switch.tsx
'use client';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean; // ✅ add optional disabled prop
}

export function ToggleSwitch({ enabled, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={() => !disabled && onChange(!enabled)} // ✅ prevent toggle if disabled
      disabled={disabled} // ✅ native button disable
    >
      <motion.span
        initial={false}
        animate={{ x: enabled ? 20 : 0 }}
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
}
