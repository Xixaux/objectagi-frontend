import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import clsx from 'clsx';
import { useCallback, useEffect, useImperativeHandle, useState, ReactNode } from 'react';
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer/SwipeableDrawer';
import ObjectAGIPageCardedSidebarContent from './ObjectAGIPageCardedSidebarContent';
import useThemeMediaQuery from '../../hooks/useThemeMediaQuery';

/**
 * Props for the ObjectAGIPageCardedSidebar component.
 */
type ObjectAGIPageCardedSidebarProps = {
	open?: boolean;
	position?: SwipeableDrawerProps['anchor'];
	variant?: SwipeableDrawerProps['variant'];
	onClose?: () => void;
	children?: ReactNode;
	ref?: React.RefObject<{ toggleSidebar: (T: boolean) => void }>;
};

/**
 * The ObjectAGIPageCardedSidebar component is a sidebar for the ObjectAGIPageCarded component.
 */
function ObjectAGIPageCardedSidebar(props: ObjectAGIPageCardedSidebarProps) {
	const { open = true, position, variant, onClose = () => {}, ref } = props;

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [isOpen, setIsOpen] = useState(open);

	const handleToggleDrawer = useCallback((val: boolean) => {
		setIsOpen(val);
	}, []);

	useImperativeHandle(ref, () => ({
		toggleSidebar: handleToggleDrawer
	}));

	useEffect(() => {
		handleToggleDrawer(open);
	}, [handleToggleDrawer, open]);

	return (
		<>
			{((variant === 'permanent' && isMobile) || variant !== 'permanent') && (
				<SwipeableDrawer
					variant="temporary"
					anchor={position}
					open={isOpen}
					onOpen={() => {}}
					onClose={() => onClose()}
					disableSwipeToOpen
					classes={{
						root: clsx('ObjectAGIPageCarded-sidebarWrapper', variant),
						paper: clsx(
							'ObjectAGIPageCarded-sidebar',
							variant,
							position === 'left' ? 'ObjectAGIPageCarded-leftSidebar' : 'ObjectAGIPageCarded-rightSidebar'
						)
					}}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
					BackdropProps={{
						classes: {
							root: 'ObjectAGIPageCarded-backdrop'
						}
					}}
					style={{ position: 'absolute' }}
				>
					<ObjectAGIPageCardedSidebarContent {...props} />
				</SwipeableDrawer>
			)}
			{variant === 'permanent' && !isMobile && (
				<Drawer
					variant="permanent"
					anchor={position}
					className={clsx(
						'ObjectAGIPageCarded-sidebarWrapper',
						variant,
						isOpen ? 'opened' : 'closed',
						position === 'left' ? 'ObjectAGIPageCarded-leftSidebar' : 'ObjectAGIPageCarded-rightSidebar'
					)}
					open={isOpen}
					onClose={onClose}
					classes={{
						paper: clsx('ObjectAGIPageCarded-sidebar', variant)
					}}
				>
					<ObjectAGIPageCardedSidebarContent {...props} />
				</Drawer>
			)}
		</>
	);
}

export default ObjectAGIPageCardedSidebar;
