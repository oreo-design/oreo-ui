import * as THREE from "three";
/** A bounded, event-driven developing pass. No perpetual render loop. */
export function createFilmRenderer(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const texture = new THREE.Texture(image);
  texture.needsUpdate = true;
  const uniforms = {
    photo: { value: texture },
    progress: { value: 0 },
    frame: { value: new THREE.Vector2(1, 1) },
    photoSize: {
      value: new THREE.Vector2(image.naturalWidth, image.naturalHeight),
    },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    depthTest: false,
    depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `precision highp float;
      uniform sampler2D photo; uniform float progress; uniform vec2 frame; uniform vec2 photoSize; varying vec2 vUv;
      float noise(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
      void main(){
        float f=frame.x/frame.y; float a=photoSize.x/photoSize.y;
        vec2 uv=(vUv-.5)*vec2(min(1.,f/a),min(1.,a/f))+.5;
        vec3 color=texture2D(photo,uv).rgb;
        float l=dot(color,vec3(.299,.587,.114));
        float field=noise(floor(vUv*frame/32.));
        float develop=smoothstep(.40,.85,progress+field*.06);
        vec3 silver=vec3(clamp((l-.5)*1.25+.60,0.,1.));
        vec3 result=mix(silver,color,develop);
        float grain=(noise(floor(vUv*frame*1.5)+floor(progress*24.))-.5)*.17*(1.-develop);
        gl_FragColor=vec4(clamp(result+grain,0.,1.),1.);
      }`,
  });
  const geometry = new THREE.PlaneGeometry(2, 2),
    scene = new THREE.Scene(),
    camera = new THREE.Camera();
  scene.add(new THREE.Mesh(geometry, material));
  let width = 0,
    height = 0;
  return {
    draw(progress: number) {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      if (!w || !h) return;
      if (w !== width || h !== height) {
        renderer.setSize(w, h, false);
        width = w;
        height = h;
      }
      uniforms.frame.value.set(w, h);
      uniforms.progress.value = progress;
      renderer.render(scene, camera);
    },
    dispose() {
      texture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
