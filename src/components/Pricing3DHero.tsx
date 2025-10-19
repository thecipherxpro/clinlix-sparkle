import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, Float } from '@react-three/drei';
import { Suspense } from 'react';

function House({ position, scale, color, bedroomCount }: { position: [number, number, number], scale: number, color: string, bedroomCount: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position} scale={scale}>
        {/* House Base */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2, 1.5, 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.6, 1, 4]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Door */}
        <mesh position={[0, -0.25, 1.01]}>
          <boxGeometry args={[0.5, 0.8, 0.05]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Windows */}
        <mesh position={[-0.5, 0.2, 1.01]}>
          <boxGeometry args={[0.4, 0.4, 0.05]} />
          <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.5, 0.2, 1.01]}>
          <boxGeometry args={[0.4, 0.4, 0.05]} />
          <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Bedroom Count Label */}
        <Center position={[0, 2, 0]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.3}
            height={0.1}
            curveSegments={12}
          >
            {bedroomCount}BR
            <meshStandardMaterial color="#ffffff" emissive="#4A90E2" emissiveIntensity={0.5} />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}

function PriceTag({ position, price, currency }: { position: [number, number, number], price: string, currency: string }) {
  return (
    <Float speed={3} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={position}>
        {/* Tag Background */}
        <mesh>
          <boxGeometry args={[1.5, 0.6, 0.1]} />
          <meshStandardMaterial color="#FFD700" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Price Text */}
        <Center position={[0, 0, 0.06]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.25}
            height={0.05}
            curveSegments={12}
          >
            {currency}{price}
            <meshStandardMaterial color="#000000" />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}

export default function Pricing3DHero({ currency, prices }: { currency: string, prices: { br1: number, br2: number, br3: number } }) {
  return (
    <div className="w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }} shadows>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8} 
            castShadow 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.4} />
          
          {/* Houses */}
          <House position={[-4, 0, 0]} scale={0.8} color="#4A90E2" bedroomCount={1} />
          <House position={[0, 0, 0]} scale={1} color="#5CB85C" bedroomCount={2} />
          <House position={[4, 0, 0]} scale={1.2} color="#F0AD4E" bedroomCount={3} />
          
          {/* Price Tags */}
          <PriceTag position={[-4, -1.5, 0]} price={prices.br1.toString()} currency={currency} />
          <PriceTag position={[0, -1.5, 0]} price={prices.br2.toString()} currency={currency} />
          <PriceTag position={[4, -1.5, 0]} price={prices.br3.toString()} currency={currency} />
          
          {/* Ground plane for shadows */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.2} />
          </mesh>
          
          {/* Controls */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}