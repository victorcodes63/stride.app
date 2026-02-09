# Eagle HR Consultants Website

A modern, animated, and responsive website for Eagle HR Consultants - Kenya's leading HR consulting firm. Built with Next.js, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Design**: Clean, professional, and corporate aesthetic
- **Responsive**: Fully responsive across all devices
- **Animated**: Smooth animations using Framer Motion
- **SEO Optimized**: Built-in SEO with Next.js metadata API
- **Performance**: Optimized for speed and performance
- **Accessibility**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **TypeScript**: Full TypeScript support

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── about/             # About us page
│   ├── services/          # Services page
│   ├── careers/           # Careers page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation component
│   ├── HeroSection.tsx    # Hero section
│   ├── ServiceCard.tsx    # Service card component
│   ├── Testimonials.tsx   # Testimonials carousel
│   ├── Footer.tsx         # Footer component
│   ├── ContactForm.tsx    # Contact form
│   ├── TeamMember.tsx     # Team member card
│   ├── AboutSummary.tsx   # About summary section
│   ├── ServicesPreview.tsx # Services preview
│   └── FeaturedJobs.tsx   # Featured jobs section
├── types/                 # TypeScript type definitions
│   └── index.ts           # Main type definitions
└── lib/                   # Utility functions
```

## 🎨 Design System

### Colors
- **Primary Blue**: #0B1D39 (Eagle HR brand blue)
- **Secondary Gold**: #F4B400 (Eagle HR brand gold)
- **Neutral**: Various shades of gray for text and backgrounds

### Typography
- **Headings**: Poppins (Google Fonts)
- **Body**: Inter (Google Fonts)

### Components
- Animated navbar with sticky behavior
- Hero section with gradient background and floating elements
- Service cards with hover animations
- Testimonials carousel with auto-rotation
- Contact form with validation
- Team member cards with social links
- Footer with newsletter signup

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd eagle-hr-website
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📄 Pages

### Home Page
- Hero section with animated statistics
- About summary with mission, vision, values
- Services preview with 3 main services
- Featured job listings
- Client testimonials carousel

### About Page
- Company overview and achievements
- Mission, vision, and values
- Team member profiles
- Company culture and benefits

### Services Page
- Comprehensive service offerings
- Detailed service descriptions
- Process workflow
- Industry expertise
- Benefits and features

### Careers Page
- Current job openings
- Company culture and benefits
- Why work with Eagle HR
- Application process

### Contact Page
- Contact form with validation
- Contact information
- Office location
- FAQ section

## 🎭 Animations

The website uses Framer Motion for smooth animations:

- **Page transitions**: Fade and slide effects
- **Scroll animations**: Elements animate into view
- **Hover effects**: Interactive hover states
- **Loading states**: Smooth loading animations
- **Form interactions**: Animated form submissions

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔍 SEO Features

- Meta tags for each page
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data ready
- Optimized images
- Fast loading times

## 🛡️ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## 📈 Performance

- Next.js optimization
- Image optimization
- Code splitting
- Lazy loading
- Minimal bundle size
- Fast page loads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary to Eagle HR Consultants.

## 📚 Documentation

- **[AUTH.md](./AUTH.md)** – Staff dashboard auth: env vars, dev bypass, and wiring for Microsoft sign-in, forgot password, and full auth later.
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** – ATS integration and environment setup.
- **[ATS_PROJECT_ANALYSIS_AND_NEXT_STEPS.md](./ATS_PROJECT_ANALYSIS_AND_NEXT_STEPS.md)** – ATS project status and next steps.

## 📞 Support

For support or questions, contact:
- Email: info@eaglehr.co.ke
- Phone: +254 700 178 680

---

Built with ❤️ for Eagle HR Consultants