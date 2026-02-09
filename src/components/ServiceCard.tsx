'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  FileText, 
  Calculator,
  ArrowRight 
} from 'lucide-react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const iconMap = {
    'users': Users,
    'building': Building2,
    'graduation': GraduationCap,
    'file-text': FileText,
    'calculator': Calculator,
  };

  const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100"
    >
      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-16 h-16 bg-gradient-to-br from-primary-900 to-secondary-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300"
      >
        <IconComponent className="w-8 h-8 text-white" />
      </motion.div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-heading font-semibold text-primary-900 group-hover:text-secondary-500 transition-colors duration-300">
          {service.title}
        </h3>
        
        <p className="text-neutral-600 leading-relaxed">
          {service.description}
        </p>

        {/* Features List */}
        <ul className="space-y-2">
          {service.features.slice(0, 3).map((feature, featureIndex) => (
            <motion.li
              key={featureIndex}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: (index * 0.1) + (featureIndex * 0.05), duration: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center text-sm text-neutral-600"
            >
              <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full mr-3"></div>
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Hover Arrow */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute bottom-6 right-6 w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ArrowRight className="w-4 h-4 text-white" />
      </motion.div>

      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 to-secondary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default ServiceCard;




