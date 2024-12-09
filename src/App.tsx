import { Canvas } from '@react-three/fiber';

import CameraControls from './components/CameraControls';
import GlowingCube from './components/GlowingCube';
import TextMesh from './components/TextMesh';

const App = () => {
  const studentIdLastThreeDigits = 753;
  const abc = studentIdLastThreeDigits + 200;
  const ambientIntensity = abc / 1000;

  return (
    <Canvas>
      <ambientLight intensity={ambientIntensity} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <TextMesh
        position={[-4, -1, 0]}
        text='N'
        color={0x87ceeb}
        type='alphabet'
        ambientIntensity={ambientIntensity}
      />
      <GlowingCube />
      <TextMesh
        position={[2, -1, 0]}
        text='3'
        color={0xfc976c}
        type='digit'
        ambientIntensity={ambientIntensity}
      />
      <CameraControls />
    </Canvas>
  );
};

export default App;
