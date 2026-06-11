import themesConfig from 'src/configs/themesConfig';

const themeOptions = [
	{
		id: 'Default',
		section: {
			main: themesConfig.default,
			navbar: themesConfig.defaultDark,
			toolbar: themesConfig.default,
			footer: themesConfig.defaultDark
		}
	},
	{
		id: 'Slate Crimson Dark',
		section: {
			main: themesConfig.slateCrimsonDark,
			navbar: themesConfig.slateCrimsonDark,
			toolbar: themesConfig.slateCrimsonDark,
			footer: themesConfig.slateCrimsonDark
		}
	},
	{
		id: 'Indigo Coral',
		section: {
			main: themesConfig.indigoCoral,
			navbar: themesConfig.indigoCoralDark,
			toolbar: themesConfig.indigoCoral,
			footer: themesConfig.indigoCoralDark
		}
	},
	{
		id: 'Cool Grey Pink',
		section: {
			main: themesConfig.coolGreyPink,
			navbar: themesConfig.coolGreyPinkDark,
			toolbar: themesConfig.coolGreyPink,
			footer: themesConfig.coolGreyPinkDark
		}
	}
];

export default themeOptions;
