import { useThree } from '@react-three/fiber';
import * as React from 'react';

export default function CameraControls() {
  // Get the camera object from the useThree hook
  const { camera } = useThree();
  // Create a ref to store the camera object
  const cameraRef = React.useRef(camera);

  React.useEffect(() => {
    // Define a function to handle keydown events
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        // Move the camera left when 'a' or 'A' is pressed
        case 'a':
        case 'A':
          cameraRef.current.position.x -= 0.1;
          break;
        // Move the camera right when 'd' or 'D' is pressed
        case 'd':
        case 'D':
          cameraRef.current.position.x += 0.1;
          break;
      }
    };

    // Add the keydown event listener to the window
    window.addEventListener('keydown', handleKeyDown);
    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return null; // This component does not render anything
}
