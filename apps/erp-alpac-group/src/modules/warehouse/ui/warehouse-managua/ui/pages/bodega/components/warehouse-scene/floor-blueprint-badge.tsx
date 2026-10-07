import { useEffect, useMemo } from "react";
import * as THREE from "three";

interface FloorBlueprintBadgeProps {
  title: string;
  subtitle?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  accentColor?: string;
  textColor?: string;
  subTextColor?: string;
  bgColor?: string;
  borderColor?: string;
  opacity?: number;
}

export function FloorBlueprintBadge({
  title,
  subtitle,
  position,
  rotation = [-Math.PI / 2, 0, 0],
  size = [2.2, 0.58],
  accentColor,
  textColor = "#cbd5e1",
  subTextColor = "#64748b",
  bgColor = "rgba(15, 23, 42, 0.65)",
  borderColor = "rgba(71, 85, 105, 0.35)",
  opacity = 0.58,
}: FloorBlueprintBadgeProps) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 144;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Fondo arquitectónico redondeado sutil y discreto tipo plano CAD
    const r = 10;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();

    ctx.fillStyle = bgColor;
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Tira sutil de acento
    if (accentColor) {
      ctx.fillStyle = accentColor;
      ctx.fillRect(8, 8, 6, h - 16);
    }

    const textLeft = accentColor ? 26 : 18;

    // Título con medidas
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = textColor;
    ctx.textBaseline = "middle";
    ctx.fillText(title, textLeft, subtitle ? 48 : h / 2);

    // Subtítulo con posición / coordenadas
    if (subtitle) {
      ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
      ctx.fillStyle = subTextColor;
      ctx.fillText(subtitle, textLeft, 98);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, [title, subtitle, accentColor, textColor, subTextColor, bgColor, borderColor]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      raycast={() => null}
    >
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}
