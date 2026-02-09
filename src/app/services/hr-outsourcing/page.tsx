'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, Users, Calculator, ShieldCheck, FileText, Clock, CheckCircle, Download, ArrowRight, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function HROutsourcingPage() {
  const outsourcingServices = [
    {
      icon: Calculator,
      title: "Payroll Management",
      description: "Complete payroll processing including salary calculations, deductions, and statutory compliance with accuracy and timeliness.",
      features: ["Salary processing", "Statutory deductions", "Tax calculations", "Payslip generation"],
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-100 to-sky-200"
    },
    {
      icon: Users,
      title: "HR Administration",
      description: "Comprehensive HR administrative support including record keeping, employee data management, and HR documentation.",
      features: ["Employee records", "HR documentation", "Data management", "Administrative support"],
      color: "from-emerald-600 to-emerald-700",
      bgColor: "from-emerald-100 to-emerald-200"
    },
    {
      icon: ShieldCheck,
      title: "Compliance Management",
      description: "Ensure your organization meets all regulatory requirements and maintains compliance with Kenyan labor laws.",
      features: ["Labor law compliance", "Regulatory reporting", "Audit support", "Policy implementation"],
      color: "from-purple-600 to-purple-700",
      bgColor: "from-purple-100 to-purple-200"
    },
    {
      icon: FileText,
      title: "Policy Development",
      description: "Development and implementation of HR policies that align with Kenyan labor laws and industry best practices.",
      features: ["Policy creation", "Legal compliance", "Implementation support", "Regular updates"],
      color: "from-orange-600 to-orange-700",
      bgColor: "from-orange-100 to-orange-200"
    }
  ];

  const benefits = [
    "Cost Reduction", "Expert HR Knowledge", "Compliance Assurance", "Time Savings",
    "Scalable Solutions", "Risk Mitigation", "Technology Integration", "24/7 Support"
  ];

  const stats = [
    { number: "40%", label: "Average Cost Savings", description: "Reduction in HR operational costs" },
    { number: "95%", label: "Compliance Rate", description: "Regulatory compliance achievement" },
    { number: "500+", label: "Companies Served", description: "Across various industries" },
    { number: "24/7", label: "Support Available", description: "Round-the-clock HR assistance" }
  ];

  const caseStudy = {
    company: "Bata Shoe Company Kenya",
    duration: "5+ Years Partnership",
    staffSize: "500+ Employees",
    image: "/images/clients/bata_logo.jpg",
    challenge: "Managing comprehensive HR operations for a large manufacturing workforce across multiple locations in Kenya, including complex statutory requirements, leave management, and compliance with Kenyan labor laws.",
    solution: "Complete HR outsourcing solution covering payroll management, statutory deductions (PAYE, NSSF, NHIF), leave management, compliance monitoring, and policy development tailored for the manufacturing sector.",
    results: [
      "100% compliance with Kenyan labor laws and statutory requirements",
      "Streamlined payroll processing for 500+ employees across multiple locations",
      "Efficient leave management system with automated tracking and approvals",
      "Comprehensive HR policy development aligned with manufacturing industry standards",
      "Regular compliance audits and reporting ensuring zero violations",
      "Cost-effective HR operations allowing focus on core manufacturing business"
    ]
  };

  const industries = [
    "Manufacturing & Industrial", "Technology & IT", "Financial Services", "Healthcare & Pharmaceuticals",
    "Retail & Consumer Goods", "Education & Training", "Government & Public Sector", "NGOs & Development"
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
              backgroundImage: 'url(/images/services/outsourcing/hero.jpg)'
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
              HR Outsourcing Services
            </h1>
            <p className="text-xl text-neutral-700 leading-relaxed mb-8">
              Streamline your HR operations with our professional outsourcing services. 
              Focus on your core business while we handle your HR needs with expertise and efficiency.
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
                href="/downloads/eagle-hr-outsourcing-guide.pdf"
                download="Eagle-HR-Outsourcing-Guide.pdf"
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
              Comprehensive HR Outsourcing Solutions
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              We offer end-to-end HR outsourcing services designed to streamline your operations 
              and ensure compliance with Kenyan labor laws.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {outsourcingServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:border-primary-200 p-8"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-secondary-500" />
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
              Why Choose Our HR Outsourcing Services?
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Partner with us to transform your HR operations and focus on what matters most - growing your business.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-900" />
                </div>
                <h3 className="text-lg font-semibold text-primary-900">{benefit}</h3>
              </motion.div>
            ))}
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
              Proven Results & Impact
            </h2>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto">
              Our HR outsourcing services deliver measurable results that transform businesses 
              and drive sustainable growth.
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

      {/* Case Study Section */}
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
              Success Story
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              A long-term partnership that demonstrates our commitment to excellence 
              and proven results in HR outsourcing.
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
                    backgroundImage: 'url(/images/services/outsourcing/Bata-Image.jpg)'
                  }}
                />
                <div className="absolute inset-0 bg-white/85" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Logo and Company Info */}
                  <div className="space-y-6">
                    <div className="text-center md:text-left">
                      <div className="w-24 h-24 mx-auto md:mx-0 mb-4 rounded-xl overflow-hidden shadow-lg bg-white p-2">
                        <img
                          src={caseStudy.image}
                          alt={caseStudy.company}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center hidden">
                          <Building2 className="w-12 h-12 text-primary-900" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-primary-900 mb-2">
                        {caseStudy.company}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-neutral-600">
                        <span className="inline-flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {caseStudy.duration}
                        </span>
                        <span className="inline-flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {caseStudy.staffSize}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
              <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-3 text-lg">Challenge:</h4>
                      <p className="text-neutral-600 leading-relaxed">{caseStudy.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-3 text-lg">Solution:</h4>
                      <p className="text-neutral-600 leading-relaxed">{caseStudy.solution}</p>
                </div>
                
                    <div>
                      <h4 className="font-semibold text-primary-900 mb-3 text-lg">Results Achieved:</h4>
                      <ul className="space-y-2">
                        {caseStudy.results.map((result, index) => (
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
        </div>
      </section>

      {/* Industries Section */}
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
              Industries We Serve
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Our HR outsourcing expertise spans across various industries, 
              providing tailored solutions for each sector's unique requirements.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-100"
              >
                <div className="text-sm font-medium text-primary-900">{industry}</div>
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
              about our HR outsourcing services and best practices.
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
                <FileText className="w-8 h-8 text-white" />
            </div>
              <h3 className="text-xl font-semibold mb-4">Company Profile</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Comprehensive overview of Eagle HR's services, expertise, and track record in HR outsourcing.
              </p>
              <a
                href="/downloads/eagle-hr-company-profile.pdf"
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
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">HR Outsourcing Guide</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Best practices and insights for effective HR outsourcing in the Kenyan market.
              </p>
              <a
                href="/downloads/hr-outsourcing-guide.pdf"
                download="HR-Outsourcing-Guide.pdf"
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
                <ShieldCheck className="w-8 h-8 text-white" />
            </div>
              <h3 className="text-xl font-semibold mb-4">Compliance Checklist</h3>
              <p className="text-orange-100 mb-6 flex-grow">
                Comprehensive checklist for HR compliance and regulatory requirements in Kenya.
              </p>
              <a
                href="/downloads/hr-compliance-checklist.pdf"
                download="HR-Compliance-Checklist.pdf"
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
              Ready to Transform Your HR Operations?
            </h2>
            <p className="text-xl text-primary-200 mb-8">
              Let us handle your HR needs so you can focus on growing your business. 
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
