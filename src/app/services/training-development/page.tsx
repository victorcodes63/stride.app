'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Users, Target, Award, CheckCircle, Download, ArrowRight, Phone, Mail, Clock, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';

export default function TrainingDevelopmentPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const trainingServices = [
    {
      icon: Users,
      title: "Leadership Development",
      description: "Comprehensive leadership programs to develop and enhance management capabilities at all levels of your organization.",
      features: ["Executive coaching", "Management training", "Team leadership", "Strategic thinking"],
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-100 to-sky-200"
    },
    {
      icon: BookOpen,
      title: "Skills Training",
      description: "Targeted skills development programs tailored to your industry and organizational needs for maximum impact.",
      features: ["Technical skills", "Soft skills", "Industry-specific training", "Certification programs"],
      color: "from-emerald-600 to-emerald-700",
      bgColor: "from-emerald-100 to-emerald-200"
    },
    {
      icon: Target,
      title: "Performance Management",
      description: "Training on effective performance management systems and employee evaluation processes for better outcomes.",
      features: ["Goal setting", "Performance reviews", "Feedback systems", "Development planning"],
      color: "from-purple-600 to-purple-700",
      bgColor: "from-purple-100 to-purple-200"
    },
    {
      icon: Award,
      title: "Board Training Services",
      description: "Specialized training for board members including interview skills, vision and mission development, and governance best practices.",
      features: ["Interview skills training", "Vision & mission workshops", "Governance training", "Board effectiveness"],
      color: "from-orange-600 to-orange-700",
      bgColor: "from-orange-100 to-orange-200"
    }
  ];

  const boardTrainingServices = [
    "Interview Skills Training",
    "Vision & Mission Development", 
    "Governance Best Practices",
    "Board Effectiveness Training",
    "Strategic Planning Workshops",
    "Risk Management Training"
  ];

  const pacidaSpotlight = {
    company: "Pacida",
    logo: "/images/clients/Pacida Logo.png",
    description: "Pacida has been a valued client of Eagle HR's training and development services, particularly benefiting from our specialized board training programs.",
    services: [
      "Board interview skills training",
      "Vision and mission development workshops", 
      "Governance effectiveness training",
      "Strategic planning facilitation"
    ],
    results: [
      "Enhanced board interview processes",
      "Clearer organizational vision and mission",
      "Improved governance structures",
      "Better strategic decision-making"
    ]
  };

  const stats = [
    { number: "95%", label: "Training Effectiveness", description: "Measured improvement in skills" },
    { number: "500+", label: "Participants Trained", description: "Across various industries" },
    { number: "50+", label: "Training Programs", description: "Customized for different needs" },
    { number: "98%", label: "Satisfaction Rate", description: "Based on participant feedback" }
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 min-h-[50vh] flex flex-col justify-center overflow-hidden">
        {/* Background Image with Reduced Opacity */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
            style={{
              backgroundImage: 'url(/images/services/training/hero.jpg)'
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
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-900 mb-6">
              Training & Development
            </h1>
            <p className="text-xl text-neutral-700 leading-relaxed mb-8">
              Enhance your team's capabilities with our customized training programs. 
              We focus on leadership development, skills training, and performance management for sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-secondary-500 text-white rounded-lg font-semibold text-lg hover:bg-secondary-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/downloads/eagle-hr-training-guide.pdf"
                download="Eagle-HR-Training-Guide.pdf"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-900 rounded-lg font-semibold text-lg border-2 border-primary-900 hover:bg-primary-900 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <Download className="mr-2 w-5 h-5" />
                Download Guide
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
              Comprehensive Training Solutions
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              We offer end-to-end training and development programs designed to enhance 
              your team's capabilities and drive organizational success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainingServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isMounted ? index * 0.1 : 0, duration: 0.6 }}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:border-primary-200 p-8"
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${service.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-primary-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-neutral-600">
                      <CheckCircle className="w-4 h-4 text-secondary-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Training Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
              Specialized Board Training Services
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Our specialized board training programs focus on governance excellence, 
              strategic leadership, and organizational effectiveness for board members and executives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {boardTrainingServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 border border-primary-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary-900" />
                </div>
                <h3 className="text-lg font-semibold text-primary-900">{service}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Spotlight Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
              Client Spotlight
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Success stories from our training and development partnerships 
              across various industries and organizational levels.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Background Image with White Overlay */}
              <div className="absolute inset-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: 'url(/images/services/training/pacida.jpg)'
                  }}
                />
                <div className="absolute inset-0 bg-white/85" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-12 md:p-16">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  {/* Logo and Company Info */}
                  <div className="space-y-8">
                    <div className="text-center md:text-left">
                      <div className="w-24 h-24 mx-auto md:mx-0 mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
                        <img
                          src={pacidaSpotlight.logo}
                          alt={pacidaSpotlight.company}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center hidden">
                          <Award className="w-12 h-12 text-primary-900" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-primary-900 mb-2">
                        {pacidaSpotlight.company}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">
                        {pacidaSpotlight.description}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-3 text-lg">Services Provided:</h4>
                      <ul className="space-y-2">
                        {pacidaSpotlight.services.map((service, index) => (
                          <li key={index} className="flex items-start text-neutral-600">
                            <CheckCircle className="w-5 h-5 text-secondary-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary-900 mb-3 text-lg">Results Achieved:</h4>
                      <ul className="space-y-2">
                        {pacidaSpotlight.results.map((result, index) => (
                          <li key={index} className="flex items-start text-neutral-600">
                            <Star className="w-5 h-5 text-secondary-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Training Impact & Results
            </h2>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto">
              Our training programs deliver measurable results that transform 
              individuals and organizations for long-term success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-primary-200 mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-primary-300">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Resources Section */}
      <section className="py-12 bg-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Download Our Resources
            </h2>
            <p className="text-lg text-orange-100 max-w-3xl mx-auto">
              Access our comprehensive guides, templates, and company information to learn more 
              about our training and development services and best practices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Training Guide</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Comprehensive guide to effective training and development strategies for modern organizations.
              </p>
              <a
                href="/downloads/training-development-guide.pdf"
                download="Training-Development-Guide.pdf"
                className="inline-flex items-center text-white hover:text-secondary-300 transition-colors duration-300 mt-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Leadership Development</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Best practices and frameworks for developing effective leaders in your organization.
              </p>
              <a
                href="/downloads/leadership-development-guide.pdf"
                download="Leadership-Development-Guide.pdf"
                className="inline-flex items-center text-white hover:text-secondary-300 transition-colors duration-300 mt-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Performance Management</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Comprehensive checklist for implementing effective performance management systems.
              </p>
              <a
                href="/downloads/performance-management-guide.pdf"
                download="Performance-Management-Guide.pdf"
                className="inline-flex items-center text-white hover:text-secondary-300 transition-colors duration-300 mt-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Transform Your Team?
            </h2>
            <p className="text-xl text-primary-200 mb-8">
              Let us help you develop your team's potential and drive organizational success. 
              Contact us today for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-900 rounded-lg font-semibold text-lg hover:bg-primary-100 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <Phone className="mr-2 w-5 h-5" />
                Schedule Consultation
              </Link>
              <Link
                href="mailto:info@eaglehr.co.ke"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white rounded-lg font-semibold text-lg border-2 border-white hover:bg-white hover:text-primary-900 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <Mail className="mr-2 w-5 h-5" />
                Send Email
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
