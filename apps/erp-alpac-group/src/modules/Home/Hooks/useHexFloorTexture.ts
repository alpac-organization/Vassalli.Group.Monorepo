import * as THREE from 'three'
import { useMemo } from "react"
import { GALERON_LARGO, WAREHOUSE_WIDTH } from '../Constants/warehouse.properties'

export function useHexFloorTexture() {
   return useMemo(() => {
      const size = 256
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#a9a49a'
      ctx.fillRect(0, 0, size, size)
      ctx.strokeStyle = '#7d786f'
      ctx.lineWidth = 3
      const r = size / 6
      const drawHex = (cx: number, cy: number) => {
         ctx.beginPath()
         for (let i = 0; i < 6; i++) {
         const a = (Math.PI / 3) * i
         const px = cx + r * Math.cos(a)
         const py = cy + r * Math.sin(a)
         i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
         }
         ctx.closePath()
         ctx.stroke()
      }
      for (let row = 0; row < 5; row++) {
         for (let col = 0; col < 4; col++) {
         const offsetX = (row % 2) * (r * 1.5)
         drawHex(col * r * 3 + offsetX, row * r * 1.6)
         }
      }
      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(WAREHOUSE_WIDTH / 3, GALERON_LARGO / 3)
      return texture
   }, [])
}
