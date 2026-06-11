import { useContext } from 'react';
import ObjectAGISettingsContext, { ObjectAGISettingsContextType } from '../ObjectAGISettingsContext';

const useObjectAGISettings = (): ObjectAGISettingsContextType => {
	const context = useContext(ObjectAGISettingsContext);

	if (!context) {
		throw new Error('useSettings must be used within a ObjectAGISettingsProvider');
	}

	return context;
};

export default useObjectAGISettings;
