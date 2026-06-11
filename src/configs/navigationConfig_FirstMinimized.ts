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
            title: 'Overview',
            type: 'item',
            url: '/dashboards/environment',
          },
          {
            id: 'apps.create-physical-object',
            title: 'Create Physical Object',
            type: 'item',
            url: '/dashboards/environment-deployment/create-phyobj',
          },
          {
            id: 'env-deployment.checkpoints',
            title: 'Checkpoints',
            type: 'item',
            url: '/dashboards/environment-deployment/checkpoints',
          },
        ],
      },
      {
        id: 'dashboards.ai-management',
        title: 'AI Management',
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
            title: 'Event Sequences (History/Future)',
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
        title: 'Conversations',
        type: 'item',
        icon: 'heroicons-outline:chat-bubble-bottom-center',
        url: '/apps/messenger',
        translate: 'Conversations',
        badge: {
          title: '8',
        },
      },
      {
        id: 'apps.engines',
        title: 'Engines',
        type: 'collapse',
        icon: 'heroicons-outline:cpu-chip',
        translate: 'Engines',
        children: [
          {
            id: 'engines.consciousness',
            title: 'Consciousness',
            type: 'item',
            icon: 'heroicons-outline:light-bulb',
            url: '/apps/engines/consciousness',
          },
          {
            id: 'engines.belief',
            title: 'Belief',
            type: 'item',
            icon: 'heroicons-outline:shield-check',
            url: '/apps/engines/belief',
          },
          {
            id: 'engines.decision',
            title: 'Decision',
            type: 'item',
            icon: 'heroicons-outline:scale',
            url: '/apps/engines/decision',
          },
          {
            id: 'engines.dreaming',
            title: 'Dreaming',
            type: 'item',
            icon: 'heroicons-outline:moon',
            url: '/apps/engines/dreaming',
          },
          {
            id: 'engines.energy',
            title: 'Energy',
            type: 'item',
            icon: 'heroicons-outline:bolt',
            url: '/apps/engines/energy',
          },
          {
            id: 'engines.instinct',
            title: 'Instinct',
            type: 'item',
            icon: 'heroicons-outline:heart',
            url: '/apps/engines/instinct',
          },
          {
            id: 'engines.emotion',
            title: 'Emotion',
            type: 'item',
            icon: 'heroicons-outline:academic-cap',
            url: '/apps/engines/emotion',
          },
          {
            id: 'engines.memory',
            title: 'Memory',
            type: 'item',
            icon: 'heroicons-outline:archive-box',
            url: '/apps/engines/memory',
          },
          {
            id: 'engines.perception',
            title: 'Perception',
            type: 'item',
            icon: 'heroicons-outline:eye',
            url: '/apps/engines/perception',
          },
          {
            id: 'engines.sensory',
            title: 'Sensory',
            type: 'item',
            icon: 'heroicons-outline:hand-thumb-up',
            url: '/apps/engines/sensory',
          },
          {
            id: 'engines.subconsciousness',
            title: 'Subconsciousness',
            type: 'item',
            icon: 'heroicons-outline:question-mark-circle',
            url: '/apps/engines/subconsciousness',
          },
          {
            id: 'engines.thought',
            title: 'Thought',
            type: 'item',
            icon: 'heroicons-outline:sparkles',
            url: '/apps/engines/thought',
          },
        ],
      },
      {
        id: 'apps.file-manager',
        title: 'My Documents',
        type: 'item',
        icon: 'heroicons-outline:share',
        url: '/apps/file-manager',
      },
      {
        ...SettingsAppNavigation,
        type: 'item',
      },
    ],
  },
];

export default navigationConfig;