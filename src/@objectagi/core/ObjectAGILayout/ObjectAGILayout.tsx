'use client';

import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { ObjectAGISettingsConfigType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';
import { themeLayoutsType } from 'src/components/theme-layouts/themeLayouts';
import usePathname from '@objectagi/hooks/usePathname';
import useObjectAGISettings from '@objectagi/core/ObjectAGISettings/hooks/useObjectAGISettings';
import ObjectAGILayoutSettingsContext from './ObjectAGILayoutSettingsContext';

export type ObjectAGIRouteObjectType = {
	settings?: ObjectAGISettingsConfigType;
	auth?: string[] | [] | null | undefined;
};

export type ObjectAGILayoutProps = {
	layouts: themeLayoutsType;
	children?: React.ReactNode;
	settings?: ObjectAGISettingsConfigType['layout'];
};

/**
 * ObjectAGILayout
 * React frontend component in a React project that is used for layouting the user interface. The component
 * handles generating user interface settings related to current routes, merged with default settings, and uses
 * the new settings to generate layouts.
 */
function ObjectAGILayout(props: ObjectAGILayoutProps) {
	const { layouts, children, settings: forcedSettings } = props;

	const { data: current } = useObjectAGISettings();
	const currentLayoutSetting = useMemo(() => current.layout, [current]);
	const pathname = usePathname();

	const layoutSetting = useMemo(
		() => _.merge({}, currentLayoutSetting, forcedSettings),
		[currentLayoutSetting, forcedSettings]
	);

	const layoutStyle = useMemo(() => layoutSetting.style, [layoutSetting]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<ObjectAGILayoutSettingsContext value={layoutSetting}>
			{useMemo(() => {
				return Object.entries(layouts).map(([key, Layout]) => {
					if (key === layoutStyle) {
						return (
							<React.Fragment key={key}>
								<Layout>{children}</Layout>
							</React.Fragment>
						);
					}

					return null;
				});
			}, [layoutStyle, layouts, children])}
		</ObjectAGILayoutSettingsContext>
	);
}

export default ObjectAGILayout;
