'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CommandCenterTabHeader from './CommandCenterTabHeader';
import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';

// Components
import MainMenuItems from './components/MainMenuItems';
import OperationsView from './components/OperationsView';
import ProjectsView from './components/ProjectsView';

export default function ExecutionConsoleDemo() {
  const [viewMode, setViewMode] = useState<'code' | 'multimedia'>('code');
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const togglePanel = (panelId: string) => {
    setActivePanel(activePanel === panelId ? null : panelId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', padding: '24px' }}
    >
      <CommandCenterTabHeader />

      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Box
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          <MainMenuItems
            activePanel={activePanel}
            togglePanel={togglePanel}
            assignedEhumans={[]}
            setAssignedEhumans={() => {}}
          />

          <Box sx={{ p: 0 }}>
            {/* NAVIGATION TABS - Directly after MainMenuItems */}
            <Tabs
              value={viewMode}
              onChange={(_, newValue) => setViewMode(newValue as 'code' | 'multimedia')}
              variant="fullWidth"
              sx={{ 
                bgcolor: 'background.paper',
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': { fontWeight: 700, letterSpacing: '1px' }
              }}
            >
              <Tab value="code" label="OPERATIONS" />
              <Tab value="multimedia" label="PROJECTS" />
            </Tabs>

            {/* MAIN VIEWPORT */}
            <Box sx={{ p: 0, height: '65vh', overflow: 'hidden', position: 'relative' }}>
              {viewMode === 'code' && (
                <OperationsView 
                  getComplianceColor={(level) => {
                    if (level === 'High') return '#10b981';
                    if (level === 'Medium') return '#f59e0b';
                    return '#64748b';
                  }} 
                />
              )}

              {viewMode === 'multimedia' && <ProjectsView />}
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}