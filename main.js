import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene, camera, renderer, controls, stars, sphere;
let clock = new THREE.Clock();

function init() {
    // Create scene
    scene = new THREE.Scene();

    // Setup camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("canvas-container").appendChild(renderer.domElement);

    // Camera controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Add animated sphere object
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    createStarfield();  // Background stars
    animate();          // Start animation loop
}

// Function to create a moving starfield background
function createStarfield() {
    stars = new THREE.Group();
    const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 200; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50
        );
        stars.add(star);
    }
    scene.add(stars);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Get elapsed time
    let elapsed = clock.getElapsedTime();

    // Animate sphere floating up and down
    sphere.position.y = Math.sin(elapsed) * 0.5;

    // Rotate sphere
    sphere.rotation.y += 0.01;
    sphere.rotation.x += 0.005;

    // Move stars slightly to create a drifting effect
    stars.rotation.y += 0.0005;
    stars.rotation.x += 0.0003;

    controls.update();
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the scene
init();
