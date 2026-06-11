import { useQuery } from '@tanstack/react-query';
import { environmentApiService } from '../../services/environmentApiService';

const queryKey = ['projectDashboardApp', 'projects'];

export const useGetEnvironments = () => {
	return useQuery({
		queryFn: environmentApiService.getProjects,
		queryKey
	});
};
