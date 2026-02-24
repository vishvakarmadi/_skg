import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { useRef } from "react"

export function GheeWicksFeature() {
    const ref = useRef(null)
    const shouldReduceMotion = useReducedMotion()

    // Scroll Fade Effect
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    })

    const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0])
    const scaleDown = useTransform(scrollYProgress, [0, 0.6], [1, 0.97])

    // Detect Mobile
    const isMobile =
        typeof window !== "undefined" && window.innerWidth < 768

    return (
        <motion.section
            ref={ref}
            style={!shouldReduceMotion ? { opacity: fadeOut, scale: scaleDown } : {}}
            className="relative min-h-[90vh] md:min-h-screen w-full overflow-hidden"
        >

            {/* 🌄 Responsive Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${
                        isMobile
                        ? "/assets/gheewicksbanner-mobile.png"
                        : "/assets/gheewicksbanner.png"
                    })`,
                }}
            />

            {/* Light Sweep (Disable on Reduced Motion) */}
            {!shouldReduceMotion && !isMobile && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                    animate={{ translateX: ["-100%", "100%"] }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 4,
                    }}
                />
            )}

            {/* Divine Light Beams (Reduced on Mobile) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(isMobile ? 1 : 3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute top-0 h-full w-24 md:w-32 bg-gradient-to-b from-saffron/30 via-transparent to-transparent blur-3xl"
                        style={{ left: `${30 + i * 25}%` }}
                        animate={
                            !shouldReduceMotion
                                ? { opacity: [0.2, 0.5, 0.2] }
                                : {}
                        }
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Sacred Rotating Circle */}
            {!shouldReduceMotion && (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 120,
                        ease: "linear",
                    }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <svg
                        viewBox="0 0 100 100"
                        className="w-[85vw] md:w-[70vw] max-w-[550px] text-saffron opacity-70"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="33"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeDasharray="2 6"
                        />
                    </svg>
                </motion.div>
            )}

            {/* Ember Particles (Much lighter on mobile) */}
            {!shouldReduceMotion && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[...Array(isMobile ? 5 : 12)].map((_, i) => (
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
            )}
        </motion.section>
    )
}