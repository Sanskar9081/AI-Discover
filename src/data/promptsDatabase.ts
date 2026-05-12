import type { Prompt } from "./tools";

export const promptsDatabase: Partial<Prompt>[] = [
  {
    title: "Cinematic Product Photography",
    category: "photography",
    prompt: `You are a professional product photographer. Take a high-end product photo with:
- Professional lighting setup with 3-point lighting
- Clean white or gradient background
- Focus on product details and textures
- 4K resolution, ultra sharp
- Cinematic color grading
- Shadow play for dimension
- Professional styling and composition`,
    author: "Alex Studios",
    instagram: "@alexstudios",
    suggestedToolId: "replicate",
    beforeImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop",
  },
  {
    title: "AI-Generated Anime Character",
    category: "illustration",
    prompt: `Generate a beautiful anime character with:
- Detailed anime art style
- Vibrant colors and clean lines
- Expressive eyes and facial features
- High quality illustration
- Professional anime art standards
- Dynamic pose and composition
- Accessories and fashion elements`,
    author: "Creative AI",
    instagram: "@creativeai",
    suggestedToolId: "midjourney",
    beforeImage: "https://images.unsplash.com/photo-1611080626919-5cf76476b4c5?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1578575437999-589f3cdd495b?w=400&h=300&fit=crop",
  },
  {
    title: "Professional Blog Post Layout",
    category: "design",
    prompt: `Design a professional blog post layout with:
- Clean typography hierarchy
- Balanced white space
- Professional color scheme (blues and neutrals)
- Readable font sizes (16px+ body text)
- Engaging header image
- Clear call-to-action buttons
- Mobile responsive design
- Featured quote sections`,
    author: "Design Studio",
    instagram: "@designstudio",
    suggestedToolId: "figma",
    beforeImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
  },
  {
    title: "Video Game Environment Concept",
    category: "gaming",
    prompt: `Create a video game environment concept art with:
- Detailed landscape and environment
- Cinematic lighting
- Fantasy or sci-fi setting choices
- Atmospheric effects (fog, particles)
- Game-ready quality
- Rich textures and details
- Adventure/exploration feeling
- Professional game art standards`,
    author: "Game Dev Studio",
    instagram: "@gamedevstudio",
    suggestedToolId: "runway",
    beforeImage: "https://images.unsplash.com/photo-1535016120754-30d87a50bed1?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1526480452585-7e5f00bae733?w=400&h=300&fit=crop",
  },
  {
    title: "Social Media Post - Instagram",
    category: "social-media",
    prompt: `Create an engaging Instagram post with:
- Eye-catching design
- On-brand color palette
- Clear messaging and call-to-action
- Optimal dimensions (1080x1350px)
- Readable text and fonts
- Engaging visuals
- Social media best practices
- Trending design elements`,
    author: "Social Boss",
    instagram: "@socialboss",
    suggestedToolId: "canva",
    beforeImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop",
  },
  {
    title: "Logo Design - Modern Minimalist",
    category: "branding",
    prompt: `Design a modern minimalist logo with:
- Clean, simple geometric shapes
- Memorable iconic design
- Scalable for all sizes
- Professional color palette
- Timeless design principles
- Minimal line work
- Versatile (works in B&W and color)
- Brand personality reflection`,
    author: "Brand Co",
    instagram: "@brandco",
    suggestedToolId: "adobe-express",
    beforeImage: "https://images.unsplash.com/photo-1554402648-2cdfa383c44b?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
  },
  {
    title: "4D Product Animation",
    category: "animation",
    prompt: `Create a 4D product animation showing:
- 360-degree product rotation
- Product assembly/disassembly
- Feature highlights and details
- Smooth transitions and effects
- Professional lighting changes
- Cinematic camera movements
- Interactive elements
- High-quality output ready for web/social`,
    author: "Motion Design",
    instagram: "@motiondesign",
    suggestedToolId: "blender",
    beforeImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
  },
  {
    title: "UI/UX Mobile App Design",
    category: "design",
    prompt: `Design a modern mobile app UI with:
- Clean user interface
- Intuitive navigation
- Consistent design system
- Modern color scheme
- Readable typography
- Touch-friendly button sizes
- Proper spacing and alignment
- Accessibility considerations
- iOS/Android best practices`,
    author: "App Designer",
    instagram: "@appdesigner",
    suggestedToolId: "framer",
    beforeImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
  },
  {
    title: "E-commerce Product Page",
    category: "web-design",
    prompt: `Design an e-commerce product page with:
- High-quality product images
- Clear product information
- Price and availability display
- Customer reviews section
- Product details and specifications
- Related/recommended products
- Shopping cart integration
- Mobile responsive layout
- Trust signals (ratings, reviews)
- Clear call-to-action buttons`,
    author: "E-commerce Expert",
    instagram: "@ecomexpert",
    suggestedToolId: "webflow",
    beforeImage: "https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1488459716781-6bae3f19640d?w=400&h=300&fit=crop",
  },
  {
    title: "Newsletter Email Template",
    category: "email",
    prompt: `Create a professional newsletter email with:
- Eye-catching header image
- Clear subject lines
- Well-organized content sections
- Readable fonts and colors
- Compelling copy and messaging
- Call-to-action buttons
- Professional footer
- Mobile-responsive layout
- Brand consistency
- Unsubscribe link compliance`,
    author: "Email Master",
    instagram: "@emailmaster",
    suggestedToolId: "mailchimp",
    beforeImage: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1586221715567-f4b85e1bb727?w=400&h=300&fit=crop",
  },
];
