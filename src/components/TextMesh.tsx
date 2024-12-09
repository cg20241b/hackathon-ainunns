import { useLoader } from '@react-three/fiber';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

interface TextMeshProps {
  position: [number, number, number];
  text: string;
  color: string;
}

export default function TextMesh({ position, text, color }: TextMeshProps) {
  const font = useLoader(
    FontLoader,
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  );
  const textOptions = {
    font,
    size: 1,
    height: 0.2,
  };

  const textGeometry = new TextGeometry(text, textOptions);

  return (
    <mesh position={position} geometry={textGeometry}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
