import { useFrame, useLoader } from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import { cubePosition } from './GlowingCube';

interface TextMeshProps {
  position: [number, number, number];
  text: string;
  color: number;
  type: 'alphabet' | 'digit';
  ambientIntensity: number;
}

const alphabetVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vVerticalFactor;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    // Calculate vertical factor based on world-space position
    vVerticalFactor = position.y;
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

    // Calculate vertical gradient based on light position
    float verticalGradient = smoothstep(-1.0, 1.0, lightPosition.y);

    // Modify lighting based on vertical position
    float lightIntensity = dot(normal, lightDir);
    
    // Create a gradient effect based on vertical position
    float gradientEffect = mix(
      1.0 - verticalGradient,  // Bottom lighting when cube is low
      verticalGradient,         // Top lighting when cube is high
      vPosition.y               // Use vertical position of the mesh
    );

    // Ambient
    vec3 ambient = ambientIntensity * color;

    // Diffuse
    float diff = max(lightIntensity, 0.0) * gradientEffect;
    vec3 diffuse = diff * color;

    // Specular (Plastic)
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0) * gradientEffect;
    vec3 specular = spec * vec3(1.0);

    vec3 result = ambient + diffuse + specular;
    gl_FragColor = vec4(result, 1.0);
  }
`;

const digitVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vVerticalFactor;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    // Calculate vertical factor based on world-space position
    vVerticalFactor = position.y;
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

    // Calculate vertical gradient based on light position
    float verticalGradient = smoothstep(-1.0, 1.0, lightPosition.y);

    // Modify lighting based on vertical position
    float lightIntensity = dot(normal, lightDir);
    
    // Create a gradient effect based on vertical position
    float gradientEffect = mix(
      1.0 - verticalGradient,  // Bottom lighting when cube is low
      verticalGradient,         // Top lighting when cube is high
      vPosition.y               // Use vertical position of the mesh
    );

    // Ambient
    vec3 ambient = ambientIntensity * color;

    // Diffuse
    float diff = max(lightIntensity, 0.0) * gradientEffect;
    vec3 diffuse = diff * color;

    // Specular (Metal)
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0) * gradientEffect;
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
  ambientIntensity,
}: TextMeshProps) {
  const font = useLoader(
    FontLoader,
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  );
  const textOptions = {
    font,
    size: 2,
    height: 0.2,
  };

  const textGeometry = React.useMemo(
    () => new TextGeometry(text, textOptions),
    [text, textOptions],
  );

  const viewPosition = new THREE.Vector3(0, 0, 5);

  const shaderMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader:
        type === 'alphabet' ? alphabetVertexShader : digitVertexShader,
      fragmentShader:
        type === 'alphabet' ? alphabetFragmentShader : digitFragmentShader,
      uniforms: {
        lightPosition: { value: cubePosition.clone() },
        viewPosition: { value: viewPosition },
        color: { value: new THREE.Color(color) },
        ambientIntensity: { value: ambientIntensity },
      },
      side: THREE.FrontSide,
    });
  }, [type, color, ambientIntensity]);

  useFrame(() => {
    shaderMaterial.uniforms.lightPosition.value.copy(cubePosition);
  });

  return (
    <mesh position={position} geometry={textGeometry}>
      <primitive object={shaderMaterial} attach='material' />
    </mesh>
  );
}
