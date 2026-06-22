'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, IconButton, Stack, Chip, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface OperationsViewProps {
  getComplianceColor: (level: string) => string;
}

export default function OperationsView({ getComplianceColor }: OperationsViewProps) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [rawNodes, setRawNodes] = useState<any[]>([]);
  const [rawEdges, setRawEdges] = useState<any[]>([]);
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(new Set());
  const [highlightedEdgeIds, setHighlightedEdgeIds] = useState<Set<string>>(new Set());

  // Live data from API
  const [hierarchyData, setHierarchyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearHighlights = useCallback(() => {
    setHighlightedNodeIds(new Set());
    setHighlightedEdgeIds(new Set());
    setSelectedNodeData(null);
  }, []);

  // Fetch data from your ASP.NET Web API
  useEffect(() => {
    const fetchHierarchyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ← UPDATE THIS URL to match your exact ASP.NET controller route
        const response = await fetch('/api/OperationsView', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // If you need authentication later:
            // 'Authorization': `Bearer ${yourToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setHierarchyData(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Failed to fetch hierarchy data:', err);
        setError(err.message || 'Failed to load operational data');
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchyData();
  }, []);

  // Generate raw nodes & edges from the live API data (exact same logic as before)
  useEffect(() => {
    if (!hierarchyData.length) return;

    const generatedNodes: any[] = [];
    const generatedEdges: any[] = [];
    const projectSet = new Set<string>();

    hierarchyData.forEach((eHuman, index) => {
      const isRoot = eHuman.AssignTo === "Root" || eHuman.AssignTo === "Strategic Oversight";

      generatedNodes.push({
        id: eHuman.eHumanName,
        type: "person",
        data: {
          label: (
            <div
              style={{
                padding: '10px 14px',
                minWidth: 170,
                textAlign: 'center',
                background: 'linear-gradient(145deg, rgba(30,30,60,0.75) 0%, rgba(20,20,40,0.95) 100%)',
                borderRadius: '12px',
                border: `2px solid ${getComplianceColor(eHuman.ComplianceLevel)}`,
                boxShadow: `0 0 18px ${getComplianceColor(eHuman.ComplianceLevel)}50`,
                backdropFilter: 'blur(5px)',
                color: '#e2e8f0',
              }}
            >
              <div style={{ fontSize: '10px', opacity: 0.75, marginBottom: 6, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                {eHuman.OperationType}
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: 6, color: '#f1f5f9' }}>
                {eHuman.eHumanName}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9, display: 'flex', justifyContent: 'center', gap: 14 }}>
                <span>IQ Management: <strong>{eHuman.IQ}</strong></span>
                <span style={{ color: getComplianceColor(eHuman.ComplianceLevel), fontWeight: 600 }}>
                  {eHuman.ComplianceLevel}
                </span>
              </div>
              <div style={{ fontSize: '10.5px', marginTop: 8, opacity: 0.9, fontStyle: 'italic' }}>
                → {eHuman.AssignTo}
              </div>
            </div>
          ),
          fullData: eHuman,
        },
        position: { 
          x: isRoot ? 520 : (index % 5) * 280 + 80, 
          y: isRoot ? 100 : Math.floor(index / 5) * 220 + 220 
        },
        style: { background: 'transparent', border: 'none', width: 'auto', height: 'auto' },
      });

      if (eHuman.AssignTo && !isRoot) projectSet.add(eHuman.AssignTo);
    });

    const projects = Array.from(projectSet);
    projects.forEach((projName, idx) => {
      generatedNodes.push({
        id: `proj-${projName}`,
        type: "project",
        data: {
          label: (
            <div
              style={{
                padding: '16px 28px',
                background: 'linear-gradient(145deg, rgba(29, 78, 216, 0.85), rgba(59, 130, 246, 0.65))',
                borderRadius: '20px',
                border: '2.5px solid #93c5fd',
                color: '#e0f2fe',
                fontWeight: 700,
                fontSize: '16px',
                textAlign: 'center',
                minWidth: 200,
                boxShadow: '0 0 24px rgba(147, 197, 253, 0.6)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {projName}
            </div>
          ),
        },
        position: { x: 180 + idx * 340, y: 400 },
      });
    });

    hierarchyData.forEach((person) => {
      if (person.AssignTo && person.AssignTo !== "Root" && person.AssignTo !== "Strategic Oversight") {
        generatedEdges.push({
          id: `e-${person.eHumanName}-${person.AssignTo}`,
          source: person.eHumanName,
          target: `proj-${person.AssignTo}`,
          animated: person.ComplianceLevel === 'Very High' || person.ComplianceLevel === 'High',
          type: 'smoothstep',
          style: {
            stroke: getComplianceColor(person.ComplianceLevel),
            strokeWidth: 3,
            opacity: 0.95,
            filter: `drop-shadow(0 0 10px ${getComplianceColor(person.ComplianceLevel)}a0)`,
          },
          markerEnd: {
            type: 'arrowclosed',
            width: 24,
            height: 24,
            color: getComplianceColor(person.ComplianceLevel),
          },
        });
      }
    });

    setRawNodes(generatedNodes);
    setRawEdges(generatedEdges);
  }, [hierarchyData, getComplianceColor]);

  // Apply highlights whenever highlight state changes (unchanged)
  useEffect(() => {
    if (!rawNodes.length) return;

    const styledNodes = rawNodes.map(node => {
      const isHighlighted = highlightedNodeIds.has(node.id);
      const isDimmed = highlightedNodeIds.size > 0 && !isHighlighted;

      let updatedNode = { ...node };

      if (node.type === 'person') {
        updatedNode = {
          ...updatedNode,
          selected: isHighlighted,
          style: { ...updatedNode.style, opacity: isDimmed ? 0.45 : 1 },
        };
      }

      if (node.type === 'project') {
        const baseStyle = node.data.label.props.style || {};
        updatedNode = {
          ...updatedNode,
          data: {
            ...updatedNode.data,
            label: (
              <div
                style={{
                  ...baseStyle,
                  background: isHighlighted ? 'linear-gradient(145deg, #7c3aed, #c4b5fd)' : baseStyle.background,
                  borderColor: isHighlighted ? '#ddd6fe' : baseStyle.borderColor || '#93c5fd',
                  boxShadow: isHighlighted ? '0 0 40px rgba(167, 139, 250, 0.9)' : baseStyle.boxShadow,
                  transform: isHighlighted ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              >
                {node.data.label.props.children}
              </div>
            ),
          },
          style: { ...updatedNode.style, opacity: isDimmed ? 0.45 : 1 },
        };
      }

      return updatedNode;
    });

    const styledEdges = rawEdges.map(edge => ({
      ...edge,
      animated: highlightedEdgeIds.has(edge.id) ? true : edge.animated,
      style: {
        ...edge.style,
        strokeWidth: highlightedEdgeIds.has(edge.id) ? 5 : edge.style.strokeWidth,
        opacity: highlightedEdgeIds.has(edge.id) ? 1 : (highlightedEdgeIds.size > 0 ? 0.35 : edge.style.opacity),
        filter: highlightedEdgeIds.has(edge.id)
          ? `drop-shadow(0 0 12px ${edge.style.stroke}c0)`
          : edge.style.filter,
      },
    }));

    setNodes(styledNodes);
    setEdges(styledEdges);
  }, [rawNodes, rawEdges, highlightedNodeIds, highlightedEdgeIds]);

  const onNodeClick = useCallback((_: React.MouseEvent, clickedNode: any) => {
    setHighlightedNodeIds(new Set());
    setHighlightedEdgeIds(new Set());

    if (clickedNode.type !== 'person') {
      setSelectedNodeData(null);
      return;
    }

    if (clickedNode.data?.fullData) {
      setSelectedNodeData(clickedNode.data.fullData);
    }

    const downstreamNodeIds = new Set<string>();
    const downstreamEdgeIds = new Set<string>();

    rawEdges.forEach(edge => {
      if (edge.source === clickedNode.id) {
        downstreamNodeIds.add(edge.target);
        downstreamEdgeIds.add(edge.id);
      }
    });

    setHighlightedNodeIds(downstreamNodeIds);
    setHighlightedEdgeIds(downstreamEdgeIds);
  }, [rawEdges]);

  // Show loading / error states
  if (loading) {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          bgcolor: '#0f0f1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ color: '#a5b4fc' }}>
          Loading operational intelligence nodes...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          bgcolor: '#0f0f1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => window.location.reload()} 
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        bgcolor: '#0f0f1a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 20,
          bgcolor: 'rgba(20, 20, 40, 0.65)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(100, 100, 255, 0.18)',
          px: 2.5,
          py: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <Typography
          variant="caption"
          fontWeight={400}
          sx={{
            color: '#a5b4fc',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: '0.80rem',
          }}
        >
          OPERATIONAL INTELLIGENCE NODES
        </Typography> 
      </Box>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        onPaneClick={clearHighlights}
        fitView
        deleteKeyCode={null}
        minZoom={0.4}
        maxZoom={2.2}
        style={{ width: '100%', height: '100%' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={32} size={1.5} variant="dots" />
        <Controls
          position="bottom-right"
          style={{
            background: 'rgba(15, 15, 30, 0.7)',
            border: '1px solid rgba(100, 100, 255, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
          }}
        />
      </ReactFlow>

      {selectedNodeData && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 25,
            bgcolor: 'rgba(15, 15, 40, 0.92)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(100, 100, 255, 0.3)',
            p: 2.5,
            maxWidth: 380,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#a5b4fc' }}>
              Selected eHuman
            </Typography>
            <Chip
              label={selectedNodeData.ComplianceLevel}
              size="small"
              sx={{
                bgcolor: getComplianceColor(selectedNodeData.ComplianceLevel),
                color: '#000',
                fontWeight: 600,
              }}
            />
          </Stack>

          <Typography variant="h6" sx={{ color: '#f1f5f9', mb: 1 }}>
            {selectedNodeData.eHumanName}
          </Typography>

          <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 0.5 }}>
            Operation: {selectedNodeData.OperationType}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 0.5 }}>
            IQ: {selectedNodeData.IQ}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
            Assigned To: {selectedNodeData.AssignTo}
          </Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => console.log(`Assign: ${selectedNodeData.eHumanName}`)}
              sx={{ minWidth: 90, textTransform: 'none', fontWeight: 600 }}
            >
              Reassign
            </Button>

            <IconButton
              size="small"
              onClick={clearHighlights}
              sx={{
                color: '#94a3b8',
                '&:hover': { color: '#f87171', bgcolor: 'rgba(248,113,113,0.08)' },
              }}
              aria-label="close"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      )}
    </Box>
  );
}