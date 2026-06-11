import ObjectAGIHighlight from '@objectagi/core/ObjectAGIHighlight';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import controlPanelLayoutRaw from '@/app/(control-panel)/layout.tsx?raw';
import publicLayoutRaw from '@/app/(public)/layout.tsx?raw';

/**
 * Routing Documentation
 *
 * This document provides detailed information on how to effectively use the routing system in ObjectAGI React.
 * It covers modular route configuration, customization options, and automatic route management.
 */
function RoutingDoc() {
    return (
        <>
            <Typography
                variant="h4"
                className="mb-10 font-bold"
            >
                Routing in ObjectAGI React with Next.js App Router
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React employs the Next.js 13 App Router to manage application routing. This advanced, file-system-based routing system, built on server components, supports layouts, nested routes, loading states, error handling, and additional features.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                For in-depth details on the Next.js App Router, consult the{' '}
                <Link
                    href="https://nextjs.org/docs/app/building-your-application/routing"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    official Next.js documentation
                </Link>
                .
            </Typography>

            <Typography
                variant="h5"
                className="mb-5 font-bold"
            >
                Key Concepts
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                1. <strong>File-based Routing:</strong> Routes are established based on the file structure within the <code>app</code> directory.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                2. <strong>Layouts:</strong> Common UI elements for multiple pages are defined in <code>layout.tsx</code> files.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                3. <strong>Route Groups:</strong> Group routes without impacting the URL structure by using parentheses in folder names.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                4. <strong>Dynamic Routes:</strong> Define routes with dynamic parameters using square brackets, such as <code>[id]</code>.
            </Typography>

            <Typography
                variant="h5"
                className="mt-8 mb-5 font-bold"
            >
                Using MainLayout in layout.tsx
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React offers a <code>MainLayout</code> component for use in <code>layout.tsx</code> files to organize the overall structure of your pages. This component allows you to control the visibility of various sections of the main theme layout.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                Below is an example of implementing <code>MainLayout</code> in a public layout:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-typescript mb-6"
            >
                {publicLayoutRaw}
            </ObjectAGIHighlight>

            <Typography
                className="mb-4"
                component="p"
            >
                In this example, the NavigationBarSlice, toolbar, side panels, and footer are hidden for all routes within the (public) group.
            </Typography>

            <Typography
                variant="h5"
                className="mt-8 mb-5 font-bold"
            >
                Route Access Restriction with AuthGuardRedirect
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React provides an <code>AuthGuardRedirect</code> component to limit access to specific routes based on user roles. Below is an example of its use in a control panel layout:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-typescript mb-6"
            >
                {controlPanelLayoutRaw}
            </ObjectAGIHighlight>

            <Typography
                className="mb-4"
                component="p"
            >
                In this case, access to all routes under the (control-panel) group is restricted to users with the 'admin' role. Users lacking the required role will be redirected.
            </Typography>

            <Typography
                variant="h5"
                className="mt-8 mb-5 font-bold"
            >
                Best Practices
            </Typography>

            <Typography
                component="ul"
                className="list-disc list-inside mb-4"
            >
                <li>
                    Organize routes logically using route groups (folders with parentheses) without altering the URL structure.
                </li>
                <li>
                    Apply shared layouts for related pages to ensure consistency and minimize redundant code.
                </li>
                <li>
                    Use the <code>AuthGuardRedirect</code> component to enforce role-based access control for your routes.
                </li>
                <li>
                    Leverage Next.js 13 features, such as server components and streaming, to enhance performance and improve user experience.
                </li>
            </Typography>

            <Typography
                className="mt-8 mb-4"
                component="p"
            >
                By utilizing the Next.js App Router alongside ObjectAGI React’s custom components like <code>MainLayout</code> and <code>AuthGuardRedirect</code>, you can build a robust, adaptable, and secure routing system for your application.
            </Typography>
        </>
    );
}

export default RoutingDoc;