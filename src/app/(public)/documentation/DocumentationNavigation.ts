import { ObjectAGINavItemType } from '@objectagi/core/ObjectAGINavigation/types/ObjectAGINavItemType';
import objectagiReactLatestVersion from './changelog/constants/objectagiReactLatestVersion';

/**
 * Documentation Navigation
 */
const DocumentationNavigation: ObjectAGINavItemType = {
  id: 'documentation',
  title: 'Documentation',
  subtitle: 'Everything you need to know about ObjectAGI',
  icon: 'heroicons-outline:book-open',
  type: 'group',
  children: [
    {
      id: 'changelog',
      title: 'Changelog',
      type: 'item',
      icon: 'heroicons-outline:megaphone',
      url: '/documentation/changelog',
      badge: {
        title: objectagiReactLatestVersion,
        bg: 'rgba(52, 214, 120, 1)',
        fg: '#ffffff',
      },
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      type: 'group',
      icon: 'play_arrow',
      children: [
        {
          id: 'introduction-doc',
          title: 'Introduction',
          type: 'item',
          icon: 'heroicons-outline:play',
          url: '/documentation/getting-started/introduction',
        },
      ],
    },
    {
      id: 'development-guide',
      title: 'Development Guide',
      type: 'group',
      icon: 'developer_board',
      children: [
        {
          id: 'api-integration-doc',
          title: 'API Integration',
          type: 'collapse',
          icon: 'heroicons-outline:cloud',
          url: '/documentation/development/api-integration',
          children: [
            {
              id: 'api-configuration-doc',
              title: 'API Configuration',
              type: 'item',
              url: '/documentation/development/api-integration/api-configuration',
            },
            {
              id: 'mock-api-doc',
              title: 'Mock API Documentation',
              type: 'item',
              url: '/documentation/development/api-integration/mock-api',
            },
          ],
        },
      ],
    },
    {
      id: 'configuration',
      title: 'Configuration',
      type: 'group',
      icon: 'settings',
      children: [
        {
          id: 'objectagi-react-routing-doc',
          title: 'Routing',
          type: 'item',
          icon: 'heroicons-outline:map',
          url: '/documentation/configuration/routing',
        },
      ],
    },
    {
      id: 'user-interface',
      title: 'User Interface',
      type: 'group',
      icon: 'palette',
      children: [
        {
          id: 'rtl-doc',
          title: 'RTL Support',
          type: 'item',
          icon: 'heroicons-outline:language',
          url: '/documentation/user-interface/rtl-support',
        },
      ],
    },
    {
      id: 'authentication-authorization',
      title: 'Authentication & Authorization',
      subtitle: 'User roles and permissions',
      type: 'group',
      icon: 'heroicons-outline:square-3-stack-3d',
      children: [
        {
          id: 'authentication',
          title: 'Authentication',
          type: 'item',
          icon: 'heroicons-outline:shield-check',
          url: '/documentation/authentication',
        },
        {
          id: 'authorization',
          title: 'Authorization',
          type: 'item',
          icon: 'heroicons-outline:shield-exclamation',
          url: '/documentation/authorization',
        },
      ],
    },
  ],
};

export default DocumentationNavigation;