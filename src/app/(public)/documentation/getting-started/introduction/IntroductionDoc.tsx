import Typography from '@mui/material/Typography';

/**
 * Introduction Doc
 * This document provides information on how to use ObjectAGI React.
 */
function IntroductionDoc() {
    return (
        <>
            <Typography
                variant="h4"
                className="mb-10 font-bold"
            >
                Introduction
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                This iteration of ObjectAGI is <i>NOT</i> a conventional admin template; it’s a React application crafted entirely in
                JavaScript, free from any jQuery dependencies.
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React serves as an excellent resource for mastering React, but it demands at least a basic
                understanding of React and Redux to navigate its source code effectively.
            </Typography>
            <Typography
                className="mb-8"
                component="p"
            >
                Below is a compilation of the core libraries, design guidelines, and coding standards utilized in
                ObjectAGI React:
            </Typography>
            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                Google's Material Design
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                All libraries and custom components adhere to{' '}
                <a
                    href="https://www.google.com/design/spec/material-design/introduction.html"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    Google's Material Design Specifications.
                </a>
            </Typography>
            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                React
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                <a
                    href="https://reactjs.org/"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    React
                </a>{' '}
                forms the foundation of our template. If you’re unfamiliar with React or its usage, we highly recommend
                exploring it before engaging with ObjectAGI.
            </Typography>
            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                Material-UI
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                <a
                    href="https://mui.com"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    Material-UI
                </a>{' '}
                is a React UI library that brings Google’s Material Design principles to life.
            </Typography>
            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                TailwindCSS
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                <a
                    href="https://tailwindcss.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    TailwindCSS
                </a>{' '}
                serves as the backbone of our styling system, offering utility classes for nearly every available CSS rule.
            </Typography>
            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                Next.js App Router
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                <a
                    href="https://nextjs.org/docs/app"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    Next.js App Router
                </a>{' '}
                is a robust routing framework for React applications. Built on React Server Components, it supports a file-system-based router with features like layouts, nested routing, loading states, and error handling. The App Router empowers developers to build dynamic, interactive web applications with enhanced performance and a superior development experience.
            </Typography>
        </>
    );
}

export default IntroductionDoc;