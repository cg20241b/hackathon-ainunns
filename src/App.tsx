import { Canvas } from '@react-three/fiber';

import CameraControls from './components/CameraControls';
import GlowingCube from './components/GlowingCube';
import TextMesh from './components/TextMesh';

const App = () => {
  const studentIdLastThreeDigits = 53; // Define the last three digits of the student ID
  const abc = studentIdLastThreeDigits + 200; // Calculate abc by adding 200 to the last three digits of the student ID
  const ambientIntensity = abc / 1000; // Calculate the ambient light intensity

  return (
    <Canvas>
      <ambientLight intensity={ambientIntensity} />{' '}
      {/* Add an ambient light with the calculated intensity */}
      <pointLight position={[10, 10, 10]} intensity={1} />{' '}
      {/* Add a point light at the specified position with intensity 1 */}
      <TextMesh
        position={[-4, -1, 0]} // Position the text mesh
        text='N' // Set the text to 'N'
        color={0x87ceeb} // Set the color to light blue
        type='alphabet' // Set the type to 'alphabet'
        ambientIntensity={ambientIntensity} // Pass the ambient light intensity
      />
      <GlowingCube /> {/* Add the glowing cube */}
      <TextMesh
        position={[2, -1, 0]} // Position the text mesh
        text='3' // Set the text to '3'
        color={0xfc976c} // Set the color to light coral
        type='digit' // Set the type to 'digit'
        ambientIntensity={ambientIntensity} // Pass the ambient light intensity
      />
      <CameraControls /> {/* Add the camera controls */}
    </Canvas>
  );
};

export default App;
