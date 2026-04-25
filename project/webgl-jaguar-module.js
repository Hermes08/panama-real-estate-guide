// Jaguar wireframe scene — adapted from neon_jaguar reference.
// Loads assets/jaguar.glb, builds a wireframe + point-cloud render in the
// website's coral palette with subtle bloom. Exposes window.JaguarScene(canvas).
//
// This file is an ES module — load it with <script type="module">.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* Palette — matches the website (coral primary, no pink) */
const CORAL       = new THREE.Color(0xE37363);
const CORAL_BR    = new THREE.Color(0xEC8F73); // brighter coral
const CORAL_SOFT  = new THREE.Color(0xF6BBA0); // soft, for points
const EYE_GLOW    = new THREE.Color(0xFFE6D0); // warm cream highlight

/* Cache the loaded GLTF so multiple mounts don't reparse the 9MB GLB */
let glbPromise = null;
function loadJaguarGLB() {
  if (!glbPromise) {
    glbPromise = new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load('assets/jaguar.glb', resolve, undefined, reject);
    });
  }
  // Each consumer needs its OWN copy of the scene/animations, so re-clone.
  return glbPromise.then(gltf => ({
    sceneClone: gltf.scene.clone(true),
    animations: gltf.animations
  }));
}

/* Subdivide each triangle into 4 (recursively `passes` times) — gives a much
   denser wireframe so the silhouette reads even on a small canvas. */
function subdivideTriangles(geometry, passes = 1) {
  const geo = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const pos = geo.attributes.position;
  const skin = geo.attributes.skinIndex;
  const skinW = geo.attributes.skinWeight;

  let positions = [];
  for (let i = 0; i < pos.count; i++) {
    positions.push([pos.getX(i), pos.getY(i), pos.getZ(i)]);
  }
  let skins = null, weights = null;
  if (skin) {
    skins = []; weights = [];
    for (let i = 0; i < skin.count; i++) {
      skins.push([skin.getX(i), skin.getY(i), skin.getZ(i), skin.getW(i)]);
      weights.push([skinW.getX(i), skinW.getY(i), skinW.getZ(i), skinW.getW(i)]);
    }
  }

  for (let p = 0; p < passes; p++) {
    const np = [], ns = skins ? [] : null, nw = weights ? [] : null;
    for (let i = 0; i < positions.length; i += 3) {
      const a = positions[i], b = positions[i+1], c = positions[i+2];
      const ab = [(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];
      const bc = [(b[0]+c[0])/2,(b[1]+c[1])/2,(b[2]+c[2])/2];
      const ca = [(c[0]+a[0])/2,(c[1]+a[1])/2,(c[2]+a[2])/2];
      np.push(a, ab, ca,  ab, b, bc,  ca, bc, c,  ab, bc, ca);
      if (skins) {
        const wa = weights[i], wb = weights[i+1], wc = weights[i+2];
        const wab = [(wa[0]+wb[0])/2,(wa[1]+wb[1])/2,(wa[2]+wb[2])/2,(wa[3]+wb[3])/2];
        const wbc = [(wb[0]+wc[0])/2,(wb[1]+wc[1])/2,(wb[2]+wc[2])/2,(wb[3]+wc[3])/2];
        const wca = [(wc[0]+wa[0])/2,(wc[1]+wa[1])/2,(wc[2]+wa[2])/2,(wc[3]+wa[3])/2];
        ns.push(skins[i], skins[i], skins[i],  skins[i+1], skins[i+1], skins[i+1],
                skins[i+2], skins[i+2], skins[i+2],  skins[i], skins[i+1], skins[i+2]);
        nw.push(wa, wab, wca,  wab, wb, wbc,  wca, wbc, wc,  wab, wbc, wca);
      }
    }
    positions = np;
    if (skins) { skins = ns; weights = nw; }
  }

  const out = new THREE.BufferGeometry();
  const flat = new Float32Array(positions.length * 3);
  for (let i = 0; i < positions.length; i++) {
    flat[i*3] = positions[i][0]; flat[i*3+1] = positions[i][1]; flat[i*3+2] = positions[i][2];
  }
  out.setAttribute('position', new THREE.BufferAttribute(flat, 3));
  if (skins) {
    const sFlat = new Float32Array(skins.length * 4);
    const wFlat = new Float32Array(weights.length * 4);
    for (let i = 0; i < skins.length; i++) {
      sFlat[i*4] = skins[i][0]; sFlat[i*4+1] = skins[i][1]; sFlat[i*4+2] = skins[i][2]; sFlat[i*4+3] = skins[i][3];
      wFlat[i*4] = weights[i][0]; wFlat[i*4+1] = weights[i][1]; wFlat[i*4+2] = weights[i][2]; wFlat[i*4+3] = weights[i][3];
    }
    out.setAttribute('skinIndex', new THREE.BufferAttribute(sFlat, 4));
    out.setAttribute('skinWeight', new THREE.BufferAttribute(wFlat, 4));
  }
  out.computeVertexNormals();
  return out;
}

/* Build wireframe + dust overlays on every mesh in the model, hide the solid mesh. */
function buildWireframeOverlay(model, registries) {
  const wireMat = new THREE.MeshBasicMaterial({
    color: CORAL, wireframe: true, transparent: true, opacity: 0.7,
    depthWrite: false, blending: THREE.AdditiveBlending
  });
  const wireMatBright = new THREE.MeshBasicMaterial({
    color: CORAL_BR, wireframe: true, transparent: true, opacity: 0.4,
    depthWrite: false, blending: THREE.AdditiveBlending
  });
  const pointMat = new THREE.PointsMaterial({
    color: CORAL_SOFT, size: 0.022, transparent: true, opacity: 1.0,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending
  });

  const targets = [];
  model.traverse(c => { if (c.isMesh) targets.push(c); });

  targets.forEach(child => {
    const name = (child.name || '') + ' ' + (child.material?.name || '');
    const isEye    = /eye|ojo/i.test(name);
    const isTongue = /tongue|lengua/i.test(name);
    if (isTongue) { child.visible = false; return; }
    if (isEye) {
      child.material = new THREE.MeshBasicMaterial({
        color: EYE_GLOW, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false
      });
      return;
    }

    const dense = subdivideTriangles(child.geometry, 2);
    let wire, wireOuter, pts;
    if (child.isSkinnedMesh) {
      wire = new THREE.SkinnedMesh(dense, wireMat.clone());
      wire.bind(child.skeleton, child.bindMatrix); wire.bindMode = child.bindMode;
      wireOuter = new THREE.SkinnedMesh(dense, wireMatBright.clone());
      wireOuter.bind(child.skeleton, child.bindMatrix); wireOuter.bindMode = child.bindMode;
      wireOuter.scale.setScalar(1.005);
      // Skinned points need bones too
      pts = new THREE.Points(dense, pointMat.clone());
    } else {
      wire = new THREE.Mesh(dense, wireMat.clone());
      wireOuter = new THREE.Mesh(dense, wireMatBright.clone());
      wireOuter.scale.setScalar(1.005);
      pts = new THREE.Points(dense, pointMat.clone());
    }
    wire.frustumCulled = false; wireOuter.frustumCulled = false; pts.frustumCulled = false;
    child.add(wire); child.add(wireOuter); child.add(pts);

    registries.wires.push(wire, wireOuter);
    registries.points.push(pts);

    // Hide the solid mesh
    child.material = new THREE.MeshBasicMaterial({
      color: 0x000000, transparent: true, opacity: 0, depthWrite: true
    });
  });
}

/* Main entry — exposed on window for the React component to call. */
window.JaguarScene = function(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // transparent — cream background shows through
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  // No fog — we want the cream page color to show through cleanly
  const aspect = (canvas.clientWidth || 1) / (canvas.clientHeight || 1);
  const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
  camera.position.set(4.2, 1.7, 6.0);
  camera.lookAt(0, 0.95, 0);

  // Post-processing: subtle bloom (much lower than reference)
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(canvas.clientWidth || 1, canvas.clientHeight || 1),
    0.6, // strength — way less than the neon reference (was 2.4)
    0.9, // radius
    0.2  // threshold
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* Ground — a few faint horizon lines (no full grid; subtler) */
  const groundGroup = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const z = (i - 2) * 0.6;
    const pts = [];
    for (let j = 0; j <= 20; j++) {
      pts.push(new THREE.Vector3(-3 + (j / 20) * 6, 0, z));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: CORAL, transparent: true,
      opacity: 0.18 - Math.abs(i - 2) * 0.04,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    groundGroup.add(new THREE.Line(geo, mat));
  }
  scene.add(groundGroup);

  /* Subtle drifting dust (much fewer particles than the reference's 900) */
  const sparkCount = 120;
  const sparkPos = new Float32Array(sparkCount * 3);
  const sparkSpeed = new Float32Array(sparkCount);
  for (let i = 0; i < sparkCount; i++) {
    sparkPos[i*3]   = (Math.random() - 0.5) * 8;
    sparkPos[i*3+1] = Math.random() * 3;
    sparkPos[i*3+2] = (Math.random() - 0.5) * 4;
    sparkSpeed[i]   = 0.08 + Math.random() * 0.18;
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({
    color: CORAL_SOFT, size: 0.03, transparent: true, opacity: 0.55,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  scene.add(sparks);

  /* Load the model */
  const registries = { wires: [], points: [] };
  let mixer = null;
  let modelGroup = null;

  const loadingPromise = loadJaguarGLB().then(({ sceneClone, animations }) => {
    const model = sceneClone;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const target = 3.5;
    const s = target / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(s);
    model.position.x = -center.x * s;
    model.position.y = -box.min.y * s;
    model.position.z = -center.z * s;

    buildWireframeOverlay(model, registries);
    scene.add(model);
    modelGroup = model;

    if (animations && animations.length) {
      window.__jaguarAnimations = animations.map(a => a.name);
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(animations[0]);
      action.play();
    }
  }).catch(err => console.error('jaguar load:', err));

  /* Animation loop */
  const clock = new THREE.Clock();
  let mx = 0, tmx = 0;
  const onPointerMove = (ev) => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0) return;
    tmx = ((ev.clientX - r.left) / r.width - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointerMove);

  let raf;
  function tick() {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t  = clock.getElapsedTime();

    // Resize check
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w > 0 && h > 0 && (canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio()))) {
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    if (mixer) mixer.update(dt);

    // Auto-rotate the whole model — slow, decorative
    mx += (tmx - mx) * 0.04;
    if (modelGroup) {
      modelGroup.rotation.y = t * 0.18 + mx * 0.4;
    }

    // Pulse the wireframe opacities subtly
    const pulse = 0.55 + Math.sin(t * 1.6) * 0.12;
    registries.wires.forEach((m, i) => {
      const base = i % 2 === 0 ? 0.55 : 0.32;
      m.material.opacity = base + pulse * 0.18;
    });

    // Drift sparks
    const sp = sparks.geometry.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
      sp[i*3]     += sparkSpeed[i] * dt;
      sp[i*3 + 1] += Math.sin(t * 0.6 + i) * dt * 0.08;
      if (sp[i*3] > 4)  sp[i*3] = -4;
    }
    sparks.geometry.attributes.position.needsUpdate = true;

    composer.render();
  }
  raf = requestAnimationFrame(tick);

  return {
    stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      composer.dispose?.();
    }
  };
};
