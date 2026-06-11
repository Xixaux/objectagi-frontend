'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Html } from '@react-three/drei';
import { Box, Typography, CircularProgress, Avatar, Stack, Tooltip } from '@mui/material';

const AQUA_BLUE = '#00A4EF';
const SCAN_GREEN = '#00FF41';

// We'll keep these hardcoded for now so your app doesn't crash 
// looking for an API endpoint that doesn't exist yet.
const EHUMAN_LIBRARY = [
  { id: 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df', name: 'Abbos Kosimov', avatar: '/assets/images/avatars/male-04.jpg', title: 'Principal Architect' },
  { id: 'c674b6e1-b846-4bba-824b-0b4df0cdec48', name: 'Jillian McKenzie', avatar: '/assets/images/avatars/female-20.jpg', title: 'Insurance Analyst' },
  { id: 'cd5fa417-b667-482d-b208-798d9da3213c', name: 'Michael Corleone', avatar: '/assets/images/avatars/male-01.jpg', title: 'Track Service Worker' },
  { id: '3acb10c1-6a39-4d7e-a453-ecff42f9c173', name: 'Celia Woodrow', avatar: '/assets/images/avatars/female-01.jpg', title: 'Firehouse LLC' },
];

interface BrainRegion {
  id: number;
  regionName: string;
  status: string;
  loadPercentage: number;
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
}

function BrainArrow({ region }: { region: BrainRegion }) {
  return (
    <group position={[region.posX, region.posY, region.posZ]} rotation={[region.rotX, region.rotY, region.rotZ]}>
      <mesh>
        <cylinderGeometry args={[0.005, 0.005, 0.6, 8]} />
        <meshStandardMaterial color={AQUA_BLUE} emissive={AQUA_BLUE} emissiveIntensity={1} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={region.status === 'Processing' ? SCAN_GREEN : AQUA_BLUE} emissive={region.status === 'Processing' ? SCAN_GREEN : AQUA_BLUE} />
      </mesh>
      <Html position={[0, -0.45, 0]} center distanceFactor={8}>
        <div style={{ background: 'rgba(5, 10, 20, 0.85)', color: 'white', padding: '6px 10px', borderLeft: `3px solid ${AQUA_BLUE}`, fontSize: '9px', fontFamily: 'monospace', backdropFilter: 'blur(4px)' }}>
          <div style={{ color: AQUA_BLUE, fontWeight: 'bold' }}>{region.regionName.toUpperCase()}</div>
          <div style={{ display: 'flex', gap: '8px', opacity: 0.8 }}>
            <span>STAT: <span style={{ color: region.status === 'Processing' ? SCAN_GREEN : 'white' }}>{region.status}</span></span>
            <span>LOAD: {region.loadPercentage}%</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function BrainModel() {
  const { scene } = useGLTF('/assets/threed/brain_project.glb');
  return <primitive object={scene} scale={2.4} position={[0, 0, 0]} />;
}

export default function NeuralCoreView() {
  const [regions, setRegions] = useState<BrainRegion[]>([]);
  const [activeEHuman, setActiveEHuman] = useState(EHUMAN_LIBRARY[0]); 
  const [loading, setLoading] = useState(true);

  // Telemetry Sync: ONLY fetch the neural regions from your existing controller
  useEffect(() => {
    setLoading(true);
    fetch(`/api/CognitiveModelView?ehumanId=${activeEHuman.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Check your backend controller!");
        return res.json();
      })
      .then((data) => {
        setRegions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Neural Link Error:", err);
        setLoading(false);
      });
  }, [activeEHuman]);

  return (
    <Box sx={{ height: '100vh', width: '100%', bgcolor: '#06090f', position: 'relative', overflow: 'hidden' }}>
      
      {/* HUD: Top Left */}
      <Box sx={{ position: 'absolute', top: 40, left: 40, zIndex: 10 }}>
        <Typography variant="h4" sx={{ color: AQUA_BLUE, fontWeight: 900, letterSpacing: '4px' }}>
          NEURAL <span style={{ color: 'white', opacity: 0.8 }}>CORE</span>
        </Typography>
        <Typography variant="caption" sx={{ color: SCAN_GREEN, fontFamily: 'monospace', display: 'block' }}>
          ● ACTIVE_LINK: {activeEHuman.name.toUpperCase()}
        </Typography>
      </Box>

      {/* HUD: Bottom Left eHuman Selector */}
      <Box sx={{ position: 'absolute', bottom: 40, left: 40, zIndex: 10 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', mb: 1, display: 'block' }}>
          LOCAL_INTERFACE_LIBRARY
        </Typography>
        <Stack direction="row" spacing={2}>
          {EHUMAN_LIBRARY.map((human) => (
            <Tooltip key={human.id} title={`${human.name} (${human.title})`} arrow>
              <Avatar
                src={human.avatar}
                onClick={() => setActiveEHuman(human)}
                sx={{ 
                  cursor: 'pointer',
                  width: 45, height: 45,
                  border: activeEHuman.id === human.id ? `2px solid ${SCAN_GREEN}` : '2px solid rgba(255,255,255,0.1)',
                  opacity: activeEHuman.id === human.id ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  '&:hover': { opacity: 1, transform: 'scale(1.1)' }
                }}
              />
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* HUD: Right Sidebar */}
      {!loading && (
        <Box sx={{ position: 'absolute', right: 40, top: 40, textAlign: 'right', pointerEvents: 'none', zIndex: 10 }}>
          <Typography sx={{ color: AQUA_BLUE, fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold', mb: 2 }}>
            {activeEHuman.name.split(' ')[0].toUpperCase()}_TELEMETRY
          </Typography>
          {regions.map((r) => (
            <Typography key={r.id} sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '10px', mt: 0.5 }}>
              {r.regionName} >> <span style={{ color: AQUA_BLUE }}>{r.loadPercentage}%</span>
            </Typography>
          ))}
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: AQUA_BLUE }} />
        </Box>
      ) : (
        <Canvas camera={{ position: [14, 12, 20], fov: 40 }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.5} contactShadow={false}>
              <BrainModel />
              {regions.map(region => (
                <BrainArrow key={region.id} region={region} />
              ))}
            </Stage>
            <OrbitControls autoRotate autoRotateSpeed={0.5} enablePan={false} minDistance={8} maxDistance={30} />
          </Suspense>
        </Canvas>
      )}

      {/* Grid Overlay */}
      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
        pointerEvents: 'none', 
        backgroundImage: `linear-gradient(rgba(0, 164, 239, 0.05) 1px, transparent 1px), 
                          linear-gradient(90deg, rgba(0, 164, 239, 0.05) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
    </Box>
  );
}