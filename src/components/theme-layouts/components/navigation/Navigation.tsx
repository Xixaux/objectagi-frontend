'use client';

import ObjectAGINavigation from '@objectagi/core/ObjectAGINavigation';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useAppDispatch } from 'src/store/hooks';
import useThemeMediaQuery from '@objectagi/hooks/useThemeMediaQuery';
import { ObjectAGINavigationProps } from '@objectagi/core/ObjectAGINavigation/ObjectAGINavigation';
import { navbarCloseMobile } from '../navbar/navbarSlice';
import useNavigation from './hooks/useNavigation';

/**
 * Navigation
 */

type NavigationProps = Partial<ObjectAGINavigationProps>;

function Navigation(props: NavigationProps) {
	const { className = '', layout = 'vertical', dense, active } = props;
	const { navigation } = useNavigation();

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const dispatch = useAppDispatch();

	return useMemo(() => {
		function handleItemClick() {
			if (isMobile) {
				dispatch(navbarCloseMobile());
			}
		}

		return (
			<ObjectAGINavigation
				className={clsx('navigation flex-1', className)}
				navigation={navigation}
				layout={layout}
				dense={dense}
				active={active}
				onItemClick={handleItemClick}
				checkPermission
			/>
		);
	}, [dispatch, isMobile, navigation, active, className, dense, layout]);
}

export default Navigation;
