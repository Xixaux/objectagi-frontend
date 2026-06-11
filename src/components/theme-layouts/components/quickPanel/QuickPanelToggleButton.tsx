import { useAppDispatch } from 'src/store/hooks';
import { toggleQuickPanel } from './quickPanelSlice';

// Keep the import for the slice in case you still need the action elsewhere

type QuickPanelToggleButtonProps = {
    className?: string;
    children?: React.ReactNode;
};

/**
 * QuickPanelToggleButton has been disabled/removed.
 * It no longer renders anything and does not toggle the panel.
 */
function QuickPanelToggleButton(_props: QuickPanelToggleButtonProps) {
    // Intentionally returns null → completely removed from DOM, not clickable
    return null;
}

export default QuickPanelToggleButton;