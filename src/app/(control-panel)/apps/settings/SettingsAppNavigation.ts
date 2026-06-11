import { ObjectAGINavItemType } from '@objectagi/core/ObjectAGINavigation/types/ObjectAGINavItemType';

const SettingsAppNavigation: ObjectAGINavItemType = {
	id: 'apps.settings',
	title: 'App Settings',
	type: 'collapse',
	icon: 'heroicons-outline:cog-6-tooth',
	url: '/apps/settings',
	children: [
		{
			"id": "apps.settings.account",
			"icon": "heroicons-outline:user-circle",
			"title": "Account Overview",
			"type": "item",
			"url": "/apps/settings/account",
			"subtitle": "View and update your account details and personal information"
		},
		{
			"id": "apps.settings.notifications",
			"icon": "heroicons-outline:circle-stack",
			"title": "Data Management",
			"type": "item",
			"url": "/apps/settings/data",
			"subtitle": "Organize and control your data"
		},		
		{
			"id": "apps.settings.security",
			"icon": "heroicons-outline:lock-closed",
			"title": "Security",
			"type": "item",
			"url": "/apps/settings/security",
			"subtitle": "Configure settings related to the security of your AGI infrastructure"
		},
				{
			"id": "apps.settings.team",
			"icon": "heroicons-outline:shield-check",
			"title": "Privacy Options",
			"type": "item",
			"url": "/apps/settings/privacy",
			"subtitle": "Manage your visibility and application privacy"
		},
		{
			"id": "apps.settings.planBilling",
			"icon": "heroicons-outline:credit-card",
			"title": "Services and Subscriptions",
			"type": "item",
			"url": "/apps/settings/plan-billing",
			"subtitle": "Control your data sharing and privacy preferences"
		}
	]
};

export default SettingsAppNavigation;
