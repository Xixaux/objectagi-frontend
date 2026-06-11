import _ from 'lodash';
import ObjectAGIUtils from '@objectagi/utils';
import { Notification } from '@/app/(control-panel)/apps/notifications/NotificationApi';

/**
 * The NotificationModel class.
 * Implements NotificationModelProps interface.
 */
function NotificationModel(data: Notification): Notification {
	data = data || {};

	return _.defaults(data, {
		id: ObjectAGIUtils.generateGUID(),
		icon: 'heroicons-solid:star',
		title: '',
		description: '',
		time: new Date().toISOString(),
		read: false,
		variant: 'default'
	}) as Notification;
}

export default NotificationModel;
