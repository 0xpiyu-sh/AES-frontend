const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 35;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create subtle background geometry
const group = new THREE.Group();
scene.add(group);

const material = new THREE.MeshBasicMaterial({ 
    color: 0x14b8a6, // Matches primary UI color
    wireframe: true, 
    transparent: true, 
    opacity: 0.05 
});

const sphereGeo = new THREE.IcosahedronGeometry(12, 1);
const sphere = new THREE.Mesh(sphereGeo, material);
group.add(sphere);

const torusGeo = new THREE.TorusKnotGeometry(10, 1.5, 100, 16);
const torus = new THREE.Mesh(torusGeo, material);
group.add(torus);

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

// API integration for visual feedback
let pulseActive = false;
let pulseDecay = 0;

window.triggerBackgroundPulse = function(mode) {
    pulseActive = true;
    pulseDecay = 1.0;
    material.color.setHex(mode === 'encrypt' ? 0x14b8a6 : 0x3b82f6);
};

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Slow, professional rotation
    sphere.rotation.x = time * 0.05;
    sphere.rotation.y = time * 0.08;
    torus.rotation.x = time * -0.03;
    torus.rotation.y = time * -0.05;

    // Subtle parallax effect tracking the mouse
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    // Handle pulse on API execution
    if (pulseActive) {
        pulseDecay -= 0.02;
        material.opacity = 0.05 + (pulseDecay * 0.15); // Peaks at 0.2 opacity
        if (pulseDecay <= 0) {
            pulseActive = false;
            material.opacity = 0.05;
            material.color.setHex(0x14b8a6); // Reset to base color
        }
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});