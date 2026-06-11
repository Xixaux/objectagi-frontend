'use client';

import { ObjectAGILayoutProps } from '@objectagi/core/ObjectAGILayout/ObjectAGILayout';
import ObjectAGILayout from '@objectagi/core/ObjectAGILayout';
import { useMemo } from 'react';
import themeLayouts from './theme-layouts/themeLayouts';

type MainLayoutProps = Omit<ObjectAGILayoutProps, 'layouts'> & {
	navbar?: boolean;
	toolbar?: boolean;
	footer?: boolean;
	leftSidePanel?: boolean;
	rightSidePanel?: boolean;
};

function MainLayout(props: MainLayoutProps) {
	const {
		children,
		navbar,
		toolbar,
		footer,
		leftSidePanel,
		rightSidePanel,
		settings = {}, // Default to an empty object if settings is undefined
		...rest
	} = props;

	const mergedSettings = useMemo(() => {
		const shorthandSettings = {
			config: {
				...(navbar !== undefined && { navbar: { display: navbar } }),
				...(toolbar !== undefined && { toolbar: { display: toolbar } }),
				...(footer !== undefined && { footer: { display: footer } }),
				...(leftSidePanel !== undefined && { leftSidePanel: { display: leftSidePanel } }),
				...(rightSidePanel !== undefined && { rightSidePanel: { display: rightSidePanel } })
			}
		};
		return { ...settings, ...shorthandSettings };
	}, [settings, navbar, toolbar, footer, leftSidePanel, rightSidePanel]);

	return (
		<ObjectAGILayout
			{...rest}
			layouts={themeLayouts}
			settings={mergedSettings}
		>
			{children}
		</ObjectAGILayout>
	);
}

export default MainLayout;
