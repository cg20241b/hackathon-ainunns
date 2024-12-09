import { Canvas } from '@react-three/fiber';

import TextMesh from './components/TextMesh';

const App = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <TextMesh position={[-2, 0, 0]} text='N' />
      <TextMesh position={[2, 0, 0]} text='3' />
    </Canvas>
  );
};

export default App;
