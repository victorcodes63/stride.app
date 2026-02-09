# Eagle HR Consultants - Images Directory

This directory contains all images used on the Eagle HR Consultants website, organized by category for easy management.

## Folder Structure

### `/logo/`
- Main company logo (SVG, PNG formats)
- Logo variations (horizontal, vertical, icon-only)
- Favicon files

### `/hero/`
- Hero section background images
- Main banner images
- Call-to-action graphics

### `/team/`
- Team member photos
- Leadership headshots
- Staff portraits

### `/services/`
- Service-related images
- Icons representing different services
- Process diagrams

### `/testimonials/`
- Client photos (with permission)
- Company logos for testimonials
- Quote graphics

### `/icons/`
- Custom icons
- Service icons
- UI element icons

### `/backgrounds/`
- Background patterns
- Decorative elements
- Texture images

## Image Guidelines

### Formats
- **SVG**: For logos, icons, and scalable graphics
- **PNG**: For images with transparency
- **JPG**: For photographs and complex images
- **WebP**: For optimized web delivery (when supported)

### Sizing
- **Hero images**: 1920x1080px or larger
- **Team photos**: 400x400px minimum
- **Service icons**: 64x64px to 128x128px
- **Logos**: Multiple sizes (16x16, 32x32, 64x64, 128x128, 256x256)

### Optimization
- Compress images for web delivery
- Use appropriate formats for content type
- Include alt text for accessibility
- Consider responsive image sizing

## Usage in Components

Images should be referenced using Next.js Image component for optimization:

```jsx
import Image from 'next/image'

<Image
  src="/images/logo/eagle-hr-logo.svg"
  alt="Eagle HR Consultants Logo"
  width={200}
  height={60}
  priority
/>
```

## Naming Convention

Use descriptive, kebab-case naming:
- `eagle-hr-logo-primary.svg`
- `hero-background-office.jpg`
- `team-jane-wanjiku.jpg`
- `service-recruitment-icon.svg`



