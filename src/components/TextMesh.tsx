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
    vNormal = normalize(normalMatrix * normal); // Normalize the normal vector
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0)); // Transform the position
    // Calculate vertical factor based on world-space position
    vVerticalFactor = position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // Set the position
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
    vec3 normal = normalize(vNormal); // Normalize the normal vector
    vec3 lightDir = normalize(lightPosition - vPosition); // Calculate the light direction
    vec3 viewDir = normalize(viewPosition - vPosition); // Calculate the view direction

    // Calculate vertical gradient based on light position
    float verticalGradient = smoothstep(-1.0, 1.0, lightPosition.y);

    // Modify lighting based on vertical position
    float lightIntensity = dot(normal, lightDir); // Calculate the light intensity
    
    // Create a gradient effect based on vertical position
    float gradientEffect = mix(
      1.0 - verticalGradient,  // Bottom lighting when cube is low
      verticalGradient,         // Top lighting when cube is high
      vPosition.y               // Use vertical position of the mesh
    );

    // Ambient
    vec3 ambient = ambientIntensity * color; // Calculate the ambient component

    // Diffuse
    float diff = max(lightIntensity, 0.0) * gradientEffect; // Calculate the diffuse component
    vec3 diffuse = diff * color;

    // Specular (Plastic)
    vec3 reflectDir = reflect(-lightDir, normal); // Calculate the reflection direction
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0) * gradientEffect; // Calculate the specular component
    vec3 specular = spec * vec3(1.0);

    vec3 result = ambient + diffuse + specular; // Combine the components
    gl_FragColor = vec4(result, 1.0); // Set the fragment color
  }
`;

const digitVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vVerticalFactor;
  void main() {
    vNormal = normalize(normalMatrix * normal); // Normalize the normal vector
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0)); // Transform the position
    // Calculate vertical factor based on world-space position
    vVerticalFactor = position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // Set the position
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
    vec3 normal = normalize(vNormal); // Normalize the normal vector
    vec3 lightDir = normalize(lightPosition - vPosition); // Calculate the light direction
    vec3 viewDir = normalize(viewPosition - vPosition); // Calculate the view direction

    // Calculate vertical gradient based on light position
    float verticalGradient = smoothstep(-1.0, 1.0, lightPosition.y);

    // Modify lighting based on vertical position
    float lightIntensity = dot(normal, lightDir); // Calculate the light intensity
    
    // Create a gradient effect based on vertical position
    float gradientEffect = mix(
      1.0 - verticalGradient,  // Bottom lighting when cube is low
      verticalGradient,         // Top lighting when cube is high
      vPosition.y               // Use vertical position of the mesh
    );

    // Ambient
    vec3 ambient = ambientIntensity * color; // Calculate the ambient component

    // Diffuse
    float diff = max(lightIntensity, 0.0) * gradientEffect; // Calculate the diffuse component
    vec3 diffuse = diff * color;

    // Specular (Metal)
    vec3 halfDir = normalize(lightDir + viewDir); // Calculate the half vector
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0) * gradientEffect; // Calculate the specular component
    vec3 specular = spec * color;

    vec3 result = ambient + diffuse + specular; // Combine the components
    gl_FragColor = vec4(result, 1.0); // Set the fragment color
  }
`;

export default function TextMesh({
  position,
  text,
  color,
  type,
  ambientIntensity,
}: TextMeshProps) {
  // Load the font using FontLoader
  const font = useLoader(
    FontLoader,
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  );

  // Define text options for TextGeometry
  const textOptions = {
    font,
    size: 2,
    height: 0.2,
  };

  // Memoize the TextGeometry to avoid unnecessary re-creations
  const textGeometry = React.useMemo(
    () => new TextGeometry(text, textOptions),
    [text, textOptions],
  );

  // Define the view position (camera position)
  const viewPosition = new THREE.Vector3(0, 0, 5);

  // Memoize the ShaderMaterial to avoid unnecessary re-creations
  const shaderMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader:
        type === 'alphabet' ? alphabetVertexShader : digitVertexShader,
      fragmentShader:
        type === 'alphabet' ? alphabetFragmentShader : digitFragmentShader,
      uniforms: {
        lightPosition: { value: cubePosition.clone() }, // Set the initial light position
        viewPosition: { value: viewPosition }, // Set the view position
        color: { value: new THREE.Color(color) }, // Set the color
        ambientIntensity: { value: ambientIntensity }, // Set the ambient intensity
      },
      side: THREE.FrontSide, // Render only the front side
    });
  }, [type, color, ambientIntensity]);

  // Update the light position uniform in the shader material dynamically
  useFrame(() => {
    shaderMaterial.uniforms.lightPosition.value.copy(cubePosition);
  });

  return (
    <mesh position={position} geometry={textGeometry}>
      <primitive object={shaderMaterial} attach='material' />
    </mesh>
  );
}
