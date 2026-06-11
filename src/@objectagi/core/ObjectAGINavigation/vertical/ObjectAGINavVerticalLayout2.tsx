import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import ObjectAGINavVerticalTab from './types/ObjectAGINavVerticalTab';
import { ObjectAGINavigationProps } from '../ObjectAGINavigation';
import { ObjectAGINavItemType } from '../types/ObjectAGINavItemType';

const StyledList = styled(List)(({ theme }) => ({
	'& .objectagi-list-item': {
		'&:hover': {
			backgroundColor: 'rgba(0,0,0,.04)',
			...theme.applyStyles('dark', {
				backgroundColor: 'rgba(255, 255, 255, 0.05)'
			})
		},
		'&:focus:not(.active)': {
			backgroundColor: 'rgba(0,0,0,.05)',
			...theme.applyStyles('dark', {
				backgroundColor: 'rgba(255, 255, 255, 0.06)'
			})
		}
	},
	'& .objectagi-list-item-text-primary': {
		lineHeight: '1'
	},
	'&.active-square-list': {
		'& .objectagi-list-item, & .active.objectagi-list-item': {
			width: '100%',
			borderRadius: '0'
		}
	},
	'&.dense': {}
}));

/**
 * ObjectAGINavVerticalLayout2 component represents a vertical navigation layout with material UI elements.
 * It displays the navigation object in the structured vertical menu and allows to handle onClick events for each navigation item.
 */
function ObjectAGINavVerticalLayout2(props: ObjectAGINavigationProps) {
	const { navigation, active, dense, className, onItemClick, firstLevel, selectedId, checkPermission } = props;

	function handleItemClick(item: ObjectAGINavItemType) {
		onItemClick?.(item);
	}

	return (
		<StyledList
			className={clsx(
				'navigation flex flex-col items-center whitespace-nowrap',
				`active-${active}-list`,
				dense && 'dense',
				className
			)}
		>
			{navigation.map((_item) => (
				<ObjectAGINavVerticalTab
					key={_item.id}
					type={`vertical-${_item.type}`}
					item={_item}
					nestedLevel={0}
					onItemClick={handleItemClick}
					firstLevel={firstLevel}
					dense={dense}
					selectedId={selectedId}
					checkPermission={checkPermission}
				/>
			))}
		</StyledList>
	);
}

export default ObjectAGINavVerticalLayout2;
