'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * Interface for the data fetched from the C# API
 * This matches the SpatialMarkerDto structure
 * @typedef {Object} SpatialMarker
 * @property {number} id
 * @property {string} shapeType - 'sphere' or 'box'
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} [size]
 * @property {string} [colorHex]
 * @property {string} [name]
 */

function HomeTab() {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const [markers, setMarkers] = useState([]); // User-placed markers
  const [permanentMarkers, setPermanentMarkers] = useState([]); // API-fetched markers
  const [lastClick, setLastClick] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to create a 3D text label using a standard THREE.js Sprite
  const createTextSprite = (text, position) => {
    // 1. Create canvas for text rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set font, size, and measure text
    const fontSize = 50;
    const fontFace = 'Arial';
    context.font = `Bold ${fontSize}px ${fontFace}`;
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize * 1.5;

    // Set canvas dimensions
    const padding = 10;
    canvas.width = textWidth + padding * 2;
    canvas.height = textHeight + padding * 2;
    
    // Re-set font and drawing properties after canvas size change
    context.font = `Bold ${fontSize}px ${fontFace}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = "rgba(255, 255, 255, 0.8)"; // Light background for text box
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(0, 0, 0, 1.0)"; // Black text
    
    // Draw the text in the center of the canvas
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // 2. Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // 3. Create material and sprite
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true 
    });
    const sprite = new THREE.Sprite(spriteMaterial);

    // 4. Scale the sprite (adjust size based on canvas dimensions and desired world scale)
    // Scale factor determined to keep text readable
    const scaleFactor = 0.02; 
    sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);
    
    // Set position, slightly above the marker
    sprite.position.set(position.x, position.y + 0.5, position.z);
    
    return sprite;
  };
  
  /**
   * Renders a single marker (sphere or box) based on the fetched API data.
   * @param {SpatialMarker} markerData
   * @param {THREE.Scene} scene
   */
  const renderAPIMarker = useCallback((markerData, scene) => {
    const { shapeType, x, y, z, size = 1, colorHex = '#FFFFFF', name } = markerData;
    let geometry;

    // Determine geometry based on the C# DTO's shapeType
    if (shapeType === 'sphere') {
      geometry = new THREE.SphereGeometry(size / 2, 32, 32);
    } else if (shapeType === 'box') {
      geometry = new THREE.BoxGeometry(size, size, size);
    } else {
      console.warn(`Unknown shapeType: ${shapeType}`);
      return;
    }

    // Use MeshLambertMaterial since the scene has lighting
    const material = new THREE.MeshLambertMaterial({ color: new THREE.Color(colorHex) });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.name = `PermanentMarker_${markerData.id}`; // Give it a unique name for identification
    scene.add(mesh);

    // Add a text label if a name is provided
    if (name) {
      const label = createTextSprite(name, mesh.position);
      label.name = `PermanentLabel_${markerData.id}`; // Give label a name too
      scene.add(label);
    }
  }, []); 

  /**
   * Clears existing permanent markers from the scene by their name.
   * @param {THREE.Scene} scene
   */
  const clearPermanentMarkers = useCallback((scene) => {
    const objectsToRemove = [];
    scene.traverse((object) => {
      // Check for both the permanent marker mesh name and the label name
      if (object.name.startsWith('PermanentMarker_') || object.name.startsWith('PermanentLabel_')) {
        objectsToRemove.push(object);
      }
    });
    objectsToRemove.forEach(object => {
      // Dispose of geometry and material to free up memory
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (object.material.map) object.material.map.dispose(); // Dispose of the texture used by the Sprite
        object.material.dispose();
      }
      scene.remove(object);
    });
  }, []);

  // --- SCENE SETUP AND INITIAL API FETCH ---
  useEffect(() => {
    const scene = sceneRef.current;
    
    // Use container dimensions for a contained canvas
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(
      75,
      width / height, 
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height); 
    renderer.setClearColor(0xf0f0f0); // Light gray background
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Lighting
    scene.add(new THREE.AmbientLight(0x404040, 5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Grid Helpers
    const gridHelper = new THREE.GridHelper(10, 10, 0x000000, 0xcccccc);
    gridHelper.rotation.x = Math.PI / 2; // XY plane
    scene.add(gridHelper);
    const gridHelperXZ = new THREE.GridHelper(10, 10, 0x000000, 0xcccccc);
    gridHelperXZ.position.y = -5; // XZ plane
    scene.add(gridHelperXZ);
    const gridHelperYZ = new THREE.GridHelper(10, 10, 0x000000, 0xcccccc);
    gridHelperYZ.rotation.z = Math.PI / 2; // YZ plane
    gridHelperYZ.position.x = -5; // Shift left
    scene.add(gridHelperYZ);

    // Axes (X: red, Y: green, Z: blue)
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // 2. API Data Fetching
    const fetchAndRenderPermanentMarkers = async () => {
      try {
        setLoading(true);
        // Note: The /api prefix works assuming the C# API is running alongside the React app
        const response = await fetch('/api/SpatialEnvironment/markers');
        
        if (!response.ok) {
          // *** ENHANCED DEBUGGING: Log the exact status before throwing ***
          console.error(`API Fetch Error: Received status ${response.status} (${response.statusText}) from /api/SpatialEnvironment/markers`);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        /** @type {SpatialMarker[]} */
        const data = await response.json();
        
        // Clear old markers before rendering new ones
        clearPermanentMarkers(scene);

        // Render each permanent marker fetched from the API
        data.forEach(marker => renderAPIMarker(marker, scene));
        setPermanentMarkers(data); // Store data in state for UI display

      } catch (error) {
        // This catch block handles network errors (fetch failure) or the thrown HTTP error
        console.error("Failed to fetch permanent markers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndRenderPermanentMarkers();

    // Raycaster for clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      // Normalize mouse coordinates (-1 to 1) based on container bounds
      const bounds = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      // Raycast to XY grid plane (z=0)
      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // XY plane at z=0
      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersect);

      if (intersect) {
        // Snap to nearest grid point (1-unit grid)
        const x = Math.round(intersect.x);
        const y = Math.round(intersect.y);
        const z = 0; // Fixed to XY plane for simplicity
        setLastClick({ x, y, z });

        // Add marker (sphere)
        const markerGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x, y, z);
        scene.add(marker);

        // Update markers state
        setMarkers((prev) => [...prev, { x, y, z }]);
      }
    };

    // Attach click listener to the window as per your original code
    window.addEventListener('click', onClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const onResize = () => {
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [clearPermanentMarkers, renderAPIMarker]); // Dependencies for useEffect

  return (
    <Box sx={{ position: 'relative', height: '100vh' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {/* Updated Info Box with Permanent Marker data */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          minWidth: 250
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, borderBottom: '1px solid #ddd' }}>
          Spatial Monitor
        </Typography>

        {/* Last Click Info */}
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
          User Click
        </Typography>
        <Typography variant="body2">
          Last click:{' '}
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            {lastClick
              ? `(${lastClick.x}, ${lastClick.y}, ${lastClick.z})`
              : 'None'}
          </Box>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Total user markers: {markers.length}
        </Typography>
        
        {/* API Permanent Markers */}
        <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 0.5, borderTop: '1px solid #eee', pt: 1 }}>
          Object Assets ({permanentMarkers.length})
        </Typography>
        
        {loading ? (
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'gray' }}>
            Loading markers from API...
          </Typography>
        ) : permanentMarkers.length === 0 ? (
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'error.main' }}>
            No API markers found. Check API connection.
          </Typography>
        ) : (
          <Box sx={{ maxHeight: 200, overflowY: 'auto', mt: 1, p: 1, border: '1px solid #f0f0f0', borderRadius: 1 }}>
            {permanentMarkers.map((marker) => (
              <Typography key={marker.id} variant="caption" display="block" sx={{ color: marker.colorHex || '#000' }}>
                {marker.name || marker.shapeType}: ({marker.x}, {marker.y}, {marker.z})
              </Typography>
            ))}
          </Box>
        )}

      </Box>
    </Box>
  );
}

export default HomeTab;
