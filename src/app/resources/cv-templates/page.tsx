'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Download, Eye, Star, CheckCircle, ArrowRight, Users, Briefcase, Award } from 'lucide-react';

export default function CVTemplatesPage() {
  const cvTemplates = [
    {
      id: 1,
      name: 'Professional Executive',
      description: 'Clean, modern design perfect for senior-level positions and executive roles.',
      category: 'Executive',
      difficulty: 'Advanced',
      features: ['ATS-friendly format', 'Executive summary section', 'Leadership highlights', 'Achievement metrics'],
      preview: '/images/templates/cv-executive-preview.jpg',
      downloadUrl: '/templates/cv-executive-template.docx',
      rating: 4.9,
      downloads: 1250
    },
    {
      id: 2,
      name: 'Creative Professional',
      description: 'Modern, visually appealing template ideal for creative industries and marketing roles.',
      category: 'Creative',
      difficulty: 'Intermediate',
      features: ['Visual portfolio section', 'Skills visualization', 'Creative layout', 'Color customization'],
      preview: '/images/templates/cv-creative-preview.jpg',
      downloadUrl: '/templates/cv-creative-template.docx',
      rating: 4.7,
      downloads: 980
    },
    {
      id: 3,
      name: 'Technical Specialist',
      description: 'Structured format perfect for IT professionals, engineers, and technical specialists.',
      category: 'Technical',
      difficulty: 'Intermediate',
      features: ['Technical skills section', 'Project portfolio', 'Certifications highlight', 'Code samples'],
      preview: '/images/templates/cv-technical-preview.jpg',
      downloadUrl: '/templates/cv-technical-template.docx',
      rating: 4.8,
      downloads: 1100
    },
    {
      id: 4,
      name: 'Fresh Graduate',
      description: 'Beginner-friendly template designed for recent graduates and entry-level positions.',
      category: 'Entry Level',
      difficulty: 'Beginner',
      features: ['Education focus', 'Internship highlights', 'Skills showcase', 'Simple layout'],
      preview: '/images/templates/cv-graduate-preview.jpg',
      downloadUrl: '/templates/cv-graduate-template.docx',
      rating: 4.6,
      downloads: 750
    },
    {
      id: 5,
      name: 'Career Changer',
      description: 'Flexible template designed for professionals transitioning between industries.',
      category: 'Career Change',
      difficulty: 'Intermediate',
      features: ['Transferable skills', 'Career narrative', 'Relevant experience', 'Adaptable sections'],
      preview: '/images/templates/cv-career-change-preview.jpg',
      downloadUrl: '/templates/cv-career-change-template.docx',
      rating: 4.5,
      downloads: 650
    },
    {
      id: 6,
      name: 'Minimalist Modern',
      description: 'Clean, minimalist design that focuses on content and readability.',
      category: 'General',
      difficulty: 'Beginner',
      features: ['Clean typography', 'Simple layout', 'Easy customization', 'Print-friendly'],
      preview: '/images/templates/cv-minimalist-preview.jpg',
      downloadUrl: '/templates/cv-minimalist-template.docx',
      rating: 4.7,
      downloads: 890
    }
  ];

  const coverLetterTemplates = [
    {
      id: 1,
      name: 'Formal Business',
      description: 'Professional, traditional format suitable for corporate environments.',
      category: 'Business',
      features: ['Traditional structure', 'Professional tone', 'Company research', 'Call to action'],
      downloadUrl: '/templates/cover-letter-business-template.docx',
      rating: 4.8,
      downloads: 1200
    },
    {
      id: 2,
      name: 'Creative Industry',
      description: 'Engaging format perfect for creative roles and non-traditional industries.',
      category: 'Creative',
      features: ['Personal storytelling', 'Creative formatting', 'Portfolio integration', 'Unique voice'],
      downloadUrl: '/templates/cover-letter-creative-template.docx',
      rating: 4.6,
      downloads: 850
    },
    {
      id: 3,
      name: 'Email Cover Letter',
      description: 'Concise format designed for email applications and online submissions.',
      category: 'Digital',
      features: ['Brief format', 'Email-friendly', 'Quick read', 'Mobile optimized'],
      downloadUrl: '/templates/cover-letter-email-template.docx',
      rating: 4.7,
      downloads: 1100
    }
  ];

  const tips = [
    {
      icon: CheckCircle,
      title: 'Tailor Your CV',
      description: 'Customize your CV for each job application, highlighting relevant skills and experience.'
    },
    {
      icon: Users,
      title: 'Use Action Verbs',
      description: 'Start bullet points with strong action verbs like "achieved," "managed," or "developed."'
    },
    {
      icon: Briefcase,
      title: 'Quantify Achievements',
      description: 'Include specific numbers, percentages, and metrics to demonstrate your impact.'
    },
    {
      icon: Award,
      title: 'Keep It Concise',
      description: 'Aim for 1-2 pages maximum, focusing on the most relevant and recent experience.'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
            style={{
              backgroundImage: 'url(/images/hero/Reception_comp.webp)'
            }}
          />
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
              <FileText className="w-4 h-4 mr-2" />
              CV & Cover Letter Templates
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-900"
            >
              Professional Templates
              <span className="block text-secondary-500">For Your Career</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-neutral-700 leading-relaxed mb-8"
            >
              Download professionally designed CV and cover letter templates to help you 
              stand out in your job applications and advance your career.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CV Templates Section */}
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
              CV Templates
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Choose from our collection of professionally designed CV templates tailored for different industries and career levels.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cvTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white border border-neutral-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-900 rounded-full text-sm font-medium">
                      {template.category}
                    </span>
                    <span className="px-3 py-1 bg-secondary-100 text-secondary-900 rounded-full text-sm font-medium">
                      {template.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    {template.description}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-primary-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {template.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-neutral-600 flex items-center">
                        <CheckCircle className="w-3 h-3 text-primary-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-neutral-600">{template.rating}</span>
                  </div>
                  <span className="text-sm text-neutral-500">{template.downloads} downloads</span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-900 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-800 transition-colors duration-200 flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-semibold text-sm hover:bg-neutral-50 transition-colors duration-200 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cover Letter Templates Section */}
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
              Cover Letter Templates
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Professional cover letter templates designed to complement your CV and make a strong first impression.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {coverLetterTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white border border-neutral-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-900 rounded-full text-sm font-medium mb-3 inline-block">
                    {template.category}
                  </span>
                  <h3 className="text-xl font-heading font-bold text-primary-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    {template.description}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-primary-900 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {template.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-neutral-600 flex items-center">
                        <CheckCircle className="w-3 h-3 text-primary-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-neutral-600">{template.rating}</span>
                  </div>
                  <span className="text-sm text-neutral-500">{template.downloads} downloads</span>
                </div>

                <button className="w-full bg-primary-900 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-800 transition-colors duration-200 flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
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
              CV Writing Tips
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Expert advice to help you create a compelling CV that gets noticed by employers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gradient-to-br from-neutral-50 to-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-primary-900 mb-3">
                  {tip.title}
                </h3>
                <p className="text-neutral-600 text-sm">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Need Professional Help?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Our HR experts can help you create a standout CV and cover letter that gets you noticed by employers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-secondary-500 text-primary-900 rounded-lg font-semibold text-lg hover:bg-secondary-400 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get CV Review
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              
              <a
                href="/services"
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                View Our Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

