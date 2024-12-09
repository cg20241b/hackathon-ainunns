import { useThree } from '@react-three/fiber';
import * as React from 'react';

export default function CameraControls() {
  const { camera } = useThree();
  const cameraRef = React.useRef(camera);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'a':
        case 'A':
          cameraRef.current.position.x -= 0.1;
          break;
        case 'd':
        case 'D':
          cameraRef.current.position.x += 0.1;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
