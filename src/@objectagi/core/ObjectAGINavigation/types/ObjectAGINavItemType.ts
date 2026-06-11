import { SxProps } from '@mui/system';
import { ObjectAGINavBadgeType } from './ObjectAGINavBadgeType';

/**
 * ObjectAGINavItemType
 * A type for ObjectAGI navigation item and its properties.
 */
export type ObjectAGINavItemType = {
	id: string;
	title?: string;
	translate?: string;
	auth?: string[] | string;
	subtitle?: string;
	icon?: string;
	iconClass?: string;
	url?: string;
	target?: string;
	type?: string;
	sx?: SxProps;
	disabled?: boolean;
	active?: boolean;
	exact?: boolean;
	end?: boolean;
	badge?: ObjectAGINavBadgeType;
	children?: ObjectAGINavItemType[];
	hasPermission?: boolean;
};

export type ObjectAGIFlatNavItemType = Omit<ObjectAGINavItemType, 'children' | 'sx'> & { children?: string[]; order: string };
