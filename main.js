import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js';
import { TransformControls } from './TransformControls.js';

const addBtn = document.getElementById('AddBtn');
const box = document.getElementById('MessageBox');
const select = document.getElementById('Select');
const input = document.getElementById('Input');

let container;
let camera, scene, renderer;
let transformControl;

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

init();

function init() {
  container = document.getElementById('container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 250, 1000);
  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-10, 18, 5);
  light.castShadow = true;
  const d = 14;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.near = 2;
  light.shadow.camera.far = 50;

  light.shadow.mapSize.x = 1024;
  light.shadow.mapSize.y = 1024;

  scene.add(light);

  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  planeGeometry.rotateX(-Math.PI / 2);
  const planeMaterial = new THREE.ShadowMaterial({
    color: 0x000000,
    opacity: 0.2,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y = -200;
  plane.receiveShadow = true;
  scene.add(plane);

  const helper = new THREE.GridHelper(2000, 100);
  helper.position.y = -199;
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add(helper);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;
  controls.addEventListener('change', render);

  transformControl = new TransformControls(camera, renderer.domElement);
  transformControl.addEventListener('change', render);
  transformControl.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
  });
  scene.add(transformControl);

  transformControl.addEventListener('objectChange', function () {
    updateSplineOutline();
  });

  window.addEventListener('resize', onWindowResize);

  render();
}

class Pyramid {
  constructor(radius = 100, height = 100) {
    this.geometry = new THREE.CylinderGeometry(0, radius, height, 4, 1);
    this.material = new THREE.MeshNormalMaterial();
    this.pyramid = new THREE.Mesh(this.geometry, this.material);
    this.uuid = this.pyramid.uuid;
  }

  addPyramid() {
    this.pyramid.position.x = Math.random() * 2 - 1;
    this.pyramid.position.y = Math.random() * 2 - 1;
    this.pyramid.position.z = Math.random() * 2 - 1;
    this.pyramid.position.normalize();
    this.pyramid.position.multiplyScalar(300);
    scene.add(this.pyramid);
    render();
  }

  removePyramid() {
    scene.remove(this.pyramid);
  }

  showInterface() {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    btn.innerText = 'delete';
    btn.addEventListener('click', () => {
      this.removePyramid();
      div.remove();
    });
    div.innerText = this.uuid;
    div.appendChild(btn);
    box.appendChild(div);
  }
}

class Sphere {
  constructor(x = 100, y = 100, z = 100) {
    this.geometry = new THREE.SphereGeometry(x, y, z);
    this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.sphere = new THREE.Mesh(this.geometry, this.material);
    this.uuid = this.sphere.uuid;
  }

  addSphere() {
    this.sphere.position.x = Math.random() * 2 - 1;
    this.sphere.position.y = Math.random() * 2 - 1;
    this.sphere.position.z = Math.random() * 2 - 1;
    this.sphere.position.normalize();
    this.sphere.position.multiplyScalar(200);
    scene.add(this.sphere);
    render();
  }

  removeSphere() {
    scene.remove(this.sphere);
  }

  showInterface() {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    btn.innerText = 'delete';
    btn.addEventListener('click', () => {
      this.removeSphere();
      div.remove();
    });
    div.innerText = this.uuid;
    div.appendChild(btn);
    box.appendChild(div);
  }
}

class Cube {
  constructor(x = 100, y = 100, z = 100) {
    this.geometry = new THREE.BoxGeometry(x, y, z);
    this.material = new THREE.MeshBasicMaterial({ color: 0x2004f6 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.uuid = this.cube.uuid;
  }

  addCube() {
    this.cube.position.x = Math.random() * 2 - 1;
    this.cube.position.y = Math.random() * 2 - 1;
    this.cube.position.z = Math.random() * 2 - 1;
    this.cube.position.normalize();
    this.cube.position.multiplyScalar(100);
    scene.add(this.cube);
    render();
  }

  removeCube() {
    scene.remove(this.cube);
    render();
  }

  showInterface() {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    btn.innerText = 'delete';
    btn.addEventListener('click', () => {
      this.removeCube();
      div.remove();
    });
    div.innerText = this.uuid;
    div.appendChild(btn);
    box.appendChild(div);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function handleClick() {
  switch (select.value) {
    case 'cube':
      let edge = +input.value;
      const cube = new Cube(edge, edge, edge);
      cube.addCube();
      cube.showInterface();
      break;
    case 'sphere':
      let param = +input.value;
      const spehere = new Sphere(param, param, param);
      spehere.addSphere();
      spehere.showInterface();
      break;
    case 'pyramid':
      let values = input.value.split('');
      let height = +values[0] * 100;
      let radius = +values[0] * 100;
      const pyramid = new Pyramid(radius, height);
      pyramid.addPyramid();
      pyramid.showInterface();
      break;
    default:
      break;
  }
}

addBtn.addEventListener('click', handleClick);
