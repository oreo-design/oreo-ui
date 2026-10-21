import * as THREE from "three";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { GLASS_PALETTES, normalizeGlassSettings, type GlassSettings } from "./material";
import { glassFragment } from "./optics";

/** Deterministic bounded ray tracing, including volume exits and subsequent discs. */
export function createGlassScene(host: HTMLDivElement, initial: GlassSettings, onFailure: () => void) {
  let settings = normalizeGlassSettings(initial), disposed = false, frame = 0, elapsed = 0, last = 0, visible = true;
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const inverses = Array.from({length:8},()=>new THREE.Matrix4());
  const normals = Array.from({length:8},()=>new THREE.Matrix3());
  const uniforms = {
    resolution: {value:new THREE.Vector2(1,1)}, inverseObjects: {value:inverses}, normalObjects: {value:normals},
    objectCount:{value:5}, halfDepth:{value:settings.thickness/2}, roughness:{value:settings.roughness},
    dispersion:{value:settings.dispersion}, detail:{value:settings.imperfections},
    absorption:{value:new THREE.Vector3(.12,.5,.04)}, lightTint:{value:new THREE.Vector3(1,.52,.95)},
    edgeTint:{value:new THREE.Vector3(.17,.025,1)}, viewHeight:{value:5.5},
  };
  const vertexShader = `varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.,1.);}`;
  const material = new THREE.ShaderMaterial({uniforms,vertexShader,fragmentShader:glassFragment,depthTest:false,depthWrite:false});
  scene.add(new THREE.Mesh(geometry,material));
  const target = new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType});
  const smoothTarget = new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType});
  const smoothScene = new THREE.Scene();
  const smoothMaterial = new THREE.ShaderMaterial({...FXAAShader,uniforms:THREE.UniformsUtils.clone(FXAAShader.uniforms),vertexShader,depthTest:false,depthWrite:false,toneMapped:false});
  smoothMaterial.uniforms.tDiffuse.value=target.texture;
  smoothScene.add(new THREE.Mesh(geometry,smoothMaterial));
  const finish = new THREE.Scene();
  const finishMaterial = new THREE.ShaderMaterial({
    uniforms:{image:{value:smoothTarget.texture},pixel:{value:new THREE.Vector2(1,1)}},vertexShader,
    fragmentShader:`uniform sampler2D image; uniform vec2 pixel; varying vec2 vUv;
      void main(){
        // Small spatial reconstruction filter for subpixel internal caustic edges.
        vec3 c=texture2D(image,vUv).rgb*4.0;
        c+=2.0*(texture2D(image,vUv+vec2(pixel.x,0)).rgb+texture2D(image,vUv-vec2(pixel.x,0)).rgb+texture2D(image,vUv+vec2(0,pixel.y)).rgb+texture2D(image,vUv-vec2(0,pixel.y)).rgb);
        c+=texture2D(image,vUv+pixel).rgb+texture2D(image,vUv-pixel).rgb+texture2D(image,vUv+vec2(pixel.x,-pixel.y)).rgb+texture2D(image,vUv+vec2(-pixel.x,pixel.y)).rgb;
        c/=16.0;
        vec3 glow=vec3(0);
        for(int x=-2;x<=2;x++) for(int y=-2;y<=2;y++) {
          vec3 s=texture2D(image,vUv+vec2(float(x),float(y))*pixel*2.0).rgb;
          glow+=max(s-vec3(1.2),vec3(0))*exp(-float(x*x+y*y)*.35);
        }
        gl_FragColor=vec4(c+glow*.025,1);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,depthTest:false,depthWrite:false,
  });
  finish.add(new THREE.Mesh(geometry,finishMaterial));
  const object = new THREE.Object3D(), globalRotation = new THREE.Matrix4();
  function position() {
    const t=elapsed/16*Math.PI*2;
    const single=settings.composition==="single", orbit=settings.composition==="orbit";
    const count=single?1:orbit?8:5;
    uniforms.objectCount.value=count;
    globalRotation.makeRotationY(settings.rotation*Math.PI/180);
    for(let i=0;i<count;i++) {
      if(single) {
        object.position.set(0,0,0); object.scale.setScalar(1.65);
        object.rotation.set(.86+t,.15,.52);
      } else if(orbit) {
        const a=i/count*Math.PI*2;
        object.position.set(Math.cos(a)*1.93,Math.sin(a)*1.93,Math.sin(a)*.12);
        object.scale.setScalar(.68);
        object.rotation.set(.65+t+a*.75,.15, a-.45);
      } else {
        const n=i-2;
        object.position.set(n*.45,-n*.83,-n*(.6+Math.max(0,settings.thickness-.3)));
        object.scale.setScalar(1.14);
        object.rotation.set(1.25-i*.22+Math.sin(t-Math.PI/2)*.38,.12,.43+Math.sin(t-Math.PI/2)*.08);
      }
      object.updateMatrix(); object.matrix.premultiply(globalRotation);
      inverses[i].copy(object.matrix).invert(); normals[i].getNormalMatrix(object.matrix);
    }
  }
  function configure() {
    uniforms.halfDepth.value=settings.thickness/2;
    uniforms.roughness.value=settings.roughness; uniforms.dispersion.value=settings.dispersion;
    uniforms.detail.value=settings.imperfections;
    const palette=GLASS_PALETTES[settings.tone];
    uniforms.absorption.value.fromArray(palette.absorption);
    uniforms.lightTint.value.fromArray(palette.key);
    uniforms.edgeTint.value.fromArray(palette.rim);
  }
  function render() {
    if(disposed) return;
    position(); renderer.setRenderTarget(target); renderer.render(scene,camera);
    renderer.setRenderTarget(smoothTarget); renderer.render(smoothScene,camera);
    renderer.setRenderTarget(null); renderer.render(finish,camera);
  }
  const reduce=matchMedia("(prefers-reduced-motion: reduce)");
  function tick(now:number) {
    frame=0;
    if(disposed||!visible||document.hidden||!settings.playing||reduce.matches) {last=0;return;}
    if(last&&now-last>=1000/30) {elapsed+=(now-last)/1000;last=now;render();}
    else if(!last) last=now;
    frame=requestAnimationFrame(tick);
  }
  function schedule() {
    if(disposed) return;
    cancelAnimationFrame(frame);frame=0;last=0;render();
    if(visible&&!document.hidden&&settings.playing&&!reduce.matches) frame=requestAnimationFrame(tick);
  }
  function resize() {
    const width=host.clientWidth,height=host.clientHeight;
    if(!width||!height) return;
    // Budget the expensive optical pass independently of the CSS dimensions.
    const ratio=Math.min(window.devicePixelRatio||1,1.25,Math.sqrt(650000/(width*height)));
    renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);
    target.setSize(Math.round(width*ratio),Math.round(height*ratio));
    smoothTarget.setSize(target.width,target.height);
    smoothMaterial.uniforms.resolution.value.set(1/target.width,1/target.height);
    uniforms.resolution.value.set(target.width,target.height);
    uniforms.viewHeight.value=Math.max(5.5,3.4/(width/height));
    finishMaterial.uniforms.pixel.value.set(1/target.width,1/target.height);schedule();
  }
  function contextLost(event:Event) {event.preventDefault();onFailure();}
  const resizeObserver=new ResizeObserver(resize);
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();});
  const dispose=()=>{
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();intersection.disconnect();
    reduce.removeEventListener("change",schedule);document.removeEventListener("visibilitychange",schedule);
    renderer.domElement.removeEventListener("webglcontextlost",contextLost);
    geometry.dispose();material.dispose();finishMaterial.dispose();smoothMaterial.dispose();target.dispose();smoothTarget.dispose();renderer.dispose();renderer.domElement.remove();
  };
  try {
    if(!renderer.extensions.has("EXT_color_buffer_float")) throw new Error("HDR render targets are unavailable");
    configure();resizeObserver.observe(host);intersection.observe(host);
    reduce.addEventListener("change",schedule);document.addEventListener("visibilitychange",schedule);
    renderer.domElement.addEventListener("webglcontextlost",contextLost);
    renderer.debug.onShaderError=()=>{throw new Error("Optical shader compilation failed");};
    resize();
  } catch(error) {dispose();throw error;}
  return {update(next:GlassSettings){settings=normalizeGlassSettings(next);configure();schedule();},dispose};
}
