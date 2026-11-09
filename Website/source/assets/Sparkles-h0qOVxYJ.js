import{R as S,ah as z,ak as C,M as F,g as u,ai as _,ae as w,X as I,a7 as O,a8 as V,a9 as k}from"./constants-owiHNVsx.js";import{av as r}from"./cvm-app-B6dLyArH.js";const T=()=>parseInt(S.replace(/\D+/g,"")),j=T();class $ extends I{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${j>=154?"colorspace_fragment":"encodings_fragment"}>
        }
      `})}get time(){return this.uniforms.time.value}set time(t){this.uniforms.time.value=t}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(t){this.uniforms.pixelRatio.value=t}}const d=e=>e&&e.constructor===Float32Array,N=e=>[e.r,e.g,e.b],p=e=>e instanceof O||e instanceof V||e instanceof k,g=e=>Array.isArray(e)?e:p(e)?e.toArray():[e,e,e];function o(e,t,n){return r.useMemo(()=>{if(t!==void 0){if(d(t))return t;if(t instanceof u){const a=Array.from({length:e*3},()=>N(t)).flat();return Float32Array.from(a)}else if(p(t)||Array.isArray(t)){const a=Array.from({length:e*3},()=>g(t)).flat();return Float32Array.from(a)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},n)},[t])}const H=r.forwardRef(({noise:e=1,count:t=100,speed:n=1,opacity:a=1,scale:c=1,size:y,color:s,children:m,...v},b)=>{r.useMemo(()=>z({SparklesImplMaterial:$}),[]);const i=r.useRef(null),h=C(l=>l.viewport.dpr),f=g(c),A=r.useMemo(()=>Float32Array.from(Array.from({length:t},()=>f.map(F.randFloatSpread)).flat()),[t,...f]),x=o(t,y,Math.random),P=o(t,a),M=o(t,n),R=o(t*3,e),E=o(s===void 0?t*3:t,d(s)?s:new u(s),()=>1);return _(l=>{i.current&&i.current.material&&(i.current.material.time=l.clock.elapsedTime)}),r.useImperativeHandle(b,()=>i.current,[]),r.createElement("points",w({key:`particle-${t}-${JSON.stringify(c)}`},v,{ref:i}),r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[A,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[x,1]}),r.createElement("bufferAttribute",{attach:"attributes-opacity",args:[P,1]}),r.createElement("bufferAttribute",{attach:"attributes-speed",args:[M,1]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[E,3]}),r.createElement("bufferAttribute",{attach:"attributes-noise",args:[R,3]})),m||r.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:h,depthWrite:!1}))});export{H as S};
