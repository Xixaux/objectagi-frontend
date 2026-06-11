// src/app/(control-panel)/pages/activities/ActivitiesPageHeader.tsx
'use client';

import { Typography, Box, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ActivitiesPageHeader() {
  const router = useRouter();

  const goToActivities = () => {
    router.push('/pages/activities');
  };

  const goToInputOutput = () => {
    router.push('/pages/activities/inputoutput');
  };

  return (
    <Box sx={{ mb: 6, pb: 5, borderBottom: 1, borderColor: 'divider' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={{ xs: 3, sm: 4 }}
      >


        {/* Two clean buttons – always on the right */}
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          sx={{ flexShrink: 0 }}
        >
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            onClick={goToActivities}
            sx={{ minWidth: 140 }}
          >
            Activities
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={goToInputOutput}
            sx={{ minWidth: 140 }}
          >
            Input Output
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}