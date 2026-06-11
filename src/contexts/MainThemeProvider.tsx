import * as React from 'react';
import ObjectAGITheme from '@objectagi/core/ObjectAGITheme';
import { useMainTheme } from '@objectagi/core/ObjectAGISettings/hooks/objectagiThemeHooks';

type MainThemeProviderProps = {
	children: React.ReactNode;
};

function MainThemeProvider({ children }: MainThemeProviderProps) {
	const mainTheme = useMainTheme();

	return (
		<ObjectAGITheme
			theme={mainTheme}
			root
		>
			{children}
		</ObjectAGITheme>
	);
}

export default MainThemeProvider;
