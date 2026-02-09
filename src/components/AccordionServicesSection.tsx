'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UserSearch, 
  Building2, 
  BookOpen, 
  ShieldCheck, 
  TrendingUp, 
  Globe2,
  Brain,
  ArrowRight,
  ChevronDown,
  CheckCircle
} from 'lucide-react';

const AccordionServicesSection = () => {
  const [activeService, setActiveService] = useState(0); // Always start with first service open

  const services = [
    {
      id: '1',
      title: 'Recruitment & Executive Search',
      description: 'Find the right talent for your organization with our comprehensive recruitment solutions.',
      icon: UserSearch,
      color: 'from-slate-600 to-slate-700',
      bgColor: 'from-slate-100 to-gray-200',
      features: ['Executive Search', 'Technical Recruitment', 'Talent Assessment', 'Interview Coordination'],
      link: '/services/recruitment',
      details: 'Our recruitment services help you find the perfect candidates for your organization. We specialize in executive search, technical recruitment, and comprehensive talent assessment processes.'
    },
    {
      id: '2',
      title: 'HR Outsourcing',
      description: 'Streamline your HR operations with our professional outsourcing services.',
      icon: Building2,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'from-blue-100 to-sky-200',
      features: ['Payroll Management', 'HR Administration', 'Policy Development', 'Compliance Management'],
      link: '/services/hr-outsourcing',
      details: 'Focus on your core business while we handle all your HR needs. Our outsourcing services include payroll management, HR administration, and comprehensive compliance support.'
    },
    {
      id: '3',
      title: 'Training & Development',
      description: 'Enhance your team\'s capabilities with our customized training programs.',
      icon: BookOpen,
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'from-indigo-100 to-blue-200',
      features: ['Leadership Development', 'Skills Training', 'Team Building', 'Performance Management'],
      link: '/services/training-development',
      details: 'Invest in your team\'s growth with our comprehensive training programs. We offer leadership development, skills training, and team building activities tailored to your needs.'
    },
    {
      id: '4',
      title: 'HR Compliance & Legal',
      description: 'Ensure your organization meets all Kenyan labor laws and regulations.',
      icon: ShieldCheck,
      color: 'from-slate-600 to-slate-700',
      bgColor: 'from-slate-100 to-gray-200',
      features: ['Labor Law Compliance', 'Employment Contracts', 'Disciplinary Procedures', 'Legal Advisory'],
      link: '/services/hr-compliance',
      details: 'Stay compliant with all Kenyan labor laws and regulations. Our legal experts ensure your organization meets all statutory requirements and maintains proper documentation.'
    },
    {
      id: '5',
      title: 'Salary Surveys',
      description: 'Get comprehensive market data to make informed compensation decisions.',
      icon: TrendingUp,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'from-blue-100 to-sky-200',
      features: ['Market Analysis', 'Compensation Benchmarking', 'Salary Ranges', 'Industry Reports'],
      link: '/services/salary-surveys',
      details: 'Stay competitive with our comprehensive salary surveys. We provide detailed market analysis, compensation benchmarking, and industry-specific salary ranges to help you make informed decisions about your compensation strategy.'
    },
    {
      id: '6',
      title: 'EOR Services',
      description: 'Employer of Record services for seamless global workforce management.',
      icon: Globe2,
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'from-indigo-100 to-blue-200',
      features: ['Global Employment', 'Payroll Management', 'Compliance Handling', 'Local Expertise'],
      link: '/services/eor-services',
      details: 'Expand your business globally with our Employer of Record services. We handle all employment, payroll, and compliance requirements, allowing you to focus on growing your business while we manage the complexities of international employment.'
    },
    {
      id: '7',
      title: 'Psychometric Assessments',
      description: 'Comprehensive psychological testing for better hiring and development decisions.',
      icon: Brain,
      color: 'from-slate-600 to-slate-700',
      bgColor: 'from-slate-100 to-gray-200',
      features: ['Personality Testing', 'Cognitive Assessments', 'Behavioral Analysis', 'Talent Profiling'],
      link: '/services/psychometric-assessments',
      details: 'Make data-driven hiring and development decisions with our comprehensive psychometric assessments. We provide personality testing, cognitive assessments, and behavioral analysis to help you understand your team better and make informed decisions.'
    }
  ];

  return (
    <section className="mt-8 py-16 md:py-20 bg-gradient-to-br from-neutral-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background Elements - Brand Orange Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Orange Blob - Top Left */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-secondary-500/15 rounded-full blur-3xl"
        />
        
        {/* Medium Orange Blob - Top Right */}
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.1, 1, 1.1],
            x: [0, -25, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-10 w-60 h-60 bg-secondary-400/20 rounded-full blur-2xl"
        />
        
        {/* Small Orange Blob - Middle Left */}
        <motion.div
          animate={{ 
            rotate: 180,
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-10 w-40 h-40 bg-secondary-600/10 rounded-full blur-xl"
        />
        
        {/* Medium Orange Blob - Bottom Right */}
        <motion.div
          animate={{ 
            rotate: -180,
            scale: [1.2, 1, 1.2],
            x: [0, -35, 0],
            y: [0, 25, 0]
          }}
          transition={{ 
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-10 right-20 w-70 h-70 bg-secondary-500/12 rounded-full blur-2xl"
        />
        
        {/* Small Orange Blob - Bottom Left */}
        <motion.div
          animate={{ 
            rotate: 90,
            scale: [1, 1.4, 1],
            x: [0, 20, 0],
            y: [0, -15, 0]
          }}
          transition={{ 
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-20 w-50 h-50 bg-secondary-400/15 rounded-full blur-xl"
        />
        
        {/* Tiny Orange Blob - Center */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.5, 1],
            x: [0, 15, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-1/2 w-30 h-30 bg-secondary-600/20 rounded-full blur-lg"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 bg-primary-900 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Our Services
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-900 mb-6">
            Comprehensive HR Solutions
            <span className="block text-secondary-500 mt-2">Tailored to Your Needs</span>
          </h2>
          
          <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
            We offer a full spectrum of HR services designed to help your organization 
            thrive in today's competitive business environment.
          </p>
        </motion.div>

        {/* Sticky Accordion Services */}
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeService === index;
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Accordion Header */}
                  <motion.button
                    onClick={() => setActiveService(isActive ? (activeService === index ? activeService : index) : index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 md:p-6 lg:p-8 rounded-xl border-2 transition-all duration-500 ${
                      isActive 
                        ? `bg-gradient-to-r ${service.bgColor} border-${service.color.split('-')[1]}-300 shadow-lg` 
                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg md:text-xl font-heading font-bold mb-1 md:mb-2 ${
                            isActive ? 'text-primary-900' : 'text-primary-900'
                          }`}>
                            {service.title}
                          </h3>
                          <p className={`text-xs md:text-sm ${
                            isActive ? 'text-neutral-700' : 'text-neutral-600'
                          }`}>
                            {service.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 md:space-x-4">
                        {/* Learn More Button - Always visible on closed accordions */}
                        {!isActive && (
                          <Link
                            href={service.link}
                            className={`hidden sm:inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r ${service.color} text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-xs md:text-sm`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Learn More
                            <ArrowRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
                          </Link>
                        )}
                        
                        <motion.div
                          animate={{ rotate: isActive ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-neutral-500" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className={`bg-gradient-to-br ${service.bgColor} rounded-b-xl p-4 md:p-6 lg:p-8 border-l-2 border-r-2 border-b-2 border-${service.color.split('-')[1]}-300`}>
                          <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                            {/* Left Column - Features */}
                            <div>
                              <h4 className="text-base md:text-lg font-semibold text-primary-900 mb-3 md:mb-4">What We Offer:</h4>
                              <div className="space-y-2 md:space-y-3">
                                {service.features.map((feature, featureIndex) => (
                                  <motion.div
                                    key={featureIndex}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                                    className="flex items-center space-x-2 md:space-x-3"
                                  >
                                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-secondary-500 flex-shrink-0" />
                                    <span className="text-sm md:text-base text-neutral-700">{feature}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Right Column - Details */}
                            <div>
                              <h4 className="text-base md:text-lg font-semibold text-primary-900 mb-3 md:mb-4">Service Details:</h4>
                              <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
                                {service.details}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA - With Professional Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-white border-2 border-neutral-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative h-48 md:h-64 lg:h-auto lg:min-h-[400px]"
              >
                <Image
                  src="/images/about/cta_image.webp"
                  alt="Professional HR consultation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </motion.div>
              
              {/* Right Side - Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="p-6 md:p-8 lg:p-12 flex flex-col justify-center"
              >
                
                <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-primary-900 mb-3 md:mb-4">
                  Ready to Transform Your HR?
                </h3>
                <p className="text-base md:text-lg text-neutral-700 mb-6 md:mb-8 leading-relaxed">
                  Discover how our comprehensive HR services can drive your organization's success. 
                  Let's discuss your specific needs and create a tailored solution.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link
                    href="/services"
                    className="group bg-primary-900 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-primary-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center border-2 border-primary-900"
                  >
                    View All Services
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="group border-2 border-primary-900 text-primary-900 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-primary-900 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    Get Started Today
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AccordionServicesSection;
