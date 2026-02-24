import { motion } from 'framer-motion';
import { type ReactNode, useRef, useState } from 'react';

interface DiyaButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  ripple?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function DiyaButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon,
  ripple = true,
  type = 'button',
}: DiyaButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    if (ripple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples((prev) => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick?.();
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'btn-diya text-white',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-saffron text-saffron hover:bg-saffron/10',
    ghost: 'text-foreground hover:bg-muted',
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden font-semibold rounded-full
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Ripple Effects */}
      {ripple && ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-diya-ripple pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Loading Spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-om-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}

      {/* Button Content */}
      <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}

// Add to Cart Button with fly animation
interface AddToCartButtonProps {
  onClick: () => void;
  isInCart?: boolean;
  className?: string;
}

export function AddToCartButton({ onClick, isInCart, className }: AddToCartButtonProps) {
  return (
    <DiyaButton
      onClick={onClick}
      variant={isInCart ? 'secondary' : 'primary'}
      size="md"
      className={className}
      icon={isInCart ? '✓' : '🛒'}
    >
      {isInCart ? 'पात्र में है' : 'पात्र में डालें'}
    </DiyaButton>
  );
}

// Wishlist Button
interface WishlistButtonProps {
  onClick: () => void;
  isInWishlist: boolean;
  className?: string;
}

export function WishlistButton({ onClick, isInWishlist, className }: WishlistButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        p-3 rounded-full transition-all duration-300
        ${isInWishlist 
          ? 'bg-saffron text-white' 
          : 'bg-muted text-muted-foreground hover:bg-saffron/10 hover:text-saffron'
        }
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isInWishlist ? 'Remove from Puja List' : 'Add to Puja List'}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill={isInWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        animate={isInWishlist ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </motion.svg>
    </motion.button>
  );
}
