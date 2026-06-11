import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { ObjectAGINavItemType } from '../types/ObjectAGINavItemType';

/**
 *  ObjectAGINavItemModel
 *  Constructs a navigation item based on ObjectAGINavItemType
 */
function ObjectAGINavItemModel(data?: PartialDeep<ObjectAGINavItemType>) {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		title: '',
		translate: '',
		auth: null,
		subtitle: '',
		icon: '',
		iconClass: '',
		url: '',
		target: '',
		type: 'item',
		sx: {},
		disabled: false,
		active: false,
		exact: false,
		end: false,
		badge: null,
		children: []
	});
}

export default ObjectAGINavItemModel;
