import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';

type NotificationIconProps = {
	value?: string;
};

/**
 * The notification icon.
 */
function NotificationIcon(props: NotificationIconProps) {
	const { value } = props;

	switch (value) {
		case 'error': {
			return (
				<ObjectAGISvgIcon
					className="mr-2 opacity-75"
					color="inherit"
					size={20}
				>
					heroicons-outline:minus-circle
				</ObjectAGISvgIcon>
			);
		}
		case 'success': {
			return (
				<ObjectAGISvgIcon
					className="mr-2 opacity-75"
					color="inherit"
					size={20}
				>
					heroicons-outline:check-circle
				</ObjectAGISvgIcon>
			);
		}
		case 'warning': {
			return (
				<ObjectAGISvgIcon
					className="mr-2 opacity-75"
					color="inherit"
					size={20}
				>
					heroicons-outline:exclamation-circle
				</ObjectAGISvgIcon>
			);
		}
		case 'info': {
			return (
				<ObjectAGISvgIcon
					className="mr-2 opacity-75"
					color="inherit"
					size={20}
				>
					heroicons-outline:information-circle
				</ObjectAGISvgIcon>
			);
		}
		default: {
			return null;
		}
	}
}

export default NotificationIcon;
