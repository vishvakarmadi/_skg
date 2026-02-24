import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { type Language } from '@/i18n';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  language: Language;
  onChange: (lang: Language) => void;
}

const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
];

export function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all',
          'bg-muted hover:bg-muted/80 border border-border'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-saffron" />
        <span className="hidden sm:inline">{currentLang?.nativeName}</span>
        <span className="sm:hidden">{currentLang?.flag}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50"
          >
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                    language === lang.code
                      ? 'bg-saffron/10 text-saffron'
                      : 'hover:bg-muted text-foreground'
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{lang.nativeName}</p>
                    <p className="text-xs text-muted-foreground">{lang.name}</p>
                  </div>
                  {language === lang.code && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact version for mobile
export function LanguageSelectorCompact({ language, onChange }: LanguageSelectorProps) {
  const toggleLanguage = () => {
    onChange(language === 'en' ? 'hi' : 'en');
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all',
        'bg-saffron/10 text-saffron hover:bg-saffron/20'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="font-bold">{language === 'en' ? 'EN' : 'हि'}</span>
    </motion.button>
  );
}
