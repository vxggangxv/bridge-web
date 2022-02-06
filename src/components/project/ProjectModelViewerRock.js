import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
const testModel = require('static/files/model3d/test.ply');

export default function ProjectModelViewer({ width, height }) {
  const canvasRef = useRef();

  const widthValue = width ? width : 425;
  const heightValue = height ? height : 425;

  useLayoutEffect(() => {
    console.log(canvasRef, 'canvasRef');

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    canvasRef.current.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(widthValue, heightValue);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#dedef0');

    const loader = new PLYLoader();

    loader.load(testModel, function (geometry) {
      console.log(geometry);

      geometry.computeFaceNormals();
      geometry.computeVertexNormals();

      geometry.center();
      geometry.computeBoundingBox();

      const x = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
      const y = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
      const z = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

      const cameraZ = Math.max(x * 2.5, y * 2.5, z * 2.5);

      const material = new THREE.MeshLambertMaterial({
        color: '#b0b0b0',
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1,
        1000,
      );

      camera.position.set(0, 0, cameraZ);
      camera.lookAt(mesh);

      const controls = new OrbitControls(camera);
      controls.enableZoom = false;

      var lightHolder = new THREE.Group();

      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
      directionalLight.position.set(1, 1, 0).normalize();
      lightHolder.add(directionalLight);

      // var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
      // directionalLight.position.set(0, 0, 0).normalize();
      // lightHolder.add(directionalLight);
      scene.add(lightHolder);

      const light = new THREE.AmbientLight('#FFF');
      scene.add(light);

      scene.add(mesh);

      function animate() {
        requestAnimationFrame(animate);
        lightHolder.quaternion.copy(camera.quaternion);
        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        renderer.render(scene, camera);
      }
      animate();
    });

    // window.addEventListener('wheel', () => {}, { passive: true });
    // return
  }, []);

  return (
    <Styled.ProjectModelViewer data-component-name="ProjectModelViewer">
      <div
        className="projectModelViewer__canvas_box"
        ref={canvasRef}
        style={{ touchAction: 'none' }}
      ></div>
    </Styled.ProjectModelViewer>
  );
}

const Styled = {
  ProjectModelViewer: styled.div``,
};
