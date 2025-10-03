# NutrientScanner Website Setup Instructions

## 🚀 Getting Started

Your modern React-based landing page is ready! Here's how to get it running:

## Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

## 📁 Project Structure

```
NutrientScanner/
├── src/
│   ├── App.jsx              # Main React component
│   ├── main.jsx             # React entry point
│   ├── App.css              # Main styles
│   └── components/
│       ├── StaggeredMenu.jsx    # Navigation menu
│       ├── StaggeredMenu.css
│       ├── Masonry.jsx          # Gallery component
│       ├── Masonry.css
│       ├── ClickSpark.jsx      # Interactive buttons
│       ├── LogoLoop.jsx         # Scrolling logos
│       └── LogoLoop.css
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js          # Build configuration
└── SETUP_INSTRUCTIONS.md    # This file
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The site will automatically open at `http://localhost:3000`
   - Or manually navigate to: `http://localhost:3000`

## 📸 Adding Your Founder Photo

To add your founder photo (the one you provided):

1. **Save your photo** as `founder-photo.jpg` in the `public` folder
2. **Create the public folder** if it doesn't exist:
   ```bash
   mkdir public
   ```
3. **Upload the image** to the public folder
4. **The image will appear** in the "About Us" section automatically

## 🎨 Key Features Implemented

### ✅ Farmer-Friendly Content
- Clear problem/solution messaging
- Agriculture-focused language
- Farmer benefits highlighted
- Real crop imagery references

### ✅ Interactive Components
- **StaggeredMenu**: Smooth animated navigation
- **Masonry**: Dynamic gallery layout
- **ClickSpark**: Engaging button interactions
- **LogoLoop**: Scrolling partner logos

### ✅ Professional Design
- Modern green gradient theme (agriculture-focused)
- Responsive design (mobile-friendly)
- Clean typography
- Smooth animations

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)
1. **Build the project:**
   ```bash
   npm run build
   ```
2. **Go to** [netlify.com](https://netlify.com)
3. **Drag the `dist` folder** to Netlify
4. **Get your live URL** instantly!

### Option 2: GitHub Pages + Netlify
1. **Build and push to GitHub:**
   ```bash
   npm run build
   git add .
   git commit -m "Build website"
   git push
   ```
2. **Connect Netlify to your GitHub repository**
3. **Automatic deployments** on every push!

### Option 3: Vercel
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```
2. **Deploy:**
   ```bash
   vercel
   ```

## 📱 Customization Options

### Colors
- Primary green: `#10B981`
- Dark green: `#059669` 
- Background: `#065F46`

### Content Updates
- Edit `src/App.jsx` for major content changes
- Update `src/App.css` for styling changes
- Modify component props in `App.jsx`

### Images
- Replace Unsplash URLs in `galleryItems` with your own
- Add partner logos to `public/logos/` folder
- Update logo references in `partnerLogos`

## 🎯 What the Website Includes

### 📋 Sections
1. **Hero** - Clear value proposition
2. **Problem** - 5 key challenges farmers face
3. **Solution** - Your NIRS technology
4. **For Farmers** - Specific farmer benefits
5. **Technology** - How it works (3 steps)
6. **Gallery** - Agriculture imagery
7. **About** - Your founder story
8. **Partners** - Scrolling logo carousel
9. **CTA** - Email signup
10. **Contact** - Footer information

### 🔧 Technical Features
- Fully responsive design
- Smooth scroll navigation
- Interactive animations
- Email capture form
- SEO-friendly structure
- Fast loading
- Modern browser support

## 📞 Support

If you need help with:
- Adding more images
- Customizing colors/content
- Setting up deployment
- Adding new sections

Just let me know! The site is built to be easily customizable and farmer-friendly. 🌱

## 🌐 Live Demo

Your site will be live at: `your-chosen-url.netlify.app` after deployment!

---

**Built with ❤️ for Agriculture**
