import { useLoader } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

interface TextMeshProps {
  position: [number, number, number];
  text: string;
  color: string;
  type: 'alphabet' | 'digit';
}

const alphabetVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const alphabetFragmentShader = `
  uniform vec3 lightPosition;
  uniform vec3 viewPosition;
  uniform vec3 color;
  uniform float ambientIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightPosition - vPosition);
    vec3 viewDir = normalize(viewPosition - vPosition);

    // Ambient
    vec3 ambient = ambientIntensity * color;

    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * color;

    // Specular (Plastic)
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0); // Moderate shininess
    vec3 specular = spec * vec3(1.0);

    vec3 result = ambient + diffuse + specular;
    gl_FragColor = vec4(result, 1.0);
  }
`;

const digitVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const digitFragmentShader = `
  uniform vec3 lightPosition;
  uniform vec3 viewPosition;
  uniform vec3 color;
  uniform float ambientIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightPosition - vPosition);
    vec3 viewDir = normalize(viewPosition - vPosition);

    // Ambient
    vec3 ambient = ambientIntensity * color;

    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * color;

    // Specular (Metal)
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0); // Higher shininess for metallic look
    vec3 specular = spec * color;

    vec3 result = ambient + diffuse + specular;
    gl_FragColor = vec4(result, 1.0);
  }
`;

export default function TextMesh({
  position,
  text,
  color,
  type,
}: TextMeshProps) {
  const font = useLoader(
    FontLoader,
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  );
  const textOptions = {
    font,
    size: 1,
    depth: 0.2,
  };

  const textGeometry = new TextGeometry(text, textOptions);

  const lightPosition = new THREE.Vector3(0, 0, 0);
  const viewPosition = new THREE.Vector3(0, 0, 5);
  const ambientIntensity = 0.323; // Replace with your calculated ambient intensity

  const shaderMaterial = React.useMemo(() => {
    const vertexShader =
      type === 'alphabet' ? alphabetVertexShader : digitVertexShader;
    const fragmentShader =
      type === 'alphabet' ? alphabetFragmentShader : digitFragmentShader;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        lightPosition: { value: lightPosition },
        viewPosition: { value: viewPosition },
        color: { value: new THREE.Color(color) },
        ambientIntensity: { value: ambientIntensity },
      },
      side: THREE.FrontSide,
    });
  }, [type, color, lightPosition, viewPosition, ambientIntensity]);

  return (
    <mesh position={position} geometry={textGeometry}>
      <primitive object={shaderMaterial} attach='material' />
    </mesh>
  );
}
