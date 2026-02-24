import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

export function GheeWicksFeature() {
    const { isHindi } = useLanguage()
    const ref = useRef(null)

    // Scroll Fade Effect
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    })

    const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0])
    const scaleDown = useTransform(scrollYProgress, [0, 0.6], [1, 0.95])

    return (
        <motion.section
            ref={ref}
            style={{ opacity: fadeOut, scale: scaleDown }}
            className="relative min-h-screen w-full overflow-hidden"
        >

            {/* 🌄 Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/assets/gheewickss.png')",
                }}
            />
            <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                        animate={{ translateX: ["-100%", "100%"] }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 3,
                        }}
                    />

            {/* 🌟 Divine Vertical Light Beams */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute top-0 h-full w-32 bg-gradient-to-b from-saffron/30 via-transparent to-transparent blur-3xl"
                        style={{
                            left: `${20 + i * 30}%`,
                        }}
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 6 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* ✨ Rotating Sacred Circle */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <svg
                    viewBox="0 0 100 100"
                    className="w-[70vw] max-w-[650px] opacity-20 text-saffron"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        strokeDasharray="2 6"
                    />
                </svg>
            </motion.div>

            {/* 🕯 Ember Particles (Behind Glass Only) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-saffron rounded-full blur-sm"
                        initial={{
                            y: "60%",
                            x: `${Math.random() * 60 - 30}%`,
                            opacity: 0,
                        }}
                        animate={{
                            y: "-40%",
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 6 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeOut",
                        }}
                    />
                ))}
            </div>

            {/* 🕉 Glass Hero Content */}
            <div className="relative z-20 flex items-center justify-center min-h-screen px-6">

                <div className="
          relative
          max-w-3xl
          w-full
          text-center
          px-10 py-14
          rounded-3xl
          backdrop-blur-2xl
          bg-gradient-to-br from-white/20 via-white/10 to-saffron/10
          border border-white/20
          shadow-[0_0_80px_rgba(255,153,0,0.2)]
          overflow-hidden
        ">

                    {/* 🌤 Soft Light Sweep Across Glass */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                        animate={{ translateX: ["-100%", "100%"] }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 3,
                        }}
                    />

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight"
                    >
                        <span className="font-serif bg-gradient-to-r from-saffron via-orange-400 to-amber-300 bg-clip-text text-transparent">
                            {isHindi ? "पवित्र दिव्य" : "Sacred Divine"}
                        </span>
                        <br />
                        <span className="text-white font-light drop-shadow-lg">
                            {isHindi ? "ज्योति" : "Light"}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative z-10 mt-6 text-lg md:text-xl text-white/90 italic"
                    >
                        {isHindi
                            ? "शुद्धता और दिव्य ऊर्जा का अनुपम संगम"
                            : "An unparalleled blend of purity and divine energy"}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="relative z-10 mt-8 text-saffron tracking-[0.35em] uppercase text-xs md:text-sm"
                    >
                        {isHindi
                            ? "शुद्धता • परंपरा • समर्पण"
                            : "Purity • Tradition • Devotion"}
                    </motion.div>

                </div>
            </div>
        </motion.section>
    )
}