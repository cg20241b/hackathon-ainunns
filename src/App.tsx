import { Canvas } from '@react-three/fiber';

import GlowingCube from './components/GlowingCube';
import TextMesh from './components/TextMesh';

const App = () => {
  const studentIdLastThreeDigits = 53;
  const abc = studentIdLastThreeDigits + 200;
  const ambientIntensity = abc / 1000;

  return (
    <Canvas>
      <ambientLight intensity={ambientIntensity} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      <TextMesh
        position={[-3, 0, 0]}
        text='N'
        color='#87CEEB'
        type='alphabet'
      />
      <GlowingCube />
      <TextMesh position={[2.5, 0, 0]} text='3' color='#FC976C' type='digit' />
    </Canvas>
  );
};

export default App;
