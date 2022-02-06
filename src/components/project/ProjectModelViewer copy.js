import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
// import { OBJLoader, PLYLoader, STLLoader } from "three/examples/jsm/loaders/OBJLoader";

export default function ProjectModelViewer({ width, height }) {
  const canvasRef = useRef();

  const widthValue = width ? width : 425;
  const heightValue = height ? height : 425;

  useLayoutEffect(() => {
    console.log(canvasRef, 'canvasRef');

    var scene = new THREE.Scene();
    // var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(widthValue, heightValue);
    canvasRef.current.appendChild(renderer.domElement);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <Styled.ProjectModelViewer data-component-name="ProjectModelViewer">
      <div className="projectModelViewer__canvas_box" ref={canvasRef}></div>
    </Styled.ProjectModelViewer>
  );
}

const Styled = {
  ProjectModelViewer: styled.div``,
};
