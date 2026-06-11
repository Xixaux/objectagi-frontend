import { api } from '@/utils/api';
import { ProjectDashboardWidgetType, ProjectType } from '../types';

export const environmentApiService = {
    // Correct endpoint for all widget data.
    getWidgets: async (): Promise<Record<string, ProjectDashboardWidgetType>> => {
        return await api.get('live/analytics-dashboard/widgets').json();
    },
    // Both project data and widget data are now sourced from the same base path.
    getProjects: async (): Promise<ProjectType[]> => {
        return await api.get('live/analytics-dashboard/projects').json();
    }
};
