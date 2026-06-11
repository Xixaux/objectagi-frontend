import IconButton from '@mui/material/IconButton';
import { useAppDispatch } from 'src/store/hooks';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import { toggleChatPanel } from './messengerPanelSlice';

type ChatPanelToggleButtonProps = {
	children?: React.ReactNode;
};

/**
 * The chat panel toggle button.
 */
function MessengerPanelToggleButton(props: ChatPanelToggleButtonProps) {
	const { children = <ObjectAGISvgIcon>heroicons-outline:chat-bubble-left-right</ObjectAGISvgIcon> } = props;
	const dispatch = useAppDispatch();

	return <IconButton onClick={() => dispatch(toggleChatPanel())}>{children}</IconButton>;
}

export default MessengerPanelToggleButton;
