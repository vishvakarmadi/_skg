import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { DiyaButton } from '@/components/ui-custom/DiyaButton';
import { useLanguage } from '@/contexts/LanguageContext';

// Floating Diya Particle Component
function FloatingDiya({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.5],
        y: [0, -30, -60, -100],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      {/* Diya Base */}
      <div className="relative">
        <div className="w-6 h-3 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-full" />
        {/* Flame */}
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2"
          animate={{
            scaleY: [1, 1.2, 0.9, 1.1, 1],
            skewX: [0, 2, -1, 1, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-2 h-4 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full blur-[1px]" />
        </motion.div>
        {/* Glow */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-400/30 rounded-full blur-xl" />
      </div>
    </motion.div>
  );
}

// Smoke Particle
function SmokeParticle({ delay, x }: { delay: number; x: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, bottom: '20%' }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.3, 0.2, 0],
        y: [-20, -100, -200],
        x: [0, 10, -10, 5],
        scale: [1, 2, 3],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <div className="w-16 h-16 bg-gradient-radial from-white/10 to-transparent rounded-full blur-2xl" />
    </motion.div>
  );
}

// Sacred Geometry Background
function SacredGeometry() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Mandala Pattern */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]"
        viewBox="0 0 400 400"
      >
        <defs>
          <pattern id="mandala" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#mandala)" />
      </svg>

      {/* Rotating Outer Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-saffron/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-saffron/20 rounded-full"
            style={{
              top: '0',
              left: '50%',
              transform: `rotate(${i * 30}deg) translateY(-300px) translateX(-50%)`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, isHindi } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const [floatingDiyas] = useState(() =>
    [...Array(8)].map((_, i) => ({
      id: i,
      delay: i * 0.8,
      x: `${10 + Math.random() * 80}%`,
      y: `${60 + Math.random() * 30}%`,
    }))
  );

  const [smokeParticles] = useState(() =>
    [...Array(5)].map((_, i) => ({
      id: i,
      delay: i * 2,
      x: `${20 + i * 15}%`,
    }))
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-sacred-gradient"
    >
      {/* Sacred Geometry Background */}
      <SacredGeometry />

      {/* Floating Diyas */}
      {floatingDiyas.map((diya) => (
        <FloatingDiya key={diya.id} delay={diya.delay} x={diya.x} y={diya.y} />
      ))}

      {/* Smoke Particles */}
      {smokeParticles.map((smoke) => (
        <SmokeParticle key={smoke.id} delay={smoke.delay} x={smoke.x} />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ y, opacity, scale }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-saffron/10 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-saffron rounded-full animate-pulse" />
              <span className="text-sm text-saffron font-medium">
                {t('hero.tagline')}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6"
            >
              <span className="block text-foreground leading-tight">
                {isHindi ? 'सर्व देव नमस्कारं' : 'One Lamp Lights All'}
              </span>
              <span className="block text-gradient-saffron font-sacred mt-2">
                {isHindi ? 'केशवं प्रतिगच्छति' : 'Keshavam Pratigachchati'}
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {isHindi
                ? 'पवन हृदय नाहु द्वारा स्थापित, SKG ENTERPRISE आपको शुद्ध पूजा सामग्री और मंदिर निर्माण यंत्र प्रदान करता है।'
                : 'Established by Pawan Hridya Nahu, SKG ENTERPRISE provides pure worship materials and temple construction machinery.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <DiyaButton size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                {t('hero.cta')}
              </DiyaButton>
              <motion.button
                className="flex items-center gap-2 px-6 py-3 text-foreground hover:text-saffron transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                {t('hero.watchVideo')}
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                {
                  value: isHindi ? '१,०८,०००+' : '1,08,000+',
                  label: t('hero.stats.customers')
                },
                {
                  value: isHindi ? '५००+' : '500+',
                  label: t('hero.stats.products')
                },
                {
                  value: isHindi ? '२५+' : '25+',
                  label: t('hero.stats.experience')
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className={`text-2xl lg:text-3xl font-bold text-saffron ${isHindi ? 'devanagari' : ''}`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs text-muted-foreground mt-1 ${isHindi ? 'devanagari' : ''}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, type: 'spring' }}
            className="flex-1 relative"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-saffron/30 to-gold/30 rounded-full blur-3xl scale-110" />

              {/* Main Image Container */}
              <motion.div
                className="relative aspect-square rounded-3xl overflow"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src="assets/diya.jpeg"
                  alt="Sacred Diya"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover "
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-saffron/20 via-transparent to-transparent" />

                {/* Floating Badge */}
                <motion.div
                  className="absolute -bottom-8 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🪔</span>
                    </div>
                    <div>
                      <p className={`font-semibold text-foreground ${isHindi ? 'devanagari' : ''}`}>
                        {isHindi ? 'शुद्ध घी बत्ती' : 'Pure Cow Ghee Batti'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isHindi ? 'Pure Cow Ghee Batti' : 'शुद्ध घी बत्ती'}
                      </p>
                    </div>
                    <div className="ml-auto">
                      {/* <span className="text-lg font-bold text-saffron">₹199</span> */}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-gold/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-saffron/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="scroll-indicator" />
      </motion.div>

      {/* SKG Watermark */}
      <div className="absolute bottom-4 right-4 text-[8px] text-saffron/20 font-sacred tracking-[0.3em]">
        SKG ENTERPRISE™
      </div>
    </section>
  );
}
