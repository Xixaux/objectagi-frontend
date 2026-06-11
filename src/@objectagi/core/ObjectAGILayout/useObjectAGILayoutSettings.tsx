import { useContext } from 'react';
import ObjectAGILayoutSettingsContext from './ObjectAGILayoutSettingsContext';

const useObjectAGILayoutSettings = () => {
	const context = useContext(ObjectAGILayoutSettingsContext);

	if (context === undefined) {
		throw new Error('useObjectAGILayoutSettings must be used within a SettingsProvider');
	}

	return context;
};

export default useObjectAGILayoutSettings;
