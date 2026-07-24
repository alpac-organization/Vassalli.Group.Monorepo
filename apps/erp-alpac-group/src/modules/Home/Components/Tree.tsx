export function Tree({x,z}:{x:number,z:number}){
   return(
      <group position={[x,0,z]}>
         <mesh position={[0,1.5,0]}>
            <cylinderGeometry args={[0.18,0.25,3]} />
            <meshStandardMaterial color="#6d4c41"/>
         </mesh>

         <mesh position={[0,4,0]}>
            <sphereGeometry args={[1.5,20,20]} />
            <meshStandardMaterial color="#2e7d32"/>
         </mesh>
      </group>
   )
}
