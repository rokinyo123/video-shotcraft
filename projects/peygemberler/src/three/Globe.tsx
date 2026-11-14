import React, {useMemo} from 'react';
import * as THREE from 'three';
import {geoEquirectangular, geoPath, geoGraticule10} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-50m.json';
import {C} from '../theme';

export const toVec3 = (lat: number, lon: number, r = 1) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

// ISO 3166 rəqəm kodları
export const ISO = {sriLanka: '144', saudi: '682', india: '356'};

const W = 8192;
const H = 4096;

/** Qaranlıq, qızılı sahil xətli dünya xəritəsi teksturası (equirectangular). */
const useWorldTexture = (highlight: Record<string, string>) =>
  useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const proj = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]);
    const path = geoPath(proj, ctx);

    // Okean
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#04070b');
    g.addColorStop(0.5, '#071019');
    g.addColorStop(1, '#04070b');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Koordinat toru
    ctx.beginPath();
    path(geoGraticule10());
    ctx.strokeStyle = 'rgba(214,168,78,0.07)';
    ctx.lineWidth = 2;
    ctx.stroke();

    const countries = feature(world as any, (world as any).objects.countries) as any;
    for (const f of countries.features) {
      ctx.beginPath();
      path(f);
      ctx.fillStyle = highlight[f.id] ?? '#241b12';
      ctx.fill();
    }
    // Sərhədlər + sahil
    ctx.beginPath();
    for (const f of countries.features) path(f);
    ctx.strokeStyle = 'rgba(240,217,160,0.55)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);

const atmosphereShader = {
  vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} `,
  fragmentShader: `varying vec3 vN; uniform vec3 color; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(color, 1.0) * i; }`,
};

export const Globe: React.FC<{highlight?: Record<string, string>}> = ({highlight = {}}) => {
  const tex = useWorldTexture(highlight);
  const atmo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        ...atmosphereShader,
        uniforms: {color: {value: new THREE.Color(C.gold)}},
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      }),
    [],
  );
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 192, 192]} />
        <meshStandardMaterial map={tex} emissiveMap={tex} emissive={new THREE.Color('#ffffff')} emissiveIntensity={0.5} roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh scale={1.12} material={atmo}>
        <sphereGeometry args={[1, 96, 96]} />
      </mesh>
    </group>
  );
};

/** Ulduzlar */
export const Stars: React.FC<{count?: number}> = ({count = 2500}) => {
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize().multiplyScalar(40 + rnd() * 30);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geo}>
      <pointsMaterial color={C.goldSoft} size={0.08} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
};

/** Torpağa sancılan nişan: işıq sütunu + nəbz halqası. */
export const Pin: React.FC<{lat: number; lon: number; color: string; t: number; pulse: number}> = ({lat, lon, color, t, pulse}) => {
  const base = toVec3(lat, lon, 1.0);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), base.clone().normalize());
  const h = 0.06 * t;
  const ring = 0.012 + 0.03 * pulse;
  return (
    <group position={base} quaternion={quat}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.0018, 0.0018, h, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, h, 0]}>
        <sphereGeometry args={[0.006 * t, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0015, 0]}>
        <ringGeometry args={[ring, ring + 0.003, 48]} />
        <meshBasicMaterial color={color} transparent opacity={(1 - pulse) * t} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[0.012 * t, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.35 * t} />
      </mesh>
    </group>
  );
};

/** İki nöqtə arasında səthdən qalxan işıqlı yay (progress 0..1). */
export const Arc: React.FC<{from: [number, number]; to: [number, number]; progress: number; color: string; height?: number}> = ({
  from,
  to,
  progress,
  color,
  height = 0.25,
}) => {
  const curve = useMemo(() => {
    const a = toVec3(from[0], from[1], 1.002);
    const b = toVec3(to[0], to[1], 1.002);
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(1 + height);
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to, height]);
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 200, 0.0035, 10, false), [curve]);
  const segs = 200 * 10 * 6;
  geo.setDrawRange(0, Math.floor(segs * Math.max(0, Math.min(1, progress))));
  const head = curve.getPoint(Math.max(0.001, Math.min(1, progress)));
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      {progress > 0 && progress < 1 && (
        <mesh position={head}>
          <sphereGeometry args={[0.01, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </group>
  );
};

/** Kameraya baxan yazı lövhəsi (3D məkanda). */
export const Label: React.FC<{lat: number; lon: number; lift?: number; title: string; sub?: string; color: string; opacity: number; scale?: number; left?: boolean}> = ({
  lat,
  lon,
  lift = 0.09,
  title,
  sub,
  color,
  opacity,
  scale = 0.16,
  left = false,
}) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const x = c.getContext('2d')!;
    x.font = '600 76px "Cormorant Garamond", serif';
    const tw = x.measureText(title).width;
    x.font = '400 40px Inter, sans-serif';
    const sw = sub ? x.measureText(sub).width : 0;
    const bw = Math.min(1024, Math.max(tw, sw) + 90);
    const bx = left ? 1024 - bw : 0;
    const grad = x.createLinearGradient(bx, 0, bx + bw, 0);
    grad.addColorStop(left ? 0 : 1, 'rgba(7,6,10,0)');
    grad.addColorStop(left ? 1 : 0, 'rgba(7,6,10,0.8)');
    x.fillStyle = grad;
    x.fillRect(bx, 40, bw, 176);
    x.fillStyle = color;
    x.fillRect(left ? 1014 : 0, 40, 10, 176);
    x.textAlign = left ? 'right' : 'left';
    const tx = left ? 984 : 40;
    x.font = '600 76px "Cormorant Garamond", serif';
    x.fillStyle = '#efe6d2';
    x.fillText(title, tx, sub ? 130 : 155);
    if (sub) {
      x.font = '400 40px Inter, sans-serif';
      x.fillStyle = color;
      x.fillText(sub, tx, 190);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [title, sub, color, left]);
  const p = toVec3(lat, lon, 1 + lift);
  return (
    <sprite position={p} scale={[scale * 4, scale, 1]} center={new THREE.Vector2(left ? 1.02 : -0.02, 0.5)}>
      <spriteMaterial map={tex} transparent opacity={opacity} depthTest={false} />
    </sprite>
  );
};
