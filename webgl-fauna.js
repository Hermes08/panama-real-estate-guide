// Three.js — wireframe / point-cloud creatures in coral. Drawn-in-3D aesthetic:
// edges + scattered points + soft glow trails. Subtle, matches the website palette.
//
//   window.ToucanScene(canvas)  — perched toucan, head turn + tail sway, occasional beak flick
//   window.JaguarScene(canvas)  — prowling jaguar profile, breathing + tail sway
//
// Compatibility shims: also exports MacawScene as an alias for ToucanScene
// so existing callers keep working.

(function() {
  const THREE = window.THREE;

  /* Palette (matches website) */
  const CORAL       = new THREE.Color('#E37363'); // primary --coral
  const CORAL_DEEP  = new THREE.Color('#C8513F'); // --coral-deep, used for accents
  const OCEAN_DEEP  = new THREE.Color('#0B2733'); // --ink, eye glow

  /* Helpers */
  function makeRenderer(canvas) {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1);
    r.setClearColor(0x000000, 0);
    return r;
  }
  function fit(renderer, camera, canvas) {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // Build a wireframe LineSegments + Points point-cloud from a mesh geometry.
  // Returns a Group containing both.
  function wireframeWithPoints(geometry, options = {}) {
    const {
      lineColor = CORAL,
      lineOpacity = 0.95,
      pointColor = CORAL,
      pointSize = 3.0,
      pointOpacity = 1.0,
      pointDensity = 1, // multiplier on vertex sampling
    } = options;

    const group = new THREE.Group();

    // Edges (clean silhouette + key crease lines)
    const edges = new THREE.EdgesGeometry(geometry, 22);
    const lineMat = new THREE.LineBasicMaterial({
      color: lineColor, transparent: true, opacity: lineOpacity,
      blending: THREE.NormalBlending, depthWrite: false
    });
    const lines = new THREE.LineSegments(edges, lineMat);
    group.add(lines);

    // Sample points across the mesh surface for the "polygon dust" feel
    const sampledPositions = [];
    const posAttr = geometry.attributes.position;
    const sampleStride = Math.max(1, Math.floor(1 / pointDensity));
    for (let i = 0; i < posAttr.count; i += sampleStride) {
      sampledPositions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    }
    // Add some interior random points by lerping triangle centroids
    if (geometry.index) {
      const idx = geometry.index.array;
      for (let i = 0; i < idx.length; i += 3) {
        const a = idx[i], b = idx[i+1], c = idx[i+2];
        const ax = posAttr.getX(a), ay = posAttr.getY(a), az = posAttr.getZ(a);
        const bx = posAttr.getX(b), by = posAttr.getY(b), bz = posAttr.getZ(b);
        const cx = posAttr.getX(c), cy = posAttr.getY(c), cz = posAttr.getZ(c);
        // 1 random point per triangle
        if (Math.random() < 0.6) {
          const u = Math.random(), v = Math.random() * (1 - u);
          const w = 1 - u - v;
          sampledPositions.push(
            ax * u + bx * v + cx * w,
            ay * u + by * v + cy * w,
            az * u + bz * v + cz * w
          );
        }
      }
    }
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position',
      new THREE.Float32BufferAttribute(sampledPositions, 3));
    const pointsMat = new THREE.PointsMaterial({
      color: pointColor, size: pointSize, sizeAttenuation: false,
      transparent: true, opacity: pointOpacity,
      blending: THREE.NormalBlending, depthWrite: false
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    group.add(points);

    return group;
  }

  // Floating energy-trail particles drifting in a small region
  function makeTrailParticles(count = 60, radius = 2.2, opts = {}) {
    const { color = CORAL, size = 1.4, opacity = 0.5 } = opts;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * radius * 0.8;
      positions[i*3]   = Math.cos(a) * r;
      positions[i*3+1] = y;
      positions[i*3+2] = Math.sin(a) * r * 0.6;
      speeds[i] = 0.2 + Math.random() * 0.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color, size, sizeAttenuation: false, transparent: true, opacity,
      blending: THREE.NormalBlending, depthWrite: false
    });
    const points = new THREE.Points(geo, mat);
    points.userData = { speeds, basePositions: positions.slice(), radius };
    return points;
  }

  /* ────────────────────────────────────────────────────────────
     TOUCAN — stylized procedural model, wireframe + dots
     ──────────────────────────────────────────────────────────── */
  window.ToucanScene = function(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(2.0, 1.2, 5.2);
    camera.lookAt(0, 0.5, 0);

    const renderer = makeRenderer(canvas);
    fit(renderer, camera, canvas);

    const group = new THREE.Group();
    scene.add(group);

    // Body — egg-ish ellipsoid (sphere scaled)
    const bodyGeo = new THREE.SphereGeometry(0.78, 18, 14);
    bodyGeo.scale(1.0, 1.05, 1.0);
    const body = wireframeWithPoints(bodyGeo);
    body.position.set(0, 0.55, 0);
    group.add(body);

    // Head — smaller sphere
    const headGeo = new THREE.SphereGeometry(0.46, 16, 12);
    const head = wireframeWithPoints(headGeo);
    head.position.set(0.55, 1.15, 0.0);
    group.add(head);

    // Beak — toucan signature: long, curved, broad. Approximate with two cones.
    // Upper beak (curved by tilting an elongated cone)
    const upperBeakGeo = new THREE.ConeGeometry(0.28, 1.25, 8, 1, true);
    upperBeakGeo.translate(0, 0.625, 0); // base at origin, tip up
    upperBeakGeo.rotateZ(-Math.PI / 2);  // tip points +x
    upperBeakGeo.translate(0.08, 0, 0);
    const upperBeak = wireframeWithPoints(upperBeakGeo, {
      pointDensity: 0.9,
      lineColor: CORAL_DEEP, pointColor: CORAL_DEEP
    });
    upperBeak.position.set(0.95, 1.18, 0);
    upperBeak.rotation.z = -0.06;
    group.add(upperBeak);

    // Lower beak — slightly shorter cone, tucked under
    const lowerBeakGeo = new THREE.ConeGeometry(0.22, 1.08, 8, 1, true);
    lowerBeakGeo.translate(0, 0.54, 0);
    lowerBeakGeo.rotateZ(-Math.PI / 2);
    const lowerBeak = wireframeWithPoints(lowerBeakGeo, {
      pointDensity: 0.8,
      lineColor: CORAL_DEEP, pointColor: CORAL_DEEP
    });
    lowerBeak.position.set(1.0, 0.95, 0);
    lowerBeak.rotation.z = 0.05;
    group.add(lowerBeak);

    // Tail — short cone, pointing back
    const tailGeo = new THREE.ConeGeometry(0.32, 0.7, 8, 1, true);
    tailGeo.translate(0, 0.35, 0);
    tailGeo.rotateZ(Math.PI / 2);
    const tail = wireframeWithPoints(tailGeo);
    tail.position.set(-0.7, 0.55, 0);
    group.add(tail);

    // Eye — tiny ring (torus) glowing brighter
    const eyeRingGeo = new THREE.TorusGeometry(0.07, 0.014, 6, 14);
    const eyeRingMat = new THREE.LineBasicMaterial({
      color: CORAL_DEEP, transparent: true, opacity: 1,
      blending: THREE.NormalBlending, depthWrite: false
    });
    const eyeEdges = new THREE.EdgesGeometry(eyeRingGeo, 1);
    const eyeRing = new THREE.LineSegments(eyeEdges, eyeRingMat);
    eyeRing.position.set(0.85, 1.22, 0.36);
    eyeRing.rotation.y = Math.PI / 2;
    group.add(eyeRing);
    // Eye dot
    const eyeDotGeo = new THREE.BufferGeometry();
    eyeDotGeo.setAttribute('position',
      new THREE.Float32BufferAttribute([0.86, 1.22, 0.37], 3));
    const eyeDot = new THREE.Points(eyeDotGeo, new THREE.PointsMaterial({
      color: CORAL_DEEP, size: 6, sizeAttenuation: false, transparent: true, opacity: 1,
      blending: THREE.NormalBlending, depthWrite: false
    }));
    group.add(eyeDot);

    // Perch — line segment + scattered points
    const perchPositions = [
      -1.4, -0.05, 0,   1.4, -0.05, 0,
      -1.4,  0.02, 0,   1.4,  0.02, 0
    ];
    const perchGeo = new THREE.BufferGeometry();
    perchGeo.setAttribute('position',
      new THREE.Float32BufferAttribute(perchPositions, 3));
    const perchMat = new THREE.LineBasicMaterial({
      color: CORAL, transparent: true, opacity: 0.6,
      blending: THREE.NormalBlending, depthWrite: false
    });
    const perch = new THREE.LineSegments(perchGeo, perchMat);
    group.add(perch);
    // Perch dust
    const perchDustPos = [];
    for (let i = 0; i < 40; i++) {
      perchDustPos.push(-1.4 + Math.random() * 2.8, -0.05 + Math.random() * 0.07, (Math.random()-0.5) * 0.05);
    }
    const perchDust = new THREE.BufferGeometry();
    perchDust.setAttribute('position', new THREE.Float32BufferAttribute(perchDustPos, 3));
    group.add(new THREE.Points(perchDust, new THREE.PointsMaterial({
      color: CORAL, size: 2.5, sizeAttenuation: false, transparent: true, opacity: 0.6,
      blending: THREE.NormalBlending, depthWrite: false
    })));

    // Floating dust particles around the toucan
    const dust = makeTrailParticles(50, 2.4, { color: CORAL, size: 2.0, opacity: 0.4 });
    scene.add(dust);

    // Mouse parallax
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onPointerMove = (ev) => {
      const r = canvas.getBoundingClientRect();
      tmx = ((ev.clientX - r.left) / r.width  - 0.5) * 2;
      tmy = ((ev.clientY - r.top ) / r.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove);

    const clock = new THREE.Clock();
    let raf;
    function tick() {
      const t = clock.getElapsedTime();
      mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;

      // Idle bob
      group.position.y = Math.sin(t * 1.2) * 0.04;
      group.rotation.y = Math.sin(t * 0.6) * 0.05 + mx * 0.18;
      group.rotation.x = -my * 0.12;

      // Head looks around — rotate around its center
      head.rotation.y = Math.sin(t * 0.9) * 0.18 + mx * 0.25;
      head.rotation.z = Math.sin(t * 0.7) * 0.04;

      // Beak follows head
      upperBeak.rotation.y = head.rotation.y;
      lowerBeak.rotation.y = head.rotation.y;
      // Beak open/close
      const beakGap = Math.max(0, Math.sin(t * 0.5) - 0.85) * 1.2;
      lowerBeak.position.y = 0.95 - beakGap * 0.15;

      // Eye ring follows head
      const headPivotX = 0.55, headPivotY = 1.15;
      const eyeOff = { x: 0.30, y: 0.07, z: 0.36 };
      const cy = Math.cos(head.rotation.y), sy = Math.sin(head.rotation.y);
      eyeRing.position.set(
        headPivotX + eyeOff.x * cy + eyeOff.z * sy,
        headPivotY + eyeOff.y,
        eyeOff.z * cy - eyeOff.x * sy
      );
      eyeDot.geometry.attributes.position.array[0] = eyeRing.position.x + 0.01;
      eyeDot.geometry.attributes.position.array[1] = eyeRing.position.y;
      eyeDot.geometry.attributes.position.array[2] = eyeRing.position.z + 0.01;
      eyeDot.geometry.attributes.position.needsUpdate = true;

      // Tail sway
      tail.rotation.z = Math.sin(t * 1.4) * 0.07;

      // Drift particles
      const arr = dust.geometry.attributes.position.array;
      const base = dust.userData.basePositions;
      const speeds = dust.userData.speeds;
      for (let i = 0; i < arr.length / 3; i++) {
        arr[i*3]     = base[i*3]     + Math.sin(t * speeds[i] + i) * 0.08;
        arr[i*3 + 1] = base[i*3 + 1] + Math.cos(t * speeds[i] + i * 0.7) * 0.05;
        arr[i*3 + 2] = base[i*3 + 2] + Math.sin(t * speeds[i] * 0.8 + i * 1.3) * 0.06;
      }
      dust.geometry.attributes.position.needsUpdate = true;

      fit(renderer, camera, canvas);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return {
      stop() {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onPointerMove);
        renderer.dispose();
      }
    };
  };
  // Backwards-compat alias
  window.MacawScene = window.ToucanScene;

  /* ────────────────────────────────────────────────────────────
     JAGUAR — stylized prowling jaguar in wireframe + dots
     ──────────────────────────────────────────────────────────── */
  window.JaguarScene = function(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0.2, 1.0, 6.4);
    camera.lookAt(0, 0.4, 0);

    const renderer = makeRenderer(canvas);
    fit(renderer, camera, canvas);

    const group = new THREE.Group();
    scene.add(group);

    // Body — elongated capsule-like ellipsoid
    const bodyGeo = new THREE.SphereGeometry(0.7, 18, 12);
    bodyGeo.scale(1.5, 0.75, 0.75);
    const body = wireframeWithPoints(bodyGeo);
    body.position.set(0, 0.6, 0);
    group.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.4, 14, 10);
    headGeo.scale(1.05, 0.9, 1.0);
    const head = wireframeWithPoints(headGeo);
    head.position.set(1.25, 0.7, 0);
    group.add(head);

    // Snout — small cone
    const snoutGeo = new THREE.ConeGeometry(0.18, 0.4, 8, 1, true);
    snoutGeo.translate(0, 0.2, 0);
    snoutGeo.rotateZ(-Math.PI / 2);
    const snout = wireframeWithPoints(snoutGeo);
    snout.position.set(1.55, 0.6, 0);
    group.add(snout);

    // Ears — two small cones
    function makeEar(x, z) {
      const g = new THREE.ConeGeometry(0.12, 0.2, 6, 1, true);
      const w = wireframeWithPoints(g);
      w.position.set(x, 1.05, z);
      return w;
    }
    const earL = makeEar(1.1, -0.22);
    const earR = makeEar(1.1, 0.22);
    group.add(earL); group.add(earR);

    // Legs — 4 simple cylinders
    function makeLeg(x, z) {
      const g = new THREE.CylinderGeometry(0.13, 0.16, 0.7, 8, 1, true);
      const w = wireframeWithPoints(g);
      w.position.set(x, 0.2, z);
      return w;
    }
    const leg1 = makeLeg(-0.7, -0.32);
    const leg2 = makeLeg(-0.7,  0.32);
    const leg3 = makeLeg( 0.7, -0.32);
    const leg4 = makeLeg( 0.7,  0.32);
    [leg1, leg2, leg3, leg4].forEach(l => group.add(l));

    // Tail — bent cylinder approximated by tapered cone
    const tailGeo = new THREE.CylinderGeometry(0.06, 0.13, 1.3, 8, 1, true);
    tailGeo.translate(0, 0.65, 0);
    tailGeo.rotateZ(Math.PI / 2.2);
    const tail = wireframeWithPoints(tailGeo);
    tail.position.set(-1.35, 0.7, 0);
    group.add(tail);

    // Eyes — small bright dots
    const eyeGeo = new THREE.BufferGeometry();
    eyeGeo.setAttribute('position', new THREE.Float32BufferAttribute([
      1.4, 0.85, -0.18,
      1.4, 0.85,  0.18
    ], 3));
    const eyes = new THREE.Points(eyeGeo, new THREE.PointsMaterial({
      color: CORAL_DEEP, size: 6, sizeAttenuation: false, transparent: true, opacity: 1,
      blending: THREE.NormalBlending, depthWrite: false
    }));
    group.add(eyes);

    // Ground line
    const groundPositions = [];
    const N = 60;
    for (let i = 0; i < N; i++) {
      const x = -2.5 + (i / (N - 1)) * 5;
      groundPositions.push(x, -0.2, 0);
    }
    const groundGeo = new THREE.BufferGeometry();
    groundGeo.setAttribute('position', new THREE.Float32BufferAttribute(groundPositions, 3));
    const ground = new THREE.Points(groundGeo, new THREE.PointsMaterial({
      color: CORAL, size: 2.5, sizeAttenuation: false, transparent: true, opacity: 0.5,
      blending: THREE.NormalBlending, depthWrite: false
    }));
    group.add(ground);

    // Floating dust
    const dust = makeTrailParticles(45, 2.6, { color: CORAL, size: 2.0, opacity: 0.4 });
    scene.add(dust);

    // Mouse parallax
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onPointerMove = (ev) => {
      const r = canvas.getBoundingClientRect();
      tmx = ((ev.clientX - r.left) / r.width  - 0.5) * 2;
      tmy = ((ev.clientY - r.top ) / r.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove);

    const clock = new THREE.Clock();
    let raf;
    function tick() {
      const t = clock.getElapsedTime();
      mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;

      // Breathing — body scale Y subtle pulse
      const breath = 1 + Math.sin(t * 1.6) * 0.015;
      body.scale.set(1, breath, 1);

      // Subtle prowl bob
      group.position.y = Math.sin(t * 1.0) * 0.025;
      group.rotation.y = mx * 0.18;
      group.rotation.x = -my * 0.10;

      // Head turn
      head.rotation.y = Math.sin(t * 0.6) * 0.18 + mx * 0.25;
      snout.rotation.y = head.rotation.y;
      earL.rotation.y = head.rotation.y * 0.5;
      earR.rotation.y = head.rotation.y * 0.5;

      // Tail sway
      tail.rotation.z = Math.PI / 2.2 + Math.sin(t * 1.3) * 0.18;

      // Drift particles
      const arr = dust.geometry.attributes.position.array;
      const base = dust.userData.basePositions;
      const speeds = dust.userData.speeds;
      for (let i = 0; i < arr.length / 3; i++) {
        arr[i*3]     = base[i*3]     + Math.sin(t * speeds[i] + i) * 0.08;
        arr[i*3 + 1] = base[i*3 + 1] + Math.cos(t * speeds[i] + i * 0.7) * 0.05;
        arr[i*3 + 2] = base[i*3 + 2] + Math.sin(t * speeds[i] * 0.8 + i * 1.3) * 0.06;
      }
      dust.geometry.attributes.position.needsUpdate = true;

      fit(renderer, camera, canvas);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return {
      stop() {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onPointerMove);
        renderer.dispose();
      }
    };
  };
})();
