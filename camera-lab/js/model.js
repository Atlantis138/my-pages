/* 相机参数实验室 · 相机结构：可旋转、可拆开镜头的三维无反相机模型
 * 单位：厘米。镜头朝 +z，摄影者站在 −z 一侧；摄影者的右手边是 −x（手柄所在）。
 */
(function () {
  'use strict';
  const CL = window.CL;

  CL.PARTS = [
    // 机身外部
    { id: 'modeDial', g: '机身', name: '模式转盘', en: 'Mode Dial', pos: [4.3, 5.0, -0.4], nrm: [0.2, 1, 0], term: 'mode-m', text: '选择曝光模式：<b>P</b> 程序自动、<b>A</b> 光圈优先、<b>S</b> 快门优先、<b>M</b> 手动，以及保存常用设置的 <b>C1–C3</b> 自定义档。转到哪一档，决定了光圈和快门由谁来定。' },
    { id: 'shutterBtn', g: '机身', name: '快门按钮', en: 'Shutter Release', pos: [-5.3, 4.75, 2.7], nrm: [-0.3, 1, 0.3], term: 'half-press', text: '两段式：<b>半按</b>启动自动对焦和测光，<b>按到底</b>拍摄。外圈通常是电源开关。拍长曝光时最好用快门线或自拍，避免按键引起的抖动。' },
    { id: 'frontDial', g: '机身', name: '前拨轮', en: 'Front Dial', pos: [-4.3, 3.9, 3.55], nrm: [0, 0.4, 1], term: 'mode-a', text: '食指操作的拨轮。A 档下一般调光圈，S 档下调快门，M 档下前后拨轮分别负责光圈和快门。P 档下转动它就是程序偏移。' },
    { id: 'rearDial', g: '机身', name: '后拨轮', en: 'Rear Dial', pos: [-3.6, 4.6, -2.4], nrm: [0, 0.6, -1], term: 'mode-s', text: '拇指操作的拨轮，与前拨轮分工。很多机身还可以把它设成直接调整 ISO 或曝光补偿。' },
    { id: 'compDial', g: '机身', name: '曝光补偿转盘', en: 'EV Compensation Dial', pos: [-2.1, 4.85, -0.6], nrm: [0, 1, 0], term: 'ev-comp', text: '刻着 −3 到 +3 的转盘，P/A/S 档下直接改变相机的目标亮度。刻度一格 1/3 档。' },
    { id: 'hotShoe', g: '机身', name: '热靴', en: 'Hot Shoe', pos: [0.9, 6.7, -0.2], nrm: [0, 1, 0], term: 'ttl', text: '安装外置闪光灯、无线引闪器或麦克风的金属插座。中间的金属触点传递 TTL 预闪测光、高速同步等信号，所以叫「热」靴。' },
    { id: 'evf', g: '机身', name: '电子取景器 EVF', en: 'Electronic Viewfinder', pos: [0.9, 5.0, -3.5], nrm: [0, 0.2, -1], term: 'histogram', text: '眼睛贴着看的小 OLED 屏。无反相机的取景器直接显示传感器看到的画面，曝光、白平衡、景深都所见即所得；单反则是通过反光镜和五棱镜看到的光学像（OVF）。' },
    { id: 'lcd', g: '机身', name: '可翻转屏幕', en: 'Rear LCD', pos: [1.0, -0.8, -3.0], nrm: [0, 0, -1], term: 'zebra', text: '显示实时取景、菜单和回放。这块屏幕上显示的就是「取景拍摄」页里最近一帧的画面。高低角度拍摄时翻转它比趴在地上看取景器方便。' },
    { id: 'afon', g: '机身', name: 'AF-ON 与 AE-L 键', en: 'AF-ON · AE-L', pos: [-3.6, 2.8, -2.7], nrm: [0, 0, -1], term: 'back-button', text: '拇指位置的两个键：<b>AF-ON</b> 用于背键对焦，<b>AE-L</b> 锁定曝光。旁边的摇杆用来快速移动对焦点。' },
    { id: 'grip', g: '机身', name: '手柄与存储卡仓', en: 'Grip · Card Slot', pos: [-6.7, 0.5, 2.6], nrm: [-1, 0, 0.3], term: 'raw-jpeg', text: '手柄里是电池仓，侧面是存储卡仓。连拍和视频的持续时间常受存储卡写入速度限制（SD UHS-II、CFexpress 等）。' },
    { id: 'mount', g: '机身', name: '卡口', en: 'Lens Mount', pos: [3.6, 2.2, 2.6], nrm: [0.4, 0.3, 1], term: 'mount', explode: true, text: '镜头与机身的接口：三片卡爪固定镜头，一排金属触点传递对焦、光圈、防抖和镜头型号信息。卡口到传感器的距离叫法兰距，无反只有约 2 厘米，所以「拆开镜头」后能直接看到传感器。' },
    // 镜头
    { id: 'zoomRing', g: '镜头', name: '变焦环', en: 'Zoom Ring', pos: [0.9, 3.5, 6.0], nrm: [0, 1, 0.2], term: 'focal-length', text: '转动它改变焦距，镜头内部的镜片组随之前后移动。环上通常刻着 24、35、50、70 等焦距数字。' },
    { id: 'focusRing', g: '镜头', name: '对焦环与距离刻度', en: 'Focus Ring', pos: [-1.6, 2.6, 9.1], nrm: [-0.5, 0.6, 0.4], term: 'focus-peaking', text: '手动对焦时转动它。环上的数字是对焦距离（米）；老式定焦镜头在旁边还有成对的彩色景深刻线，读一读就能知道某个光圈下的景深范围，用来做超焦距对焦。' },
    { id: 'lensName', g: '镜头', name: '镜头标识', en: 'Lens Markings', pos: [3.4, 1.0, 7.4], nrm: [1, 0.2, 0.2], term: 'max-aperture', text: '「24-70mm 1:2.8」表示焦距范围和最大光圈；「⌀82」是滤镜口径；ED、ASPH、IS/OIS 等缩写分别代表低色散镜片、非球面镜片和光学防抖。' },
    { id: 'switches', g: '镜头', name: 'AF/MF 与防抖开关', en: 'Lens Switches', pos: [3.65, -1.0, 4.5], nrm: [1, 0, 0], term: 'stabilization', text: '在镜头上切换自动/手动对焦，以及打开或关闭镜头防抖。部分长焦镜头还有对焦距离限制开关，缩短对焦搜索的范围。' },
    { id: 'frontElement', g: '镜头', name: '前组镜片与镀膜', en: 'Front Element', pos: [0.9, -0.2, 11.8], nrm: [0, 0, 1], term: 'coating', text: '最前面的大口径镜片。表面的紫绿色反光来自多层增透镀膜，它们把每个玻璃面的反射从 4% 降到 0.5% 以下，抑制眩光、提高反差。' },
    { id: 'filterThread', g: '镜头', name: '滤镜螺纹', en: 'Filter Thread', pos: [3.8, 2.5, 11.4], nrm: [0.7, 0.5, 0.6], term: 'filter-thread', text: '镜头前端内侧的螺纹，用来拧 ND、偏振镜、保护镜；外侧卡口用来装遮光罩。' },
    // 内部
    { id: 'iris', g: '内部', name: '光圈叶片', en: 'Aperture Iris', pos: [0.9, 2.3, 15.3], nrm: [0.2, 0.5, 1], term: 'blades', explode: true, text: '一组弧形金属叶片围成可变的开孔。这里显示的是「取景拍摄」页当前的光圈值和镜头的叶片数——回去改一改光圈再来看。拍照前相机才把光圈收到设定值。' },
    { id: 'elements', g: '内部', name: '镜片组', en: 'Optical Elements', pos: [0.9, 3.2, 19.5], nrm: [0, 1, 0.4], term: 'chromatic-aberration', explode: true, text: '一支变焦镜头通常有十几到二十片镜片，分成若干组。<b>非球面镜片</b>校正球差和畸变，<b>ED/萤石镜片</b>抑制色差。变焦和对焦时其中几组会前后移动。' },
    { id: 'focusGroup', g: '内部', name: '对焦组与马达', en: 'Focus Group', pos: [-1.8, 2.0, 17.5], nrm: [-0.6, 0.6, 0.4], term: 'pdaf-cdaf', explode: true, text: '只移动一小组轻的镜片来对焦（内对焦），由线性马达或步进马达驱动，所以对焦又快又安静。对焦时视角轻微变化就是「呼吸效应」。' },
    { id: 'shutterCurtain', g: '内部', name: '快门帘幕', en: 'Focal-plane Shutter', pos: [3.4, 1.6, 1.8], nrm: [0.5, 0.5, 1], term: 'shutter-types', explode: true, text: '紧贴传感器前的两组金属帘幕：前帘打开开始曝光，后帘关闭结束曝光。快门速度高于闪光同步速度时，两帘之间只留一条窄缝扫过传感器。' },
    { id: 'sensor', g: '内部', name: '图像传感器', en: 'Image Sensor', pos: [0.9, -0.2, 1.2], nrm: [0, 0, 1], term: 'sensor-size', explode: true, text: '把光变成电信号的芯片，上面覆盖拜耳彩色滤镜和微透镜，表面的彩虹色来自这些微结构的衍射。这块传感器的尺寸会跟随「取景拍摄」页里选的传感器（全画幅为 36×24 mm）。' },
    { id: 'ibis', g: '内部', name: '机身防抖单元', en: 'IBIS Unit', pos: [-1.9, -2.2, 1.0], nrm: [-0.3, -0.3, 1], term: 'stabilization', explode: true, text: '传感器装在一个由磁力驱动的浮动平台上，可在 5 个轴向上移动来抵消手抖，约能放宽 5–8 档安全快门。关机时传感器会轻轻晃动，就是这个平台松开了。' },
  ];

  function canvasTex(w, h, draw, srgb) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    if (srgb !== false) t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }
  const ribTex = (n) => { const t = canvasTex(512, 16, (g, w, h) => { g.fillStyle = '#888'; g.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { g.fillStyle = '#fff'; g.fillRect((i * w) / n, 0, (w / n) * 0.55, h); } }, false); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };

  CL.createAnatomy = function (o) {
    const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: true, alpha: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 4 / 3, 1, 400);
    camera.position.set(25, 15, 31);
    const controls = new THREE.OrbitControls(camera, o.canvas);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.target.set(0.5, 0.5, 4);
    controls.minDistance = 16; controls.maxDistance = 110; controls.autoRotate = true; controls.autoRotateSpeed = 0.7;

    // 影棚环境
    const pm = new THREE.PMREMGenerator(renderer);
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(100, 60, 100), new THREE.MeshBasicMaterial({ color: 0x1a1c1f, side: THREE.BackSide })));
    const panel = (w, h, x, y, z, ry, rx, I) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(I, I, I * 0.97), side: THREE.DoubleSide })); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0); env.add(m); };
    panel(40, 30, 0, 29, 0, 0, Math.PI / 2, 5); panel(14, 50, -49, 5, 0, Math.PI / 2, 0, 3); panel(14, 50, 49, 5, -10, -Math.PI / 2, 0, 2.2); panel(60, 8, 0, 8, -49, 0, 0, 1.6);
    scene.environment = pm.fromScene(env, 0.03).texture;
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(30, 50, 40); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 150 });
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb9d4ff, 0.8); rim.position.set(-40, 20, -30); scene.add(rim);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.ShadowMaterial({ opacity: 0.35 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -4.6; floor.receiveShadow = true; scene.add(floor);

    const root = new THREE.Group(); scene.add(root);
    // 材质
    const bodyM = new THREE.MeshPhysicalMaterial({ color: 0x1b1c1e, roughness: 0.5, metalness: 0.25, clearcoat: 0.25, clearcoatRoughness: 0.5 });
    const leatherT = canvasTex(256, 256, (g, w, h) => { const img = g.createImageData(w, h); for (let k = 0; k < img.data.length; k += 4) { const v = 110 + Math.random() * 120; img.data[k] = img.data[k + 1] = img.data[k + 2] = v; img.data[k + 3] = 255; } g.putImageData(img, 0, 0); }, false);
    leatherT.wrapS = leatherT.wrapT = THREE.RepeatWrapping; leatherT.repeat.set(3, 3);
    const leatherM = new THREE.MeshStandardMaterial({ color: 0x141516, roughness: 0.85, bumpMap: leatherT, bumpScale: 0.04 });
    const metalM = new THREE.MeshStandardMaterial({ color: 0xc9ccd1, roughness: 0.22, metalness: 1 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.35, metalness: 0.8 });
    const rubberM = new THREE.MeshStandardMaterial({ color: 0x111213, roughness: 0.9, bumpMap: ribTex(90), bumpScale: 0.06 });
    const brassM = new THREE.MeshStandardMaterial({ color: 0xe0b25c, roughness: 0.3, metalness: 1 });
    const blackM = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });

    /* --- 机身 --- */
    const body = new THREE.Group(); root.add(body);
    const rr = (w, h, r) => { const s = new THREE.Shape(); const x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
    const MX = 0.9, MY = -0.2;
    const shell = rr(13.4, 8, 0.9);
    const hole = new THREE.Path(); hole.absarc(MX, MY, 2.75, 0, Math.PI * 2, true); shell.holes.push(hole);
    const bodyGeo = new THREE.ExtrudeGeometry(shell, { depth: 4.0, bevelEnabled: true, bevelThickness: 0.4, bevelSize: 0.4, bevelSegments: 4, curveSegments: 40 });
    bodyGeo.translate(0, 0, -2.0);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyM); body.add(bodyMesh);
    // 手柄
    const gripGeo = new THREE.ExtrudeGeometry(rr(3.0, 3.0, 1.1), { depth: 7.2, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 5, curveSegments: 24 });
    gripGeo.rotateX(-Math.PI / 2); gripGeo.translate(0, -3.8, 0);
    const grip = new THREE.Mesh(gripGeo, leatherM); grip.position.set(-5.2, 0, 2.6); body.add(grip);
    // 取景器凸起
    const hump = new THREE.Shape(); hump.moveTo(-3.3, 0); hump.lineTo(3.3, 0); hump.lineTo(2.1, 2.3); hump.lineTo(-2.1, 2.3); hump.lineTo(-3.3, 0);
    const humpGeo = new THREE.ExtrudeGeometry(hump, { depth: 4.4, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.3, bevelSegments: 3 });
    humpGeo.translate(0, 0, -2.2);
    const humpM = new THREE.Mesh(humpGeo, bodyM); humpM.position.set(MX, 3.9, 0); body.add(humpM);
    const frontPlate = new THREE.Mesh(new THREE.RingGeometry(3.2, 4.3, 64, 1, 0, Math.PI * 2), leatherM); frontPlate.position.set(MX, MY, 2.41); body.add(frontPlate);
    // 卡口与腔体
    const mountRing = new THREE.Mesh(new THREE.TorusGeometry(2.95, 0.22, 16, 72), metalM); mountRing.position.set(MX, MY, 2.5); body.add(mountRing);
    for (let k = 0; k < 3; k++) { const tab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.2), metalM); const a = (k / 3) * Math.PI * 2 + 0.4; tab.position.set(MX + Math.cos(a) * 2.6, MY + Math.sin(a) * 2.6, 2.35); tab.rotation.z = a + Math.PI / 2; body.add(tab); }
    const contacts = new THREE.Group();
    for (let k = 0; k < 10; k++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.08), brassM); const a = -Math.PI / 2 - 0.55 + k * 0.12; c.position.set(MX + Math.cos(a) * 2.45, MY + Math.sin(a) * 2.45, 2.25); c.rotation.z = a; contacts.add(c); }
    body.add(contacts);
    const cavity = new THREE.Mesh(new THREE.CylinderGeometry(2.74, 2.74, 3.6, 48, 1, true), new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.95, side: THREE.BackSide }));
    cavity.rotation.x = Math.PI / 2; cavity.position.set(MX, MY, 0.6); body.add(cavity);
    const back = new THREE.Mesh(new THREE.CircleGeometry(2.75, 48), blackM); back.position.set(MX, MY, -1.2); body.add(back);
    // 传感器、防抖平台
    const sensorT = canvasTex(512, 342, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, w, h);
      ['#2a1d4a', '#1d3d6b', '#1d6b5a', '#6b6a1d', '#6b2a1d', '#3a1d5a'].forEach((c, k, a) => gr.addColorStop(k / (a.length - 1), c));
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.globalAlpha = 0.25; g.strokeStyle = '#000'; for (let x = 0; x < w; x += 3) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 3) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    });
    const sensorM = new THREE.MeshPhysicalMaterial({ map: sensorT, roughness: 0.18, metalness: 0.6, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.8 });
    const ibis = new THREE.Group(); ibis.position.set(MX, MY, -0.95); body.add(ibis);
    const ibisFrame = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.4, 0.25), new THREE.MeshStandardMaterial({ color: 0x8a6a2c, roughness: 0.4, metalness: 0.9 })); ibis.add(ibisFrame);
    const sensorPkg = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.9, 0.15), new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 0.6 })); sensorPkg.position.z = 0.18; ibis.add(sensorPkg);
    const sensor = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.4), sensorM); sensor.position.z = 0.27; ibis.add(sensor);
    const curtains = new THREE.Group(); curtains.position.set(MX, MY, -0.4); body.add(curtains);
    const slatM = new THREE.MeshStandardMaterial({ color: 0x1d1e20, roughness: 0.45, metalness: 0.6 });
    const slats = [];
    for (let k = 0; k < 6; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.46, 0.04), slatM); s.position.set(0, -1.15 + k * 0.45, 0); curtains.add(s); slats.push(s); }

    // 顶部
    const dialTex = (labels, bg) => canvasTex(512, 512, (g, w) => {
      g.fillStyle = bg || '#1e1f22'; g.beginPath(); g.arc(w / 2, w / 2, w / 2, 0, 7); g.fill();
      g.fillStyle = '#d9d6cf'; g.textAlign = 'center'; g.textBaseline = 'middle';
      labels.forEach((L, k) => { const a = (k / labels.length) * Math.PI * 2 - Math.PI / 2; g.save(); g.translate(w / 2 + Math.cos(a) * w * 0.36, w / 2 + Math.sin(a) * w * 0.36); g.rotate(a + Math.PI / 2); g.font = `700 ${L.length > 2 ? 46 : 64}px "Barlow Condensed", sans-serif`; g.fillStyle = L === 'M' || L === 'A' ? '#e0b25c' : '#d9d6cf'; g.fillText(L, 0, 0); g.restore(); });
    });
    const knurl = ribTex(120);
    const dial = (r, h, labels, x, y, z) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 64), [new THREE.MeshStandardMaterial({ color: 0x2a2b2e, roughness: 0.5, metalness: 0.6, bumpMap: knurl, bumpScale: 0.05 }), new THREE.MeshStandardMaterial({ map: dialTex(labels), roughness: 0.5, metalness: 0.3 }), darkMetal]);
      m.position.set(x, y, z); body.add(m); return m;
    };
    dial(1.45, 0.8, ['P', 'A', 'S', 'M', 'C1', 'C2', 'C3', 'AUTO'], 4.3, 4.75, -0.4);
    dial(1.2, 0.7, ['0', '+1', '+2', '+3', '−3', '−2', '−1'], -2.1, 4.75, -0.6);
    const rearDial = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.42, 48), new THREE.MeshStandardMaterial({ color: 0x2a2b2e, roughness: 0.5, metalness: 0.6, bumpMap: knurl, bumpScale: 0.05 })); rearDial.position.set(-3.6, 4.25, -2.35); body.add(rearDial);
    const frontDial = rearDial.clone(); frontDial.position.set(-4.3, 3.7, 3.3); body.add(frontDial);
    const sbtn = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.35, 32), metalM); sbtn.position.set(-5.2, 4.55, 2.7); sbtn.rotation.x = 0.15; body.add(sbtn);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.16, 12, 40), darkMetal); collar.rotation.x = Math.PI / 2 + 0.15; collar.position.set(-5.2, 4.42, 2.7); body.add(collar);
    const shoe = new THREE.Group(); shoe.position.set(MX, 6.55, -0.2);
    shoe.add(new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 1.9), metalM));
    [-1, 1].forEach((s) => { const r = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 1.9), metalM); r.position.set(s * 1.0, 0.15, 0); shoe.add(r); });
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16), brassM); pin.position.y = 0.1; shoe.add(pin);
    body.add(shoe);
    // 背面
    const eyecup = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.7, 1.0), new THREE.MeshStandardMaterial({ color: 0x0e0f10, roughness: 0.95 })); eyecup.position.set(MX, 5.15, -2.75); body.add(eyecup);
    const eyeGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), new THREE.MeshPhysicalMaterial({ color: 0x06080c, roughness: 0.05, clearcoat: 1 })); eyeGlass.position.set(MX, 5.15, -3.26); eyeGlass.rotation.y = Math.PI; body.add(eyeGlass);
    const lcdFrame = new THREE.Mesh(new THREE.BoxGeometry(8.0, 5.6, 0.4), bodyM); lcdFrame.position.set(1.0, -0.8, -2.55); body.add(lcdFrame);
    const lcdData = new Uint8Array(240 * 160 * 4).fill(40);
    const lcdTex = new THREE.DataTexture(lcdData, 240, 160, THREE.RGBAFormat); lcdTex.encoding = THREE.sRGBEncoding; lcdTex.needsUpdate = true;
    const lcd = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 4.93), new THREE.MeshBasicMaterial({ map: lcdTex, toneMapped: false }));
    lcd.position.set(1.0, -0.8, -2.77); lcd.rotation.y = Math.PI; body.add(lcd);
    const btn = (x, y, r, m) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.3, 24), m || darkMetal); b.rotation.x = Math.PI / 2; b.position.set(x, y, -2.5); body.add(b); return b; };
    btn(-3.4, 2.8, 0.45, new THREE.MeshStandardMaterial({ color: 0x2b2c2f, roughness: 0.5, metalness: 0.4 })); btn(-4.9, 2.8, 0.38); btn(-4.2, 1.2, 0.3, metalM);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.18, 12, 40), darkMetal); wheel.position.set(-4.4, -1.2, -2.5); body.add(wheel);
    btn(-4.4, -1.2, 0.35); btn(-5.6, -3.0, 0.3); btn(-4.4, -3.0, 0.3); btn(-3.2, -3.0, 0.3);
    const lugM = metalM;
    [-6.9, 6.9].forEach((x) => { const l = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 8, 20), lugM); l.position.set(x, 3.2, 0.2); l.rotation.y = Math.PI / 2; body.add(l); });
    const afLamp = new THREE.Mesh(new THREE.CircleGeometry(0.32, 24), new THREE.MeshPhysicalMaterial({ color: 0xff8a3a, roughness: 0.1, clearcoat: 1, emissive: 0x401800 })); afLamp.position.set(-3.6, 3.0, 2.82); body.add(afLamp);
    const release = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.25, 24), metalM); release.rotation.x = Math.PI / 2; release.position.set(4.6, -1.2, 2.5); body.add(release);
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.8), new THREE.MeshBasicMaterial({ transparent: true, map: canvasTex(512, 120, (g, w, h) => { g.font = '700 74px "Barlow Condensed", sans-serif'; g.fillStyle = '#cfcac0'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CAMERA·LAB', w / 2, h / 2 + 4); }) }));
    logo.position.set(MX, 5.2, 2.32); logo.rotation.x = -0.45; body.add(logo);
    body.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });

    /* --- 镜头 --- */
    const lens = new THREE.Group(); lens.position.set(MX, MY, 2.5); root.add(lens);
    const barrelMats = [];
    const ringMesh = (r, len, z, mat, open) => { const g = new THREE.CylinderGeometry(r, r, len, 72, 1, !!open); g.rotateX(Math.PI / 2); const m = new THREE.Mesh(g, mat); m.position.z = z; lens.add(m); return m; };
    const shellMat = (base) => { const m = base.clone(); m.transparent = true; barrelMats.push(m); return m; };
    const lensBlack = shellMat(new THREE.MeshStandardMaterial({ color: 0x141517, roughness: 0.55, metalness: 0.2 }));
    const lensRub = shellMat(rubberM);
    const lensMetal = shellMat(metalM);
    const textT = canvasTex(1024, 64, (g, w, h) => { g.fillStyle = '#141517'; g.fillRect(0, 0, w, h); g.font = '600 40px "Barlow Condensed", sans-serif'; g.fillStyle = '#e8e3d8'; g.textBaseline = 'middle'; g.fillText('24-70mm  1:2.8  ⌀82', 40, h / 2 + 2); g.fillStyle = '#e0b25c'; g.fillText('ED · ASPH · OIS', 470, h / 2 + 2); g.fillStyle = '#e8e3d8'; g.fillText('LENS MADE FOR CAMERA·LAB', 700, h / 2 + 2); });
    textT.wrapS = THREE.RepeatWrapping;
    const distT = canvasTex(1024, 64, (g, w, h) => { g.fillStyle = '#111213'; g.fillRect(0, 0, w, h); g.font = '600 30px "Barlow Condensed", sans-serif'; g.fillStyle = '#d8d3c8'; g.textBaseline = 'middle'; ['∞', '10', '5', '3', '2', '1.5', '1', '0.7', '0.5', '0.38m'].forEach((s, k) => g.fillText(s, 30 + k * 52, h / 2)); g.fillStyle = '#6fb6ff'; g.fillText('ft  ∞ 30 15 10 7 5 3 2 1.5 1.25', 560, h / 2); });
    distT.wrapS = THREE.RepeatWrapping;
    ringMesh(3.05, 0.6, 0.3, lensMetal);
    ringMesh(3.3, 1.4, 1.3, lensBlack);
    const zoomR = ringMesh(3.55, 3.0, 3.5, lensRub);
    const band = ringMesh(3.4, 0.9, 5.45, shellMat(new THREE.MeshStandardMaterial({ map: textT, roughness: 0.5 })));
    ringMesh(3.48, 0.55, 6.2, shellMat(new THREE.MeshStandardMaterial({ map: distT, roughness: 0.5 })));
    const focusR = ringMesh(3.5, 1.6, 7.25, lensRub);
    const accent = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.06, 8, 96), shellMat(brassM)); accent.position.z = 8.1; lens.add(accent);
    const frontG = new THREE.CylinderGeometry(3.85, 3.6, 1.4, 72, 1, true); frontG.rotateX(Math.PI / 2);
    const front = new THREE.Mesh(frontG, lensBlack); front.position.z = 8.85; lens.add(front);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.12, 8, 72), lensMetal); lip.position.z = 9.55; lens.add(lip);
    const sw = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.6, 1.6), lensBlack); sw.position.set(3.35, -0.8, 1.6); lens.add(sw);
    const fe = new THREE.Mesh(new THREE.SphereGeometry(6.0, 64, 16, 0, Math.PI * 2, 0, 0.58), new THREE.MeshPhysicalMaterial({ color: 0x0a1018, roughness: 0.03, metalness: 0, clearcoat: 1, envMapIntensity: 2.2, iridescence: 1, iridescenceIOR: 1.5, iridescenceThicknessRange: [180, 520], transparent: true, opacity: 0.92 }));
    fe.rotation.x = Math.PI / 2; fe.position.z = 9.1 - 6.0 * Math.cos(0.58) + 0.0; lens.add(fe);
    barrelMats.push(fe.material);
    void zoomR; void focusR; void band;

    // 镜片组（拆开后可见）
    const glassM = new THREE.MeshPhysicalMaterial({ color: 0xdff4ff, roughness: 0.04, metalness: 0, transmission: 0.92, thickness: 0.6, ior: 1.6, clearcoat: 1, envMapIntensity: 1.4, transparent: true });
    const edM = glassM.clone(); edM.color.set(0xfff3c8);
    const asM = glassM.clone(); asM.color.set(0xd8ffe8);
    function element(r, t, s1, s2, mat) {
      const pts = [], n = 24;
      for (let k = 0; k <= n; k++) { const y = (k / n) * r; pts.push(new THREE.Vector2(y, t / 2 + s1 * (1 - (y / r) * (y / r)))); }
      for (let k = n; k >= 0; k--) { const y = (k / n) * r; pts.push(new THREE.Vector2(y, -t / 2 - s2 * (1 - (y / r) * (y / r)))); }
      const g = new THREE.LatheGeometry(pts, 64); g.rotateX(Math.PI / 2);
      return new THREE.Mesh(g, mat);
    }
    const inner = new THREE.Group(); lens.add(inner);
    const ELS = [
      { m: element(3.25, 0.3, 0.55, -0.25, glassM), z: 8.7 }, { m: element(2.9, 0.25, 0.2, 0.25, asM), z: 7.7 },
      { m: element(2.3, 0.2, -0.15, -0.15, glassM), z: 6.7, focus: true }, { m: element(2.2, 0.35, 0.3, 0.3, edM), z: 4.3 },
      { m: element(2.4, 0.2, 0.15, -0.1, asM), z: 3.3 }, { m: element(2.5, 0.3, 0.25, 0.2, glassM), z: 1.6 },
    ];
    ELS.forEach((e) => { e.m.position.z = e.z; inner.add(e.m); });
    const irisG = new THREE.Group(); irisG.position.z = 5.3; inner.add(irisG);
    const irisHousing = new THREE.Mesh(new THREE.RingGeometry(2.45, 3.0, 64), new THREE.MeshStandardMaterial({ color: 0x1b1c1e, metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide })); irisG.add(irisHousing);
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x232427, metalness: 0.85, roughness: 0.35, side: THREE.DoubleSide });
    let irisMesh = null, irisLines = null;
    function buildIris(N, Nmin, blades, round) {
      if (irisMesh) { irisG.remove(irisMesh, irisLines); irisMesh.geometry.dispose(); irisLines.geometry.dispose(); }
      const R = 2.46, r = Math.max(0.08, R * 0.96 * (Nmin / N));
      const s = new THREE.Shape(); s.absarc(0, 0, R, 0, Math.PI * 2, false);
      const h = new THREE.Path(), steps = 120, rd = N <= Nmin * 1.01 ? 1 : round;
      const vtx = [];
      for (let k = 0; k <= steps; k++) {
        const a = (k / steps) * Math.PI * 2, seg = (Math.PI * 2) / blades, x = (((a - 0.3) % seg) + seg) % seg - seg / 2;
        const rr2 = r * (rd + (1 - rd) * (Math.cos(Math.PI / blades) / Math.cos(x)));
        const p = [Math.cos(a) * rr2, Math.sin(a) * rr2];
        k ? h.lineTo(p[0], p[1]) : h.moveTo(p[0], p[1]);
      }
      s.holes.push(h);
      irisMesh = new THREE.Mesh(new THREE.ShapeGeometry(s, 64), irisMat);
      for (let k = 0; k < blades; k++) { const a = 0.3 + (k / blades) * Math.PI * 2; const vx = Math.cos(a) * r, vy = Math.sin(a) * r; vtx.push(vx, vy, 0.01, vx + Math.cos(a + 1.2) * 2.6, vy + Math.sin(a + 1.2) * 2.6, 0.01); }
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(vtx, 3));
      irisLines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x55585e }));
      irisG.add(irisMesh, irisLines);
      R_.iris = { N, r };
    }
    const R_ = {};
    buildIris(2.8, 2.8, 9, 0.7);

    // 光路
    const rayGeo = new THREE.BufferGeometry();
    const rayPos = new Float32Array(7 * 4 * 3);
    rayGeo.setAttribute('position', new THREE.BufferAttribute(rayPos, 3));
    const rays = new THREE.LineSegments(rayGeo, new THREE.LineBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.9, toneMapped: false }));
    rays.frustumCulled = false; rays.visible = false; root.add(rays);

    /* --- 热点 --- */
    const hsEl = o.hotspots;
    const groups = {};
    CL.PARTS.forEach((p, k) => { p.n = k + 1; (groups[p.g] = groups[p.g] || []).push(p); });
    hsEl.innerHTML = CL.PARTS.map((p) => `<button class="hs" data-p="${p.id}" aria-label="${p.name}"><i>${p.n}</i><span>${p.name}</span></button>`).join('');
    o.list.innerHTML = Object.keys(groups).map((g) => `<div><h3>${g}</h3><ul>${groups[g].map((p) => `<li><button data-p="${p.id}"><i>${p.n}</i>${p.name}</button></li>`).join('')}</ul></div>`).join('');
    const hsBtns = {};
    hsEl.querySelectorAll('.hs').forEach((b) => (hsBtns[b.dataset.p] = b));
    let sel = null;
    function select(id, fly) {
      sel = CL.PARTS.find((p) => p.id === id) || CL.PARTS[0];
      Object.values(hsBtns).forEach((b) => b.classList.toggle('on', b.dataset.p === sel.id));
      o.list.querySelectorAll('button').forEach((b) => b.setAttribute('aria-current', String(b.dataset.p === sel.id)));
      const t = CL.TERM_BY_ID[sel.term];
      o.card.innerHTML = `<h2>${sel.name}<small>${sel.en}</small></h2><p>${sel.text}</p>${t ? `<p><button class="more" data-term="${t.id}" style="border:0;background:none;padding:0;color:var(--brass);cursor:pointer">相关词条：${t.zh} →</button></p>` : ''}${sel.explode && !exploded ? '<p class="note">这个部件在内部，点下方「拆开镜头」后可以看到。</p>' : ''}`;
      if (sel.explode && !exploded && fly) toggleExplode(true);
      if (fly) flyTo(sel);
    }
    o.card.addEventListener('click', (e) => { const b = e.target.closest('[data-term]'); if (b) o.openTerm(b.dataset.term); });
    const onPick = (e) => { const b = e.target.closest('[data-p]'); if (b) { setSpin(false); select(b.dataset.p, true); } };
    hsEl.addEventListener('click', onPick); o.list.addEventListener('click', onPick);
    let fly = null;
    function partWorld(p) { const v = new THREE.Vector3(...p.pos); if (['zoomRing', 'focusRing', 'lensName', 'switches', 'frontElement', 'filterThread', 'iris', 'elements', 'focusGroup'].includes(p.id)) v.z += lensOff(); return v; }
    function flyTo(p) {
      const target = partWorld(p);
      const n = new THREE.Vector3(...p.nrm).normalize();
      const dist = camera.position.distanceTo(controls.target);
      const d = Math.min(Math.max(dist, 30), 48);
      fly = { t: 0, p0: camera.position.clone(), t0: controls.target.clone(), p1: target.clone().add(n.multiplyScalar(d)).add(new THREE.Vector3(0, 4, 0)), t1: target.clone() };
    }

    /* --- 拆开 --- */
    let exploded = false, ex = 0, spin = true, showRays = false;
    const lensOff = () => ex * 9;
    function toggleExplode(v) { exploded = v == null ? !exploded : v; o.explode.setAttribute('aria-pressed', String(exploded)); o.explode.textContent = exploded ? '装回镜头' : '拆开镜头'; }
    function setSpin(v) { spin = v; controls.autoRotate = v; o.spin.setAttribute('aria-pressed', String(v)); }
    o.explode.addEventListener('click', () => toggleExplode());
    o.rays.addEventListener('click', () => { showRays = !showRays; o.rays.setAttribute('aria-pressed', String(showRays)); });
    o.spin.addEventListener('click', () => setSpin(!spin));
    o.canvas.addEventListener('pointerdown', () => { if (spin) setSpin(false); fly = null; });

    /* --- 尺寸与循环 --- */
    let active = false, raf = 0, last = performance.now();
    function resize() {
      const r = o.stage.getBoundingClientRect();
      if (!r.width) return;
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(o.stage);
    const tmp = new THREE.Vector3();
    function loop(now) {
      if (!active) return;
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      // 拆开动画
      const tgt = exploded ? 1 : 0;
      ex += (tgt - ex) * Math.min(1, dt * 4);
      const e = ex * ex * (3 - 2 * ex);
      lens.position.z = 2.5 + e * 9;
      barrelMats.forEach((m) => { m.opacity = 1 - 0.82 * e; m.depthWrite = e < 0.3; });
      inner.visible = e > 0.02;
      ELS.forEach((el) => (el.m.position.z = el.z * (1 + 0.45 * e) + (el.focus ? Math.sin(now / 900) * 0.25 * e : 0)));
      irisG.position.z = 5.3 * (1 + 0.45 * e);
      slats.forEach((s, k) => (s.position.y = -1.15 + k * 0.45 + e * (2.0 + k * 0.06) * (k < 3 ? 1 : 1)));
      curtains.visible = true;
      ibis.position.x = MX + Math.sin(now / 700) * 0.06 * e; ibis.position.y = MY + Math.cos(now / 830) * 0.05 * e;
      // 光路：平行光进入前镜片，经光圈汇聚到传感器
      rays.visible = showRays;
      if (showRays) {
        const fz = lens.position.z + 9.2 * (1 + 0.45 * e), sz = -0.68;
        const r = Math.min(R_.iris.r * 1.25, 2.9);
        let k = 0;
        for (let i = 0; i < 7; i++) {
          const y = MY + ((i - 3) / 3) * r, x = MX;
          const pts = [[x, y, fz + 16], [x, y, fz], [x, y, fz], [MX, MY, sz]];
          pts.forEach((p) => { rayPos[k++] = p[0]; rayPos[k++] = p[1]; rayPos[k++] = p[2]; });
        }
        rayGeo.attributes.position.needsUpdate = true;
      }
      if (fly) {
        fly.t = Math.min(1, fly.t + dt * 1.6);
        const s = fly.t * fly.t * (3 - 2 * fly.t);
        camera.position.lerpVectors(fly.p0, fly.p1, s); controls.target.lerpVectors(fly.t0, fly.t1, s);
        if (fly.t >= 1) fly = null;
      }
      controls.update();
      renderer.render(scene, camera);
      // 热点投影
      const W = o.stage.clientWidth, H = o.stage.clientHeight;
      const camDir = tmp.copy(camera.position).sub(controls.target).normalize();
      CL.PARTS.forEach((p) => {
        const b = hsBtns[p.id], v = partWorld(p);
        const n = new THREE.Vector3(...p.nrm).normalize();
        const facing = n.dot(camDir) > -0.15;
        const hidden = (p.explode && e < 0.6) || !facing;
        v.project(camera);
        b.style.left = ((v.x * 0.5 + 0.5) * W).toFixed(1) + 'px';
        b.style.top = ((-v.y * 0.5 + 0.5) * H).toFixed(1) + 'px';
        b.classList.toggle('hide', hidden && p !== sel);
      });
    }
    select('modeDial', false);
    return {
      setActive(v) { active = v; if (v) { resize(); last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); } else cancelAnimationFrame(raf); },
      setAperture(N, Nmin, blades, round) { if (!R_.iris || Math.abs(R_.iris.N - N) > 1e-3 || R_.blades !== blades) { buildIris(N, Nmin, blades, round); R_.blades = blades; } },
      setLCD(data, w, h) { if (w === 240) { lcdTex.image.data.set(data.subarray(0, Math.min(data.length, lcdData.length))); lcdTex.image.height = Math.min(h, 160); lcdTex.needsUpdate = true; } },
      setSensor(wmm, hmm) { sensor.scale.set(wmm / 36, hmm / 24, 1); },
    };
  };
})();
