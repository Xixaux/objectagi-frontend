'use client';

import NavLinkAdapter from '@objectagi/core/NavLinkAdapter';
import { styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import { ListItemButton, ListItemButtonProps } from '@mui/material';
import { WithRouterProps } from '@objectagi/core/withRouter/withRouter';
import ObjectAGINavBadge from '../../ObjectAGINavBadge';
import ObjectAGISvgIcon from '../../../ObjectAGISvgIcon';
import { ObjectAGINavItemComponentProps } from '../../ObjectAGINavItem';

const Root = styled(ListItemButton)<ListItemButtonProps>(({ theme }) => ({
	color: theme.palette.text.primary,
	textDecoration: 'none!important',
	minHeight: 48,
	'&.active': {
		backgroundColor: `${theme.palette.secondary.main}!important`,
		color: `${theme.palette.secondary.contrastText}!important`,
		'& .objectagi-list-item-text-primary': {
			color: 'inherit'
		},
		'& .objectagi-list-item-icon': {
			color: 'inherit'
		}
	},
	'& .objectagi-list-item-icon': {},
	'& .objectagi-list-item-text': {
		padding: '0 0 0 16px'
	}
}));

type ObjectAGINavHorizontalItemProps = ObjectAGINavItemComponentProps & WithRouterProps;

/**
 * ObjectAGINavHorizontalItem is a component responsible for rendering the navigation element in the horizontal menu in the ObjectAGI theme.
 */
function ObjectAGINavHorizontalItem(props: ObjectAGINavHorizontalItemProps) {
	const { item, checkPermission } = props;
	const component = item.url ? NavLinkAdapter : 'li';

	const itemProps = useMemo(
		() => ({
			...(component !== 'li' && {
				disabled: item.disabled,
				to: item.url || '',
				end: item.end,
				role: 'button',
				exact: item?.exact
			})
		}),
		[item, component]
	);

	const memoizedContent = useMemo(
		() => (
			<Root
				component={component}
				className={clsx('objectagi-list-item', item.active && 'active')}
				sx={item.sx}
				{...itemProps}
			>
				{item.icon && (
					<ObjectAGISvgIcon
						className={clsx('objectagi-list-item-icon shrink-0', item.iconClass)}
						color="action"
					>
						{item.icon}
					</ObjectAGISvgIcon>
				)}

				<ListItemText
					className="objectagi-list-item-text"
					primary={item.title}
					classes={{ primary: 'text-md objectagi-list-item-text-primary truncate' }}
				/>

				{item.badge && (
					<ObjectAGINavBadge
						className="ltr:ml-2 rtl:mr-2"
						badge={item.badge}
					/>
				)}
			</Root>
		),
		[component, item.active, item.badge, item.icon, item.iconClass, item.sx, item.title, itemProps]
	);

	if (checkPermission && !item?.hasPermission) {
		return null;
	}

	return memoizedContent;
}

const NavHorizontalItemWithMemo = memo(ObjectAGINavHorizontalItem);

export default NavHorizontalItemWithMemo;
