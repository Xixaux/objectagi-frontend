import { useQuery } from '@tanstack/react-query';
import { environmentApiService } from '../../services/environmentApiService';

export const widgetsQueryKey = ['projectDashboardApp', 'widgets'];

export const useGetWidgets = () => {
	return useQuery({
		queryFn: environmentApiService.getWidgets,
		queryKey: widgetsQueryKey
	});
};
