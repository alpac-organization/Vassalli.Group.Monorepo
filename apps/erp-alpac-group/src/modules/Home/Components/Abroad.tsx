export function Exterior() {
  return (
    <>
      {/* Terreno */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 35]}
      >
        <planeGeometry args={[350, 350]} />
        <meshStandardMaterial color="#7b8b5f" />
      </mesh>

      {/* Patio de concreto */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 2]}
      >
        <planeGeometry args={[80, 18]} />
        <meshStandardMaterial color="#b7b7b7" />
      </mesh>
    </>
  )
}
