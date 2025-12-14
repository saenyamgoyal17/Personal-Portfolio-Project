// getting the container where the 3D canvas will be rendered
const container = document.getElementById("three-container");

// basic three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// values to control how the galaxy looks
const count = 12000;
const radius = 5;
const branches = 4;
const spin = 1;
const randomness = 0.35;

// creating particles for the galaxy
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  const r = Math.random() * radius;
  const branchAngle = ((i % branches) / branches) * Math.PI * 2;
  const spinAngle = r * spin;

  positions[i3] =
    Math.cos(branchAngle + spinAngle) * r +
    (Math.random() - 0.5) * randomness;
  positions[i3 + 1] = (Math.random() - 0.5) * randomness;
  positions[i3 + 2] =
    Math.sin(branchAngle + spinAngle) * r +
    (Math.random() - 0.5) * randomness;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// material for the particles
const material = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xffffff,
  transparent: true,
  depthWrite: false
});

// adding the galaxy to the scene
const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

// mouse movement for slight interaction
const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

// animation loop
function animate() {
  galaxy.rotation.y += 0.002;
  galaxy.rotation.x += mouse.y * 0.05;
  galaxy.rotation.y += mouse.x * 0.05;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// handling active link highlight on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
