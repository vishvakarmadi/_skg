import { motion } from "framer-motion"
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useUIStore } from "@/store"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"

/* =========================
   Footer Brand Section
========================= */
function FooterBrand() {
  return (
    <div className="lg:col-span-2">
      <img
        src="/assets/skglogo-h.jpeg"
        alt="SKG ENTERPRISE"
        className="h-16 brightness-125 contrast-110 mb-6"
      />

      <p className="text-cream/80 mb-6 max-w-sm leading-relaxed">
        Established by Pawan Hridya Nahu, SKG ENTERPRISE provides pure
        worship materials and temple machinery solutions.
      </p>

      {/* Contact */}
      <div className="space-y-4">
        <div className="flex items-start gap-3 text-cream/70">
          <MapPin className="w-5 h-5 text-saffron mt-1" />
          <span className="text-sm">
            H.NO 12, Mangolpur Kalan Marble Market,<br />
            Rohini Sector-2, Delhi - 110085
          </span>
        </div>

        <div className="flex items-center gap-3 text-cream/70">
          <Phone className="w-5 h-5 text-saffron" />
          <span className="text-sm font-medium">
            +91 8800580015
          </span>
        </div>

        <div className="flex items-center gap-3 text-cream/70">
          <Mail className="w-5 h-5 text-saffron" />
          <span className="text-sm">
            skgenterprise3@gmail.com
          </span>
        </div>
      </div>

      {/* Social */}
      <div className="flex gap-3 mt-8">
        {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
          <motion.a
            key={i}
            href="#"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-saffron transition-all"
            whileHover={{ y: -3 }}
          >
            <Icon className="w-5 h-5" />
          </motion.a>
        ))}
      </div>
    </div>
  )
}

/* =========================
   Footer Links Section
========================= */
function FooterLinks() {
  return (
    <div className="lg:col-span-3">
      <div className="grid lg:grid-cols-3 lg:gap-16">

        {/* Products */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Products
          </h3>

          <div className="grid grid-cols-2 gap-2 text-sm lg:grid-cols-1 lg:gap-3">
            {[
              "Ghee Jyot Batti",
              "Kesar Batti",
              "Mogra Batti",
              "Rose Batti",
              "Lavender Batti",
              "Round Cotton Wicks Machine",
              "Long Wicks Machine",
            ].map((item) => (
              <Link
                key={item}
                to="#"
                className="text-cream/70 hover:text-saffron transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div className="mt-10 lg:mt-0">
          <h3 className="text-lg font-semibold mb-4">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              "About Us",
              "Stories",
              "Terms & Conditions",
              "Privacy Policy",
            ].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="text-cream/70 hover:text-saffron transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="mt-10 lg:mt-0">
          <h3 className="text-lg font-semibold mb-4">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              "Contact Us",
              "FAQ",
              "Refund Policy",
            ].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="text-cream/70 hover:text-saffron transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
/* =========================
   Footer Bottom Section
========================= */
function FooterBottom({ t }: { t: any }) {
  return (
    <>
      {/* Founder Quote + Newsletter */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center">
            🙏
          </div>
          <div>
            <p className="italic text-lg">
              "{t("about.founderQuote")}"
            </p>
            <p className="text-saffron text-sm mt-1">
              — {t("about.founder")}, SKG ENTERPRISE
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter email"
            className="px-4 py-2 bg-white/10 rounded-full text-sm outline-none focus:ring-2 focus:ring-saffron"
          />
          <button className="px-6 py-2 bg-saffron text-white rounded-full text-sm hover:bg-saffron-dark">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-cream/60">
            <p className="text-center sm:text-left">
              © 2026 SKG ENTERPRISE.
            </p>

            <p className="text-[10px] tracking-widest text-cream/30">
              SKG ENTERPRISE™
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

/* =========================
   Main Footer Component
========================= */
export function Footer() {
  const { mode } = useUIStore()
  const { t } = useLanguage()
  const isBhakti = mode === "bhakti"

  return (
    <footer
      className={cn(
        "relative overflow-hidden",
        isBhakti
          ? "bg-temple-midnight text-cream"
          : "bg-steel-dark text-white"
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <FooterBrand />
          <FooterLinks />
        </div>

        <FooterBottom t={t} />
      </div>
    </footer>
  )
}