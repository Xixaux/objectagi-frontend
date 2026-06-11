'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';

import SelfModification from './SelfModification';
import PerformanceMetrics from './PerformanceMetrics';
import RegisteredKnowledge from './RegisteredKnowledge';
import MemoryAdministration from './MemoryAdministration';
import LifeCycleManagement from './LifeCycleManagement';
import EHumanLibrary from './eHumanLibrary';
import ObjectLibrary from './ObjectLibrary';
import ActiveeHumanSelection from './ActiveeHumanSelection';

export default function CreatePhysicalObjectView() {
  const [isMobile, setIsMobile] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 1280;
      setIsMobile(mobile);
      if (width >= 1280) setLeftOpen(true);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Sidebar - eHuman Selection */}
        {(leftOpen || !isMobile) && (
          <Box
            sx={{
              width: 360,
              flexShrink: 0,
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              zIndex: 10,
            }}
          >
            <ActiveeHumanSelection 
              selectedAgentId={selectedAgentId}
              onAgentChange={setSelectedAgentId}
            />
          </Box>
        )}

        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>


          {/* Tabs + Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              sx={{ 
                px: 3, 
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider'
              }}
            >
              <Tab label="eHuman Library" />
              <Tab label="Object Library" />
              <Tab label="Self-Modification" />
              <Tab label="Performance Profile" />
              <Tab label="Registered Knowledge" />
              <Tab label="Memory Management" />
              <Tab label="Life Cycle Management" />
            </Tabs>

            <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
              {tabValue === 0 && <EHumanLibrary />}
              {tabValue === 1 && <ObjectLibrary />}
              {tabValue === 2 && <SelfModification selectedAgentId={selectedAgentId} />}
              {tabValue === 3 && <PerformanceMetrics selectedAgentId={selectedAgentId} />}
              {tabValue === 4 && <RegisteredKnowledge selectedAgentId={selectedAgentId} />}
              {tabValue === 5 && <MemoryAdministration selectedAgentId={selectedAgentId} />}
              {tabValue === 6 && <LifeCycleManagement selectedAgentId={selectedAgentId} />}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}