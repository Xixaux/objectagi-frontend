import { redirect } from 'next/navigation';

function DashboardsPage() {
	redirect(`/dashboards/environment`);
	return null;
}

export default DashboardsPage;
