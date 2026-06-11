import IconButton from '@mui/material/IconButton';
import { useAppDispatch } from 'src/store/hooks';
import _ from 'lodash';
import useThemeMediaQuery from '@objectagi/hooks/useThemeMediaQuery';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import clsx from 'clsx';
import { IconButtonProps } from '@mui/material/IconButton/IconButton';
import useObjectAGILayoutSettings from '@objectagi/core/ObjectAGILayout/useObjectAGILayoutSettings';
import useObjectAGISettings from '@objectagi/core/ObjectAGISettings/hooks/useObjectAGISettings';
import { navbarToggle, navbarToggleMobile } from './navbarSlice';

export type NavbarToggleButtonProps = IconButtonProps;

/**
 * The navbar toggle button.
 */
function NavbarToggleButton(props: NavbarToggleButtonProps) {
	const {
		className = '',
		children = (
			<ObjectAGISvgIcon
				size={22}
				color="action"
			>
				heroicons-outline:bars-3
			</ObjectAGISvgIcon>
		),
		...rest
	} = props;

	const dispatch = useAppDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { config } = useObjectAGILayoutSettings();
	const { setSettings } = useObjectAGISettings();

	return (
		<IconButton
			onClick={() => {
				if (isMobile) {
					dispatch(navbarToggleMobile());
				} else if (config?.navbar?.style === 'style-2') {
					setSettings(_.set({}, 'layout.config.navbar.folded', !config?.navbar?.folded));
				} else {
					dispatch(navbarToggle());
				}
			}}
			{...rest}
			className={clsx('border border-divider', className)}
		>
			{children}
		</IconButton>
	);
}

export default NavbarToggleButton;
