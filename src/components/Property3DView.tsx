import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from "@react-three/drei";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Furniture Components
const Bed = ({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
        {/* Frame */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[2, 0.6, 3]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        {/* Mattress */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.3, 2.9]} />
            <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Pillow */}
        <mesh position={[0, 0.95, -1.2]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.2, 0.5]} />
            <meshStandardMaterial color="#eeeeee" />
        </mesh>
        {/* Blanket */}
        <mesh position={[0, 0.75, 0.5]} castShadow receiveShadow>
            <boxGeometry args={[1.92, 0.32, 1.9]} />
            <meshStandardMaterial color="#3b82f6" />
        </mesh>
    </group>
);

const Desk = ({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
        {/* Top */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.1, 1.2]} />
            <meshStandardMaterial color="#8d6e63" />
        </mesh>
        {/* Legs */}
        <mesh position={[-1.1, 0.6, -0.5]} castShadow>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[1.1, 0.6, -0.5]} castShadow>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[-1.1, 0.6, 0.5]} castShadow>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        <mesh position={[1.1, 0.6, 0.5]} castShadow>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        {/* Laptop */}
        <mesh position={[0, 1.26, 0]} castShadow>
            <boxGeometry args={[0.6, 0.02, 0.4]} />
            <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0, 1.45, -0.2]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 0.4, 0.02]} />
            <meshStandardMaterial color="#333333" />
        </mesh>
    </group>
);

const Wardrobe = ({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 4, 1]} />
            <meshStandardMaterial color="#5d4037" />
        </mesh>
        {/* Doors details */}
        <mesh position={[0.3, 2, 0.51]} castShadow>
            <boxGeometry args={[0.05, 0.4, 0.02]} />
            <meshStandardMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[-0.3, 2, 0.51]} castShadow>
            <boxGeometry args={[0.05, 0.4, 0.02]} />
            <meshStandardMaterial color="#c0c0c0" />
        </mesh>
    </group>
);

const Rug = ({ position }: { position: [number, number, number] }) => (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#818cf8" />
    </mesh>
);

const RoomModel = () => {
    return (
        <group dispose={null}>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[8, 8]} />
                <meshStandardMaterial color="#f5f5f5" roughness={1} />
            </mesh>

            {/* Walls */}
            {/* Back Wall */}
            <mesh position={[0, 2, -4]} receiveShadow>
                <boxGeometry args={[8.2, 4, 0.2]} />
                <meshStandardMaterial color="#eef2ff" />
            </mesh>
            {/* Left Wall */}
            <mesh position={[-4, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <boxGeometry args={[8, 4, 0.2]} />
                <meshStandardMaterial color="#eef2ff" />
            </mesh>

            {/* Window Frame */}
            <group position={[0, 2.5, -3.95]}>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[2, 1.5, 0.1]} />
                    <meshStandardMaterial color="#87ceeb" opacity={0.5} transparent />
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[2.1, 1.6, 0.05]} />
                    <meshStandardMaterial color="#ffffff" wireframe />
                </mesh>
            </group>

            {/* Furniture Placement */}
            <Bed position={[-2.5, 0, -2]} rotation={[0, 0, 0]} />
            <Desk position={[2.5, 0, -2.5]} rotation={[0, -0.2, 0]} />
            <Wardrobe position={[3, 0, 2]} rotation={[0, -0.5, 0]} />
            <Rug position={[0, 0.02, 0]} />

            {/* Interactive Element - Books */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <group position={[2.2, 1.4, -2.5]} rotation={[0, -0.2, 0]}>
                    <mesh position={[0, 0.1, 0]}>
                        <boxGeometry args={[0.2, 0.05, 0.3]} />
                        <meshStandardMaterial color="#ef4444" />
                    </mesh>
                    <mesh position={[0, 0.16, 0]} rotation={[0, 0.1, 0]}>
                        <boxGeometry args={[0.2, 0.05, 0.3]} />
                        <meshStandardMaterial color="#22c55e" />
                    </mesh>
                </group>
            </Float>

        </group>
    );
};

const LoadingFallback = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-xl">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Loading 3D View...</span>
        </div>
    </div>
);

export const Property3DView = () => {
    return (
        <div className="w-full h-[500px] relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-border shadow-sm">
            <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold text-primary shadow-sm border border-white/50">
                3D Model
            </div>

            <div className="absolute inset-0">
                <Suspense fallback={<LoadingFallback />}>
                    <Canvas shadows camera={{ position: [6, 4, 6], fov: 45 }}>
                        <PerspectiveCamera makeDefault position={[6, 5, 6]} fov={50} />
                        <OrbitControls
                            enablePan={false}
                            minPolarAngle={0}
                            maxPolarAngle={Math.PI / 2.1}
                            autoRotate
                            autoRotateSpeed={0.5}
                            maxDistance={12}
                            minDistance={3}
                        />

                        <ambientLight intensity={0.6} />
                        <pointLight position={[0, 4, 0]} intensity={0.8} castShadow />
                        <spotLight
                            position={[5, 5, 5]}
                            angle={0.25}
                            penumbra={1}
                            intensity={1}
                            castShadow
                        />

                        <Environment preset="city" />

                        <RoomModel />

                        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#000000" />
                    </Canvas>
                </Suspense>
            </div>

            <div className="absolute bottom-4 right-4 z-10 text-xs text-muted-foreground bg-white/60 px-2 py-1 rounded-md backdrop-blur-sm">
                Drag to rotate • Scroll to zoom
            </div>
        </div>
    );
};
