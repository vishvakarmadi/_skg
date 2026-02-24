
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function NotFoundPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <h1 className="text-9xl font-bold tracking-tighter text-primary/20">404</h1>
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold tracking-tight">Page not found</h2>
                    <p className="text-muted-foreground max-w-[500px] mx-auto">
                        Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
                    </p>
                </div>
                <div className="flex justify-center gap-4">
                    <Button asChild size="lg">
                        <Link to="/">
                            Go back home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link to="/contact">
                            Contact support
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
