import { DeepPartial } from 'react-hook-form';
import { ObjectAGISettingsConfigType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';

export const layoutConfigOnlyMain: DeepPartial<ObjectAGISettingsConfigType>['layout'] = {
	config: {
		navbar: {
			display: false
		},
		toolbar: {
			display: false
		},
		footer: {
			display: false
		},
		leftSidePanel: {
			display: false
		},
		rightSidePanel: {
			display: false
		}
	}
};

export const layoutConfigOnlyMainFullWidth: DeepPartial<ObjectAGISettingsConfigType>['layout'] = {
	config: {
		...layoutConfigOnlyMain.config,
		mode: 'fullwidth'
	}
};

export const layoutNoContainer: DeepPartial<ObjectAGISettingsConfigType>['layout'] = {
	config: {
		mode: 'fullwidth'
	}
};
