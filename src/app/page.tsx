import { redirect } from 'next/navigation';

function MainPage() {
	redirect(`/apps/messenger`);
	return null;
}

export default MainPage;
