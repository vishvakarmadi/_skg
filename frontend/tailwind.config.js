/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // SKG Custom Colors
        saffron: {
          DEFAULT: '#FF6F00',
          light: '#FB8C00',
          dark: '#E65100',
        },
        gold: {
          DEFAULT: '#FFD700',
          dark: '#FFA000',
          light: '#FFECB3',
        },
        maroon: {
          DEFAULT: '#800000',
          light: '#B71C1C',
        },
        cream: {
          DEFAULT: '#FFF8E1',
          dark: '#FFECB3',
        },
        temple: {
          midnight: '#1A0F00',
          copper: '#2C1810',
        },
        // Yantra Industrial Colors
        steel: {
          DEFAULT: '#374151',
          light: '#4B5563',
          dark: '#1F2937',
        },
        copper: {
          DEFAULT: '#B87333',
          dark: '#8B5A2B',
        },
        bronze: {
          DEFAULT: '#CD7F32',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'Plus Jakarta Sans', 'sans-serif'],
        sacred: ['Cinzel Decorative', 'serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        'bhakti': '12px',
        'yantra': '4px',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'diya': '0 4px 20px rgba(255, 111, 0, 0.15)',
        'diya-hover': '0 8px 32px rgba(255, 160, 0, 0.25)',
        'glow': '0 0 20px rgba(255, 111, 0, 0.3), 0 0 40px rgba(255, 111, 0, 0.1)',
        'glow-strong': '0 0 30px rgba(255, 111, 0, 0.5), 0 0 60px rgba(255, 111, 0, 0.2)',
        'yantra': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'yantra-hover': '0 4px 16px rgba(255, 140, 0, 0.15)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float-diya": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(2deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(255, 111, 0, 0.3), 0 0 40px rgba(255, 111, 0, 0.1)"
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(255, 111, 0, 0.5), 0 0 60px rgba(255, 111, 0, 0.2)"
          },
        },
        "scroll-bounce": {
          "0%, 100%": { transform: "translateX(-50%) translateY(0)", opacity: "1" },
          "50%": { transform: "translateX(-50%) translateY(12px)", opacity: "0.3" },
        },
        "smoke-rise": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.6" },
          "100%": { transform: "translateY(-100px) scale(2)", opacity: "0" },
        },
        "om-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "sparkle": {
          "0%, 100%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1)", opacity: "1" },
        },
        "diya-ripple": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "mandala-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "flame-flicker": {
          "0%, 100%": { transform: "scaleY(1) skewX(0deg)", opacity: "0.9" },
          "25%": { transform: "scaleY(1.1) skewX(2deg)", opacity: "1" },
          "50%": { transform: "scaleY(0.95) skewX(-1deg)", opacity: "0.85" },
          "75%": { transform: "scaleY(1.05) skewX(1deg)", opacity: "0.95" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float-diya": "float-diya 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "scroll-bounce": "scroll-bounce 2s infinite",
        "smoke-rise": "smoke-rise 8s ease-out infinite",
        "om-spin": "om-spin 2s linear infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "diya-ripple": "diya-ripple 2s infinite",
        "shimmer": "shimmer 1.5s infinite",
        "mandala-pulse": "mandala-pulse 3s ease-in-out infinite",
        "flame-flicker": "flame-flicker 0.5s ease-in-out infinite",
      },
      backgroundImage: {
        'sacred-gradient': 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--sacred-cream)) 100%)',
        'saffron-gradient': 'linear-gradient(135deg, #FF6F00, #FFD700)',
        'gold-gradient': 'linear-gradient(135deg, #FFD700, #FF6F00)',
        'yantra-gradient': 'linear-gradient(135deg, #374151, #B87333)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
