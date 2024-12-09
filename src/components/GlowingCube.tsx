import * as React from 'react';
import * as THREE from 'three';

export const cubePosition = new THREE.Vector3(0, 0, 0);

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 color;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 glow = color * 3.0; // Increase the intensity to simulate glow
    gl_FragColor = vec4(glow, 1.0);
  }
`;

export default function GlowingCube() {
  const meshRef = React.useRef<THREE.Mesh>(null);

  const glowMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
      },
      side: THREE.FrontSide,
      transparent: true,
      blending: THREE.AdditiveBlending, // Additive blending for glow effect
    });
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (meshRef.current) {
        switch (event.key) {
          case 'w':
          case 'W':
            meshRef.current.position.y += 0.1;
            break;
          case 's':
          case 'S':
            meshRef.current.position.y -= 0.1;
            break;
        }
        cubePosition.copy(meshRef.current.position);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <mesh ref={meshRef} position={cubePosition} scale={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={glowMaterial} attach='material' />
      </mesh>
      <pointLight position={cubePosition} intensity={2} />
    </>
  );
}
