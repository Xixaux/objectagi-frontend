/* eslint-disable prettier/prettier */
import i18n from '@i18n';
import { ObjectAGINavItemType } from '@objectagi/core/ObjectAGINavigation/types/ObjectAGINavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import SettingsAppNavigation from '../app/(control-panel)/apps/settings/SettingsAppNavigation';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the ObjectAGI application.
 */
const navigationConfig: ObjectAGINavItemType[] = [
  {
    id: 'dashboards',
    title: 'Dashboard',
    subtitle: 'General Intelligence',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'DASHBOARD',
    children: [
      {
        id: 'dashboards.environment',
        title: 'Environment',
        subtitle: 'Control Center for AGI',
        type: 'collapse',
        icon: 'heroicons-outline:globe-alt',
        children: [
          {
            id: 'environment.overview',
            title: 'Control Panel',
            type: 'item',
            url: '/dashboards/environment',
          },
          {
            id: 'apps.create-physical-object',
            title: 'Knowledge Framework',
            type: 'item',
            url: '/dashboards/environment-deployment/create-phyobj',
          },
        ],
      },
      {
        id: 'dashboards.ai-management',
        title: 'AGI Configuration',
        type: 'collapse',
        icon: 'heroicons-outline:cpu-chip',
        children: [
          {
            id: 'ai-management.skills-manager',
            title: 'Skills Manager',
            type: 'item',
            url: '/dashboards/ai-management/skills-manager',
          },
          {
            id: 'monitoring.event-sequences',
            title: 'Event Management',
            type: 'item',
            url: '/dashboards/monitoring/event-sequences',
          },
        ],
      },
    ],
  },
  {
    id: 'apps',
    title: 'Communication',
    subtitle: 'Hosting eHuman Conversations',
    type: 'group',
    icon: 'heroicons-outline:chat-bubble-left-right',
    translate: 'Communication',
    children: [
      {
        id: 'apps.messenger',
        title: 'Your Conversations',
        type: 'item',
        icon: 'heroicons-outline:chat-bubble-bottom-center',
        url: '/apps/messenger',
        translate: 'Conversations',
        badge: {
          title: '8',
        },
      },
      {
        ...SettingsAppNavigation,
        type: 'item',
      },
    ],
  },
];

export default navigationConfig;