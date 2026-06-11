import ObjectAGIScrollbars from '@objectagi/core/ObjectAGIScrollbars';
import IconButton from '@mui/material/IconButton';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import Typography from '@mui/material/Typography';
import ObjectAGIThemeSelector from '@objectagi/core/ObjectAGIThemeSelector/ObjectAGIThemeSelector';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { SwipeableHandlers } from 'react-swipeable';
import themeOptions from 'src/configs/themeOptions';
import { ObjectAGIThemeOption } from '@objectagi/core/ObjectAGIThemeSelector/ThemePreview';
import useUser from '@auth/useUser';
import useObjectAGISettings from '@objectagi/core/ObjectAGISettings/hooks/useObjectAGISettings';

import { ObjectAGISettingsConfigType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';
import { useAppDispatch } from '@/store/hooks';

const StyledDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialog-paper': {
		position: 'fixed',
		width: 380,
		maxWidth: '90vw',
		backgroundColor: theme.palette.background.paper,
		top: 0,
		height: '100%',
		minHeight: '100%',
		bottom: 0,
		right: 0,
		margin: 0,
		zIndex: 1000,
		borderRadius: 0
	}
}));

type TransitionProps = {
	children?: React.ReactElement;
	ref?: React.RefObject<HTMLDivElement>;
};

function Transition(props: TransitionProps) {
	const { children, ref, ...other } = props;

	const theme = useTheme();

	if (!children) {
		return null;
	}

	return (
		<Slide
			direction={theme.direction === 'ltr' ? 'left' : 'right'}
			ref={ref}
			{...other}
		>
			{children}
		</Slide>
	);
}

type ThemesPanelProps = {
	schemesHandlers: SwipeableHandlers;
	onClose: () => void;
	open: boolean;
};

function ThemesPanel(props: ThemesPanelProps) {
	const { schemesHandlers, onClose, open } = props;
	const { setSettings } = useObjectAGISettings();
	const { isGuest, updateUserSettings } = useUser();
	const dispatch = useAppDispatch();

	async function handleThemeSelect(_theme: ObjectAGIThemeOption) {
		const _newSettings = setSettings({ theme: { ..._theme?.section } } as Partial<ObjectAGISettingsConfigType>);

		/**
		 * Updating user settings disabled for demonstration purposes
		 * The request is made to the mock API and will not persist the changes
		 * You can enable it by removing the comment block below when using a real API
		 * */
		/* if (!isGuest) {
			const updatedUserData = await updateUserSettings(_newSettings);

			if (updatedUserData) {
				dispatch(showMessage({ message: 'User settings saved.' }));
			}
		} */
	}

	return (
		<StyledDialog
			TransitionComponent={Transition}
			aria-labelledby="schemes-panel"
			aria-describedby="schemes"
			open={open}
			onClose={onClose}
			BackdropProps={{ invisible: true }}
			classes={{
				paper: 'shadow-lg'
			}}
			{...schemesHandlers}
		>
			<ObjectAGIScrollbars className="p-4 sm:p-6">
				<IconButton
					className="fixed top-0 z-10 ltr:right-0 rtl:left-0"
					onClick={onClose}
					size="large"
				>
					<ObjectAGISvgIcon>heroicons-outline:x-mark</ObjectAGISvgIcon>
				</IconButton>

				<Typography
					className="mb-8"
					variant="h6"
				>
					Headline here
				</Typography>

				<Typography
					className="mb-6 text-justify text-md italic"
					color="text.secondary"
				>
					Content here
				</Typography>

				<ObjectAGIThemeSelector
					options={themeOptions}
					onSelect={handleThemeSelect}
				/>
			</ObjectAGIScrollbars>
		</StyledDialog>
	);
}

export default ThemesPanel;
