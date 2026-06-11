import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const Root = styled('div')(({ theme }) => ({
  '& > .logo-icon': {
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  '& > .badge': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

const ObjectText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? '#222222' : '#222222',
  fontSize: '1.5rem',
  fontWeight: 600,
  letterSpacing: '0.025em',
  lineHeight: 1,
  '&.logo-text .MuiTypography-root, &.logo-text > *, &.MuiTypography-root, &': {
    color: theme.palette.mode === 'light' ? '#222222' : '#222222 !important',
  },
}));

const AGIText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? '#82d7f7' : '#5ba8d6',
  fontSize: '13.6px',
  fontWeight: 600,
  letterSpacing: '0.025em',
  lineHeight: 1,
}));

function Logo() {
  return (
    <Root className="flex flex-1 items-center space-x-3">
      <div className="flex flex-1 items-center space-x-2 px-2.5">
        <img
          className="logo-icon h-8 w-8"
          src="/assets/images/logo/logo.svg"
          alt="logo"
        />
        <div className="logo-text flex flex-col flex-auto gap-0.5">
          <ObjectText>Object</ObjectText>
          <AGIText>AGI</AGIText>
        </div>
      </div>
    </Root>
  );
}

export default Logo;