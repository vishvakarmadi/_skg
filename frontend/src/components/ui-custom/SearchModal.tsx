import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mic, History, TrendingUp, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUIStore } from '@/store';
import { productsApi } from '@/api';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

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

export function SearchModal() {
  const { isHindi } = useLanguage();
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Search products
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await productsApi.search(searchQuery);
      setResults(response.data.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setQuery(isHindi ? 'गी बत्ती' : 'ghee batti');
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchOpen(false);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setSearchOpen(false)}
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
                    placeholder={isHindi ? 'खोजें... (Search products)' : 'Search... (खोजें)'}
                    className={`flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg ${isHindi ? 'devanagari' : ''}`}
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
                    className={cn(
                      'p-2 rounded-full transition-colors',
                      isListening ? 'bg-saffron text-white' : 'hover:bg-muted'
                    )}
                    animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                  >
                    <Mic className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>

              {/* Search Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-saffron" />
                  </div>
                )}

                {/* Search Results */}
                {!isLoading && query.trim() && results.length > 0 && (
                  <div className="mb-6">
                    <h4 className={`text-sm font-medium text-muted-foreground mb-3 ${isHindi ? 'devanagari' : ''}`}>
                      {isHindi ? 'खोज परिणाम' : 'Search Results'}
                    </h4>
                    <div className="space-y-2">
                      {results.slice(0, 5).map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <img
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={isHindi ? product.nameHi : product.name}
                            loading="lazy"
                            decoding="async"
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${isHindi ? 'devanagari' : ''}`}>
                              {isHindi ? product.nameHi : product.name}
                            </p>
                            <p className="text-sm text-saffron">₹{product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!isLoading && query.trim() && results.length === 0 && (
                  <div className={`text-center py-8 text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
                    {isHindi ? 'कोई परिणाम नहीं मिला' : 'No results found'}
                  </div>
                )}

                {/* Default Content - No Query */}
                {!query.trim() && (
                  <>
                    {/* Hindi Suggestions */}
                    <div className="mb-6">
                      <h4 className={`text-sm font-medium text-muted-foreground mb-3 ${isHindi ? 'devanagari' : ''}`}>
                        {isHindi ? 'लोकप्रिय खोज' : 'Popular Searches'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {hindiSuggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSuggestionClick(isHindi ? suggestion.hi : suggestion.en)}
                            className="px-3 py-1.5 bg-muted hover:bg-saffron/10 hover:text-saffron rounded-full text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isHindi ? suggestion.hi : suggestion.en}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <History className="w-4 h-4 text-muted-foreground" />
                        <h4 className={`text-sm font-medium text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
                          {isHindi ? 'हाल की खोज' : 'Recent'}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-left"
                          >
                            <History className="w-4 h-4 text-muted-foreground" />
                            <span className={isHindi ? 'devanagari' : ''}>{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Trending */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-saffron" />
                        <h4 className={`text-sm font-medium text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
                          {isHindi ? 'ट्रेंडिंग' : 'Trending'}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {trendingSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-left"
                          >
                            <span className="w-5 h-5 flex items-center justify-center bg-saffron/10 text-saffron rounded text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className={isHindi ? 'devanagari' : ''}>{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
