import { motion } from 'motion/react';
import Link from '@objectagi/core/Link';
import { useSession } from 'next-auth/react';

/**
 * The Error404Page component renders a custom 404 error page.
 */
function Error404Page() {
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';

    return (
        <div className="flex flex-1 flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                >
                    <h1 className="mt-12 text-center text-4xl font-extrabold leading-[1.25] tracking-tight sm:mt-24 md:text-7xl md:leading-none">
                        404
                    </h1>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                >
                    <h5 className="mt-2 text-center text-lg font-medium tracking-tight md:text-xl text-gray-500">
                        The page you requested could not be found.
                    </h5>
                </motion.div>
                {isAuthenticated ? (
                    <Link
                        className="mt-12 block font-normal"
                        to="/"
                    >
                        Return Home
                    </Link>
                ) : (
                    <Link
                        className="mt-12 block font-normal"
                        to="/sign-in"
                    >
                        Back to sign-in
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Error404Page;