import _ from 'lodash';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import usePathname from '@objectagi/hooks/usePathname';
import SettingsAppNavigation from './SettingsAppNavigation';
import useThemeMediaQuery from '../../../../@objectagi/hooks/useThemeMediaQuery';

type SettingsAppHeaderProps = {
	className?: string;
	onSetSidebarOpen: (open: boolean) => void;
};

function SettingsAppHeader(props: SettingsAppHeaderProps) {
	const { className, onSetSidebarOpen } = props;
	const pathname = usePathname();
	const currentNavigation = _.find(SettingsAppNavigation.children, { url: pathname });
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<div className={clsx('flex space-x-3', className)}>
			{isMobile && (
				<IconButton
					className="border border-divider"
					onClick={() => onSetSidebarOpen(true)}
					aria-label="open left sidebar"
				>
					<ObjectAGISvgIcon>heroicons-outline:bars-3</ObjectAGISvgIcon>
				</IconButton>
			)}

			<div>
				<PageBreadcrumb className="mb-2" />

				<Typography className=" text-3xl font-bold leading-none tracking-tight lg:ml-0">
					{currentNavigation?.title}
				</Typography>
			</div>
		</div>
	);
}

export default SettingsAppHeader;
