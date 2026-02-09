'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Scale, Shield, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: FileText,
      title: 'Service Agreement',
      content: 'By using our services, you agree to be bound by these terms and conditions. Please read them carefully before engaging with our HR consulting services.'
    },
    {
      icon: Scale,
      title: 'Service Scope',
      content: 'Our services include recruitment, HR outsourcing, training, compliance, and other HR consulting services as described in our service agreements.'
    },
    {
      icon: Shield,
      title: 'Client Responsibilities',
      content: 'Clients are responsible for providing accurate information, maintaining confidentiality, and complying with applicable laws and regulations.'
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: 'Our liability is limited to the extent permitted by law. We are not responsible for indirect or consequential damages arising from our services.'
    }
  ];

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50"></div>
        
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
              <Scale className="w-4 h-4 mr-2" />
              Terms of Service
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-900"
            >
              Terms of Service
              <span className="block text-secondary-500">Legal Agreement</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-neutral-700 leading-relaxed mb-8"
            >
              These terms and conditions govern your use of our HR consulting services. 
              Please read them carefully before engaging with our services.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-6">
                Service Terms & Conditions
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                These terms and conditions outline the rights and responsibilities of both Eagle HR Consultants 
                and our clients when using our HR consulting services.
              </p>
            </motion.div>

            {/* Key Sections */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <section.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-primary-900">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Detailed Terms */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-neutral-50 rounded-xl p-8"
            >
              <h3 className="text-2xl font-heading font-bold text-primary-900 mb-6">
                Detailed Terms & Conditions
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-primary-900 mb-3">1. Service Provision</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Eagle HR Consultants will provide HR consulting services as agreed in the service contract. 
                    Services may include recruitment, training, compliance, and other HR-related activities.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary-900 mb-3">2. Client Obligations</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Clients must provide accurate information, maintain confidentiality, and comply with 
                    all applicable laws and regulations. Payment terms are as specified in the service agreement.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary-900 mb-3">3. Confidentiality</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Both parties agree to maintain strict confidentiality regarding all business information 
                    and personal data shared during the course of our professional relationship.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary-900 mb-3">4. Limitation of Liability</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Our liability is limited to the fees paid for the specific service. We are not liable 
                    for indirect, consequential, or punitive damages arising from our services.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary-900 mb-3">5. Termination</h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Either party may terminate the service agreement with written notice as specified in 
                    the contract. Outstanding fees remain due upon termination.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <h3 className="text-xl font-heading font-bold text-primary-900 mb-4">
                Questions About These Terms?
              </h3>
              <p className="text-neutral-600 mb-6">
                If you have any questions about these terms and conditions, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:legal@eaglehr.co.ke"
                  className="inline-flex items-center px-6 py-3 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-300"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  legal@eaglehr.co.ke
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border-2 border-primary-900 text-primary-900 rounded-lg font-semibold hover:bg-primary-900 hover:text-white transition-colors duration-300"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

