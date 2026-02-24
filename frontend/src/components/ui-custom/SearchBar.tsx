import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mic, History, TrendingUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useFilterStore } from '@/store';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Hindi search suggestions
const hindiSuggestions = [
  { en: 'ghee batti', hi: 'गी बत्ती' },
  { en: 'diya', hi: 'दीया' },
  { en: 'agarbatti', hi: 'अगरबत्ती' },
  { en: 'puja thali', hi: 'पूजा थाली' },
  { en: 'rudraksha', hi: 'रुद्राक्ष' },
  { en: 'idol', hi: 'मूर्ति' },
];

const recentSearches = ['गी बत्ती', 'पूजा सामग्री', 'दीया सेट'];
const trendingSearches = ['दीवाली ऑफर', 'नवरात्रि स्पेशल', 'शुद्ध घी'];

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSearchQuery } = useFilterStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
      onClose();
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setQuery('गी बत्ती');
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchQuery(suggestion);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Search Input */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center px-4 py-4 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground mr-3" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="खोजें... (Search products)"
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg devanagari"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="p-1 rounded-full hover:bg-muted mr-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <motion.button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-2 rounded-full transition-colors ${
                      isListening ? 'bg-saffron text-white' : 'hover:bg-muted'
                    }`}
                    animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                  >
                    <Mic className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>

              {/* Search Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {/* Hindi Suggestions */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 devanagari">
                    लोकप्रिय खोज (Popular Searches)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {hindiSuggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.hi)}
                        className="px-3 py-1.5 bg-muted hover:bg-saffron/10 hover:text-saffron rounded-full text-sm transition-colors devanagari"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {suggestion.hi}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <History className="w-4 h-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium text-muted-foreground devanagari">
                        हाल की खोज (Recent)
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(search)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-left devanagari"
                        >
                          <History className="w-4 h-4 text-muted-foreground" />
                          <span>{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-saffron" />
                    <h4 className="text-sm font-medium text-muted-foreground devanagari">
                      ट्रेंडिंग (Trending)
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-left devanagari"
                      >
                        <span className="w-5 h-5 flex items-center justify-center bg-saffron/10 text-saffron rounded text-xs font-bold">
                          {index + 1}
                        </span>
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Inline Search Bar for Header
export function InlineSearchBar() {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { setSearchQuery } = useFilterStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-48'
      }`}
    >
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => setIsExpanded(false)}
        placeholder="खोजें..."
        className="w-full pl-10 pr-10 py-2 bg-muted rounded-full text-sm outline-none focus:ring-2 focus:ring-saffron/50 transition-all devanagari"
      />
      <button
        type="button"
        className="absolute right-3 p-1 rounded-full hover:bg-muted-foreground/20"
      >
        <Mic className="w-3 h-3 text-muted-foreground" />
      </button>
    </form>
  );
}
