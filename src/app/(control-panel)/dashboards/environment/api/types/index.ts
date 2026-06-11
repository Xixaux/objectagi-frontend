import BudgetDetailsDataType from './console/BudgetDetailsDataType';
import BudgetDistributionDataType from './console/BudgetDistributionDataType';
import ExpensesDataType from './console/ExpensesDataType';
import WidgetDataType from './home/WidgetDataType';
import GithubIssuesDataType from './home/GithubIssuesDataType';
import ScheduleDataType from './home/ScheduleDataType';
import TaskDistributionDataType from './home/TaskDistributionDataType';
import TeamMemberType from './activity/TeamMemberType';

export type ProjectDashboardWidgetType =
	| BudgetDetailsDataType
	| BudgetDistributionDataType
	| ExpensesDataType
	| WidgetDataType
	| GithubIssuesDataType
	| ScheduleDataType
	| TaskDistributionDataType
	| TeamMemberType[];

export type ProjectType = {
	id: number;
	name: string;
};
