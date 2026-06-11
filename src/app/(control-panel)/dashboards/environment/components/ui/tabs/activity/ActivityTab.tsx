'use client';

import { motion } from 'motion/react';
import SkillRadarCharts from '@/app/(control-panel)/dashboards/environment/components/ui/tabs/command-center/components/SkillRadarCharts';

const systemMetricsData = [
  { metric: 'Analytical', Primary: 92, Secondary: 65 },
  { metric: 'Artistic', Primary: 28, Secondary: 55 },
  { metric: 'Social', Primary: 88, Secondary: 60 },
  { metric: 'Communication', Primary: 35, Secondary: 72 },
  { metric: 'Mechanical', Primary: 76, Secondary: 45 },
  { metric: 'Linguistic', Primary: 50, Secondary: 68 },
];

const signatureData = [
  { name: 'Data Forecasting', value: 91 },
  { name: 'Systems Architecture', value: 73 },
  { name: 'Strategic Planning', value: 42 },
  { name: 'Creative Direction', value: 28 },
  { name: 'Fiscal Accounting', value: 65 },
];

function TaskManagerWireframe() {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full h-full"
    >
      <SkillRadarCharts 
        systemMetricsData={systemMetricsData} 
        signatureData={signatureData} 
      />
    </motion.div>
  );
}

export default TaskManagerWireframe;