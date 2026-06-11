import { ObjectAGISettingsConfigType, ObjectAGIThemesType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';
import { createContext } from 'react';

// ObjectAGISettingsContext type
export type ObjectAGISettingsContextType = {
	data: ObjectAGISettingsConfigType;
	setSettings: (newSettings: Partial<ObjectAGISettingsConfigType>) => ObjectAGISettingsConfigType;
	changeTheme: (newTheme: ObjectAGIThemesType) => void;
};

// Context with a default value of undefined
const ObjectAGISettingsContext = createContext<ObjectAGISettingsContextType | undefined>(undefined);

export default ObjectAGISettingsContext;
