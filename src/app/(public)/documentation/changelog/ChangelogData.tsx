/* eslint-disable react/jsx-key */
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { Alert, Button } from '@mui/material';
import Link from '@objectagi/core/Link';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';

/**
 * The changelog item type.
 */
export type ChangelogItemType = {
    version?: string;
    date?: string;
    newChanges?: string[] | ReactNode[];
    fixedChanges?: string[] | ReactNode[];
    breakingChanges?: string[] | ReactNode[];
    notes?: ReactNode;
};

/**
 * The changelog data.
 */
const changelogData: ChangelogItemType[] = [
    {
        version: '4.0.0',
        date: '2025-11-28',
        newChanges: [
            'Added new ObjectAGIGridPro component with advanced virtualization, column pinning, and Excel-like editing.',
            'Implemented dynamic theme builder allowing runtime palette generation and persistent user themes.',
        ],
        fixedChanges: [
            'Resolved memory leak in long-running dashboard sessions with large datasets.',
            'Fixed race condition in concurrent form submissions across multiple tabs.',
            'Corrected layout shift issues when toggling sidebar on ultra-wide displays.',
        ],
    },
    {
        version: '3.1.0',
        date: '2025-10-20',
        newChanges: [
            'Updated documentation to expand on key topics related to rendering widget visuals.',
            'Scaled down !important references in global css files to improve CSS specificity and simplify custom styling/overrides.',
        ],
        fixedChanges: [
            'Fixed minor color and styling issue for the bottom toolbar.',
            'Fixed issues with documentation section rendering in desktop view.',
        ],
        breakingChanges: [
            'React upgraded to v19.2.0.',
            'MUI advanced to v7.1.0.',
            'Tailwind CSS updated to v4.2.0.',
            'Redux Toolkit improved to v2.8.0.',
            'React Hook Form improved to v7.57.0.',
            'Material React Table updated to v3.3.0.',
        ],
    },
    {
        version: '3.0.0',
        date: '2025-09-25',
        newChanges: [
            'Implemented new Roboto Flex font for improved typography consistency.',
            'Enhanced authentication security with strengthened login mechanisms.',
            'Reduced technical debt by minimizing CSS !important declarations and increasing reliance on global styles.',
            'Improved Heroicons font rendering quality for navigation items.',
        ],
        fixedChanges: [
            'Removed unnecessary custom theme color overrides for better theme consistency.',
        ],
    },
    {
        version: '2.12.0',
        date: '2025-04-25',
        newChanges: [
            'All dependency packages refreshed to latest versions.',
            'React upgraded to v19.1.0.',
            'MUI advanced to v7.0.2.',
            'Tailwind CSS updated to v4.1.4.',
            'Next.js progressed to v15.3.1.',
            'Redux Toolkit improved to v2.7.0.',
            'React Hook Form improved to v7.56.0.',
            'Material React Table updated to v3.2.1.',
            'Refactored validation types for React Hook Form.',
        ],
        breakingChanges: [
            'Replaced react-draft-wysiwyg with @tiptap/react for rich text editing.',
            'Swapped react-masonry-css for MUI’s masonry component.',
            'Removed react-swipeable-views.',
            'Eliminated draft-js.',
            'Converted next.config.mjs to next.config.ts.',
        ],
    },
    {
        version: '2.11.2',
        date: '2025-03-23',
        fixedChanges: ['Updated demos and components for page layouts.'],
    },
    {
        version: '2.11.1',
        date: '2025-03-22',
        newChanges: ['Enhanced Dashboard widget data access with optional chaining for safety.'],
        fixedChanges: [
            'Improved layout components for better responsiveness using media queries and full-width support.',
            'Updated AdjustFontSize to use pixel-based values instead of percentages.',
        ],
    },
    {
        version: '2.11.0',
        date: '2025-03-06',
        fixedChanges: [
            'Corrected Tailwind CSS media query breakpoints.',
            'Fixed Contacts App form not updating on CountryCodeSelector change.',
            'Updated aria-labelledby attribute for CountryCodeSelector.',
        ],
    },
    {
        version: '2.10.3',
        date: '2025-02-17',
        fixedChanges: [
            'Resolved sidebar width issue in ObjectAGISimpleLayout and ObjectAGIPageCardLayout layouts.',
        ],
    },
    {
        version: '2.10.0',
        date: '2025-01-26',
        newChanges: ['Upgraded Tailwind CSS to v4.'],
        notes: (
            <div className="text-base p-6 border-2 rounded-xl w-full max-w-2xl mt-10 mb-6">
                <Typography component="div">
                    <ul className="list-disc leading-[2]">
                        <li>
                            This major release introduces <b>Tailwind CSS v4</b>, delivering significant enhancements.
                        </li>
                        <li>
                            Adopted Tailwind CSS v4’s default spacing and configuration for improved consistency.
                        </li>
                        <li>
                            <b>
                                <code>tailwindcss.config.js</code>
                            </b>{' '}
                            is deprecated.
                        </li>
                        <li>
                            Base font size set to 16px for better readability and web standards alignment.
                        </li>
                        <Alert
                            severity="warning"
                            className="mt-2 leading-[2]"
                        >
                            A migration script is available at{' '}
                            <code>src/utils/node-scripts/migrate-tw-classes.js</code> to update Tailwind CSS classes for
                            this version.
                            <br />
                            Run{' '}
                            <code className="bg-orange-100 text-orange-800 px-1 py-0.5 rounded-md">
                                node src/utils/node-scripts/migrate-tw-classes.js ./src
                            </code>{' '}
                            to update classes.
                            <br />
                            Caution: This script will replace all Tailwind CSS classes.
                        </Alert>
                    </ul>
                </Typography>
            </div>
        ),
    },
    {
        version: '2.9.0',
        date: '2024-12-09',
        newChanges: [
            'Advanced React to v19.',
            'Upgraded React Router to v7.',
            'Configured ESLint to use flat config system.',
            'Updated Apex Charts to v4.1.0.',
            'Enhanced Material-UI to v6.1.10.',
            'Progressed Next.js to v15.0.4.',
            'Updated Auth.js.',
            'Replaced google-map-react with @react-google-maps/api.',
            'Revised MUI documentation.',
            'Set Node.js minimum to v22.12.0 (LTS).',
            'Advanced Tailwind CSS to v3.4.16.',
            'Included @hookform/devtools example.',
            'Updated npm minimum to v10.9.0.',
        ],
        breakingChanges: [
            'Removed forwardRef (deprecated in React v19).',
            'Applied migrations for React v19 compatibility.',
        ],
        fixedChanges: [
            'Resolved React v19 compatibility issues.',
            'Fixed AWS authentication issues.',
            'Corrected CSS properties in app-base.css.',
            'Addressed various type errors.',
        ],
        notes: (
            <div className="text-base p-6 border-2 rounded-xl w-full max-w-2xl mt-10 mb-6">
                <Typography component="div">
                    <ul className="list-disc">
                        <li className="leading-[2]">
                            This major release requires React 19 compatibility with significant dependency updates.
                        </li>
                        <li className="leading-[2]">
                            Google Maps integration revamped with @react-google-maps/api.
                        </li>
                        <li className="leading-[2]">
                            ESLint now uses flat config, which may require updates to custom configurations.
                        </li>
                    </ul>
                </Typography>
            </div>
        ),
    },
    {
        version: '2.8.1',
        date: '2024-11-10',
        newChanges: [
            <>
                Added AI Image Generation App (DALL-E 3). <Link to="/apps/ai-image-generator">Explore now!</Link>
            </>,
        ],
    },
    {
        version: '2.8.0',
        date: '2024-10-21',
        newChanges: [
            'Launched ObjectAGI React Next.js version!',
            'Upgraded Material-UI to v6+.',
            'Enhanced documentation layout with better navigation and additional pages.',
            'Refactored Vite.js authentication for simpler setup and improved multi-provider support.',
            'Integrated Mock Service Worker (MSW) for API request simulation.',
        ],
        breakingChanges: [
            'Restructured mock API specifications for better database alignment.',
            'Replaced Axios with native fetch API for lighter HTTP requests.',
            'Swapped Axios mock adapter for MSW for enhanced request mocking.',
            'Removed @lodash, using standard lodash library.',
            'Replaced Redux slices (ObjectAGISettingsSlice, userSlice, i18nSlice) with React Context Providers.',
            'Removed @hello-pangea/dnd, replaced with @hello-pangea/dnd.',
            <span>
                Dropped Vite.js &quot;JS&quot; version support. Use TypeScript compiler (tsc) for JavaScript
                compilation. See{' '}
                <a
                    href="https://www.typescriptlang.org/docs/handbook/compiler-options.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    TypeScript documentation
                </a>{' '}
                for details.
            </span>,
        ],
        notes: (
            <Alert
                classes={{
                    root: 'flex flex-col sm:flex-row justify-center items-center sm:justify-start',
                    action: 'flex sm:items-center justify-center w-full sm:w-auto',
                }}
                severity="info"
                className="mb-1.5"
                icon={<></>}
                action={
                    <Button
                        component="a"
                        href="https://nextjs.objectagis.com"
                        target="_blank"
                        variant="outlined"
                        color="inherit"
                        size="small"
                        role="button"
                        startIcon={
                            <div className="flex items-center">
                                <img
                                    src="/assets/images/logo/nextjs.svg"
                                    alt="Nextjs Logo"
                                    className="h-6 dark:hidden"
                                />
                                <img
                                    src="/assets/images/logo/nextjs-dark.svg"
                                    alt="Nextjs Logo"
                                    className="h-6 hidden dark:block"
                                />
                            </div>
                        }
                        endIcon={<ObjectAGISvgIcon size={16}>heroicons-outline:arrow-right</ObjectAGISvgIcon>}
                    >
                        Go to the demo
                    </Button>
                }
            >
                <Typography
                    variant="h6"
                    className="font-extrabold text-center"
                >
                    ObjectAGI React Next.js version launched!
                </Typography>
                <Typography
                    variant="body1"
                    className="font-medium text-center mt-0.25"
                >
                    Bringing server-side rendering capabilities with Next.js.
                </Typography>
            </Alert>
        ),
    },
    {
        version: '2.5.0',
        date: '2024-08-19',
        newChanges: [
            'Configured vite.config.mts for local network host exposure.',
            'Ensured components support Fast Refresh.',
            'Added eslint-plugin-react-refresh to ESLint.',
        ],
        fixedChanges: [
            'Addressed ESLint warnings.',
            'Fixed scrolling issues on mobile devices.',
        ],
    },
    {
        version: '2.0.0',
        date: '2024-08-18',
        newChanges: [
            'Introduced a 401 error page.',
            'Added useObjectAGIRouteParameter.tsx for route parameter management.',
            'Included a copy button in ObjectAGIHighlight.',
            'Improved Icon List page with auto-copy icon names on click.',
            'Integrated PageBreadcrumb component across apps and pages.',
            'Automated route configuration, removing manual imports in routesConfig.tsx.',
            'Added ObjectAGITabs and ObjectAGITab for enhanced tab styling.',
            'Refined theme styles for modern enterprise use.',
            'Updated default theme color palette.',
            'Introduced LightDarkModeToggle component.',
            'Relocated and restyled User Menu to NavigationBar footer.',
            'Enhanced tailwindconfig.js for customization.',
            'Adjusted default font and icon sizes.',
            'Updated Heroicons SVGs to the latest version.',
            'Simplified ObjectAGISettings with ObjectAGILayoutConfig components and added number input validation for layoutConfig.containerWidth.',
            'Boosted application performance.',
            'Updated all dependencies.',
        ],
        fixedChanges: [
            'Fixed JWT SignIn/SignUp form error handling.',
            'Enhanced mobile styles application-wide.',
            'Improved RTL support with multiple fixes.',
        ],
        breakingChanges: [
            'Renamed *Config.tsx files to *Route.tsx.',
            'Removed @history package.',
            'Updated router to support React Router v6 data APIs.',
        ],
        notes: (
            <div className="text-base p-6 border-2 border-red-500 rounded-xl w-full max-w-2xl mt-10 mb-6">
                <ul className="list-disc">
                    <Typography component="li" className="leading-[2]">
                        The routing system now supports React Router v6’s new data APIs.
                    </Typography>
                    <Typography component="li" className="leading-[2]">
                        All *Config.tsx files renamed to *Route.tsx.
                    </Typography>
                    <Typography component="li" className="leading-[2]">
                        Manual route imports in routesConfig.tsx are no longer required.
                    </Typography>
                    <Typography component="li" className="leading-[2]">
                        See <Link to="/documentation/configuration/routing">Routing documentation</Link> for details.
                    </Typography>
                </ul>
            </div>
        ),
    },
];

export default changelogData;