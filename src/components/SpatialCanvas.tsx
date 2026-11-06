import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { playPulseReversalSound, playHarmonicChime, playClickBeep } from '../utils/audio';

interface SpatialCanvasProps {
  onEventLogged?: (event: {
    agent: string;
    msg: string;
    type?: 'cyan' | 'amber' | 'green' | 'rose';
    yield?: boolean;
    yieldAmount?: number;
  }) => void;
  selectedLobe?: string | null;
}

export type VisualMode = 'splats' | 'lattice' | 'torus' | 'atrm';

export default function SpatialCanvas({ onEventLogged, selectedLobe }: SpatialCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const shockwaveRef = useRef<THREE.Mesh | null>(null);
  
  // Interactive / state flags
  const [visualMode, setVisualMode] = useState<VisualMode>('splats');
  const [pulseReversalActive, setPulseReversalActive] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'LOCKED'>('LOCKED');
  const [z0Value, setZ0Value] = useState<number>(376.73);
  const [mahalanobisM, setMahalanobisM] = useState<number>(0.150);
  const [particleCount] = useState<number>(4096);
  const [fps, setFps] = useState<number>(60);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const shockwaveProgress = useRef<number>(0);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch (e) {
        return false;
      }
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 384;

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create custom circular gaussian texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.9)');
      grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    // 4096 Gaussian Splat points
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Gaussian distribution
      const u = Math.random();
      const v = Math.random();
      const radius = 4.2 * Math.sqrt(-2.0 * Math.log(u || 0.001));
      const theta = 2.0 * Math.PI * v;
      const phi = (Math.random() - 0.5) * Math.PI;

      const x = radius * Math.cos(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) * Math.sin(theta);
      const z = radius * Math.sin(phi);

      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;

      initialPositions[i] = x;
      initialPositions[i + 1] = y;
      initialPositions[i + 2] = z;

      // Cyan-blue-amber palette
      const r = Math.random();
      if (r < 0.7) {
        colors[i] = 0.02; // R
        colors[i + 1] = 0.72; // G
        colors[i + 2] = 0.95; // B
      } else if (r < 0.9) {
        colors[i] = 0.95; // Amber
        colors[i + 1] = 0.65;
        colors[i + 2] = 0.1;
      } else {
        colors[i] = 0.15; // Emerald
        colors[i + 1] = 0.85;
        colors[i + 2] = 0.45;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('initialPosition', new THREE.BufferAttribute(initialPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.14,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    // Resonant shockwave ring (for Pulse Reversal)
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.4, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    scene.add(shockwaveMesh);
    shockwaveRef.current = shockwaveMesh;

    // Connecting lattice lines (sparse subset)
    const lineIndices: number[] = [];
    const step = 32;
    for (let i = 0; i < particleCount; i += step) {
      for (let j = i + step; j < Math.min(i + step * 3, particleCount); j += step) {
        lineIndices.push(i, j);
      }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', geometry.getAttribute('position'));
    lineGeometry.setIndex(lineIndices);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    linesRef.current = lines;

    // Animation & 3.69 Hz Tesla harmonic modulation loop
    let clock = 0;
    let animFrameId = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      clock += 0.016;

      // Calculate FPS
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      // Smooth damping for mouse drag rotation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      // 3.69 Hz Tesla harmonic oscillation effect
      const harmonicFrequency = 3.69;
      const pulse = Math.sin(clock * harmonicFrequency) * 0.18;

      if (pointsRef.current) {
        pointsRef.current.rotation.x = currentRotation.current.x + clock * 0.12;
        pointsRef.current.rotation.y = currentRotation.current.y + clock * 0.22;
        const scaleVal = 1 + pulse;
        pointsRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      }

      if (linesRef.current && linesRef.current.visible) {
        linesRef.current.rotation.x = pointsRef.current?.rotation.x || 0;
        linesRef.current.rotation.y = pointsRef.current?.rotation.y || 0;
        linesRef.current.scale.copy(pointsRef.current?.scale || new THREE.Vector3(1, 1, 1));
      }

      // Animate shockwave if triggered
      if (shockwaveRef.current && shockwaveProgress.current > 0) {
        shockwaveProgress.current += 0.035;
        const s = shockwaveProgress.current * 14;
        shockwaveRef.current.scale.set(s, s, s);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - shockwaveProgress.current);

        if (shockwaveProgress.current >= 1) {
          shockwaveProgress.current = 0;
          (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse drag handlers for orbit
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      targetRotation.current.y += deltaX * 0.008;
      targetRotation.current.x += deltaY * 0.008;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      shockwaveGeo.dispose();
      shockwaveMat.dispose();
      renderer.dispose();
    };
  }, [particleCount]);

  // Handle visual mode updates
  useEffect(() => {
    if (!pointsRef.current || !linesRef.current) return;
    const points = pointsRef.current;
    const lines = linesRef.current;
    const posAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const initPosAttr = points.geometry.getAttribute('initialPosition') as THREE.BufferAttribute;
    const count = posAttr.count;

    if (visualMode === 'splats') {
      lines.visible = false;
      for (let i = 0; i < count * 3; i += 3) {
        posAttr.array[i] = initPosAttr.array[i];
        posAttr.array[i + 1] = initPosAttr.array[i + 1];
        posAttr.array[i + 2] = initPosAttr.array[i + 2];
      }
      (points.material as THREE.PointsMaterial).size = 0.14;
    } else if (visualMode === 'lattice') {
      lines.visible = true;
      for (let i = 0; i < count * 3; i += 3) {
        posAttr.array[i] = initPosAttr.array[i] * 0.9;
        posAttr.array[i + 1] = initPosAttr.array[i + 1] * 0.9;
        posAttr.array[i + 2] = initPosAttr.array[i + 2] * 0.9;
      }
      (points.material as THREE.PointsMaterial).size = 0.16;
    } else if (visualMode === 'torus') {
      lines.visible = false;
      // Morph into Torus geometry
      const R = 3.6;
      const r = 1.4;
      for (let i = 0; i < count; i++) {
        const u = (i / count) * Math.PI * 2 * 17;
        const v = (i / count) * Math.PI * 2 * 3;
        posAttr.array[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
        posAttr.array[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
        posAttr.array[i * 3 + 2] = r * Math.sin(v) + (Math.random() - 0.5) * 0.2;
      }
      (points.material as THREE.PointsMaterial).size = 0.12;
    } else if (visualMode === 'atrm') {
      lines.visible = true;
      // Concentric wave spherical shells
      for (let i = 0; i < count; i++) {
        const shell = (i % 6) + 1;
        const shellRadius = shell * 0.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        posAttr.array[i * 3] = shellRadius * Math.cos(phi) * Math.cos(theta);
        posAttr.array[i * 3 + 1] = shellRadius * Math.cos(phi) * Math.sin(theta);
        posAttr.array[i * 3 + 2] = shellRadius * Math.sin(phi);
      }
      (points.material as THREE.PointsMaterial).size = 0.15;
    }
    posAttr.needsUpdate = true;
  }, [visualMode]);

  // Respond to selected lobe
  useEffect(() => {
    if (!selectedLobe || !pointsRef.current) return;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    // Highlight effect
    material.size = 0.22;
    const timer = setTimeout(() => {
      material.size = 0.14;
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedLobe]);

  // CONTROLLER ACTIONS
  const triggerPulseReversal = useCallback(() => {
    playPulseReversalSound();
    setPulseReversalActive(true);
    shockwaveProgress.current = 0.01;

    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.color.setHex(0xf59e0b); // Amber pulse
      setTimeout(() => {
        mat.color.setHex(0x06b6d4); // Cyan return
      }, 700);
    }

    const newM = Number((0.140 + Math.random() * 0.02).toFixed(3));
    setMahalanobisM(newM);

    onEventLogged?.({
      agent: 'ATRM-MIRROR',
      msg: `Pulse Reversal Executed. Acoustic Phase Nulling Enforced (-42.60 dB Floor). M(s) = ${newM}`,
      type: 'amber',
    });

    setTimeout(() => {
      setPulseReversalActive(false);
    }, 1200);
  }, [onEventLogged]);

  const syncNodeMesh = useCallback(() => {
    playHarmonicChime();
    setSyncStatus('SYNCING');
    
    // Quick spin boost
    targetRotation.current.y += Math.PI;

    setTimeout(() => {
      setSyncStatus('LOCKED');
      onEventLogged?.({
        agent: 'MESH-SYNC',
        msg: 'Multi-Nodal Mesh Synchronized across Vertex AI (NYMT26), Bare-Metal Workstation & Termux Satellites. Jitter: 0.002ns.',
        type: 'green',
        yield: true,
        yieldAmount: 1.45,
      });
    }, 600);
  }, [onEventLogged]);

  const recalibrateZ0 = useCallback(() => {
    playHarmonicChime();
    const calibrated = 376.73;
    setZ0Value(calibrated);

    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.color.setHex(0x10b981); // Emerald resonance
      setTimeout(() => {
        mat.color.setHex(0xffffff);
      }, 400);
    }

    onEventLogged?.({
      agent: 'HARMONIC-Z₀',
      msg: `Free-Space Wave Impedance Anchored to Invariant Z₀ = ${calibrated} Ω. Resonant frequency 3.690 Hz locked.`,
      type: 'cyan',
    });
  }, [onEventLogged]);

  return (
    <div className="bg-slate-900 border-glow rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
      {/* Top Header of 3D Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            4D Gaussian Splatting & Multi-Nodal Spatial Mesh
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-amber-400 font-semibold">
            {particleCount} SPLATS @ 3.69 Hz TESLA HARMONIC
          </span>
          <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {fps} FPS
          </span>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        id="canvas-container"
        ref={containerRef}
        className="w-full h-80 sm:h-96 bg-[#02050e] rounded border border-slate-800 relative cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Telemetry HUD Overlay in Top-Left */}
        <div className="absolute top-2 left-2 text-[10px] text-cyan-400/90 font-mono pointer-events-none bg-slate-950/85 backdrop-blur-sm p-2.5 rounded border border-cyan-500/30 space-y-0.5 shadow-lg max-w-[280px]">
          <div className="text-cyan-300 font-bold flex items-center justify-between">
            <span>VERA ANALOG MESH:</span>
            <span className="text-green-400">SUPERPOSITION ACTIVE</span>
          </div>
          <div>MAHALANOBIS M(s) = {mahalanobisM.toFixed(3)} [EVALUATED]</div>
          <div>SIMD KERNEL LATENCY: 0.004 ns (16.113B WVec/s)</div>
          <div className="text-amber-400 flex items-center justify-between">
            <span>PULSE REVERSAL:</span>
            <span>ENFORCED (-42.60 dB FLOOR)</span>
          </div>
          <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Z₀ IMPEDANCE: {z0Value} Ω</span>
            <span>NODE STATUS: {syncStatus}</span>
          </div>
        </div>

        {/* Visual Mode Selector HUD in Top-Right */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-950/85 backdrop-blur-sm p-1 rounded border border-slate-800 text-[10px] font-mono">
          {(['splats', 'lattice', 'torus', 'atrm'] as VisualMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                playClickBeep(1400);
                setVisualMode(mode);
              }}
              className={`px-2 py-1 rounded uppercase font-semibold transition-all ${
                visualMode === mode
                  ? 'bg-cyan-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Pulse Reversal visual flash alert */}
        {pulseReversalActive && (
          <div className="absolute inset-0 border-2 border-amber-500/80 bg-amber-500/10 pointer-events-none flex items-center justify-center animate-pulse">
            <span className="text-amber-300 font-bold text-xs tracking-widest bg-slate-950/90 px-4 py-1.5 rounded border border-amber-500/50">
              ⚡ ACOUSTIC PULSE REVERSAL ACTIVE // -42.60 dB ENFORCED
            </span>
          </div>
        )}

        {/* Interactive drag hint */}
        <div className="absolute bottom-2 right-2 text-[9px] text-slate-500 pointer-events-none font-mono">
          [DRAG TO ROTATE 4D TENSOR]
        </div>
      </div>

      {/* Controller Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 text-xs font-mono">
        <button
          onClick={triggerPulseReversal}
          className="p-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 rounded font-bold transition shadow-sm hover:shadow-cyan-500/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>TRIGGER PULSE REVERSAL</span>
        </button>
        <button
          onClick={syncNodeMesh}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded font-bold transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>SYNC NODE MESH</span>
          {syncStatus === 'SYNCING' && <span className="animate-spin text-xs">⟳</span>}
        </button>
        <button
          onClick={recalibrateZ0}
          className="p-2.5 bg-amber-950 hover:bg-amber-900 border border-amber-500/60 text-amber-300 rounded font-bold transition shadow-sm hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>RECALIBRATE Z₀ (376.73 Ω)</span>
        </button>
      </div>
    </div>
  );
}
