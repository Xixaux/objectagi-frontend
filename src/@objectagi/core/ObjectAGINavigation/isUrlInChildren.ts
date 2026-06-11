import { Pathname } from 'history';
import { ObjectAGINavItemType } from './types/ObjectAGINavItemType';

/**
 * Determines whether a given URL is present in the parent's child list or not.
 */
const isUrlInChildren = (parent: ObjectAGINavItemType, url: Pathname) => {
	if (!parent.children) {
		return false;
	}

	for (const navItem of parent.children) {
		if (navItem.children) {
			if (isUrlInChildren(navItem, url)) {
				return true;
			}
		}

		if (navItem.url === url || url.includes(navItem.url)) {
			return true;
		}
	}

	return false;
};

export default isUrlInChildren;
