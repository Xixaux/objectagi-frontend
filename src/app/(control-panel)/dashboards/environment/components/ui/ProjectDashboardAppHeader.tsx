import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CubeIcon, Cog6ToothIcon, BellIcon } from '@heroicons/react/24/outline';
import { darken } from '@mui/material/styles';
import useUser from '@auth/useUser';

/**
 * The ProjectDashboardAppHeader page.
 */
function ProjectDashboardAppHeader() {
  const { data: user, isGuest } = useUser();

return (
  <div className="flex flex-auto flex-col px-4 pt-4 sm:px-8">
    <div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex flex-auto items-center gap-2">
        <Avatar
          sx={(theme) => ({
            background: darken(theme.palette.background.default, 0.05),
            color: theme.palette.text.secondary,
          })}
          className="h-12 w-12 shrink-0"
          alt="user photo"
          src={user?.photoURL}
        >
          {user?.displayName?.[0]}
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <Typography
            // Using direct rem values via Tailwind arbitrary properties
            className="truncate text-[1.25rem] leading-7 font-semibold tracking-tight md:text-[1.875rem] md:leading-[1.375]"
          >
            {isGuest ? 'Hi Guest!' : `Welcome back, ${user?.displayName || user?.email}!`}
          </Typography>
          <div className="flex items-center gap-1">
            <BellIcon className="h-5 w-5 text-action" /> 
            <Typography 
              className="truncate text-[0.875rem]" 
              color="text.secondary"
            >
              Your environment is stable and there are no critical issues.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default ProjectDashboardAppHeader;