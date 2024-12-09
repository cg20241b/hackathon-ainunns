import * as React from 'react';
import * as THREE from 'three';

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
  uniform vec3 lightPosition;
  uniform vec3 viewPosition;
  uniform vec3 color;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightPosition - vPosition);
    vec3 viewDir = normalize(viewPosition - vPosition);

    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);

    // Specular
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0); // Higher shininess for metallic look

    vec3 result = (0.1 + diff + spec) * color; // Ambient + Diffuse + Specular
    gl_FragColor = vec4(result, 1.0);
  }
`;

export default function GlowingCube() {
  const lightPosition = new THREE.Vector3(0, 0, 0);
  const viewPosition = new THREE.Vector3(0, 0, 5);
  const meshRef = React.useRef<THREE.Mesh>(null);

  const glowMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        lightPosition: { value: lightPosition },
        viewPosition: { value: viewPosition },
        color: { value: new THREE.Color(0xffffff) },
      },
      side: THREE.FrontSide,
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={glowMaterial} attach='material' />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2} />
    </>
  );
}
