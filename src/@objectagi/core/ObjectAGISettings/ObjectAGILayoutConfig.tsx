import { Control } from 'react-hook-form';
import { Typography } from '@mui/material';
import { AnyFormFieldType } from '@objectagi/core/ObjectAGISettings/ThemeFormConfigTypes';
import { ObjectAGISettingsConfigType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';
import ObjectAGILayoutConfigs from './ObjectAGILayoutConfigs';
import RadioFormController from './form-controllers/RadioFormController';
import SwitchFormController from './form-controllers/SwitchFormController';
import NumberFormController from './form-controllers/NumberFormController';

type ObjectAGISettingsControllerProps = {
	key?: string;
	name: keyof ObjectAGISettingsConfigType;
	control: Control<ObjectAGISettingsConfigType>;
	title?: string;
	item: AnyFormFieldType;
};

function ObjectAGILayoutConfig(props: ObjectAGISettingsControllerProps) {
	const { item, name, control } = props;

	switch (item.type) {
		case 'radio':
			return (
				<RadioFormController
					name={name}
					control={control}
					item={item}
				/>
			);
		case 'switch':
			return (
				<SwitchFormController
					name={name}
					control={control}
					item={item}
				/>
			);
		case 'number':
			return (
				<NumberFormController
					name={name}
					control={control}
					item={item}
				/>
			);
		case 'group':
			return (
				<div
					key={name}
					className="ObjectAGISettings-formGroup"
				>
					<Typography
						className="ObjectAGISettings-formGroupTitle"
						color="text.secondary"
					>
						{item.title}
					</Typography>
					<ObjectAGILayoutConfigs
						value={item.children}
						prefix={name}
						control={control}
					/>
				</div>
			);
		default:
			return '';
	}
}

export default ObjectAGILayoutConfig;
