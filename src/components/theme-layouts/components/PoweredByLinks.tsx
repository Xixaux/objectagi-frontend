import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Link from '@objectagi/core/Link';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';

type GoToDocBoxProps = {
    className?: string;
};

function GoToDocBox(props: GoToDocBoxProps) {
    const { className } = props;
    return (
        <Box
            className={clsx('documentation-hero flex flex-col px-4 py-3 gap-3', className)}
            sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(200, 200, 255, 0.2))',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                borderWidth: 0,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease-in-out',
                position: 'relative', // Allow absolute positioning of SVG
                pl: 8, // Add padding-left to avoid SVG overlap
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                },
            }}
        >
            {/* SVG positioned left-middle */}
            <Box
                component="svg"
                sx={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '24px',
                    height: '24px',
                }}
                id="Layer_1"
                height="512"
                viewBox="0 0 64 64"
                width="512"
                xmlns="http://www.w3.org/2000/svg"
                data-name="Layer 1"
            >
                <path
                    d="m54.3406 49h-44.6812a1 1 0 0 0 -.91915.60608l-5.14286 12a1 1 0 0 0 .91915 1.39392h54.96692a1 1 0 0 0 .91915-1.39392l-5.14286-12a1 1 0 0 0 -.91915-.60608z"
                    fill="#637e99"
                />
                <path d="m53 52h-42l-3 8h48z" fill="#e3eef7" />
                <path d="m49 17h5v5h-5z" fill="#ffdc7d" />
                <path d="m46 31h6v6h-6z" fill="#d96c6c" />
                <path d="m10 8h5v5h-5z" fill="#000000ff" />
                <path d="m2 24h8v8h-8z" fill="#000000ff" />
                <path d="m47 6h8v8h-8z" fill="#ffdc7d" />
                <path
                    d="m7 17h10v10h-10z"
                    fill="#57bf89"
                    transform="matrix(0 1 -1 0 34 10)"
                />
                <path d="m51 10h10v10h-10z" fill="#f2cb61" />
                <path d="m28 1h8v8h-8z" fill="#c66" />
                <path
                    d="m40.65228 22.18182a.91031.91031 0 0 1 -.85876-.65643 8.11585 8.11585 0 0 0 -.53333-1.28387.91109.91109 0 0 1 .14283-1.07325l.95367-.95367-2.57129-2.57135-.95367.95373a.91111.91111 0 0 1 -1.07325.14283 8.11022 8.11022 0 0 0 -1.28387-.53333.91031.91031 0 0 1 -.65643-.85876v-1.34772h-3.63636v1.34772a.91031.91031 0 0 1 -.65643.85876 8.11022 8.11022 0 0 0 -1.28387.53333.91111.91111 0 0 1 -1.07325-.14283l-.95367-.95373-2.57129 2.57135.95367.95367a.91109.91109 0 0 1 .14283 1.07325 8.11585 8.11585 0 0 0 -.53333 1.28387.91031.91031 0 0 1 -.85876.65643h-1.34772v3.63636h1.34772a.91031.91031 0 0 1 .85876.65643 8.11819 8.11819 0 0 0 .53333 1.28387.91111.91111 0 0 1 -.14283 1.07325l-.95367.95367 2.57129 2.57129.95367-.95367a.91092.91092 0 0 1 1.07325-.14283 8.11561 8.11561 0 0 0 1.28387.53327.91038.91038 0 0 1 .65643.85882v1.34772h3.63636v-1.34772a.91038.91038 0 0 1 .65643-.85882 8.11561 8.11561 0 0 0 1.28387-.53327.91092.91092 0 0 1 1.07325.14283l.95367.95367 2.57129-2.57129-.95367-.95367a.91111.91111 0 0 1 -.14283-1.07325 8.11819 8.11819 0 0 0 .53333-1.28387.91031.91031 0 0 1 .85876-.65643h1.34772v-3.63636zm-8.65228 6.81818a5 5 0 1 1 5-5 5 5 0 0 1 -5 5z"
                    fill="#5a6d80"
                />
                <g fill="#88c2f7">
                    <path d="m29.25 38h1.5v7h-1.5z" />
                    <path d="m29.25 47h1.5v2h-1.5z" />
                    <path d="m29.25 51h1.5v5h-1.5z" />
                    <path d="m33.25 38h1.5v7h-1.5z" />
                    <path d="m33.25 47h1.5v8h-1.5z" />
                    <path d="m37.25 35h1.5v11h-1.5z" />
                    <path d="m25.25 48h1.5v2h-1.5z" />
                    <path d="m25.25 35h1.5v10h-1.5z" />
                    <path d="m37.25 48h1.5v2h-1.5z" />
                </g>
            </Box>
            <Typography
                className="truncate"
                sx={{
                    color: '#1a1a1a',
                    fontWeight: 600,
                    fontSize: '1rem',
                    lineHeight: 1.5,
                }}
            >
                Flatten the learning curve
            </Typography>
            <Typography
                className="flex items-center gap-2 truncate"
                component={Link}
                to="/documentation"
                color="primary"
                sx={{
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                        color: 'primary.dark',
                    },
                }}
            >
                View documentation
                <ObjectAGISvgIcon
                    size={18}
                    sx={{
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': { transform: 'translateX(4px)' },
                    }}
                >
                    heroicons-outline:arrow-right
                </ObjectAGISvgIcon>
            </Typography>
        </Box>
    );
}

export default GoToDocBox;