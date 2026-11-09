import{av as c,at as i}from"./cvm-app-B6dLyArH.js";import{al as te,p as le,n as q,q as N,s as z,ad as ce,a as V,a0 as ne,a8 as b,X as fe,a4 as $,a3 as X,a7 as ie,A as de,a9 as O,L as ue,z as pe,M as se,ak as he,g as me,ae as J,ai as U,C as xe}from"./constants-owiHNVsx.js";import{S as ve}from"./Sparkles-h0qOVxYJ.js";import{R as I}from"./RoundedBox-CSuh5Zg6.js";const oe=te>=125?"uv1":"uv2",K=new V,C=new b;class F extends le{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],o=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(o),this.setAttribute("position",new q(t,3)),this.setAttribute("uv",new q(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,o=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),o.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const o=new N(e,6,1);return this.setAttribute("instanceStart",new z(o,3,0)),this.setAttribute("instanceEnd",new z(o,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t,e=3){let o;t instanceof Float32Array?o=t:Array.isArray(t)&&(o=new Float32Array(t));const n=new N(o,e*2,1);return this.setAttribute("instanceColorStart",new z(n,e,0)),this.setAttribute("instanceColorEnd",new z(n,e,e)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new ce(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new V);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),K.setFromBufferAttribute(e),this.boundingBox.union(K))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ne),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const o=this.boundingSphere.center;this.boundingBox.getCenter(o);let n=0;for(let s=0,l=t.count;s<l;s++)C.fromBufferAttribute(t,s),n=Math.max(n,o.distanceToSquared(C)),C.fromBufferAttribute(e,s),n=Math.max(n,o.distanceToSquared(C));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}class re extends F{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){const e=t.length-3,o=new Float32Array(2*e);for(let n=0;n<e;n+=3)o[2*n]=t[n],o[2*n+1]=t[n+1],o[2*n+2]=t[n+2],o[2*n+3]=t[n+3],o[2*n+4]=t[n+4],o[2*n+5]=t[n+5];return super.setPositions(o),this}setColors(t,e=3){const o=t.length-e,n=new Float32Array(2*o);if(e===3)for(let s=0;s<o;s+=e)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];else for(let s=0;s<o;s+=e)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5],n[2*s+6]=t[s+6],n[2*s+7]=t[s+7];return super.setColors(n,e),this}fromLine(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}}class k extends fe{constructor(t){super({type:"LineMaterial",uniforms:$.clone($.merge([X.common,X.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ie(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${te>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(t)}}const G=new O,Y=new b,Q=new b,m=new O,x=new O,M=new O,H=new b,W=new pe,v=new ue,Z=new b,D=new V,P=new ne,_=new O;let j,A;function ee(r,t,e){return _.set(0,0,-t,1).applyMatrix4(r.projectionMatrix),_.multiplyScalar(1/_.w),_.x=A/e.width,_.y=A/e.height,_.applyMatrix4(r.projectionMatrixInverse),_.multiplyScalar(1/_.w),Math.abs(Math.max(_.x,_.y))}function ge(r,t){const e=r.matrixWorld,o=r.geometry,n=o.attributes.instanceStart,s=o.attributes.instanceEnd,l=Math.min(o.instanceCount,n.count);for(let a=0,u=l;a<u;a++){v.start.fromBufferAttribute(n,a),v.end.fromBufferAttribute(s,a),v.applyMatrix4(e);const f=new b,h=new b;j.distanceSqToSegment(v.start,v.end,h,f),h.distanceTo(f)<A*.5&&t.push({point:h,pointOnLine:f,distance:j.origin.distanceTo(h),object:r,face:null,faceIndex:a,uv:null,[oe]:null})}}function ye(r,t,e){const o=t.projectionMatrix,s=r.material.resolution,l=r.matrixWorld,a=r.geometry,u=a.attributes.instanceStart,f=a.attributes.instanceEnd,h=Math.min(a.instanceCount,u.count),p=-t.near;j.at(1,M),M.w=1,M.applyMatrix4(t.matrixWorldInverse),M.applyMatrix4(o),M.multiplyScalar(1/M.w),M.x*=s.x/2,M.y*=s.y/2,M.z=0,H.copy(M),W.multiplyMatrices(t.matrixWorldInverse,l);for(let g=0,E=h;g<E;g++){if(m.fromBufferAttribute(u,g),x.fromBufferAttribute(f,g),m.w=1,x.w=1,m.applyMatrix4(W),x.applyMatrix4(W),m.z>p&&x.z>p)continue;if(m.z>p){const d=m.z-x.z,y=(m.z-p)/d;m.lerp(x,y)}else if(x.z>p){const d=x.z-m.z,y=(x.z-p)/d;x.lerp(m,y)}m.applyMatrix4(o),x.applyMatrix4(o),m.multiplyScalar(1/m.w),x.multiplyScalar(1/x.w),m.x*=s.x/2,m.y*=s.y/2,x.x*=s.x/2,x.y*=s.y/2,v.start.copy(m),v.start.z=0,v.end.copy(x),v.end.z=0;const w=v.closestPointToPointParameter(H,!0);v.at(w,Z);const B=se.lerp(m.z,x.z,w),L=B>=-1&&B<=1,T=H.distanceTo(Z)<A*.5;if(L&&T){v.start.fromBufferAttribute(u,g),v.end.fromBufferAttribute(f,g),v.start.applyMatrix4(l),v.end.applyMatrix4(l);const d=new b,y=new b;j.distanceSqToSegment(v.start,v.end,y,d),e.push({point:y,pointOnLine:d,distance:j.origin.distanceTo(y),object:r,face:null,faceIndex:g,uv:null,[oe]:null})}}}class ae extends de{constructor(t=new F,e=new k({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,o=t.attributes.instanceEnd,n=new Float32Array(2*e.count);for(let l=0,a=0,u=e.count;l<u;l++,a+=2)Y.fromBufferAttribute(e,l),Q.fromBufferAttribute(o,l),n[a]=a===0?0:n[a-1],n[a+1]=n[a]+Y.distanceTo(Q);const s=new N(n,2,1);return t.setAttribute("instanceDistanceStart",new z(s,1,0)),t.setAttribute("instanceDistanceEnd",new z(s,1,1)),this}raycast(t,e){const o=this.material.worldUnits,n=t.camera;n===null&&!o&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const s=t.params.Line2!==void 0&&t.params.Line2.threshold||0;j=t.ray;const l=this.matrixWorld,a=this.geometry,u=this.material;A=u.linewidth+s,a.boundingSphere===null&&a.computeBoundingSphere(),P.copy(a.boundingSphere).applyMatrix4(l);let f;if(o)f=A*.5;else{const p=Math.max(n.near,P.distanceToPoint(j.origin));f=ee(n,p,u.resolution)}if(P.radius+=f,j.intersectsSphere(P)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),D.copy(a.boundingBox).applyMatrix4(l);let h;if(o)h=A*.5;else{const p=Math.max(n.near,D.distanceToPoint(j.origin));h=ee(n,p,u.resolution)}D.expandByScalar(h),j.intersectsBox(D)!==!1&&(o?ge(this,e):ye(this,n,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(G),this.material.uniforms.resolution.value.set(G.z,G.w))}}class Se extends ae{constructor(t=new re,e=new k({color:Math.random()*16777215})){super(t,e),this.isLine2=!0,this.type="Line2"}}const be=c.forwardRef(function({points:t,color:e=16777215,vertexColors:o,linewidth:n,lineWidth:s,segments:l,dashed:a,...u},f){var h,p;const g=he(L=>L.size),E=c.useMemo(()=>l?new ae:new Se,[l]),[S]=c.useState(()=>new k),w=(o==null||(h=o[0])==null?void 0:h.length)===4?4:3,B=c.useMemo(()=>{const L=l?new F:new re,T=t.map(d=>{const y=Array.isArray(d);return d instanceof b||d instanceof O?[d.x,d.y,d.z]:d instanceof ie?[d.x,d.y,0]:y&&d.length===3?[d[0],d[1],d[2]]:y&&d.length===2?[d[0],d[1],0]:d});if(L.setPositions(T.flat()),o){e=16777215;const d=o.map(y=>y instanceof me?y.toArray():y);L.setColors(d.flat(),w)}return L},[t,l,o,w]);return c.useLayoutEffect(()=>{E.computeLineDistances()},[t,E]),c.useLayoutEffect(()=>{a?S.defines.USE_DASH="":delete S.defines.USE_DASH,S.needsUpdate=!0},[a,S]),c.useEffect(()=>()=>{B.dispose(),S.dispose()},[B]),c.createElement("primitive",J({object:E,ref:f},u),c.createElement("primitive",{object:B,attach:"geometry"}),c.createElement("primitive",J({object:S,attach:"material",color:e,vertexColors:!!o,resolution:[g.width,g.height],linewidth:(p=n??s)!==null&&p!==void 0?p:1,dashed:a,transparent:w===4},u)))}),we=c.forwardRef(({children:r,enabled:t=!0,speed:e=1,rotationIntensity:o=1,floatIntensity:n=1,floatingRange:s=[-.1,.1],autoInvalidate:l=!1,...a},u)=>{const f=c.useRef(null);c.useImperativeHandle(u,()=>f.current,[]);const h=c.useRef(Math.random()*1e4);return U(p=>{var g,E;if(!t||e===0)return;l&&p.invalidate();const S=h.current+p.clock.elapsedTime;f.current.rotation.x=Math.cos(S/4*e)/8*o,f.current.rotation.y=Math.sin(S/4*e)/8*o,f.current.rotation.z=Math.sin(S/4*e)/20*o;let w=Math.sin(S/4*e)/10;w=se.mapLinear(w,-.1,.1,(g=s==null?void 0:s[0])!==null&&g!==void 0?g:-.1,(E=s==null?void 0:s[1])!==null&&E!==void 0?E:.1),f.current.position.y=w*n,f.current.updateMatrix()}),c.createElement("group",a,c.createElement("group",{ref:f,matrixAutoUpdate:!1},r))});function Ce({variant:r,active:t}){return i.jsxs(xe,{className:"!absolute inset-0",dpr:[1,1.75],frameloop:t?"always":"never",camera:{position:[0,0,6],fov:38},gl:{antialias:!0,alpha:!0},children:[i.jsx("ambientLight",{intensity:.4}),i.jsx("directionalLight",{position:[3,4,5],intensity:1.1,color:"#fff1e6"}),i.jsx("pointLight",{position:[-3,-1,3],intensity:14,distance:10,color:"#8f3df3"}),i.jsx("pointLight",{position:[3,1,2],intensity:10,distance:10,color:"#ff8a2a"}),i.jsx(Me,{children:i.jsxs(we,{speed:1.6,rotationIntensity:.25,floatIntensity:.6,children:[r==="plans"&&i.jsx(_e,{}),r==="hardware"&&i.jsx(je,{}),r==="changelog"&&i.jsx(Ee,{}),r==="downloads"&&i.jsx(Le,{}),r==="models"&&i.jsx(Ae,{})]})}),i.jsx(ve,{count:40,scale:[8,4,4],size:2,speed:.3,opacity:.5,color:"#d9b8ff"})]})}function Me({children:r}){const t=c.useRef(null);return U((e,o)=>{if(!t.current)return;const n=1-Math.exp(-o*3);t.current.rotation.y+=(e.pointer.x*.55-t.current.rotation.y)*n,t.current.rotation.x+=(-e.pointer.y*.35-t.current.rotation.x)*n}),i.jsx("group",{ref:t,children:r})}function _e(){const r=c.useRef(null),t=c.useRef(null);return U((e,o)=>{r.current&&(r.current.rotation.z+=o*.35),t.current&&(t.current.rotation.z-=o*.22)}),i.jsxs("group",{rotation:[.25,-.45,.08],children:[i.jsx(I,{args:[2.9,1.8,.08],radius:.12,smoothness:6,children:i.jsx("meshStandardMaterial",{color:"#1f1540",metalness:.75,roughness:.25})}),i.jsxs("mesh",{position:[-.85,.35,.05],children:[i.jsx("boxGeometry",{args:[.55,.42,.02]}),i.jsx("meshStandardMaterial",{color:"#fbbf24",metalness:.95,roughness:.2})]}),[0,1,2,3].map(e=>i.jsxs("mesh",{position:[-.95+e*.62,-.45,.05],children:[i.jsx("boxGeometry",{args:[.5,.1,.01]}),i.jsx("meshStandardMaterial",{color:"#d9b8ff",emissive:"#b26bff",emissiveIntensity:1.4,toneMapped:!1})]},e)),i.jsxs("mesh",{position:[.95,.4,.05],children:[i.jsx("circleGeometry",{args:[.28,32]}),i.jsx("meshStandardMaterial",{color:"#ff8a2a",emissive:"#ff7a1c",emissiveIntensity:.9,toneMapped:!1})]}),i.jsxs("mesh",{ref:r,rotation:[Math.PI/2.3,0,0],children:[i.jsx("torusGeometry",{args:[2.05,.012,8,120]}),i.jsx("meshBasicMaterial",{color:"#b26bff",toneMapped:!1})]}),i.jsxs("mesh",{ref:t,rotation:[Math.PI/1.8,.3,0],children:[i.jsx("torusGeometry",{args:[2.35,.008,8,120]}),i.jsx("meshBasicMaterial",{color:"#ff8a2a",transparent:!0,opacity:.6,toneMapped:!1})]})]})}function je(){const r=c.useRef(null);U(e=>{r.current&&(r.current.emissiveIntensity=1.2+Math.sin(e.clock.elapsedTime*2.2)*.6)});const t=c.useMemo(()=>Array.from({length:9},(e,o)=>-.8+o*.2),[]);return i.jsxs("group",{rotation:[.55,-.6,.05],children:[i.jsx(I,{args:[3,.1,1.8],radius:.03,children:i.jsx("meshStandardMaterial",{color:"#0b3b2e",metalness:.35,roughness:.5})}),i.jsxs("mesh",{position:[-.35,.1,0],children:[i.jsx("boxGeometry",{args:[.7,.08,.7]}),i.jsx("meshStandardMaterial",{ref:r,color:"#9a3b12",emissive:"#ff7a1c",emissiveIntensity:1.2,toneMapped:!1})]}),t.map(e=>i.jsxs("mesh",{position:[.85+e*.55,.22,0],children:[i.jsx("boxGeometry",{args:[.04,.3,1.2]}),i.jsx("meshStandardMaterial",{color:"#9ca3af",metalness:.9,roughness:.25})]},e)),[-.55,.05].map(e=>i.jsxs("mesh",{position:[-1.35,.14,e],children:[i.jsx("boxGeometry",{args:[.3,.16,.36]}),i.jsx("meshStandardMaterial",{color:"#1f2937",metalness:.85,roughness:.3})]},e)),i.jsxs("mesh",{position:[0,-.04,.95],children:[i.jsx("boxGeometry",{args:[2.2,.04,.1]}),i.jsx("meshStandardMaterial",{color:"#facc15",metalness:.9,roughness:.2})]})]})}function Ee(){const r=c.useRef(null);U(e=>{if(!r.current)return;const o=.34+(e.pointer.y+1)*.08;r.current.children.forEach((n,s)=>{const l=(s-2)*o;n.position.y+=(l-n.position.y)*.08,n.rotation.z=Math.sin(e.clock.elapsedTime*.6+s)*.03})});const t=["#2a1c52","#3a1f66","#5b2a86","#8a2f7a","#b8481f"];return i.jsx("group",{rotation:[.9,-.5,.2],children:i.jsx("group",{ref:r,children:t.map((e,o)=>i.jsxs("group",{position:[0,(o-2)*.34,0],children:[i.jsx(I,{args:[2.6,.05,1.7],radius:.04,children:i.jsx("meshStandardMaterial",{color:e,metalness:.4,roughness:.35,transparent:!0,opacity:.88})}),i.jsxs("mesh",{position:[-.7,.03,-.45],rotation:[-Math.PI/2,0,0],children:[i.jsx("planeGeometry",{args:[.9,.08]}),i.jsx("meshBasicMaterial",{color:o===4?"#ffb36b":"#d9b8ff",toneMapped:!1})]})]},e))})})}function Le(){const r=c.useRef(null),t=c.useRef(null);return U(e=>{const n=e.clock.elapsedTime%2.2/2.2;r.current&&(r.current.position.y=1.9-n*1.5,r.current.scale.setScalar(n>.85?(1-n)/.15:1)),t.current&&(t.current.rotation.x=-.35-Math.max(0,Math.sin(n*Math.PI))*.35)}),i.jsxs("group",{rotation:[.35,-.6,0],children:[i.jsx(I,{args:[1.9,1.3,1.9],radius:.06,position:[0,-.55,0],children:i.jsx("meshStandardMaterial",{color:"#1f1540",metalness:.5,roughness:.35})}),i.jsxs("mesh",{position:[0,-.55,.955],children:[i.jsx("planeGeometry",{args:[1.5,.12]}),i.jsx("meshStandardMaterial",{color:"#ff8a2a",emissive:"#ff7a1c",emissiveIntensity:1.4,toneMapped:!1})]}),i.jsxs("mesh",{ref:t,position:[0,.12,-.95],rotation:[-.35,0,0],children:[i.jsx("boxGeometry",{args:[1.95,.06,1]}),i.jsx("meshStandardMaterial",{color:"#2a1c52",metalness:.5,roughness:.35})]}),i.jsxs("group",{ref:r,children:[i.jsxs("mesh",{position:[0,.25,0],children:[i.jsx("boxGeometry",{args:[.22,.6,.22]}),i.jsx("meshStandardMaterial",{color:"#b26bff",emissive:"#8f3df3",emissiveIntensity:1.2,toneMapped:!1})]}),i.jsxs("mesh",{position:[0,-.15,0],rotation:[Math.PI,0,0],children:[i.jsx("coneGeometry",{args:[.36,.42,4]}),i.jsx("meshStandardMaterial",{color:"#b26bff",emissive:"#8f3df3",emissiveIntensity:1.2,toneMapped:!1})]})]})]})}const R=[3,5,5,2];function Ae(){const r=c.useMemo(()=>R.flatMap((s,l)=>Array.from({length:s},(a,u)=>new b((l-(R.length-1)/2)*1.05,(u-(s-1)/2)*.6,0))),[]),t=c.useMemo(()=>{const s=[];let l=0;return R.slice(0,-1).forEach((a,u)=>{const f=l+a;for(let h=0;h<a;h+=1)for(let p=0;p<R[u+1];p+=1)s.push([r[l+h],r[f+p]]);l=f}),s},[r]),e=c.useRef([]),o=c.useRef(null),n=c.useMemo(()=>[0,4,9,13].map(s=>r[s]),[r]);return U(s=>{const l=s.clock.elapsedTime;if(e.current.forEach((a,u)=>{a&&(a.emissiveIntensity=.6+Math.max(0,Math.sin(l*2.4-r[u].x*1.6))*1.8)}),o.current){const u=l*.45%1*(n.length-1),f=Math.floor(u);o.current.position.lerpVectors(n[f],n[Math.min(f+1,n.length-1)],u-f)}}),i.jsxs("group",{rotation:[.15,-.45,0],children:[t.map(([s,l],a)=>i.jsx(be,{points:[s,l],color:"#8f3df3",lineWidth:1,transparent:!0,opacity:.35},a)),r.map((s,l)=>i.jsxs("mesh",{position:s,children:[i.jsx("sphereGeometry",{args:[.11,20,20]}),i.jsx("meshStandardMaterial",{ref:a=>{e.current[l]=a},color:"#1f1540",emissive:l>=r.length-2?"#ff7a1c":"#8f3df3",emissiveIntensity:1,toneMapped:!1})]},l)),i.jsxs("mesh",{ref:o,children:[i.jsx("sphereGeometry",{args:[.07,16,16]}),i.jsx("meshBasicMaterial",{color:"#fff1e6",toneMapped:!1})]})]})}export{Ce as default};
