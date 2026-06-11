'use client';
import ObjectAGIPageSimple from '@objectagi/core/ObjectAGIPageSimple';
import { useState } from 'react';
import * as React from 'react';
import ObjectAGILoading from '@objectagi/core/ObjectAGILoading';
import { Tabs, Tab } from '@mui/material';
import ProjectDashboardAppHeader from '../ui/ProjectDashboardAppHeader';
import HomeTab from '../ui/tabs/home/HomeTab';
import ActivityTab from '../ui/tabs/activity/ActivityTab';
import CommandCenterTab from '../ui/tabs/command-center/CommandCenterTab';
import { useGetWidgets } from '../../api/hooks/widgets/useGetWidgets';
import ProjectSelector from '../ui/ProjectSelector';

/**
 * The ProjectDashboardApp page.
 */
function ProjectDashboardAppView() {
    const { isLoading } = useGetWidgets();

    // Changed default state from 'home' to 'console'
    const [tabValue, setTabValue] = useState('console');

    function handleTabChange(event: React.SyntheticEvent, value: string) {
        setTabValue(value);
    }

    if (isLoading) {
        return <ObjectAGILoading />;
    }

    return (
        <ObjectAGIPageSimple
            header={<ProjectDashboardAppHeader />}
            content={
                <div className="w-full pt-4 sm:pt-6">
                    <div className="flex w-full flex-col justify-between gap-2 px-4 sm:flex-row sm:items-center md:px-8">
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="New user tabs"
                        >
                            <Tab
                                value="home"
                                label="Environment"
                            />
                            <Tab
                                value="console"
                                label="Command Center"
                            />
                            <Tab
                                value="activity"
                                label="Activity Manager"
                            />
                        </Tabs>

                        <ProjectSelector />
                    </div>
                    {/* Console will now be rendered by default */}
                    {tabValue === 'home' && <HomeTab />}
                    {tabValue === 'activity' && <ActivityTab />}
                    {tabValue === 'console' && <CommandCenterTab />}
                </div>
            }
        />
    );
}

export default ProjectDashboardAppView;