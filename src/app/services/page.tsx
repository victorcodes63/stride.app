'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { Service } from '@/types';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  Calculator,
  ArrowRight,
  Award,
  Shield,
  BarChart3,
  Star,
  Building2,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

// Metadata moved to layout.tsx

// Helper functions for service comparison
const getServiceDuration = (serviceId: string) => {
  const durations = {
    'recruitment': '2-8 weeks',
    'hr-outsourcing': 'Ongoing',
    'training-development': '1-12 weeks',
    'hr-compliance': '1-4 weeks',
    'salary-surveys': '2-6 weeks',
    'hr-documentation': '1-3 weeks',
    'psychometric-testing': '1-2 weeks'
  };
  return durations[serviceId as keyof typeof durations] || 'Varies';
};

const getServicePrice = (serviceId: string) => {
  const prices = {
    'recruitment': 'KSh 50,000+',
    'hr-outsourcing': 'KSh 25,000+/mo',
    'training-development': 'KSh 15,000+',
    'hr-compliance': 'KSh 30,000+',
    'salary-surveys': 'KSh 40,000+',
    'hr-documentation': 'KSh 20,000+',
    'psychometric-testing': 'KSh 35,000+'
  };
  return prices[serviceId as keyof typeof prices] || 'Contact Us';
};

const getServiceTarget = (serviceId: string) => {
  const targets = {
    'recruitment': 'All Organizations',
    'hr-outsourcing': 'Growing Companies',
    'training-development': 'Teams & Individuals',
    'hr-compliance': 'All Organizations',
    'salary-surveys': 'HR Teams',
    'hr-documentation': 'All Organizations',
    'psychometric-testing': 'HR Teams & Recruiters'
  };
  return targets[serviceId as keyof typeof targets] || 'All Organizations';
};

export default function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const services: Service[] = [
    {
      id: 'recruitment',
      title: 'Recruitment & Executive Search',
      description: 'Find the perfect talent for your organization with our comprehensive recruitment solutions. From entry-level positions to C-suite executives, we deliver exceptional candidates who drive results.',
      icon: 'users',
      category: 'recruitment',
      features: [
        'Executive Search & C-Suite Placements',
        'Technical & Specialized Recruitment',
        'Mass Recruitment for Large Projects',
        'Talent Assessment & Psychometric Testing',
        'Interview Coordination & Management',
        'Reference Checking & Background Verification',
        'Onboarding Support & Integration',
        'Retained Search Services'
      ]
    },
    {
      id: 'hr-outsourcing',
      title: 'HR Outsourcing',
      description: 'Streamline your HR operations with our professional outsourcing services. Focus on your core business while we handle all aspects of human resource management.',
      icon: 'building',
      category: 'hr-operations',
      features: [
        'Complete HR Department Outsourcing',
        'Payroll Processing & Management',
        'HR Administration & Documentation',
        'Policy Development & Implementation',
        'Compliance Management & Reporting',
        'Employee Relations & Disciplinary Actions',
        'Performance Management Systems',
        'HR Technology Implementation'
      ]
    },
    {
      id: 'training-development',
      title: 'Training & Development',
      description: 'Enhance your team\'s capabilities with our customized training programs. From leadership development to technical skills, we design programs that deliver measurable results.',
      icon: 'graduation',
      category: 'training-development',
      features: [
        'Leadership Development Programs',
        'Technical Skills Training',
        'Soft Skills & Communication Training',
        'Team Building & Collaboration',
        'Performance Management Training',
        'Compliance & Legal Training',
        'Executive Coaching & Mentoring',
        'Custom Training Program Design'
      ]
    },
    {
      id: 'hr-compliance',
      title: 'HR Compliance & Legal',
      description: 'Ensure your organization meets all Kenyan labor laws and regulations. We provide comprehensive compliance support and legal advisory services.',
      icon: 'shield',
      category: 'compliance',
      features: [
        'Labor Law Compliance',
        'Employment Contract Review',
        'Disciplinary Procedures',
        'Legal Advisory Services',
        'Compliance Audits',
        'Policy Development',
        'Risk Assessment',
        'Regulatory Updates'
      ]
    },
    {
      id: 'salary-surveys',
      title: 'Salary Surveys & Analytics',
      description: 'Make data-driven compensation decisions with comprehensive salary surveys, market analytics, and strategic pay structure design.',
      icon: 'bar-chart',
      category: 'analytics',
      features: [
        'Salary Benchmarking',
        'Compensation Analytics',
        'Pay Structure Design',
        'Compensation Modeling',
        'Market Rate Analysis',
        'ROI on Compensation Spend',
        'Pay Equity Assessments',
        'Budget Forecasting'
      ]
    },
    {
      id: 'hr-documentation',
      title: 'HR Documentation & Policies',
      description: 'Professional HR documentation that ensures compliance, clarity, and consistency. From policy development to employee handbooks.',
      icon: 'file-text',
      category: 'documentation',
      features: [
        'Policy Development',
        'Employee Handbooks',
        'Compliance Documentation',
        'HR Forms & Templates',
        'Legal Documentation',
        'Procedure Manuals',
        'Training Materials',
        'Audit Documentation'
      ]
    },
    {
      id: 'psychometric-testing',
      title: 'Psychometric Testing',
      description: 'Comprehensive psychological assessments for talent selection, development, and organizational effectiveness. Data-driven insights for better hiring decisions.',
      icon: 'brain',
      category: 'recruitment',
      features: [
        'Cognitive Ability Testing',
        'Personality Assessments',
        'Aptitude Testing',
        'Emotional Intelligence Testing',
        'Leadership Potential Assessment',
        'Team Dynamics Analysis',
        'Cultural Fit Evaluation',
        'Custom Assessment Design'
      ]
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Assessment',
      description: 'We begin by understanding your unique needs, challenges, and organizational goals.'
    },
    {
      step: '02',
      title: 'Solution Design',
      description: 'Our experts design customized HR solutions tailored to your specific requirements.'
    },
    {
      step: '03',
      title: 'Implementation',
      description: 'We execute the solution with precision, ensuring minimal disruption to your operations.'
    },
    {
      step: '04',
      title: 'Monitoring & Optimization',
      description: 'We continuously monitor results and optimize processes for maximum effectiveness.'
    }
  ];

  const benefits = [
    'Access to Expert HR Knowledge',
    'Cost-Effective Solutions',
    'Compliance Assurance',
    'Scalable Services',
    '24/7 Support & Monitoring',
    'Proven Track Record',
    'Customized Approach',
    'Technology Integration'
  ];

  // Filter services based on active filter
  const filteredServices = services.filter(service => {
    if (activeFilter === 'all') return true;
    return service.category === activeFilter;
  });

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        {/* Background Image with Reduced Opacity */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
            style={{
              backgroundImage: 'url(/images/hero/Reception_comp.webp)'
            }}
          />
          {/* White Overlay with Higher Opacity */}
          <div className="absolute inset-0 bg-white/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-900 rounded-full text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 mr-2" />
              Our Services
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-900"
            >
              Comprehensive HR Solutions
              <span className="block text-secondary-500">That Drive Results</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-neutral-700 leading-relaxed mb-8"
            >
              From recruitment to training, we offer a full spectrum of HR services designed to 
              help your organization thrive in today's competitive business environment.
            </motion.p>

          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Service Categories Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeFilter === 'all' 
                  ? 'bg-primary-900 text-white' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Services
            </button>
            <button 
              onClick={() => setActiveFilter('recruitment')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeFilter === 'recruitment' 
                  ? 'bg-primary-900 text-white' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Recruitment
            </button>
            <button 
              onClick={() => setActiveFilter('hr-operations')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeFilter === 'hr-operations' 
                  ? 'bg-primary-900 text-white' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              HR Operations
            </button>
            <button 
              onClick={() => setActiveFilter('training-development')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeFilter === 'training-development' 
                  ? 'bg-primary-900 text-white' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Training & Development
            </button>
            <button 
              onClick={() => setActiveFilter('compliance')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeFilter === 'compliance' 
                  ? 'bg-primary-900 text-white' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Compliance
            </button>
            <button 
              onClick={() => setActiveFilter('analytics')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeFilter === 'analytics' 
                  ? 'bg-primary-900 text-white' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Analytics
            </button>
            <button 
              onClick={() => setActiveFilter('documentation')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeFilter === 'documentation' 
                  ? 'bg-primary-900 text-white' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Documentation
            </button>
          </div>

          {/* Enhanced Service Cards */}
          {isMounted ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <EnhancedServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
                  <div className="w-16 h-16 bg-neutral-200 rounded-xl mb-6"></div>
                  <div className="h-6 bg-neutral-200 rounded mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Service Comparison Matrix */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
              Service Comparison
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Compare our services to find the perfect solution for your organization's needs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-primary-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Service</th>
                  <th className="px-6 py-4 text-center font-semibold">Duration</th>
                  <th className="px-6 py-4 text-center font-semibold">Best For</th>
                  <th className="px-6 py-4 text-center font-semibold">Features</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, index) => (
                  <tr key={service.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors duration-300`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                          {(() => {
                            const iconMap = {
                              'users': Users,
                              'building': Building2,
                              'graduation': GraduationCap,
                              'file-text': FileText,
                              'calculator': Calculator,
                              'shield': Shield,
                              'bar-chart': BarChart3,
                            };
                            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;
                            return <IconComponent className="w-4 h-4 text-secondary-500" />;
                          })()}
                        </div>
                        <div>
                          <div className="font-semibold text-primary-900">{service.title}</div>
                          <div className="text-sm text-neutral-600">{service.features.length} key features</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {getServiceDuration(service.id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-neutral-600">
                        {getServiceTarget(service.id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {service.features.length} features
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/services/${service.id}`}
                        className="inline-flex items-center px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors duration-300"
                      >
                        Learn More
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Get answers to common questions about our HR services
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
              Our Proven Process
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              We follow a systematic approach to ensure successful delivery of HR solutions 
              that meet your specific needs and drive organizational success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-900 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-xl font-heading font-semibold text-primary-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Why Choose Our Services?
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Our comprehensive HR services are designed to deliver exceptional value 
                and measurable results for your organization.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-center">
                <Award className="w-16 h-16 text-secondary-500 mx-auto mb-6" />
                <h3 className="text-2xl font-heading font-bold mb-4">
                  Proven Excellence
                </h3>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-secondary-500 mb-1">500+</div>
                    <div className="text-sm text-white/80">Companies Served</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary-500 mb-1">98%</div>
                    <div className="text-sm text-white/80">Client Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary-500 mb-1">2000+</div>
                    <div className="text-sm text-white/80">Successful Placements</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary-500 mb-1">15+</div>
                    <div className="text-sm text-white/80">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
              Industry Expertise
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              We serve organizations across diverse industries, bringing specialized knowledge 
              and tailored solutions to each sector.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'Technology', 'Banking & Finance', 'Healthcare', 'Manufacturing', 
              'Education', 'Retail', 'Construction', 'Agriculture', 
              'Telecommunications', 'Energy', 'Logistics', 'Hospitality'
            ].map((industry, index) => (
              <div key={industry} className="bg-gradient-to-br from-neutral-50 to-white p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300">
                <div className="text-sm font-medium text-primary-900">{industry}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-500 to-secondary-400 text-primary-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Transform Your HR?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Let's discuss how our comprehensive HR services can drive your organization's success. 
              Contact us today for a free consultation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group bg-primary-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
              >
                Get Free Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                href="/about"
                className="group border-2 border-primary-900 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-900 hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Enhanced Service Card Component
const EnhancedServiceCard = ({ service, index }: { service: Service; index: number }) => {
  const iconMap = {
    'users': Users,
    'building': Building2,
    'graduation': GraduationCap,
    'file-text': FileText,
    'calculator': Calculator,
    'shield': Shield,
    'bar-chart': BarChart3,
  };

  const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 flex flex-col h-full"
    >
      {/* Service Badge */}
      <div className="absolute top-4 right-4">
        <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-xs font-medium">
          {getServiceDuration(service.id)}
        </span>
      </div>

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300"
      >
        <IconComponent className="w-8 h-8 text-secondary-500" />
      </motion.div>

      {/* Content */}
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <h3 className="text-xl font-heading font-semibold text-primary-900 group-hover:text-secondary-500 transition-colors duration-300">
            {service.title}
          </h3>
          
          <p className="text-neutral-600 leading-relaxed mt-4">
            {service.description}
          </p>

          {/* Key Features */}
          <div className="space-y-2 mt-6">
            <h4 className="font-semibold text-primary-900 text-sm">Key Features:</h4>
            <ul className="space-y-2">
              {service.features.slice(0, 4).map((feature, featureIndex) => (
                <motion.li
                  key={featureIndex}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + (featureIndex * 0.05), duration: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-center text-sm text-neutral-600"
                >
                  <CheckCircle className="w-4 h-4 text-secondary-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section - Always at bottom */}
        <div className="pt-4 border-t border-neutral-100 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-neutral-600">
              Best for: <span className="font-medium text-primary-900">{getServiceTarget(service.id)}</span>
            </div>
            <div className="text-sm text-neutral-500">
              Duration: <span className="font-medium">{getServiceDuration(service.id)}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/services/${service.id}`}
              className="flex-1 bg-primary-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors duration-300 text-center"
            >
              Learn More
            </Link>
            <Link
              href="/contact"
              className="flex-1 border border-primary-900 text-primary-900 py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-900 hover:text-white transition-colors duration-300 text-center"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 to-secondary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

// FAQ Accordion Component
const FAQAccordion = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How long does the recruitment process typically take?",
      answer: "Our recruitment process typically takes 2-4 weeks for standard positions and 4-8 weeks for executive roles, depending on the complexity and requirements of the position."
    },
    {
      question: "Do you provide ongoing support after placement?",
      answer: "Yes, we provide comprehensive onboarding support and follow-up services to ensure successful integration and long-term retention of placed candidates."
    },
    {
      question: "What industries do you specialize in?",
      answer: "We serve organizations across diverse industries including technology, banking, healthcare, manufacturing, education, and many more with specialized knowledge for each sector."
    },
    {
      question: "Can you help with compliance and legal HR issues?",
      answer: "Absolutely. Our HR advisory services include compliance management, policy development, and legal guidance to ensure your organization meets all regulatory requirements."
    },
    {
      question: "What makes your HR services different from competitors?",
      answer: "Our combination of local expertise with global best practices, proven track record with 500+ companies, and personalized approach tailored to each client's unique needs sets us apart in the Kenyan market."
    },
    {
      question: "Do you offer customized HR solutions?",
      answer: "Yes, we specialize in creating tailored HR solutions that align with your organization's specific goals, culture, and industry requirements. Every solution is designed to meet your unique challenges."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          viewport={{ once: true }}
          className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200"
          >
            <h3 className="font-semibold text-primary-900 text-lg pr-6">
              {faq.question}
            </h3>
            <motion.div
              animate={{ rotate: activeFAQ === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-primary-600 flex-shrink-0" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {activeFAQ === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-8 pt-6">
                  <p className="text-neutral-600 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

