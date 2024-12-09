import * as React from 'react';
import * as THREE from 'three';

export default function GlowingCube() {
  const glowMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Vector3(1, 1, 1) },
        opacity: { value: 1 },
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vPosition;
        void main() {
          gl_FragColor = vec4(color, opacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: 1,
    });
  }, []);

  return (
    <>
      <mesh position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={glowMaterial} attach='material' />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color='white'
        distance={5}
        decay={2}
      />
    </>
  );
}
