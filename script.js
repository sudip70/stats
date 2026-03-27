// ─── SETUP ────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('globe');
const app    = document.getElementById('app');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(app.clientWidth, app.clientHeight);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, app.clientWidth / app.clientHeight, 0.1, 1000);
camera.position.z = 2.85;

window.addEventListener('resize', () => {
  renderer.setSize(app.clientWidth, app.clientHeight);
  camera.aspect = app.clientWidth / app.clientHeight;
  camera.updateProjectionMatrix();
});

// ─── PIVOT (all globe geo rotates together) ───────────────────────────────────
const pivot = new THREE.Group();
pivot.rotation.y = Math.PI; // start showing Asia/Africa like the reference
scene.add(pivot);

// ─── LIGHTS ───────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.12));

const keyLight = new THREE.DirectionalLight(0xffd085, 1.7);
keyLight.position.set(-4, 2, 3);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x223366, 0.28);
fillLight.position.set(5, -2, -2);
scene.add(fillLight);

// ─── STARS ────────────────────────────────────────────────────────────────────
(function () {
  const n = 7000, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 220, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
    pos[i*3]   = r * Math.sin(p) * Math.cos(t);
    pos[i*3+1] = r * Math.sin(p) * Math.sin(t);
    pos[i*3+2] = r * Math.cos(p);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.22, sizeAttenuation: true, transparent: true, opacity: 0.5
  })));
})();

// ─── DARK BASE SPHERE ─────────────────────────────────────────────────────────
pivot.add(new THREE.Mesh(
  new THREE.SphereGeometry(1.0, 64, 64),
  new THREE.MeshPhongMaterial({ color: 0x080a0e, shininess: 4 })
));

// ─── WARM RIM GLOW (Fresnel shader — matches reference golden halo) ────────────
scene.add(new THREE.Mesh(
  new THREE.SphereGeometry(1.22, 48, 48),
  new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color(0xc06a10) } },
    vertexShader: `
      varying float vI;
      void main(){
        vec3 n = normalize(normalMatrix * normal);
        vec3 v = normalize(-vec3(modelViewMatrix * vec4(position, 1.0)));
        vI = pow(1.0 - max(0.0, dot(n, v)), 3.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 glowColor;
      varying float vI;
      void main(){ gl_FragColor = vec4(glowColor * vI, vI); }`,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })
));

// ─── COORDINATE HELPER ────────────────────────────────────────────────────────
function ll3(lat, lon, r) {
  const phi   = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

// Fan-triangulate a polygon ring onto the sphere
function fanFromRing(ring, r) {
  const pts = ring.map(([lon, lat]) => ll3(lat, lon, r));
  if (pts.length < 3) return null;

  // Centroid projected onto sphere
  const sum = new THREE.Vector3();
  pts.forEach(p => sum.add(p));
  const centroid = sum.divideScalar(pts.length).normalize().multiplyScalar(r);

  const positions = [centroid.x, centroid.y, centroid.z];
  pts.forEach(p => positions.push(p.x, p.y, p.z));

  const indices = [];
  const n = pts.length;
  for (let i = 0; i < n - 1; i++) indices.push(0, i + 1, i + 2);
  indices.push(0, n, 1); // close loop

  return { positions, indices };
}

// ─── DEFORESTATION COLOR DATA ─────────────────────────────────────────────────
// ISO numeric → [forestColor, deforestedColor, rate/yr]
const COUNTRY_DATA = {

  // ── SOUTH AMERICA ──────────────────────────────────────────────────────────
  '076': ['#15803d', '#7f1d1d', 0.014],  // Brazil
  '170': ['#15803d', '#7f1d1d', 0.008],  // Colombia
  '604': ['#166534', '#7f1d1d', 0.006],  // Peru
  '862': ['#15803d', '#7f1d1d', 0.012],  // Venezuela
  '218': ['#15803d', '#7f1d1d', 0.010],  // Ecuador
  '068': ['#166534', '#7f1d1d', 0.009],  // Bolivia
  '600': ['#1a5c2e', '#92400e', 0.006],  // Paraguay
  '032': ['#1a5c2e', '#92400e', 0.006],  // Argentina
  '858': ['#1a5c2e', '#1a4a20', 0.003],  // Uruguay
  '328': ['#15803d', '#7f1d1d', 0.008],  // Guyana
  '740': ['#15803d', '#7f1d1d', 0.007],  // Suriname
  '254': ['#15803d', '#7f1d1d', 0.005],  // French Guiana
  '152': ['#2d6a4f', '#1a4a20', 0.003],  // Chile

  // ── CENTRAL AMERICA & CARIBBEAN ────────────────────────────────────────────
  '320': ['#15803d', '#7f1d1d', 0.013],  // Guatemala
  '340': ['#15803d', '#7f1d1d', 0.014],  // Honduras
  '558': ['#15803d', '#7f1d1d', 0.012],  // Nicaragua
  '188': ['#15803d', '#7f1d1d', 0.008],  // Costa Rica
  '484': ['#1a5c2e', '#7f1d1d', 0.010],  // Mexico
  '222': ['#15803d', '#7f1d1d', 0.016],  // El Salvador
  '591': ['#15803d', '#7f1d1d', 0.009],  // Panama
  '332': ['#15803d', '#7f1d1d', 0.014],  // Haiti
  '214': ['#15803d', '#7f1d1d', 0.008],  // Dominican Republic
  '388': ['#15803d', '#7f1d1d', 0.005],  // Jamaica
  '192': ['#15803d', '#1a4a20', 0.003],  // Cuba

  // ── NORTH AMERICA ──────────────────────────────────────────────────────────
  '840': ['#1a3a2a', '#1a3020', 0.002],  // USA
  '124': ['#1a4030', '#1a3820', 0.001],  // Canada

  // ── WEST AFRICA ────────────────────────────────────────────────────────────
  '566': ['#14532d', '#7f1d1d', 0.010],  // Nigeria
  '288': ['#14532d', '#7f1d1d', 0.012],  // Ghana
  '384': ['#14532d', '#7f1d1d', 0.013],  // Côte d'Ivoire
  '324': ['#14532d', '#7f1d1d', 0.014],  // Guinea
  '694': ['#14532d', '#7f1d1d', 0.012],  // Sierra Leone
  '430': ['#14532d', '#7f1d1d', 0.015],  // Liberia
  '232': ['#14532d', '#7f1d1d', 0.005],  // Eritrea
  '204': ['#14532d', '#7f1d1d', 0.011],  // Benin
  '854': ['#14532d', '#7f1d1d', 0.009],  // Burkina Faso
  '466': ['#14532d', '#7f1d1d', 0.010],  // Mali
  '686': ['#14532d', '#7f1d1d', 0.008],  // Senegal
  '624': ['#14532d', '#7f1d1d', 0.013],  // Guinea-Bissau
  '562': ['#14532d', '#7f1d1d', 0.007],  // Niger
  '768': ['#14532d', '#7f1d1d', 0.009],  // Togo

  // ── CENTRAL AFRICA ─────────────────────────────────────────────────────────
  '180': ['#052e16', '#7f1d1d', 0.008],  // DR Congo
  '024': ['#14532d', '#7f1d1d', 0.010],  // Angola
  '120': ['#14532d', '#7f1d1d', 0.008],  // Cameroon
  '266': ['#052e16', '#7f1d1d', 0.006],  // Gabon
  '178': ['#052e16', '#7f1d1d', 0.007],  // Republic of Congo
  '140': ['#14532d', '#7f1d1d', 0.009],  // Central African Republic
  '646': ['#14532d', '#7f1d1d', 0.011],  // Rwanda
  '108': ['#14532d', '#7f1d1d', 0.012],  // Burundi
  '800': ['#14532d', '#7f1d1d', 0.007],  // Uganda
  '646': ['#14532d', '#7f1d1d', 0.009],  // Rwanda
  '404': ['#14532d', '#7f1d1d', 0.007],  // Kenya
  '834': ['#14532d', '#7f1d1d', 0.009],  // Tanzania
  '508': ['#14532d', '#7f1d1d', 0.010],  // Mozambique
  '454': ['#14532d', '#7f1d1d', 0.011],  // Malawi
  '894': ['#14532d', '#7f1d1d', 0.008],  // Zambia
  '716': ['#14532d', '#7f1d1d', 0.014],  // Zimbabwe

  // ── SOUTHERN & EAST AFRICA ─────────────────────────────────────────────────
  '450': ['#14532d', '#9a3412', 0.010],  // Madagascar
  '710': ['#1a4a28', '#2d5016', 0.003],  // South Africa
  '516': ['#14532d', '#7f1d1d', 0.006],  // Namibia
  '072': ['#14532d', '#7f1d1d', 0.005],  // Botswana
  '231': ['#14532d', '#7f1d1d', 0.007],  // Ethiopia
  '706': ['#14532d', '#7f1d1d', 0.020],  // Somalia
  '270': ['#14532d', '#7f1d1d', 0.012],  // Gambia
  '174': ['#14532d', '#7f1d1d', 0.009],  // Comoros

  // ── SOUTHEAST ASIA ─────────────────────────────────────────────────────────
  '360': ['#14532d', '#9a3412', 0.018],  // Indonesia
  '458': ['#14532d', '#9a3412', 0.018],  // Malaysia
  '116': ['#166534', '#7f1d1d', 0.022],  // Cambodia
  '104': ['#14532d', '#7f1d1d', 0.016],  // Myanmar
  '608': ['#14532d', '#7f1d1d', 0.015],  // Philippines
  '704': ['#14532d', '#9a3412', 0.016],  // Vietnam
  '764': ['#14532d', '#9a3412', 0.014],  // Thailand
  '418': ['#14532d', '#7f1d1d', 0.018],  // Laos
  '096': ['#14532d', '#9a3412', 0.012],  // Brunei
  '626': ['#14532d', '#7f1d1d', 0.014],  // Timor-Leste
  '764': ['#14532d', '#7f1d1d', 0.012],  // Thailand

  // ── SOUTH ASIA ─────────────────────────────────────────────────────────────
  '356': ['#22c55e', '#4d7c0f', 0.003],  // India
  '050': ['#22c55e', '#7f1d1d', 0.008],  // Bangladesh
  '144': ['#22c55e', '#4d7c0f', 0.006],  // Sri Lanka
  '524': ['#22c55e', '#4d7c0f', 0.007],  // Nepal
  '064': ['#22c55e', '#4d7c0f', 0.004],  // Bhutan
  '586': ['#22c55e', '#4d7c0f', 0.004],  // Pakistan

  // ── EAST ASIA ──────────────────────────────────────────────────────────────
  '156': ['#223020', '#223020', 0.002],  // China
  '392': ['#1e4434', '#1e3c2a', 0.001],  // Japan
  '410': ['#1e4434', '#1e3c2a', 0.001],  // South Korea
  '408': ['#1e4434', '#1e3c2a', 0.001],  // North Korea

  // ── CENTRAL ASIA ───────────────────────────────────────────────────────────
  '398': ['#2d4a1e', '#3d3d1a', 0.002],  // Kazakhstan
  '860': ['#2d4a1e', '#3d3d1a', 0.003],  // Uzbekistan
  '417': ['#2d4a1e', '#3d3d1a', 0.002],  // Kyrgyzstan
  '762': ['#2d4a1e', '#3d3d1a', 0.003],  // Tajikistan
  '795': ['#2d4a1e', '#3d3d1a', 0.002],  // Turkmenistan

  // ── MIDDLE EAST ────────────────────────────────────────────────────────────
  '368': ['#2a3a1a', '#2a3a1a', 0.001],  // Iraq
  '364': ['#2a3a1a', '#2a3a1a', 0.001],  // Iran
  '792': ['#22c55e', '#4d7c0f', 0.002],  // Turkey
  '760': ['#2a3a1a', '#2a3a1a', 0.002],  // Syria
  '422': ['#2a3a1a', '#2a3a1a', 0.002],  // Lebanon
  '400': ['#2a3a1a', '#2a3a1a', 0.001],  // Jordan

  // ── EUROPE ─────────────────────────────────────────────────────────────────
  '643': ['#1e4434', '#1e3c2a', 0.001],  // Russia
  '246': ['#1e4a2e', '#1e4a2e', 0.001],  // Finland
  '752': ['#1e4a2e', '#1e4a2e', 0.001],  // Sweden
  '578': ['#1e4a2e', '#1e4a2e', 0.001],  // Norway
  '233': ['#1e4a2e', '#1e4a2e', 0.001],  // Estonia
  '428': ['#1e4a2e', '#1e4a2e', 0.001],  // Latvia
  '440': ['#1e4a2e', '#1e4a2e', 0.001],  // Lithuania
  '112': ['#1e4a2e', '#1e4a2e', 0.001],  // Belarus
  '804': ['#1e4a2e', '#1e4a2e', 0.001],  // Ukraine
  '616': ['#1e4a2e', '#1e4a2e', 0.001],  // Poland
  '203': ['#1e4a2e', '#1e4a2e', 0.001],  // Czech Republic
  '703': ['#1e4a2e', '#1e4a2e', 0.001],  // Slovakia
  '040': ['#1e4a2e', '#1e4a2e', 0.001],  // Austria
  '756': ['#1e4a2e', '#1e4a2e', 0.001],  // Switzerland
  '276': ['#1e4a2e', '#1e4a2e', 0.001],  // Germany
  '250': ['#1e4a2e', '#1e4a2e', 0.001],  // France
  '724': ['#1e4a2e', '#1e4a2e', 0.001],  // Spain
  '620': ['#1e4a2e', '#1e4a2e', 0.001],  // Portugal
  '380': ['#1e4a2e', '#1e4a2e', 0.001],  // Italy
  '300': ['#1e4a2e', '#1e4a2e', 0.001],  // Greece
  '642': ['#1e4a2e', '#1e4a2e', 0.002],  // Romania
  '100': ['#1e4a2e', '#1e4a2e', 0.001],  // Bulgaria
  '191': ['#1e4a2e', '#1e4a2e', 0.001],  // Croatia
  '705': ['#1e4a2e', '#1e4a2e', 0.001],  // Slovenia
  '688': ['#1e4a2e', '#1e4a2e', 0.001],  // Serbia
  '807': ['#1e4a2e', '#1e4a2e', 0.001],  // North Macedonia
  '008': ['#1e4a2e', '#1e4a2e', 0.001],  // Albania
  '070': ['#1e4a2e', '#1e4a2e', 0.001],  // Bosnia & Herzegovina
  '372': ['#1e4a2e', '#1e4a2e', 0.001],  // Ireland
  '826': ['#1e4a2e', '#1e4a2e', 0.001],  // United Kingdom
  '208': ['#1e4a2e', '#1e4a2e', 0.001],  // Denmark
  '528': ['#1e4a2e', '#1e4a2e', 0.001],  // Netherlands
  '056': ['#1e4a2e', '#1e4a2e', 0.001],  // Belgium
  '348': ['#1e4a2e', '#1e4a2e', 0.001],  // Hungary

  // ── CAUCASUS ───────────────────────────────────────────────────────────────
  '268': ['#1e4a2e', '#1e4a2e', 0.002],  // Georgia
  '051': ['#1e4a2e', '#1e4a2e', 0.002],  // Armenia
  '031': ['#1e4a2e', '#1e4a2e', 0.002],  // Azerbaijan

  // ── OCEANIA ────────────────────────────────────────────────────────────────
  '036': ['#1c3420', '#1c3420', 0.002],  // Australia
  '598': ['#166534', '#7f1d1d', 0.006],  // Papua New Guinea
  '242': ['#166534', '#7f1d1d', 0.007],  // Fiji
  '090': ['#166534', '#7f1d1d', 0.006],  // Solomon Islands
  '548': ['#166534', '#7f1d1d', 0.005],  // Vanuatu
  '554': ['#1e4a2e', '#1e4a2e', 0.001],  // New Zealand
};
const DEFAULT_CLR = new THREE.Color(0x1a3a28); // neutral dark green for unmapped land

// ─── OCEAN SPHERE ─────────────────────────────────────────────────────────────
pivot.add(new THREE.Mesh(
  new THREE.SphereGeometry(1.001, 64, 64),
  new THREE.MeshPhongMaterial({ color: 0x0a2744, shininess: 30 })
));

// ─── COUNTRY + BORDER GROUPS ──────────────────────────────────────────────────
const countryGroup = new THREE.Group();
const borderGroup  = new THREE.Group();
pivot.add(countryGroup);
pivot.add(borderGroup);

const countryMeshMap = {}; // id → Mesh

// ─── GLOBE LOADER ─────────────────────────────────────────────────────────────
async function loadGlobe() {
  document.body.insertAdjacentHTML('beforeend', `
    <div id="loader" style="
      position:fixed;inset:0;display:flex;flex-direction:column;
      align-items:center;justify-content:center;z-index:99;
      background:rgba(2,5,8,0.75);backdrop-filter:blur(4px);
    ">
      <div style="width:38px;height:38px;border:2px solid rgba(34,197,94,0.2);
        border-top-color:#22c55e;border-radius:50%;animation:spin 0.9s linear infinite;margin-bottom:16px;"></div>
      <div style="color:#22c55e;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:3px;">LOADING GLOBE...</div>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    </div>
  `);
  // 1. Load topojson-client library
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src     = 'https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js';
    s.onload  = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });

  // 2. Fetch 110m world atlas
  const topoData = await fetch(
    'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
  ).then(r => r.json());

  const features = topojson.feature(topoData, topoData.objects.countries).features;

  // Interior borders shared between countries
  const borders = topojson.mesh(topoData, topoData.objects.countries, (a, b) => a !== b);

  // 3. Build filled country meshes
  for (const feat of features) {
    const id   = String(feat.id);
    const info = COUNTRY_DATA[id];

    const polys = feat.geometry.type === 'Polygon'
      ? [feat.geometry.coordinates]
      : feat.geometry.coordinates;   // MultiPolygon

    const allPos = [], allIdx = [];

    for (const poly of polys) {
      const ring = poly[0];          // outer ring only
      if (!ring || ring.length < 3) continue;

      const res = fanFromRing(ring, 1.003);
      if (!res) continue;

      const base = allPos.length / 3;
      allPos.push(...res.positions);
      allIdx.push(...res.indices.map(i => base + i));
    }

    if (allPos.length === 0) continue;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(allPos), 3));
    geo.setIndex(allIdx);
    geo.computeVertexNormals();

    const startColor = info ? new THREE.Color(info[0]) : DEFAULT_CLR.clone();

    const mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
      color:              startColor,
      shininess:          8,
      polygonOffset:      true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits:  -1,
    }));

    mesh._id   = id;
    mesh._info = info;
    countryMeshMap[id] = mesh;
    countryGroup.add(mesh);
  }

  // 4. Country border lines
  if (borders && borders.coordinates) {
    const borderMat = new THREE.LineBasicMaterial({
      color: 0x2e3440, transparent: true, opacity: 0.85
    });
    for (const line of borders.coordinates) {
      const pts = line.map(([lon, lat]) => ll3(lat, lon, 1.0048));
      if (pts.length < 2) continue;
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      borderGroup.add(new THREE.Line(geo, borderMat));
    }
  }

  // 5. Kick off initial coloring
  recolorCountries(2000);

  // Remove loader
  document.getElementById('loader')?.remove();
}

// ─── RECOLOR COUNTRIES BY YEAR ────────────────────────────────────────────────
const _c1 = new THREE.Color(), _c2 = new THREE.Color();

function recolorCountries(year) {
  const yp = year - 2000;
  for (const [id, mesh] of Object.entries(countryMeshMap)) {
    const info = mesh._info;
    if (!info) continue;
    const t = Math.min(info[2] * yp * 2.2, 1.0);
    mesh.material.color.lerpColors(_c1.set(info[0]), _c2.set(info[1]), t);
  }
}

loadGlobe();

// ─── YEAR / UI LOGIC ──────────────────────────────────────────────────────────
let curYear = 2000, playing = false, playTimer = null;
const slider   = document.getElementById('slider');
const playBtn  = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const playText = document.getElementById('playText');

function updateSliderFill(val) {
  document.getElementById('sliderFill').style.width =
    ((val - 2000) / 25 * 100) + '%';
}

function setYear(y) {
  curYear = y;
  slider.value = y;
  document.getElementById('yearLabel').textContent = y;
  updateSliderFill(y);
  const yp   = y - 2000;
  const loss  = (yp * 0.20).toFixed(1);
  const cov   = Math.max(0, 31.6 - yp * 0.04).toFixed(1);
  document.getElementById('coverageVal').textContent = cov;
  document.getElementById('lossVal').textContent     = loss;
  document.getElementById('coverageBar').style.width =
    cov + '%';
  document.getElementById('lossBar').style.width =
    Math.min(parseFloat(loss) / 5.0 * 100, 100) + '%';
  recolorCountries(y);
}

slider.addEventListener('input', e => setYear(parseInt(e.target.value)));

playBtn.addEventListener('click', () => {
  playing = !playing;
  if (playing) {
    playBtn.classList.add('playing');
    playIcon.textContent = '⏸'; playText.textContent = 'PAUSE';
    if (curYear >= 2025) setYear(2000);
    playTimer = setInterval(() => {
      if (curYear >= 2025) {
        playing = false; clearInterval(playTimer);
        playBtn.classList.remove('playing');
        playIcon.textContent = '▶'; playText.textContent = 'PLAY';
        return;
      }
      setYear(curYear + 1);
    }, 700);
  } else {
    clearInterval(playTimer);
    playBtn.classList.remove('playing');
    playIcon.textContent = '▶'; playText.textContent = 'PLAY';
  }
});

// ─── MOUSE / TOUCH / ZOOM ─────────────────────────────────────────────────────
let dragging = false, prevMX = 0, prevMY = 0, velX = 0, velY = 0;

canvas.addEventListener('mousedown', e => {
  dragging = true; prevMX = e.clientX; prevMY = e.clientY; velX = velY = 0;
});
window.addEventListener('mousemove', e => {
  if (!dragging) return;
  velX = (e.clientY - prevMY) * 0.005;
  velY = (e.clientX - prevMX) * 0.005;
  pivot.rotation.x = Math.max(-1.3, Math.min(1.3, pivot.rotation.x + velX));
  pivot.rotation.y += velY;
  prevMX = e.clientX; prevMY = e.clientY;
});
window.addEventListener('mouseup', () => dragging = false);

canvas.addEventListener('touchstart', e => {
  e.preventDefault(); dragging = true;
  prevMX = e.touches[0].clientX; prevMY = e.touches[0].clientY; velX = velY = 0;
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  e.preventDefault(); if (!dragging) return;
  velX = (e.touches[0].clientY - prevMY) * 0.005;
  velY = (e.touches[0].clientX - prevMX) * 0.005;
  pivot.rotation.x = Math.max(-1.3, Math.min(1.3, pivot.rotation.x + velX));
  pivot.rotation.y += velY;
  prevMX = e.touches[0].clientX; prevMY = e.touches[0].clientY;
}, { passive: false });
canvas.addEventListener('touchend', () => dragging = false);

canvas.addEventListener('wheel', e => {
  e.preventDefault();
  camera.position.z = Math.max(1.85, Math.min(5.5, camera.position.z + e.deltaY * 0.003));
}, { passive: false });

// ─── ANIMATION LOOP ───────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  if (!dragging) {
    pivot.rotation.y += 0.0012;
    velX *= 0.90; velY *= 0.90;
    pivot.rotation.x = Math.max(-1.3, Math.min(1.3, pivot.rotation.x + velX));
    pivot.rotation.y += velY;
  }
  pivot.rotation.y %= Math.PI * 2;
  renderer.render(scene, camera);
}
animate();