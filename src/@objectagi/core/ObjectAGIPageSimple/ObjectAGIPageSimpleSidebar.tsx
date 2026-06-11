import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import clsx from 'clsx';
import { ReactNode, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer/SwipeableDrawer';
import ObjectAGIPageSimpleSidebarContent from './ObjectAGIPageSimpleSidebarContent';
import useThemeMediaQuery from '../../hooks/useThemeMediaQuery';

/**
 * Props for the ObjectAGIPageSimpleSidebar component.
 */
type ObjectAGIPageSimpleSidebarProps = {
	open?: boolean;
	position?: SwipeableDrawerProps['anchor'];
	variant?: SwipeableDrawerProps['variant'];
	onClose?: () => void;
	children?: ReactNode;
	ref?: React.RefObject<{ toggleSidebar: (T: boolean) => void }>;
};

/**
 * The ObjectAGIPageSimpleSidebar component.
 */
function ObjectAGIPageSimpleSidebar(props: ObjectAGIPageSimpleSidebarProps) {
	const { open = true, position, variant, onClose = () => {}, ref } = props;

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [isOpen, setIsOpen] = useState(open);

	useImperativeHandle(ref, () => ({
		toggleSidebar: handleToggleDrawer
	}));

	const handleToggleDrawer = useCallback((val: boolean) => {
		setIsOpen(val);
	}, []);

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
						root: clsx('ObjectAGIPageSimple-sidebarWrapper', variant),
						paper: clsx(
							'ObjectAGIPageSimple-sidebar',
							variant,
							position === 'left' ? 'ObjectAGIPageSimple-leftSidebar' : 'ObjectAGIPageSimple-rightSidebar',
							'max-w-full'
						)
					}}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
					// container={rootRef.current}
					BackdropProps={{
						classes: {
							root: 'ObjectAGIPageSimple-backdrop'
						}
					}}
					style={{ position: 'absolute' }}
				>
					<ObjectAGIPageSimpleSidebarContent {...props} />
				</SwipeableDrawer>
			)}
			{variant === 'permanent' && !isMobile && (
				<Drawer
					variant="permanent"
					anchor={position}
					className={clsx(
						'ObjectAGIPageSimple-sidebarWrapper',
						variant,
						isOpen ? 'opened' : 'closed',
						position === 'left' ? 'ObjectAGIPageSimple-leftSidebar' : 'ObjectAGIPageSimple-rightSidebar'
					)}
					open={isOpen}
					onClose={onClose}
					classes={{
						paper: clsx('ObjectAGIPageSimple-sidebar border-0', variant)
					}}
				>
					<ObjectAGIPageSimpleSidebarContent {...props} />
				</Drawer>
			)}
		</>
	);
}

export default ObjectAGIPageSimpleSidebar;
