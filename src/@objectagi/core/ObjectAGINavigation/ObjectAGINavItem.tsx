import { ObjectAGINavItemType } from './types/ObjectAGINavItemType';
import components from './utils/components';

export type ObjectAGINavItemComponentProps = {
	type: string;
	item: ObjectAGINavItemType;
	dense?: boolean;
	nestedLevel?: number;
	onItemClick?: (T: ObjectAGINavItemType) => void;
	checkPermission?: boolean;
};

/**
Component to render NavItem depending on its type.
*/
function ObjectAGINavItem(props: ObjectAGINavItemComponentProps) {
	const { type } = props;

	const C = components[type];

	return C ? <C {...(props as object)} /> : null;
}

export default ObjectAGINavItem;
