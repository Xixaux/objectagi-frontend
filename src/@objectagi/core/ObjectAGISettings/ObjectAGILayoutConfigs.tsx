import { Control } from 'react-hook-form';
import ObjectAGILayoutConfig from './ObjectAGILayoutConfig';
import ThemeFormConfigTypes from './ThemeFormConfigTypes';
import { ObjectAGISettingsConfigType } from './ObjectAGISettings';

type ObjectAGISettingsControllersProps = {
	value: ThemeFormConfigTypes;
	prefix: string;
	control: Control<ObjectAGISettingsConfigType>;
};

function ObjectAGILayoutConfigs(props: ObjectAGISettingsControllersProps) {
	const { value, prefix, control } = props;

	return Object?.entries?.(value)?.map?.(([key, item]) => {
		const name = prefix ? `${prefix}.${key}` : key;
		return (
			<ObjectAGILayoutConfig
				key={key}
				name={name as keyof ObjectAGISettingsConfigType}
				control={control}
				item={item}
			/>
		);
	});
}

export default ObjectAGILayoutConfigs;
