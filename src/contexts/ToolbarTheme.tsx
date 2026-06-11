import { ThemeProvider } from '@mui/material/styles';
import { useToolbarTheme } from '@objectagi/core/ObjectAGISettings/hooks/objectagiThemeHooks';

type ToolbarThemeProps = {
	children: React.ReactNode;
};

function ToolbarTheme({ children }: ToolbarThemeProps) {
	const toolbarTheme = useToolbarTheme();

	return <ThemeProvider theme={toolbarTheme}>{children}</ThemeProvider>;
}

export default ToolbarTheme;
