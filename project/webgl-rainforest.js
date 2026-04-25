// Three.js — Subtle rainforest + canal + toucan scene (NOT overwhelming, ambient bg)
// Exports: window.RainforestScene(canvas)

(function() {
  const THREE = window.THREE;

  window.RainforestScene = function(canvas) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xE8F0E4, 20, 80);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 4, 22);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ── Soft mist / background gradient sheet ──
    const bgGeo = new THREE.PlaneGeometry(200, 100);
    const bgMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      depthWrite: false,
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main(){
          vec3 top    = vec3(0.95, 0.94, 0.88); // warm misty cream
          vec3 mid    = vec3(0.82, 0.88, 0.80); // hazy green
          vec3 low    = vec3(0.62, 0.75, 0.62); // deeper canopy tint
          vec3 col = mix(low, mid, smoothstep(0.1, 0.55, vUv.y));
          col = mix(col, top, smoothstep(0.5, 0.95, vUv.y));
          // very subtle sunbeam center
          float glow = exp(-pow((vUv.x - 0.55) * 1.4, 2.0) * 2.2) * exp(-pow((vUv.y - 0.7), 2.0) * 6.0) * 0.12;
          col += glow;
          gl_FragColor = vec4(col, 1.0);
        }
      `
    });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    bg.position.set(0, 5, -40);
    scene.add(bg);

    // ── Layered jungle silhouettes (receding) ──
    function makeLayer(z, shade, count, hScale) {
      const group = new THREE.Group();
      for (let i = 0; i < count; i++) {
        // Simple palm-leaf silhouette via triangle shape
        const x = (i / count - 0.5) * 80 + (Math.random() - 0.5) * 4;
        const h = (2 + Math.random() * 3) * hScale;
        const w = 3 + Math.random() * 2.5;

        // Palm trunk
        const trunkGeo = new THREE.PlaneGeometry(0.14, h);
        const trunkMat = new THREE.MeshBasicMaterial({ color: shade * 0.7, transparent: true, opacity: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(x, h/2, z);
        group.add(trunk);

        // Palm fronds — fan of triangles
        const frondCount = 7;
        for (let f = 0; f < frondCount; f++) {
          const ang = (f / (frondCount - 1)) * Math.PI - Math.PI/2;
          const frondGeo = new THREE.PlaneGeometry(w * 0.9, 0.22);
          const frondMat = new THREE.MeshBasicMaterial({ color: shade, transparent: true, opacity: 0.92, side: THREE.DoubleSide });
          const frond = new THREE.Mesh(frondGeo, frondMat);
          frond.position.set(x + Math.cos(ang) * w * 0.32, h + Math.sin(ang) * 0.8, z);
          frond.rotation.z = ang;
          group.add(frond);
        }
      }
      scene.add(group);
      return group;
    }

    // Three receding layers, greens from dark (near) to light (far) with atmospheric haze
    const layerNear = makeLayer(-4, 0x1F4A38, 8, 1.2);
    const layerMid  = makeLayer(-12, 0x3A6B52, 10, 1.0);
    const layerFar  = makeLayer(-22, 0x6B8E76, 12, 0.8);

    // ── Canal water strip across bottom ──
    const canalGeo = new THREE.PlaneGeometry(80, 6, 60, 6);
    canalGeo.rotateX(-Math.PI/2);
    const canalMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          vUv = uv;
          vec3 p = position;
          float w = sin(p.x * 0.6 + uTime * 0.8) * 0.08 + cos(p.z * 0.9 + uTime * 0.6) * 0.06;
          p.y += w;
          vWave = w;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vWave;
        void main() {
          vec3 deep = vec3(0.10, 0.32, 0.34);
          vec3 shallow = vec3(0.55, 0.72, 0.68);
          vec3 col = mix(deep, shallow, smoothstep(0.0, 1.0, vUv.y + vWave * 2.0));
          // fine ripple shimmer
          float shimmer = smoothstep(0.3, 0.9, abs(vWave) * 5.0);
          col += shimmer * 0.08;
          gl_FragColor = vec4(col, 0.92);
        }
      `
    });
    const canal = new THREE.Mesh(canalGeo, canalMat);
    canal.position.set(0, -0.5, -2);
    scene.add(canal);

    // ── The bird (toucan-ish) — simple low-poly silhouette, in the mid-distance, gentle bob ──
    const birdGroup = new THREE.Group();
    // Body (black)
    const bodyGeo = new THREE.SphereGeometry(0.28, 12, 10);
    bodyGeo.scale(1.15, 0.9, 0.8);
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    birdGroup.add(body);
    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 10, 8);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0.28, 0.12, 0);
    birdGroup.add(head);
    // White chest patch
    const chestGeo = new THREE.SphereGeometry(0.19, 10, 8);
    chestGeo.scale(1.0, 0.8, 0.8);
    const chestMat = new THREE.MeshBasicMaterial({ color: 0xFFF5D8 });
    const chest = new THREE.Mesh(chestGeo, chestMat);
    chest.position.set(0.14, 0.02, 0.08);
    birdGroup.add(chest);
    // The iconic beak — orange/coral, long
    const beakGeo = new THREE.ConeGeometry(0.11, 0.55, 8);
    beakGeo.rotateZ(-Math.PI/2);
    const beakMat = new THREE.MeshBasicMaterial({ color: 0xFF8A3D });
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.position.set(0.62, 0.12, 0);
    birdGroup.add(beak);
    // Beak tip accent (deeper coral)
    const beakTipGeo = new THREE.ConeGeometry(0.065, 0.18, 8);
    beakTipGeo.rotateZ(-Math.PI/2);
    const beakTipMat = new THREE.MeshBasicMaterial({ color: 0xD63E52 });
    const beakTip = new THREE.Mesh(beakTipGeo, beakTipMat);
    beakTip.position.set(0.82, 0.12, 0);
    birdGroup.add(beakTip);
    // Tiny eye highlight
    const eyeGeo = new THREE.SphereGeometry(0.03, 6, 6);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xFFF9EC });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0.38, 0.18, 0.12);
    birdGroup.add(eye);

    birdGroup.position.set(-6, 4.8, -8);
    birdGroup.scale.setScalar(1.1);
    scene.add(birdGroup);

    // ── Drifting mist particles (subtle depth cue) ──
    const mistCount = 140;
    const mistPos = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) {
      mistPos[i*3] = (Math.random() - 0.5) * 40;
      mistPos[i*3+1] = Math.random() * 10 + 1;
      mistPos[i*3+2] = -Math.random() * 20 - 3;
    }
    const mistGeo = new THREE.BufferGeometry();
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    const mistMat = new THREE.PointsMaterial({
      color: 0xFFF9EC, size: 0.25, transparent: true, opacity: 0.35, depthWrite: false, sizeAttenuation: true
    });
    const mist = new THREE.Points(mistGeo, mistMat);
    scene.add(mist);

    // ── Resize ──
    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Loop ──
    let raf, t0 = performance.now();
    function tick() {
      const t = (performance.now() - t0) / 1000;
      canalMat.uniforms.uTime.value = t;
      // gentle bird bob
      birdGroup.position.y = 4.8 + Math.sin(t * 0.7) * 0.18;
      birdGroup.rotation.z = Math.sin(t * 0.4) * 0.03;
      // slow mist drift
      const pos = mistGeo.attributes.position.array;
      for (let i = 0; i < mistCount; i++) {
        pos[i*3] += 0.008 * ((i % 5) - 2) * 0.5;
        if (pos[i*3] > 20) pos[i*3] = -20;
        if (pos[i*3] < -20) pos[i*3] = 20;
      }
      mistGeo.attributes.position.needsUpdate = true;

      // subtle camera parallax
      camera.position.x = Math.sin(t * 0.12) * 0.6;
      camera.lookAt(0, 3.5, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    tick();

    return {
      stop() {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        renderer.dispose();
      }
    };
  };
})();
