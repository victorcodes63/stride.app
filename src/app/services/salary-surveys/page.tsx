'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Award, 
  CheckCircle, 
  Download,
  ArrowRight,
  Star,
  Building,
  Calculator,
  PieChart,
  BookOpen,
  Clock,
  Shield
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SalarySurveysPage() {
  const surveyServices = [
    {
      icon: BarChart3,
      title: 'Salary Benchmarking',
      description: 'Comprehensive salary surveys to benchmark your compensation against market rates.',
      features: [
        'Market rate analysis',
        'Industry-specific benchmarks',
        'Geographic salary variations',
        'Position-level comparisons'
      ],
      color: 'text-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: TrendingUp,
      title: 'Compensation Analytics',
      description: 'Advanced analytics to optimize your compensation strategy and budget allocation.',
      features: [
        'Compensation trend analysis',
        'ROI on compensation spend',
        'Pay equity assessments',
        'Budget forecasting'
      ],
      color: 'text-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      icon: Target,
      title: 'Pay Structure Design',
      description: 'Design competitive and fair pay structures that attract and retain top talent.',
      features: [
        'Grade and band structures',
        'Performance-based pay',
        'Variable compensation design',
        'Total rewards optimization'
      ],
      color: 'text-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      icon: Calculator,
      title: 'Compensation Modeling',
      description: 'Predictive modeling to forecast compensation costs and optimize pay decisions.',
      features: [
        'Salary forecasting models',
        'Scenario planning',
        'Cost-benefit analysis',
        'Risk assessment'
      ],
      color: 'text-red-600',
      bgColor: 'from-red-50 to-red-100'
    }
  ];

  const benefits = [
    {
      icon: BarChart3,
      title: 'Market Intelligence',
      description: 'Stay competitive with real-time market data and industry insights.'
    },
    {
      icon: Target,
      title: 'Strategic Planning',
      description: 'Make informed decisions with data-driven compensation strategies.'
    },
    {
      icon: Users,
      title: 'Talent Retention',
      description: 'Attract and retain top talent with competitive compensation packages.'
    },
    {
      icon: Award,
      title: 'Cost Optimization',
      description: 'Optimize your compensation spend while maintaining competitive positioning.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Companies Surveyed', description: 'Across various industries' },
    { number: '50,000+', label: 'Salary Records', description: 'Comprehensive database' },
    { number: '95%', label: 'Accuracy Rate', description: 'Market-aligned insights' },
    { number: '24/7', label: 'Data Access', description: 'Real-time compensation data' }
  ];

  const caseStudy = {
    company: 'Kenya Deposit Insurance Corporation (KDIC)',
    duration: '2+ Years',
    staffSize: '200+',
    image: '/images/services/salary-surveys/kdic.jpg',
    challenge: 'Developing a competitive compensation structure to attract and retain top talent in the financial services sector while managing budget constraints.',
    solution: 'Comprehensive salary survey and compensation analysis, followed by pay structure redesign and ongoing market monitoring.',
    results: [
      '25% improvement in talent retention',
      '15% reduction in compensation costs',
      '100% market competitiveness',
      'Enhanced employee satisfaction'
    ]
  };

  const industries = [
    { name: 'Banking & Finance', icon: Building },
    { name: 'Insurance', icon: Shield },
    { name: 'Government', icon: Building },
    { name: 'Manufacturing', icon: Building },
    { name: 'Technology', icon: Building },
    { name: 'Healthcare', icon: Building }
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
              backgroundImage: 'url(/images/services/surverys/hero.jpg)'
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
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-primary-900">
              Salary Surveys & Analytics
            </h1>
            <p className="text-xl md:text-2xl text-primary-800 leading-relaxed mb-8">
              Make data-driven compensation decisions with comprehensive salary surveys, 
              market analytics, and strategic pay structure design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-secondary-500 text-white rounded-lg font-semibold text-lg hover:bg-secondary-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="/downloads/salary-survey-guide.pdf"
                className="inline-flex items-center px-8 py-4 bg-white/20 text-primary-900 rounded-lg font-semibold text-lg hover:bg-white/30 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
              >
                <Download className="mr-2 w-5 h-5" />
                Download Guide
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comprehensive Salary Survey Solutions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
                Comprehensive Salary Survey Solutions
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Leverage market intelligence to make informed compensation decisions. 
                Our comprehensive surveys and analytics provide the insights you need.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {surveyServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:border-primary-200 p-8"
                >
                  <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-secondary-500" />
                  </div>
                  
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
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
                Why Choose Our Salary Survey Services?
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Our data-driven approach ensures you have the market intelligence needed for strategic compensation decisions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                Our Survey Track Record
              </h2>
              <p className="text-xl text-primary-200 max-w-3xl mx-auto">
                Trusted by leading organizations for comprehensive salary survey and analytics services.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xl font-semibold text-primary-200 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-primary-300">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client Spotlight */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
                Client Success Story
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                How we helped Kenya Deposit Insurance Corporation optimize their compensation structure 
                and achieve significant cost savings while improving talent retention.
              </p>
            </div>

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
                    backgroundImage: 'url(/images/services/salary-surveys/kdic.jpg)'
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
                          src="/images/clients/kdic_logo.jpg"
                          alt={caseStudy.company}
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
                        {caseStudy.company}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">
                        {caseStudy.challenge}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-3 text-lg">Our Solution:</h4>
                      <p className="text-neutral-600 leading-relaxed mb-4">
                        {caseStudy.solution}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary-900 mb-3 text-lg">Results Achieved:</h4>
                      <ul className="space-y-2">
                        {caseStudy.results.map((result, index) => (
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
          </motion.div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
                Industries We Serve
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Our salary survey expertise spans across various industries, each with unique compensation challenges.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <industry.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-900">
                    {industry.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              about our salary survey services and best practices.
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
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Company Profile</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Learn more about Eagle HR Consultants and our comprehensive salary survey services.
              </p>
              <a
                href="/downloads/company-profile.pdf"
                download="Eagle-HR-Company-Profile.pdf"
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
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Salary Survey Guide</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Comprehensive guide to conducting effective salary surveys and market analysis.
              </p>
              <a
                href="/downloads/salary-survey-guide.pdf"
                download="Salary-Survey-Guide.pdf"
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
              <h3 className="text-xl font-semibold mb-4">Compensation Analytics</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Tools and templates for analyzing compensation data and market trends.
              </p>
              <a
                href="/downloads/compensation-analytics.pdf"
                download="Compensation-Analytics.pdf"
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
      <section className="py-20 bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to Optimize Your Compensation Strategy?
            </h2>
            <p className="text-xl text-primary-200 mb-8 leading-relaxed">
              Let our expert team help you make data-driven compensation decisions. 
              Stay competitive and attract the best talent with market-aligned pay structures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-secondary-500 text-white rounded-lg font-semibold text-lg hover:bg-secondary-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Schedule Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="mailto:info@eaglehr.co.ke"
                className="inline-flex items-center px-8 py-4 bg-white/20 text-white rounded-lg font-semibold text-lg hover:bg-white/30 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
              >
                Send Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
