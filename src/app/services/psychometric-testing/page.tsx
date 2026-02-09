'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Brain, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  BarChart3, 
  Shield, 
  Award,
  Clock,
  FileText,
  TrendingUp,
  Star,
  Building2
} from 'lucide-react';

export default function PsychometricTestingPage() {
  const testTypes = [
    {
      icon: Brain,
      title: 'Cognitive Ability Tests',
      description: 'Measure reasoning, problem-solving, and analytical thinking skills',
      features: ['Verbal Reasoning', 'Numerical Reasoning', 'Abstract Reasoning', 'Logical Thinking']
    },
    {
      icon: Users,
      title: 'Personality Assessments',
      description: 'Evaluate behavioral traits, work styles, and cultural fit',
      features: ['Big Five Personality', 'Behavioral Styles', 'Leadership Potential', 'Team Dynamics']
    },
    {
      icon: Target,
      title: 'Aptitude Tests',
      description: 'Assess specific skills and abilities for particular roles',
      features: ['Technical Aptitude', 'Mechanical Reasoning', 'Spatial Ability', 'Language Skills']
    },
    {
      icon: BarChart3,
      title: 'Emotional Intelligence',
      description: 'Measure emotional awareness and interpersonal skills',
      features: ['Self-Awareness', 'Social Skills', 'Empathy', 'Emotional Regulation']
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Assessment Planning',
      description: 'We work with you to identify the specific competencies and traits needed for the role',
      icon: Target
    },
    {
      step: '02',
      title: 'Test Administration',
      description: 'Professional administration of validated psychometric assessments in controlled environments',
      icon: Brain
    },
    {
      step: '03',
      title: 'Analysis & Scoring',
      description: 'Comprehensive analysis of results using advanced statistical methods and norm comparisons',
      icon: BarChart3
    },
    {
      step: '04',
      title: 'Detailed Reporting',
      description: 'Detailed reports with actionable insights and recommendations for hiring decisions',
      icon: FileText
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Objective Selection',
      description: 'Remove bias and subjectivity from hiring decisions with data-driven assessments'
    },
    {
      icon: TrendingUp,
      title: 'Improved Performance',
      description: 'Higher job performance and reduced turnover through better candidate-job matching'
    },
    {
      icon: Shield,
      title: 'Risk Mitigation',
      description: 'Identify potential issues early and make informed decisions about candidate suitability'
    },
    {
      icon: Award,
      title: 'Cultural Fit',
      description: 'Ensure candidates align with your organizational values and team dynamics'
    }
  ];

  const clientSuccess = {
    company: 'Central Bank of Kenya (CBK)',
    challenge: 'Need to assess over 1,000 potential hires for various positions requiring different skill sets and competencies',
    solution: 'Comprehensive psychometric testing program including aptitude tests and personality assessments',
    results: [
      'Successfully assessed 1,000+ candidates',
      'Improved hiring accuracy by 40%',
      'Reduced time-to-hire by 30%',
      'Enhanced candidate experience with professional assessment process'
    ]
  };

  return (
    <main className="min-h-screen">
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
              <Brain className="w-4 h-4 mr-2" />
              Psychometric Testing
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-900"
            >
              Psychometric Testing
              <span className="block text-secondary-500">For Better Hiring Decisions</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-neutral-700 leading-relaxed mb-8"
            >
              Comprehensive psychological assessments to identify the right talent, 
              reduce hiring risks, and improve organizational performance through data-driven selection.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Test Types Section */}
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
              Comprehensive Assessment Types
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Our psychometric testing covers all aspects of human capability and potential, 
              providing you with complete insights for informed hiring decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testTypes.map((test, index) => (
              <motion.div
                key={test.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white border border-neutral-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <test.icon className="w-8 h-8 text-primary-600" />
                </div>
                
                <h3 className="text-xl font-heading font-semibold text-primary-900 mb-4">
                  {test.title}
                </h3>
                
                <p className="text-neutral-600 mb-6">
                  {test.description}
                </p>
                
                <ul className="space-y-2">
                  {test.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-neutral-600">
                      <CheckCircle className="w-4 h-4 text-secondary-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Our Assessment Process
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              A systematic approach to psychometric testing that ensures accuracy, 
              reliability, and actionable insights for your hiring decisions.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-semibold text-primary-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600">
                      {step.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Why Choose Psychometric Testing?
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Transform your hiring process with scientific assessments that provide 
              objective insights and improve your selection outcomes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gradient-to-br from-neutral-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-primary-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success Story */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src="/images/clients/interview.jpg" 
                alt="Professional assessment and testing environment" 
                className="w-full h-full object-cover object-[center_bottom]"
              />
              <div className="absolute inset-0 bg-white/80"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Logo and Company Info */}
                <div className="space-y-6">
                  <div className="text-center md:text-left">
                    <div className="w-24 h-24 mx-auto md:mx-0 mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
                      <img
                        src="/images/clients/cbk_loho.png"
                        alt="Central Bank of Kenya"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-primary-900 mb-2">
                      Central Bank of Kenya
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-neutral-600">
                      <span className="inline-flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        2+ Years Partnership
                      </span>
                      <span className="inline-flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        1,000+ Candidates Assessed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-3 text-lg">Challenge:</h4>
                    <p className="text-neutral-600 leading-relaxed">{clientSuccess.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-3 text-lg">Solution:</h4>
                    <p className="text-neutral-600 leading-relaxed">{clientSuccess.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-3 text-lg">Results Achieved:</h4>
                    <ul className="space-y-2">
                      {clientSuccess.results.map((result, index) => (
                        <li key={index} className="flex items-start text-neutral-600">
                          <CheckCircle className="w-5 h-5 text-secondary-500 mr-3 flex-shrink-0 mt-0.5" />
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
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Let our psychometric testing experts help you make better hiring decisions 
              and build a stronger, more capable workforce.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-secondary-500 text-primary-900 rounded-lg font-semibold text-lg hover:bg-secondary-400 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Assessment Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
