'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { Star, Quote, ArrowRight, Users } from 'lucide-react';
import { Testimonial } from '@/types';
import Image from 'next/image';

interface FloatingTestimonialsProps {
  testimonials: Testimonial[];
}

const FloatingTestimonials = ({ testimonials }: FloatingTestimonialsProps) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
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
          className="absolute -top-20 -left-20 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"
        />
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
          className="absolute top-10 right-10 w-60 h-60 bg-primary-500/15 rounded-full blur-2xl"
        />
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
          className="absolute bottom-20 left-20 w-40 h-40 bg-secondary-600/20 rounded-full blur-xl"
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
            <Users className="w-4 h-4 mr-2" />
            Client Success Stories
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-900 mb-6">
            Trusted by Industry Leaders
            <span className="block text-secondary-500 mt-2">Across Kenya</span>
          </h2>
          
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
            See how we've helped organizations transform their HR operations 
            and achieve remarkable results.
          </p>
        </motion.div>

        {/* Floating Testimonial Cards */}
        <div ref={containerRef} className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const isHovered = hoveredCard === index;
              
              return (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -20,
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5,
                    z: 50
                  }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="relative group cursor-pointer"
                  style={{
                    perspective: "1000px"
                  }}
                >
                  {/* Card */}
                  <motion.div
                    whileHover={{
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    className="bg-white border-2 border-neutral-200 rounded-2xl p-8 h-full relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Floating Elements */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-4 right-4 w-8 h-8 bg-secondary-500/20 rounded-full"
                    />
                    
                    <motion.div
                      animate={{
                        y: [0, 15, 0],
                        rotate: [0, -5, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                      className="absolute bottom-4 left-4 w-6 h-6 bg-primary-500/20 rounded-full"
                    />

                    {/* Quote Icon */}
                    <motion.div
                      animate={isHovered ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-6 left-6"
                    >
                      <Quote className="w-8 h-8 text-secondary-500/30" />
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Client Info */}
                      <div className="flex items-center space-x-4 mb-6">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-white"
                        >
                          <Image
                            src={testimonial.image || '/images/about/smile_1.jpg'}
                            alt={testimonial.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        
                        <div>
                          <h3 className="text-lg font-heading font-bold text-primary-900">
                            {testimonial.name}
                          </h3>
                          <p className="text-secondary-500 font-medium text-sm">
                            {testimonial.position}
                          </p>
                          <p className="text-neutral-600 text-xs">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex space-x-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                i < testimonial.rating
                                  ? 'text-secondary-500 fill-current'
                                  : 'text-neutral-300'
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-neutral-700 leading-relaxed italic mb-6">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Hover Effect - Learn More */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center text-primary-900 font-semibold text-sm"
                      >
                        Read full story
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </motion.div>
                    </div>

                    {/* Gradient Overlay on Hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-br from-primary-900/5 to-secondary-500/5 rounded-2xl"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary-900 mb-4">
                  Ready to Join Our Success Stories?
                </h3>
                <p className="text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
                  Let us help you achieve the same level of HR excellence that our clients have experienced.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-800 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    Start Your Success Story
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-primary-900 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-900 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    View All Case Studies
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FloatingTestimonials;
