import ObjectAGINavigation from '@objectagi/core/ObjectAGINavigation/ObjectAGINavigation';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import clsx from 'clsx';
import useThemeMediaQuery from '@objectagi/hooks/useThemeMediaQuery';
import SettingsAppNavigation from './SettingsAppNavigation';

const Root = styled('div')(({ theme }) => ({
	'&  .navigation': {
		padding: `${0}!important`,
		borderTop: `1px solid ${theme.palette.divider}`
	},
	'&  .objectagi-list-item': {
		padding: '20px 32px',
		margin: 0,
		borderRadius: 0,
		alignItems: 'start',
		borderBottom: 0,
		'&.active': {
			backgroundColor: `${alpha(theme.palette.secondary.main, 0.1)}!important`,
			'&  .objectagi-list-item-icon': {
				color: `${theme.palette.secondary.main}!important`
			},
			'&  .objectagi-list-item-text-primary': {
				color: `${theme.palette.secondary.main}!important`
			}
		}
	},
	'&  .objectagi-list-item-text-primary': {
		fontSize: '13px!important',
		fontWeight: '500!important'
	},
	'&  .objectagi-list-item-text-secondary': {
		fontSize: '12px!important',
		whiteSpace: 'normal!important',
		fontWeight: '400!important'
	}
}));

type SettingsAppSidebarContentProps = {
	className?: string;
	onSetSidebarOpen: (open: boolean) => void;
};

function SettingsAppSidebarContent(props: SettingsAppSidebarContentProps) {
	const { className, onSetSidebarOpen } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<Root>
			<div className={clsx('m-8 mr-6 flex items-center justify-between sm:my-10', className)}>
				<Typography className="text-4xl font-extrabold leading-none tracking-tight"> Settings</Typography>
				{isMobile && (
					<IconButton
						onClick={() => onSetSidebarOpen(false)}
						aria-label="close left sidebar"
						size="small"
					>
						<ObjectAGISvgIcon>heroicons-outline:x-mark</ObjectAGISvgIcon>
					</IconButton>
				)}
			</div>
			<ObjectAGINavigation navigation={SettingsAppNavigation.children} />
		</Root>
	);
}

export default SettingsAppSidebarContent;
