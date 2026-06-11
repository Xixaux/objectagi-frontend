import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import { ObjectAGIThemeOption } from '@objectagi/core/ObjectAGIThemeSelector/ThemePreview';
import clsx from 'clsx';
import { useMainTheme } from '@objectagi/core/ObjectAGISettings/hooks/objectagiThemeHooks';
import useObjectAGISettings from '@objectagi/core/ObjectAGISettings/hooks/useObjectAGISettings';
import { ObjectAGISettingsConfigType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';
import useUser from '@auth/useUser';
import { useAppDispatch } from '@/store/hooks';

type LightDarkModeToggleProps = {
    className?: string;
    lightTheme: ObjectAGIThemeOption;
    darkTheme: ObjectAGIThemeOption;
};

function LightDarkModeToggle(props: LightDarkModeToggleProps) {
    const { className = '', lightTheme, darkTheme } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { setSettings } = useObjectAGISettings();
    const { isGuest, updateUserSettings } = useUser();
    const dispatch = useAppDispatch();

    const mainTheme = useMainTheme();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectionChange = (selection: 'light' | 'dark') => {
        if (selection === 'light') {
            handleThemeSelect(lightTheme);
        } else {
            handleThemeSelect(darkTheme);
        }

        handleClose();
    };

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
        <>
            <IconButton
                aria-controls="light-dark-toggle-menu"
                aria-haspopup="true"
                onClick={handleClick}
                // BORDER REMOVED: The 'border border-divider' utility classes were deleted.
                className={clsx(className)}
            >
                {mainTheme.palette.mode === 'light' && <ObjectAGISvgIcon>heroicons-outline:sun</ObjectAGISvgIcon>}
                {mainTheme.palette.mode === 'dark' && <ObjectAGISvgIcon>heroicons-outline:moon</ObjectAGISvgIcon>}
            </IconButton>
            <Menu
                id="light-dark-toggle-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    selected={mainTheme.palette.mode === 'light'}
                    onClick={() => handleSelectionChange('light')}
                >
                    Light
                </MenuItem>
                <MenuItem
                    selected={mainTheme.palette.mode === 'dark'}
                    onClick={() => handleSelectionChange('dark')}
                >
                    Dark
                </MenuItem>
            </Menu>
        </>
    );
}

export default LightDarkModeToggle;