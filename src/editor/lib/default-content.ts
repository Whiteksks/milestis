import { SectionContent, SectionVisibility, PhotobookSectionContent, PhotobookSectionVisibility } from './types'

export const defaultSectionVisibility: SectionVisibility = {
  showHeader: true,
  showHero: true,
  showBio: true,
  showFeaturedWork: true,
  showVideo: true,
  showContact: true,
  showFooter: true,
}

export const defaultSectionContent: SectionContent = {
  header: {
    title: 'Amelia & Noah',
    links: [
      { label: 'Story', href: '#hero' },
      { label: 'About', href: '#bio' },
      { label: 'Gallery', href: '#work' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  hero: {
    title: 'Timeless stories, captured in every frame',
    subtitle: 'Wedding & Lifestyle Photographer',
    description:
      'Creating elegant, heartfelt imagery that feels like your favorite memory – honest, luminous, and entirely you.',
  },
  bio: {
    title: 'A storyteller with a camera',
    subtitle: 'About Me',
    description:
      'Based in Copenhagen, I document modern love stories with a soft, editorial eye. My approach is calm, observant, and quietly intentional – blending candid moments with thoughtful direction so you can simply be present.\n\nFrom the fleeting in‑between glances to the big, emotional vows, I focus on the details that feel most like you.',
    image: '',
    imageAspectRatio: 'portrait',
    imageFrameStyle: 'soft',
    achievements: [
      'Featured in Modern Wedding & White Magazine',
      'Over 120 weddings documented across Europe',
      'Known for calm direction and film‑inspired color',
    ],
  },
  featuredWork: {
    title: 'Selected stories',
    subtitle: 'Portfolio',
    projects: [],
  },
  video: {
    title: 'Super 8 wedding highlights',
    subtitle: 'Motion',
    description: 'A glimpse into how your day could feel in motion.',
    videoUrl: '',
  },
  contact: {
    title: "Let's begin your story",
    subtitle: 'Get in Touch',
    description:
      'Share a few details about your day and vision – I personally reply within 2 business days.',
    email: 'hello@example.com',
    phone: '+1 (555) 000-0000',
  },
  footer: {
    copyright: '© 2024 Amelia Hart Photography. All rights reserved.',
    socialLinks: [],
  },
}

export const defaultPhotobookVisibility: PhotobookSectionVisibility = {
  showCover: true,
  showIntroduction: true,
  showStory: true,
  showGallery: true,
  showHighlight: true,
  showEnding: true,
}

export const defaultPhotobookContent: PhotobookSectionContent = {
  cover: {
    title: 'Emily & James',
    subtitle: 'The Wedding Album',
    date: 'August 12, 2024',
    location: 'London',
    tagline: 'The story of a single day that changed everything',
    images: {
      id: 'cover-main',
      image: '/placeholder.jpg',
      caption: 'The defining shot of our day',
      imageSettings: [
        {
          aspectRatio: 'landscape',
          frameStyle: 'gallery',
        },
      ],
    },
  },
  introduction: {
    title: 'Our Journey Begins',
    quote: 'Sometimes, a single day can encompass an entire lifetime.',
    dedication: 'Dedicated to our parents and friends who stood by our side.',
    images: {
      id: 'intro-1',
      image: '/placeholder.jpg',
      caption: 'The morning before the most anticipated day.',
      imageSettings: [
        {
          aspectRatio: 'portrait',
          frameStyle: 'soft',
        },
      ],
    },
  },
  story: {
    title: 'The Day Unfolds',
    date: 'August 12, 2024',
    location: 'London',
    paragraphs: [
      'The morning began with a quiet, calm anticipation, fueled by hot coffee and nervous excitement.',
      'Every sequence, from the preparation to the first dance, became an integral chapter of our shared narrative.',
    ],
    images: [
      {
        id: 'story-morning',
        label: 'Bridal Preparation',
        images: ['/placeholder.jpg'],
        caption: 'Moments of tender, anticipatory preparation.',
        imageSettings: [
          { aspectRatio: 'portrait', frameStyle: 'soft' },
        ],
      },
      {
        id: 'story-ceremony',
        label: 'The Ceremony',
        images: ['/placeholder.jpg'],
        caption: 'The exact moment we exchanged our vows.',
        imageSettings: [
          { aspectRatio: 'landscape', frameStyle: 'film' },
        ],
      },
    ],
  },
  gallery: {
    title: 'Curated Collection',
    description: 'A selection of candid moments we cherish and revisit time and again.',
    images: [
      {
        id: 'gallery-1',
        image: '/placeholder.jpg',
        caption: 'Just us and the rhythm of the night.',
        imageSettings: [
          { aspectRatio: 'landscape', frameStyle: 'film' },
        ],
      },
    ],
  },
  highlight: {
    title: 'The Defining Moment',
    description: 'Images that became the undeniable symbols of this significant day.',
    quote: 'In this very moment, time seemed to stand still.',
    images: {
      id: 'highlight-main',
      image: '/placeholder.jpg',
      caption: 'Lost in the moment, surrounded by music.',
      imageSettings: [
        { aspectRatio: 'landscape', frameStyle: 'film' },
      ],
    },
    videoUrl: '',
  },
  ending: {
    text: 'Thank you for reliving this day with us through these pages.',
    date: '2024',
    signature: 'With love, Emily and James',
    images: {
      id: 'ending-detail',
      image: '/placeholder.jpg',
      caption: 'The rings that sealed our commitment.',
      imageSettings: [
        { aspectRatio: 'square', frameStyle: 'soft' },
      ],
    },
  },
}