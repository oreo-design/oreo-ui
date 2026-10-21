/** Bounded RGB ray transport through closed, bevelled volumes. No screen-space transmission. */
export const glassFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 resolution;
uniform mat4 inverseObjects[8];
uniform mat3 normalObjects[8];
uniform int objectCount;
uniform float halfDepth;
uniform float roughness;
uniform float dispersion;
uniform float detail;
uniform vec3 absorption;
uniform vec3 lightTint;
uniform vec3 edgeTint;
uniform float viewHeight;
const float FAR = 100.0;
const float EPS = 0.0004;

// Exact rounded-cylinder distance, clipped to its object-local bounding box.
// Flat faces and the cylindrical wall converge immediately; only the small
// round-over needs iterative intersection. Normal and geometry use one surface.
float discDistance(vec3 p) {
  float b=min(.055,halfDepth*.36);
  vec2 q=vec2(length(p.xz)-(1.0-b),abs(p.y)-(halfDepth-b));
  return min(max(q.x,q.y),0.0)+length(max(q,0.0))-b;
}
float discHit(vec3 ro, vec3 rd, out vec3 normal) {
  vec3 safe=vec3(rd.x==0.0?1e-9:rd.x,rd.y==0.0?1e-9:rd.y,rd.z==0.0?1e-9:rd.z);
  vec3 a=(-vec3(1,halfDepth,1)-ro)/safe;
  vec3 b=(vec3(1,halfDepth,1)-ro)/safe;
  vec3 low=min(a,b),high=max(a,b);
  float near=max(max(low.x,low.y),low.z),far=min(min(high.x,high.y),high.z);
  if(far<max(near,EPS)) return FAR;
  float t=max(near,EPS*2.0), speed=length(rd);
  for(int k=0;k<56;k++) {
    vec3 p=ro+rd*t;
    float distance=abs(discDistance(p));
    if(distance<.00008) {
      float bevel=min(.055,halfDepth*.36),r=length(p.xz);
      vec2 q=vec2(r-(1.0-bevel),abs(p.y)-(halfDepth-bevel));
      vec2 gradient=q.x>0.0&&q.y>0.0?normalize(q):(q.x>q.y?vec2(1,0):vec2(0,1));
      normal=vec3(p.x/max(r,.00001)*gradient.x,sign(p.y)*gradient.y,p.z/max(r,.00001)*gradient.x);
      return t;
    }
    t+=max(distance/speed,.00008)*.95;
    if(t>far+.0001) break;
  }
  return FAR;
}
float sceneHit(vec3 ro,vec3 rd,out vec3 n,out vec3 localPoint,out int objectId) {
  float best=FAR; objectId=-1;
  for(int i=0;i<8;i++) {
    if(i>=objectCount) break;
    vec3 o=(inverseObjects[i]*vec4(ro,1)).xyz;
    vec3 d=(inverseObjects[i]*vec4(rd,0)).xyz;
    // Cheap bounding sphere rejects almost all unrelated secondary rays.
    float b=dot(o,d), a=dot(d,d), c=dot(o,o)-(1.0+halfDepth*halfDepth);
    if(b*b-a*c<0.0) continue;
    vec3 ln=vec3(0);
    float t=discHit(o,d,ln);
    if(t<best) { best=t; n=normalize(normalObjects[i]*ln); localPoint=o+d*t; objectId=i; }
  }
  return best;
}
float panel(vec3 ro,vec3 d,vec3 center,vec2 size,float blur) {
  vec3 z=normalize(center);
  vec3 x=normalize(cross(vec3(0,1,0),z));
  vec3 y=cross(z,x);
  float facing=dot(d,z);
  if(facing<=0.0) return 0.0;
  float distanceToLight=dot(center-ro,z)/facing;
  if(distanceToLight<=0.0) return 0.0;
  vec3 hit=ro+d*distanceToLight-center;
  vec2 uv=vec2(dot(hit,x),dot(hit,y))/length(center);
  vec2 q=abs(uv)-size;
  return (1.0-smoothstep(-blur,blur,q.x))*(1.0-smoothstep(-blur,blur,q.y));
}
vec3 studio(vec3 ro,vec3 d,float blur) {
  // Off-camera softboxes illuminate/refelect; camera rays still see pure black.
  vec3 c=vec3(0.025,0.006,0.065);
  c += lightTint * 13.0 * panel(ro,d,vec3(-1.4,6.0,2.0),vec2(.95,.8),blur+.18) * (.45+.55*smoothstep(-.7,.8,d.x));
  c += vec3(1.0,.92,1.0) * 12.0 * panel(ro,d,vec3(5.0,2.8,2.0),vec2(.065,1.2),blur+.008);
  c += lightTint * 8.0 * panel(ro,d,vec3(-6.0,-.4,-2.0),vec2(.18,1.2),blur+.015);
  c += edgeTint * 2.0 * panel(ro,d,vec3(5.6,.8,-3.0),vec2(.28,.8),blur+.08);
  c += vec3(1.0,.53,.32) * 6.0 * panel(ro,d,vec3(4.0,-3.4,-1.2),vec2(.055,.9),blur+.01);
  c += vec3(.75,.62,1.0) * 4.0 * panel(ro,d,vec3(-.4,-6.0,3.0),vec2(.65,.12),blur+.025);
  return c;
}
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float wear(vec2 p) {
  vec2 q=p*vec2(9.0,48.0);
  vec2 cell=floor(q); vec2 f=fract(q);
  float r=hash(cell);
  float stroke=1.0-smoothstep(.012,.06,abs(f.y-.5-(f.x-.5)*.12));
  stroke*=smoothstep(.1,.22,f.x)*(1.0-smoothstep(.7,.9,f.x));
  return stroke*step(.88,r);
}
vec3 transport(vec3 origin,vec3 direction,float ior) {
  vec3 throughput=vec3(1), color=vec3(0);
  int inside=-1;
  for(int bounce=0;bounce<16;bounce++) {
    vec3 n=vec3(0), lp=vec3(0); int id;
    float t=sceneHit(origin,direction,n,lp,id);
    if(id<0) { if(bounce>0) color+=throughput*studio(origin,direction,roughness*.22); break; }
    if(inside>=0) throughput*=exp(-absorption*t);
    vec3 p=origin+direction*t;
    bool entering=dot(direction,n)<0.0;
    vec3 face=entering?n:-n;
    float scratches=wear(lp.xz+float(id)*.371)*detail*smoothstep(halfDepth-.012,halfDepth,abs(lp.y));
    float smudge=sin(lp.x*11.0+sin(lp.z*8.0))*sin(lp.z*17.0)*.5+.5;
    float blur=roughness*roughness*.8+detail*smudge*.008+scratches*.1;
    float cosine=clamp(dot(-direction,face),0.0,1.0);
    float f0=pow((ior-1.0)/(ior+1.0),2.0);
    float fresnel=f0+(1.0-f0)*pow(1.0-cosine,5.0);
    vec3 reflected=reflect(direction,face);
    vec3 transmitted=refract(direction,face,entering?1.0/ior:ior);
    if(dot(transmitted,transmitted)<.01) { direction=reflected; origin=p+face*EPS*4.0; continue; }
    color+=throughput*fresnel*studio(p,reflected,blur);
    color+=throughput*scratches*.024*studio(p,reflected,.12);
    throughput*=1.0-fresnel;
    direction=transmitted;
    origin=p-face*EPS*4.0;
    inside=entering?id:-1;
  }
  return color;
}
void main() {
  vec3 color=vec3(0);
  // Fixed subpixel quadrature resolves thin bevels without animated random noise.
  for(int sampleIndex=0;sampleIndex<4;sampleIndex++) {
    vec2 offset=vec2(float(sampleIndex%2),float(sampleIndex/2))-.5;
    vec2 uv=(vUv-.5+offset/resolution*.5)*vec2(resolution.x/resolution.y,1.0)*viewHeight;
    vec3 origin=vec3(uv,9.0),direction=vec3(0,0,-1);
    vec3 red=transport(origin,direction,1.50-dispersion*.004);
    vec3 green=transport(origin,direction,1.50);
    vec3 blue=transport(origin,direction,1.50+dispersion*.006);
    color+=vec3(red.r,green.g,blue.b);
  }
  gl_FragColor=vec4(color*.25,1.0);
}
`;
