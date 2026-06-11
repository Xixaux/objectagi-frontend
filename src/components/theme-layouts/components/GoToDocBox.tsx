import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Link from '@objectagi/core/Link'; 
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';

// Define the public path for the SVG
const OnlineLearningSvgPath = '/assets/images/left-menu-documentation/online-learning.svg';

type GoToDocBoxProps = {
    className?: string;
};

function GoToDocBox(props: GoToDocBoxProps) {
    const { className } = props;
    const documentationUrl = "/documentation";

    return (
        <Box
            component={Link}
            to={documentationUrl}
            // Adjusted className to ensure content is centered within the Box
            className={clsx('documentation-hero flex flex-col items-center justify-center px-4 py-3 gap-4', className)}
            sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(200, 200, 255, 0.2))',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                borderWidth: 0,
                boxShadow: 'none', 
                transition: 'all 0.3s ease-in-out',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 'none', 
                },
                '& a': {
                    textDecoration: 'none',
                    color: 'inherit',
                }
            }}
        >
            {/* New SVG Integration */}
            <Box
                component="img"
                src={OnlineLearningSvgPath}
                alt="Online Learning Icon"
                sx={{
                    width: '128px',
                    height: '128px',
                    flexShrink: 0,
                    // Ensure the image itself is centered, though flex centering on the parent Box is primary
                    display: 'block', 
                }}
            />
            
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                    className="flex items-center gap-2 truncate"
                    component="span" 
                    color="primary"
                    sx={{
                        fontWeight: 300,
                        fontSize: '0.75rem',
                        transition: 'color 0.2s ease-in-out',
                        opacity: 0, 
                        height: 0,
                        overflow: 'hidden',
                        display: 'none', 
                    }}
                >
                </Typography>
            </Box>
        </Box>
    );
}

export default GoToDocBox;