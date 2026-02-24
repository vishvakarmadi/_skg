import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    placeholderClassName?: string;
}

/**
 * LazyImage — loads images only when they enter the viewport.
 * Uses native loading="lazy" + Intersection Observer for a smooth fade-in.
 */
export function LazyImage({
    src,
    alt,
    className,
    placeholderClassName,
    ...props
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // Start loading 200px before it enters viewport
        );

        observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
            {/* Skeleton placeholder */}
            {!isLoaded && (
                <div
                    className={cn(
                        'absolute inset-0 bg-muted animate-pulse',
                        placeholderClassName
                    )}
                />
            )}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    className={cn(
                        'w-full h-full object-cover transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        className
                    )}
                    {...props}
                />
            )}
        </div>
    );
}
