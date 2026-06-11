import { amber, blue, green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { hideMessage, selectObjectAGIMessageOptions, selectObjectAGIMessageState } from '@objectagi/core/ObjectAGIMessage/objectagiMessageSlice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import ObjectAGISvgIcon from '../ObjectAGISvgIcon';

export type ObjectAGIMessageVariantType = 'success' | 'error' | 'warning' | 'info';

type StyledSnackbarProps = {
	variant?: ObjectAGIMessageVariantType;
};

const StyledSnackbar = styled(Snackbar)<StyledSnackbarProps>(({ theme }) => ({
	'& .ObjectAGIMessage-content': {},
	variants: [
		{
			props: {
				variant: 'success'
			},
			style: {
				'& .ObjectAGIMessage-content': {
					backgroundColor: green[600],
					color: '#FFFFFF'
				}
			}
		},
		{
			props: {
				variant: 'error'
			},
			style: {
				'& .ObjectAGIMessage-content': {
					backgroundColor: theme.palette.error.dark,
					color: theme.palette.getContrastText(theme.palette.error.dark)
				}
			}
		},
		{
			props: {
				variant: 'info'
			},
			style: {
				'& .ObjectAGIMessage-content': {
					backgroundColor: blue[600],
					color: '#FFFFFF'
				}
			}
		},
		{
			props: {
				variant: 'warning'
			},
			style: {
				'& .ObjectAGIMessage-content': {
					backgroundColor: amber[600],
					color: '#FFFFFF'
				}
			}
		}
	]
}));

const variantIcon = {
	success: 'check_circle',
	warning: 'warning',
	error: 'error_outline',
	info: 'info'
};

/**
 * ObjectAGIMessage
 * The ObjectAGIMessage component holds a snackbar that is capable of displaying message with 4 different variant. It uses the @mui/material React packages to create the components.
 */
function ObjectAGIMessage() {
	const dispatch = useAppDispatch();
	const state = useAppSelector(selectObjectAGIMessageState);
	const options = useAppSelector(selectObjectAGIMessageOptions);

	return (
		<StyledSnackbar
			{...options}
			open={state}
			onClose={() => dispatch(hideMessage())}
		>
			<SnackbarContent
				className="ObjectAGIMessage-content"
				message={
					<div className="flex items-center">
						{variantIcon[options.variant] && (
							<ObjectAGISvgIcon color="inherit">{variantIcon[options.variant]}</ObjectAGISvgIcon>
						)}
						<Typography className="mx-2">{options.message}</Typography>
					</div>
				}
				action={[
					<IconButton
						key="close"
						aria-label="Close"
						color="inherit"
						onClick={() => dispatch(hideMessage())}
						size="large"
					>
						<ObjectAGISvgIcon>heroicons-outline:x-mark</ObjectAGISvgIcon>
					</IconButton>
				]}
			/>
		</StyledSnackbar>
	);
}

export default memo(ObjectAGIMessage);
