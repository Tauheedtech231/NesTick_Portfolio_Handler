'use client';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
   alert?: boolean; // optional prop
}

export function StatsCard({ title, value, description, trend, }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="relative overflow-hidden p-6 rounded-2xl shadow-sm 
                 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
                 hover:shadow-md hover:shadow-gray-400/10 transition-all duration-300"
    >
      {/* Subtle hover background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100/20 to-gray-300/10 
                      dark:from-gray-800/40 dark:to-gray-700/30 
                      opacity-0 hover:opacity-100 transition-opacity duration-500 
                      rounded-2xl pointer-events-none"></div>

      <div className="relative z-10 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        <p
          className={`text-sm mt-1 font-medium ${
            trend.includes('-')
              ? 'text-gray-500 dark:text-gray-500'
              : 'text-gray-400 dark:text-gray-400'
          }`}
        >
          {trend}
        </p>
      </div>
    </motion.div>
  );
}
