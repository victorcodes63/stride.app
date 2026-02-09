'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Calendar, 
  User, 
  Tag, 
  ExternalLink, 
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  url: string;
  image: string;
}

export default function InsightsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // Mock data based on the blog content - in a real implementation, you'd fetch this from an API
  const mockPosts: BlogPost[] = [
    {
      title: "Why Toxic Culture Accumulates Like Interest",
      excerpt: "Culture is the heartbeat of any organization. It dictates how people behave when no one is watching, how decisions are made, and ultimately, how successful the organization becomes.",
      date: "October 17, 2025",
      author: "EaglesHR",
      category: "Uncategorized",
      url: "https://www.eaglehr.co.ke/blog/why-toxic-culture-accumulates-like-interest/",
      image: "/images/insights/featured-images/Why-Toxic-Culture-Accumulates-Like-Interest.png"
    },
    {
      title: "What Every Employer Should Include in a Job Contract",
      excerpt: "Hiring a new employee is an exciting milestone for any business. But before your new hire officially joins the team, there's one document that can make or break the relationship.",
      date: "October 15, 2025",
      author: "EaglesHR",
      category: "Uncategorized",
      url: "https://www.eaglehr.co.ke/blog/what-every-employer-should-include-in-a-job-contract/",
      image: "/images/insights/featured-images/contract-checklist.png"
    },
    {
      title: "10 Employee Red Flags Companies Should Watch Out for When Hiring",
      excerpt: "Recruiting the right people is one of the most important investments a company can make. A great hire can propel a business forward, boost morale, and drive innovation.",
      date: "October 9, 2025",
      author: "EaglesHR",
      category: "Job Hunting Tips",
      url: "https://www.eaglehr.co.ke/blog/10-employee-red-flags-companies-should-watch-out-for-when-hiring/",
      image: "/images/insights/featured-images/red-flags.jpg"
    },
    {
      title: "10 Employer Red Flags When Job Hunting",
      excerpt: "Vague or Overly Flashy Job Descriptions - One of the first red flags you may encounter when job hunting is a job description that sounds too good to be true.",
      date: "October 6, 2025",
      author: "EaglesHR",
      category: "Job Hunting Tips",
      url: "https://www.eaglehr.co.ke/blog/10-employer-red-flags-when-job-hunting/",
      image: "/images/insights/featured-images/red-flags-hunting.png"
    },
    {
      title: "Quiet Quitting: What HR Leaders Need to Know",
      excerpt: "In the past few years, one phrase has captured global workplace conversations: quiet quitting. Despite the dramatic name, it does not mean that employees are literally quitting their jobs.",
      date: "September 22, 2025",
      author: "EaglesHR",
      category: "Uncategorized",
      url: "https://www.eaglehr.co.ke/blog/quiet-quitting-what-hr-leaders-need-to-know/",
      image: "/images/insights/featured-images/quiet-qutting.png"
    },
    {
      title: "Why Gen Z Isn't Interested in Climbing the Corporate Ladder",
      excerpt: "For decades, the image of success in the workplace has been tied to the metaphorical 'corporate ladder.' Employees were expected to start at the bottom and work their way up.",
      date: "September 17, 2025",
      author: "EaglesHR",
      category: "Uncategorized",
      url: "https://www.eaglehr.co.ke/blog/why-gen-z-isnt-interested-in-climbing-the-corporate-ladder/",
      image: "/images/insights/featured-images/corporate-ladder.jpg"
    },
    {
      title: "Why You Should Choose Eagle HR Consultants as Your In-House HR Partner",
      excerpt: "Running a business in Kenya comes with both opportunities and challenges. While many organizations start lean, relying on a small team to manage operations.",
      date: "September 11, 2025",
      author: "EaglesHR",
      category: "HR Outsourcing",
      url: "https://www.eaglehr.co.ke/blog/why-you-should-choose-eagle-hr-consultants-as-your-in-house-hr-partner/",
      image: "/images/insights/featured-images/in-house-hr.png"
    },
    {
      title: "Beyond Compliance: How SMEs in Kenya Can Stay Legally Safe Without a Full HR Department",
      excerpt: "When most people hear HR compliance, they think of large corporates with in-house legal teams and full-fledged HR departments.",
      date: "September 8, 2025",
      author: "EaglesHR",
      category: "Compliance and Regulation",
      url: "https://www.eaglehr.co.ke/blog/beyond-compliance-how-smes-in-kenya-can-stay-legally-safe-without-a-full-hr-department/",
      image: "/images/insights/featured-images/SMEs.png"
    },
    {
      title: "The Future of Work in Kenya: Skills Employers Will Value Most in 2025 and Beyond",
      excerpt: "The world of work is changing faster than ever before. In Kenya, shifts in technology, demographics, and business needs are reshaping how companies hire and retain talent.",
      date: "September 5, 2025",
      author: "EaglesHR",
      category: "Strategy Business",
      url: "https://www.eaglehr.co.ke/blog/the-future-of-work-in-kenya-skills-employers-will-value-most-in-2025-and-beyond/",
      image: "/images/insights/featured-images/future-work.jpg"
    },
    {
      title: "The Five Pillars of Organizations",
      excerpt: "Every organisation, whether for-profit or non-profit, rests on five key pillars: Mission, Vision, Strategy, Structure, and Culture. Top leadership must understand and balance these elements.",
      date: "August 25, 2025",
      author: "EaglesHR",
      category: "Strategy Business",
      url: "https://www.eaglehr.co.ke/blog/the-five-pillars-of-organizations/",
      image: "/images/insights/featured-images/5-pillars.png"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: BookOpen },
    { value: 'HR Outsourcing', label: 'HR Outsourcing', icon: Users },
    { value: 'Compliance and Regulation', label: 'Compliance', icon: Shield },
    { value: 'Job Hunting Tips', label: 'Job Hunting', icon: TrendingUp },
    { value: 'Strategy Business', label: 'Strategy', icon: TrendingUp },
    { value: 'Uncategorized', label: 'General', icon: BookOpen }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
              <BookOpen className="w-4 h-4 mr-2" />
              News & Insights
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-900"
            >
              HR Insights & Expertise
              <span className="block text-secondary-500">From Eagle HR</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-neutral-700 leading-relaxed mb-8"
            >
              Stay updated with the latest HR trends, best practices, and insights 
              from Kenya's leading HR consultancy experts.
            </motion.p>

          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
                <p className="text-neutral-600">Loading articles...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-heading font-bold text-primary-900 mb-2">
                    Latest Articles
                  </h2>
                  <p className="text-neutral-600">
                    Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                    {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
                  </p>
                </div>

                <div className="space-y-12">
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-200 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      } flex flex-col md:flex`}
                    >
                      {/* Image Section */}
                      <div className="md:w-1/2 h-64 md:h-auto">
                        <div className="w-full h-full relative overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center relative">
                                    <div class="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-secondary-100/20"></div>
                                    <div class="relative z-10 text-center p-8">
                                      <div class="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                        </svg>
                                      </div>
                                      <h4 class="text-lg font-semibold text-primary-900 mb-2">${post.category}</h4>
                                      <p class="text-sm text-neutral-600">Expert Insights</p>
                                    </div>
                                    <div class="absolute top-4 right-4 w-20 h-20 bg-secondary-500/10 rounded-full"></div>
                                    <div class="absolute bottom-4 left-4 w-12 h-12 bg-primary-500/10 rounded-full"></div>
                                  </div>
                                `;
                              }
                            }}
                          />
                          {/* Overlay for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="md:w-1/2 p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                          <Tag className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-heading font-bold text-primary-900 mb-4 leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-neutral-600 mb-6 leading-relaxed text-lg">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-neutral-500 mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                        </div>
                        
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-300 w-fit"
                        >
                          Read Full Article
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-20">
                    <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-600 mb-2">No articles found</h3>
                    <p className="text-neutral-500">
                      Try adjusting your search terms or category filter.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Need Expert HR Guidance?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Our team of HR experts is ready to help you implement these insights 
              and transform your organization's people practices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-secondary-500 text-primary-900 rounded-lg font-semibold text-lg hover:bg-secondary-400 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Expert Consultation
                <ExternalLink className="ml-2 w-5 h-5" />
              </a>
              
              <a
                href="https://www.eaglehr.co.ke/blog/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold text-lg hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                Visit Our Blog
                <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
