export type BlockType =
  | "navbar"
  | "hero"
  | "gallery"
  | "text"
  | "quote"
  | "contact"
  | "cta"
  | "features"
  | "testimonials"

export interface NestedElement {
  id: string
  type: "button" | "heading" | "text" | "image" | "divider" | "input"
  content: string
  style?: {
    color?: string
    size?: "small" | "medium" | "large"
    align?: "left" | "center" | "right"
    [key: string]: any
  }
}

export interface BlockData {
  id: string
  type: BlockType
  title: string
  description: string
  preview: string
  children?: NestedElement[]
  settings: {
    background: string
    textColor: string
    padding: "small" | "medium" | "large"
    animation: "none" | "fade" | "slide" | "scale"
    preset?: string
    // Navbar content
    navItems?: Array<{ title: string; href: string }>
    // Hero content
    heroTitle?: string
    heroSubtitle?: string
    heroButtons?: Array<{ text: string; href: string; variant: "primary" | "secondary" }>
    heroImage?: string
    // Gallery content
    galleryImages?: Array<{ url: string; caption: string; id: string }>
    // Text content
    textHeading?: string
    textContent?: string
    // CTA content
    ctaTitle?: string
    ctaDescription?: string
    ctaButton?: { text: string; href: string }
    // Features content
    featuresTitle?: string
    featuresItems?: Array<{ icon: string; title: string; description: string; id: string }>
    // Contact content
    contactTitle?: string
    contactDescription?: string
    contactEmail?: string
    // Testimonials content
    testimonialsTitle?: string
    testimonialsItems?: Array<{ name: string; role: string; content: string; avatar: string; id: string }>
    // Quote content
    quoteText?: string
    quoteAuthor?: string
    quoteRole?: string
    [key: string]: any
  }
}

export interface CanvasBlock extends BlockData {
  order: number
}

export const BLOCK_LIBRARY: BlockData[] = [
  {
    id: "navbar-1",
    type: "navbar",
    title: "Navigation Bar",
    description: "Responsive navigation with multiple preset designs",
    preview: "/placeholder.svg?height=100&width=800",
    settings: {
      background: "bg-background",
      textColor: "text-foreground",
      padding: "medium",
      animation: "none",
      preset: "centered",
      navItems: [
        { title: "Home", href: "#" },
        { title: "Products", href: "#" },
        { title: "About Us", href: "#" },
        { title: "Contacts", href: "#" },
      ],
    },
  },
  {
    id: "hero-1",
    type: "hero",
    title: "Hero Section",
    description: "Impressive hero banner with headline and CTA",
    preview: "/gradient-hero.png",
    settings: {
      background: "bg-gradient-to-r from-indigo-500 to-purple-600",
      textColor: "text-white",
      padding: "large",
      animation: "fade",
      preset: "centered",
      heroTitle: "Build Your Dream Website",
      heroSubtitle: "Create stunning websites with our easy-to-use drag and drop editor",
      heroButtons: [
        { text: "Get Started", href: "#", variant: "primary" },
        { text: "Learn More", href: "#", variant: "secondary" },
      ],
      heroImage: "/placeholder.svg?height=400&width=600",
    },
  },
  {
    id: "gallery-1",
    type: "gallery",
    title: "Image Gallery",
    description: "Showcase images in a beautiful grid layout",
    preview: "/image-gallery-grid-layout.jpg",
    settings: {
      background: "bg-slate-50",
      textColor: "text-slate-900",
      padding: "medium",
      animation: "scale",
      preset: "grid",
      galleryImages: [
        { id: "1", url: "/placeholder.svg?height=300&width=400", caption: "Image 1" },
        { id: "2", url: "/placeholder.svg?height=300&width=400", caption: "Image 2" },
        { id: "3", url: "/placeholder.svg?height=300&width=400", caption: "Image 3" },
        { id: "4", url: "/placeholder.svg?height=300&width=400", caption: "Image 4" },
        { id: "5", url: "/placeholder.svg?height=300&width=400", caption: "Image 5" },
        { id: "6", url: "/placeholder.svg?height=300&width=400", caption: "Image 6" },
      ],
    },
  },
  {
    id: "text-1",
    type: "text",
    title: "Text Block",
    description: "Rich text content with formatting options",
    preview: "/text-block-with-content.jpg",
    settings: {
      background: "bg-white",
      textColor: "text-slate-900",
      padding: "medium",
      animation: "none",
      preset: "standard",
      textHeading: "About Our Company",
      textContent:
        "We are dedicated to providing the best service to our customers. Our team of experts works tirelessly to ensure your satisfaction.",
    },
  },
  {
    id: "quote-1",
    type: "quote",
    title: "Quote Block",
    description: "Highlight inspirational or key quotes",
    preview: "/quote-testimonial-design.jpg",
    settings: {
      background: "bg-slate-100",
      textColor: "text-slate-900",
      padding: "medium",
      animation: "fade",
      preset: "centered",
      quoteText: "This product has transformed the way we work. Highly recommended!",
      quoteAuthor: "John Doe",
      quoteRole: "CEO, Company Inc.",
    },
  },
  {
    id: "contact-1",
    type: "contact",
    title: "Contact Form",
    description: "Email capture and contact form section",
    preview: "/contact-form-with-fields.jpg",
    settings: {
      background: "bg-white",
      textColor: "text-slate-900",
      padding: "medium",
      animation: "none",
      preset: "standard",
      contactTitle: "Get In Touch",
      contactDescription:
        "Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      contactEmail: "hello@example.com",
    },
  },
  {
    id: "cta-1",
    type: "cta",
    title: "Call to Action",
    description: "Convert visitors with a focused CTA section",
    preview: "/call-to-action-button-section.jpg",
    settings: {
      background: "bg-indigo-600",
      textColor: "text-white",
      padding: "large",
      animation: "scale",
      preset: "centered",
      ctaTitle: "Ready to Get Started?",
      ctaDescription: "Join thousands of satisfied customers today",
      ctaButton: { text: "Sign Up Now", href: "#" },
    },
  },
  {
    id: "features-1",
    type: "features",
    title: "Features Showcase",
    description: "Display key features with icons and descriptions",
    preview: "/features-showcase-with-icons.jpg",
    settings: {
      background: "bg-white",
      textColor: "text-slate-900",
      padding: "large",
      animation: "slide",
      preset: "grid",
      featuresTitle: "Why Choose Us",
      featuresItems: [
        {
          id: "1",
          icon: "⚡",
          title: "Fast Performance",
          description: "Lightning-fast load times for better user experience",
        },
        { id: "2", icon: "🔒", title: "Secure", description: "Enterprise-grade security to protect your data" },
        { id: "3", icon: "📱", title: "Responsive", description: "Works perfectly on all devices and screen sizes" },
        { id: "4", icon: "🎨", title: "Customizable", description: "Fully customizable to match your brand" },
      ],
    },
  },
  {
    id: "testimonials-1",
    type: "testimonials",
    title: "Testimonials",
    description: "Customer reviews and success stories",
    preview: "/testimonials-carousel-design.jpg",
    settings: {
      background: "bg-slate-50",
      textColor: "text-slate-900",
      padding: "medium",
      animation: "fade",
      preset: "cards",
      testimonialsTitle: "What Our Customers Say",
      testimonialsItems: [
        {
          id: "1",
          name: "Sarah Johnson",
          role: "Marketing Director",
          content: "This platform has revolutionized our workflow. Highly recommended!",
          avatar: "/placeholder.svg?height=80&width=80",
        },
        {
          id: "2",
          name: "Michael Chen",
          role: "Product Manager",
          content: "The best investment we've made for our business this year.",
          avatar: "/placeholder.svg?height=80&width=80",
        },
        {
          id: "3",
          name: "Emily Davis",
          role: "Designer",
          content: "Intuitive, powerful, and beautiful. Everything we needed.",
          avatar: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
  },
]
