# Vishwak Naidu - Creative Developer Portfolio

A high-performance, cinematic, and interactive personal portfolio website built with a modern, futuristic aesthetic.

## 🚀 Features
- **Cinematic Animations**: Powered by GSAP and ScrollTrigger for buttery smooth reveals.
- **Smooth Scrolling**: Integrated Lenis for a premium, inertia-based scrolling experience.
- **Dynamic GitHub Feed**: Automatically fetches and displays repositories using the GitHub API.
- **Live Backend**: Contact form submissions are stored in a **Supabase** database.
- **Mobile Optimized**: Fully responsive design with a custom hamburger menu and fluid typography.
- **Glassmorphism**: Modern UI components with blur and transparency effects.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Animations**: [GSAP](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Smooth Scroll**: [Lenis](https://github.com/studio-freight/lenis)
- **Backend**: [Supabase](https://supabase.com/)
- **Icons**: [Font Awesome](https://fontawesome.com/) (Optional) / SVG

## 📦 Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/viswakpullepu/viswak-portfolio.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Supabase credentials (see below).
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables
Create a `.env` file in the root directory and add:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📄 License
This project is for personal showcase. All rights reserved.
