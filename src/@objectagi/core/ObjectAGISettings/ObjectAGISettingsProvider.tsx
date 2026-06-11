// src/@objectagi/core/ObjectAGISettings/ObjectAGISettingsProvider.tsx (FIXED: setSettings stabilized with useCallback)

import { useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { defaultSettings, getParsedQuerySettings } from '@objectagi/default-settings';
import settingsConfig from 'src/configs/settingsConfig';
import themeLayoutConfigs from 'src/components/theme-layouts/themeLayoutConfigs';
import { ObjectAGISettingsConfigType, ObjectAGIThemesType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';
import useUser from '@auth/useUser';
import { PartialDeep } from 'type-fest';
import ObjectAGISettingsContext from './ObjectAGISettingsContext';

// Get initial settings
const getInitialSettings = (): ObjectAGISettingsConfigType => {
    const defaultLayoutStyle = settingsConfig.layout?.style || 'layout1';
    const layout = {
        style: defaultLayoutStyle,
        config: themeLayoutConfigs[defaultLayoutStyle]?.defaults
    };
    return _.merge({}, defaultSettings, { layout }, settingsConfig, getParsedQuerySettings());
};

const initialSettings = getInitialSettings();

const generateSettings = (
    _defaultSettings: ObjectAGISettingsConfigType,
    _newSettings: PartialDeep<ObjectAGISettingsConfigType>
) => {
    return _.merge(
        {},
        _defaultSettings,
        { layout: { config: themeLayoutConfigs[_newSettings?.layout?.style]?.defaults } },
        _newSettings
    );
};

// ObjectAGISettingsProvider component
export function ObjectAGISettingsProvider({ children }: { children: ReactNode }) {
    // We now rely on data/user being potentially null/undefined safely
    const { data: user, isGuest } = useUser();

    // Safely retrieve user settings. user will be null initially, resulting in {}
    const userSettings = useMemo(() => user?.settings || {}, [user]);

    const calculateSettings = useCallback(() => {
        const defaultSettings = _.merge({}, initialSettings);
        // If the user is a guest (unauthenticated or data is null), use defaultSettings.
        return isGuest ? defaultSettings : _.merge({}, defaultSettings, userSettings);
    }, [isGuest, userSettings]);

    // Initialize state with the default settings immediately.
    const [data, setData] = useState<ObjectAGISettingsConfigType>(initialSettings);

    // FIX 1: Wrap setSettings in useCallback for stability
    const setSettings = useCallback((newSettings: Partial<ObjectAGISettingsConfigType>) => {
        // Use the functional form of setData if you rely on the previous state (`data`)
        setData((currentData) => {
            const _settings = generateSettings(currentData, newSettings);

            if (!_.isEqual(_settings, currentData)) {
                return _.merge({}, _settings);
            }
            // Must return the current state if no change to avoid unnecessary re-renders
            return currentData; 
        });
        // We cannot return the new settings reliably here because of the async nature of setData
    }, []); // Empty dependency array because we use the functional update for setData

    // Sync data with userSettings when isGuest or userSettings change (i.e., user loads)
    useEffect(() => {
        const newSettings = calculateSettings();

        // Only update if settings are different
        if (!_.isEqual(data, newSettings)) {
            setData(newSettings);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calculateSettings, user, isGuest]); // Added user and isGuest for clarity, although calculateSettings covers them

    const changeTheme = useCallback(
        (newTheme: ObjectAGIThemesType) => {
            const { navbar, footer, toolbar, main } = newTheme;

            const newSettings: Partial<ObjectAGISettingsConfigType> = {
                theme: {
                    main,
                    navbar,
                    toolbar,
                    footer
                }
            };

            setSettings(newSettings);
        },
        [setSettings] // FIX 2: Removed 'data' from dependency array as setSettings no longer needs it.
    );

    return (
        <ObjectAGISettingsContext.Provider
            value={useMemo(
                () => ({
                    data,
                    setSettings, // Now stable
                    changeTheme // Now stable
                }),
                [data, setSettings, changeTheme] // Dependencies are now stable
            )}
        >
            {children}
        </ObjectAGISettingsContext.Provider>
    );
}

export default ObjectAGISettingsProvider;