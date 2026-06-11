import { createContext } from 'react';
import { ObjectAGISettingsConfigType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';

type ObjectAGILayoutSettingsContextType = ObjectAGISettingsConfigType['layout'];

const ObjectAGILayoutSettingsContext = createContext<ObjectAGILayoutSettingsContextType | undefined>(undefined);

export default ObjectAGILayoutSettingsContext;
