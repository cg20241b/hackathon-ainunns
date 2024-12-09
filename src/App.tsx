import { Canvas } from '@react-three/fiber';

import GlowingCube from './components/GlowingCube';
import TextMesh from './components/TextMesh';

const App = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <TextMesh position={[-3, 0, 0]} text='N' color='#87CEEB' />
      <GlowingCube />
      <TextMesh position={[2.5, 0, 0]} text='3' color='#FC976C' />
    </Canvas>
  );
};

export default App;
