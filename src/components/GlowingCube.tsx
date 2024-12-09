import * as React from 'react';
import * as THREE from 'three';

// Export the cube's position so it can be used by other components
export const cubePosition = new THREE.Vector3(0, 0, 0);

// Vertex shader code
const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal); // Normalize the normal vector
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0)); // Transform the position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // Set the position
  }
`;

// Fragment shader code
const fragmentShader = `
  uniform vec3 color;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal); // Normalize the normal vector
    vec3 glow = color * 3.0; // Increase the intensity to simulate glow
    gl_FragColor = vec4(glow, 1.0); // Set the fragment color
  }
`;

export default function GlowingCube() {
  // Create a ref to store the mesh object
  const meshRef = React.useRef<THREE.Mesh>(null);

  // Create the glow material using the shaders
  const glowMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        color: { value: new THREE.Color(0xffffff) }, // Set the color uniform
      },
      side: THREE.FrontSide, // Render only the front side
      transparent: true, // Enable transparency
      blending: THREE.AdditiveBlending, // Additive blending for glow effect
    });
  }, []);

  // Effect to handle keydown events
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (meshRef.current) {
        switch (event.key) {
          case 'w':
          case 'W':
            meshRef.current.position.y += 0.1; // Move the cube up
            break;
          case 's':
          case 'S':
            meshRef.current.position.y -= 0.1; // Move the cube down
            break;
        }
        cubePosition.copy(meshRef.current.position); // Update the cube position
      }
    };

    // Add the keydown event listener to the window
    window.addEventListener('keydown', handleKeyDown);
    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <>
      <mesh ref={meshRef} position={cubePosition} scale={[0.5, 0.5, 0.5]}>
        {/* Create a box geometry */}
        <boxGeometry args={[1, 1, 1]} />
        {/* Attach the glow material */}
        <primitive object={glowMaterial} attach='material' />{' '}
      </mesh>
      {/* Add a point light at the cube's position */}
      <pointLight position={cubePosition} intensity={2} />{' '}
    </>
  );
}
