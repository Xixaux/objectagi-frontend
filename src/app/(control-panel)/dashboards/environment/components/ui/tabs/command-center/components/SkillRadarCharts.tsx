'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid as MuiGrid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function GithubAnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/live/analytics-dashboard/widgets')
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`))
      .then(json => {
        console.log("✅ DASHBOARD DATA LOADED:", json);
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        setError(err.toString());
        setLoading(false);
      });
  }, []);

  if (loading) return <Box sx={{ p: 6, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 4 }}>Error: {error}</Alert>;

  // Big line chart logic (GitHub Issues)
  const github = data?.githubIssues || {};
  const seriesDict = github.series || {};
  const labelsDict = github.labels || {};
  const currentKey = Object.keys(seriesDict)[0] || 'day';
  const seriesArray = seriesDict[currentKey] || [];
  const labels = labelsDict[currentKey] || [];

  const chartData = labels.map((label: string, index: number) => {
    const point: any = { name: label };
    seriesArray.forEach((s: any, i: number) => {
      const name = s?.name || `Series ${i}`;
      point[name] = s?.data?.[index] ?? 0;
    });
    return point;
  });

  // Test Widget 1: Issues
  const issuesWidget = data?.issues || { title: 'Issues', data: { count: 0, name: 'N/A' } };
  
  // Test Widget 2: Overdue
  const overdueWidget = data?.overdue || { title: 'Overdue', data: { count: 0, name: 'N/A' } };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc' }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
        Analytics Test Dashboard
      </Typography>

      {/* Test Widgets Grid */}
      <MuiGrid container spacing={3} sx={{ mb: 6 }}>
        {/* Issues Widget */}
        <MuiGrid item xs={12} sm={6}>
          <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {issuesWidget.title}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#4f46e5' }}>
                {issuesWidget.data?.count ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {issuesWidget.data?.name}
              </Typography>
            </CardContent>
          </Card>
        </MuiGrid>

        {/* Overdue Widget */}
        <MuiGrid item xs={12} sm={6}>
          <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {overdueWidget.title}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#ef4444' }}>
                {overdueWidget.data?.count ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {overdueWidget.data?.name}
              </Typography>
            </CardContent>
          </Card>
        </MuiGrid>
      </MuiGrid>

      {/* Big Line Chart */}
      <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Daily Issues Trend
          </Typography>
          <Box sx={{ height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {seriesArray.map((s: any, i: number) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={s?.name || `Series ${i}`}
                    stroke={['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6'][i % 4]}
                    strokeWidth={3}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}