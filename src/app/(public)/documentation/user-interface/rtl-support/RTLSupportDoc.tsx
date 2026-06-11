import ObjectAGIHighlight from '@objectagi/core/ObjectAGIHighlight';
import Typography from '@mui/material/Typography';
import Link from '@objectagi/core/Link';

/**
 * RTL Support Documentation
 * This guide details how to implement RTL support in your project.
 */
function RTLSupportDoc() {
    return (
        <>
            <Typography
                variant="h4"
                className="mb-10 font-bold"
            >
                RTL Support
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React enables support for Right-to-Left languages, including Arabic, Persian, Hebrew, and others.
            </Typography>

            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                Development
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                We utilized{' '}
                <a
                    href="https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    TailwindCSS's RTL and LTR modifiers
                </a>{' '}
                along with the styles components plugin{' '}
                <a
                    href="https://github.com/styled-components/stylis-plugin-rtl"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <code>stylis-plugin-rtl</code>
                </a>{' '}
                to enable RTL functionality in ObjectAGI React.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                <a
                    href="https://github.com/alitaheri/jss-rtl"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <code>stylis-plugin-rtl</code>
                </a>{' '}
                facilitates Right-to-Left support by mirroring JSS styles along the x-axis. This allows you to develop your application in a Left-to-Right format and convert it to Right-to-Left using the plugin, or vice versa.
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                <a
                    href="https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <code>TailwindCSS's RTL and LTR modifiers</code>
                </a>{' '}
                provide a tailored direction variant for your Tailwind project, enabling custom CSS rules for both LTR and RTL layouts. For example:
            </Typography>

            <ObjectAGIHighlight
                component="pre"
                className="language-jsx mb-6"
            >
                {`
            <div class="text-green-500 text-2xl ltr:pl-4 rtl:pr-4">
                Hello, world.
            </div>
        `}
            </ObjectAGIHighlight>

            <Typography
                className="text-2xl mt-5 mb-2.5 font-bold"
                variant="h5"
            >
                Configuration
            </Typography>

            <Typography
                className="mb-4"
                component="p"
            >
                The theme's text direction is determined by the selected theme language, eliminating the need to manually set a direction value. Refer to{' '}
                <Link
                    className="link mx-2"
                    to="/documentation/development/multi-language"
                >
                    Multi Language configuration
                </Link>
                for details.
            </Typography>
        </>
    );
}

export default RTLSupportDoc;