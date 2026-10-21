import * as THREE from "three";
import { GLASS_PALETTES, normalizeGlassSettings, type GlassSettings } from "./material";

/** Real-time RGB approximation. This is not the source author's spectral path tracer. */
export function createGlassScene(host: HTMLDivElement, initial: GlassSettings, onFailure: () => void) {
  let settings = normalizeGlassSettings(initial), disposed = false, frame = 0, elapsed = 0, last = 0, visible = true;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.setClearColor(0x030205);
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  const group = new THREE.Group();
  scene.add(group);
  const envCanvas = document.createElement("canvas");
  envCanvas.width = 1024; envCanvas.height = 512;
  const envContext = envCanvas.getContext("2d")!;
  const envTexture = new THREE.CanvasTexture(envCanvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  envTexture.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  let environment: THREE.WebGLRenderTarget | undefined;

  // Deterministic fine roughness and scratches: no downloaded textures or frame noise.
  const scratchCanvas = document.createElement("canvas");
  scratchCanvas.width = scratchCanvas.height = 512;
  const ctx = scratchCanvas.getContext("2d")!;
  let seed = 27;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  ctx.fillStyle = "#8c8c8c"; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) {
    const x = random() * 512, y = random() * 512;
    ctx.strokeStyle = `rgba(255,255,255,${0.06 + random() * 0.2})`;
    ctx.lineWidth = 0.35 + random() * 0.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + random() * 32, y + random() * 6); ctx.stroke();
  }
  for (let i = 0; i < 18; i++) {
    const x = random() * 512, y = random() * 512;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 30 + random() * 50);
    g.addColorStop(0, "rgba(255,255,255,0.25)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
  }
  const scratches = new THREE.CanvasTexture(scratchCanvas);
  scratches.wrapS = scratches.wrapT = THREE.RepeatWrapping;
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, transmission: 1, opacity: 1,
    ior: 1.5, clearcoat: 0.6, envMapIntensity: 4,
    roughnessMap: settings.imperfections > 0 ? scratches : null, bumpMap: scratches,
  });
  // Keep the studio visible to WebGL's screen-space transmission buffer while
  // compositing only the objects onto black. An object mask is not path tracing.
  const beauty = new THREE.WebGLRenderTarget(1, 1, { samples: 4 });
  const mask = new THREE.WebGLRenderTarget(1, 1, { samples: 4 });
  const maskMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const composite = new THREE.Scene();
  const compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const compositeGeometry = new THREE.PlaneGeometry(2, 2);
  const compositeMaterial = new THREE.ShaderMaterial({
    uniforms: { beauty: { value: beauty.texture }, mask: { value: mask.texture } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `uniform sampler2D beauty; uniform sampler2D mask; varying vec2 vUv;
      void main() { vec3 color = texture2D(beauty, vUv).rgb; float coverage = texture2D(mask, vUv).r;
        gl_FragColor = vec4(mix(vec3(0.001, 0.0006, 0.0015), color, coverage), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    depthTest: false, depthWrite: false,
  });
  composite.add(new THREE.Mesh(compositeGeometry, compositeMaterial));
  const meshes: THREE.Mesh[] = [];
  function rebuildGeometry() {
    for (const mesh of meshes) { group.remove(mesh); mesh.geometry.dispose(); }
    meshes.length = 0;
    const half = settings.thickness / 2, bevel = 0.045;
    const profile: THREE.Vector2[] = [];
    // A very shallow optical crown avoids perfectly flat, uniform reflections.
    for (let i = 0; i <= 16; i++) { const r = i / 16 * 0.92; profile.push(new THREE.Vector2(r, -half - 0.035 * (1 - (r / 0.92) ** 2))); }
    profile.push(new THREE.Vector2(0.97, -half + bevel * 0.3), new THREE.Vector2(1, -half + bevel), new THREE.Vector2(1, half - bevel), new THREE.Vector2(0.97, half - bevel * 0.3));
    for (let i = 16; i >= 0; i--) { const r = i / 16 * 0.92; profile.push(new THREE.Vector2(r, half + 0.035 * (1 - (r / 0.92) ** 2))); }

    const count = settings.composition === "single" ? 1 : settings.composition === "orbit" ? 8 : 5;
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), material);
      group.add(mesh); meshes.push(mesh);
    }
  }
  function updateEnvironment() {
    const p = GLASS_PALETTES[settings.tone];
    envContext.fillStyle = settings.tone === "violet" ? "#050111" : settings.tone === "amber" ? "#100701" : "#06090e"; envContext.fillRect(0, 0, 1024, 512);
    const strips = [[60, 0, 100, 512, p.key], [242, 0, 8, 512, "#ffffff"], [274, 0, 30, 512, p.rim], [324, 0, 14, 512, p.key], [600, 70, 100, 440, p.rim], [935, 0, 40, 512, p.warm]] as const;
    for (const [x, y, w, h, color] of strips) {
      envContext.fillStyle = color; envContext.fillRect(x, y, w, h);
    }
    envTexture.needsUpdate = true;
    const next = pmrem.fromEquirectangular(envTexture);
    scene.environment = next.texture;
    environment?.dispose(); environment = next;
    material.attenuationColor.set(p.absorption);
  }
  function position() {
    const t = elapsed / 16 * Math.PI * 2;
    const orbit = settings.composition === "orbit", single = settings.composition === "single";
    group.rotation.set(0, settings.rotation * Math.PI / 180, 0);
    meshes.forEach((m, i) => {
      if (orbit) {
        const a = i / meshes.length * Math.PI * 2;
        m.position.set(Math.cos(a) * 2.05, Math.sin(a) * 2.2, Math.sin(a * 2) * 0.3);
        m.scale.setScalar(0.56);
        m.rotation.set(1.05 + Math.sin(t + a) * 0.6, Math.cos(a) * 0.4, a + Math.sin(t) * 0.35);
      } else {
        const n = i - (meshes.length - 1) / 2;
        m.position.set(single ? 0 : n * 0.31 + Math.sin(t + i * 0.6) * 0.08, single ? 0 : -n * 0.8, single ? 0 : n * -0.18);
        m.scale.setScalar(single ? 1.6 : 1.12);
        m.rotation.set(0.85 + i * 0.08 + Math.sin(t + i * 0.3) * 0.18, Math.cos(t + i * 0.7) * 0.18, -0.4 + Math.sin(t + i * 0.4) * 0.18);
      }
    });
  }
  function render() {
    if (disposed) return;
    position();
    scene.background = envTexture;
    renderer.setRenderTarget(beauty); renderer.render(scene, camera);
    scene.background = new THREE.Color(0x000000); scene.overrideMaterial = maskMaterial;
    renderer.setRenderTarget(mask); renderer.render(scene, camera);
    scene.overrideMaterial = null;
    renderer.setRenderTarget(null); renderer.render(composite, compositeCamera);
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  function tick(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden || !settings.playing || reduce.matches) { last = 0; return; }
    if (last && now - last >= 1000 / 30) { elapsed += Math.min((now - last) / 1000, 0.1); last = now; render(); }
    else if (!last) last = now;
    frame = requestAnimationFrame(tick);
  }
  function schedule() { cancelAnimationFrame(frame); frame = 0; last = 0; render(); if (visible && !document.hidden && settings.playing && !reduce.matches) frame = requestAnimationFrame(tick); }
  function resize() {
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const pixelRatio = renderer.getPixelRatio(); beauty.setSize(width * pixelRatio, height * pixelRatio); mask.setSize(width * pixelRatio, height * pixelRatio);
    camera.aspect = width / height;
    camera.position.set(0, 0, camera.aspect < 0.85 ? 12 : 10.2);
    camera.updateProjectionMatrix(); schedule();
  }
  function contextLost(event: Event) { event.preventDefault(); onFailure(); }
  const resizeObserver = new ResizeObserver(resize);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
  const dispose = () => {
    if (disposed) return;
    disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect();
    reduce.removeEventListener("change", schedule); document.removeEventListener("visibilitychange", schedule);
    renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    meshes.forEach(m => m.geometry.dispose()); material.dispose(); scratches.dispose(); environment?.dispose(); envTexture.dispose(); pmrem.dispose(); beauty.dispose(); mask.dispose(); maskMaterial.dispose(); compositeGeometry.dispose(); compositeMaterial.dispose(); renderer.dispose(); renderer.domElement.remove();
  };
  try {
    rebuildGeometry(); updateEnvironment();
    material.roughness = settings.roughness; material.clearcoatRoughness = settings.roughness;
    material.dispersion = settings.dispersion; material.thickness = settings.thickness;
    material.attenuationDistance = 2.5; material.bumpScale = settings.imperfections * 0.006;
    resizeObserver.observe(host); intersection.observe(host);
    reduce.addEventListener("change", schedule); document.addEventListener("visibilitychange", schedule);
    renderer.domElement.addEventListener("webglcontextlost", contextLost); resize();
  } catch (error) { dispose(); throw error; }
  return {
    update(next: GlassSettings) {
      const before = settings; settings = normalizeGlassSettings(next);
      if (before.composition !== settings.composition || before.thickness !== settings.thickness) rebuildGeometry();
      if (before.tone !== settings.tone) updateEnvironment();
      material.roughness = settings.roughness; material.clearcoatRoughness = settings.roughness;
      material.dispersion = settings.dispersion; material.thickness = settings.thickness;
      material.bumpScale = settings.imperfections * 0.006;
      // Imperfections affect the surface only; uniform roughness remains a separate optical control.
      material.roughnessMap = settings.imperfections > 0 ? scratches : null;
      if ((before.imperfections === 0) !== (settings.imperfections === 0)) material.needsUpdate = true;
      schedule();
    },
    dispose,
  };
}
