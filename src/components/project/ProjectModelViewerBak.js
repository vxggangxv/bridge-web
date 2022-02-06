import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
// import FullScreenLoading from 'components/base/loading/FullScreenLoading';
import CircularLoading from 'components/base/loading/CircularLoading';
import { AppActions } from 'store/actionCreators';
import { ENV_MODE_DEV } from 'lib/setting';

const teethMtl = require('static/files/model3d/teeth/obj/teeth.mtl');
const teethObj = require('static/files/model3d/teeth/obj/teeth.obj');
const teethObjPng = require('static/files/model3d/teeth/obj/teeth.png');
const teethPlyTextureO = require('static/files/model3d/teeth/ply/textureO/teeth.ply');
const teethPlyTextureOJpg = require('static/files/model3d/teeth/ply/textureO/teeth.jpg');
const teethPlyTextureX = require('static/files/model3d/teeth/ply/textureX/teeth.ply');
const teethStl = require('static/files/model3d/teeth/stl/teeth.stl');
// const testModel = require('static/files/model3d/PeugeotOnyxConcept.obj');
// const modelOBJ = require('static/files/model3d/Cat_obj.obj');
// const modelPLY = require('static/files/model3d/dragon/Dragon 2.5_ply.ply');
// const modelSTL = require('static/files/model3d/dragon/Dragon 2.5_stl.stl');

export default React.memo(function ProjectModelViewer({
  // width = 425,
  width = 450,
  height = 425,
  backgroundColor = '#ddd',
  className = '',
  // model = { file: null, name: null, textureUrl: '', mtlUrl: '' },
  model = { isView: null, name: '', url: '', textureUrl: '', mtlUrl: '' },
}) {
  const [isLoading, setIsLoading] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const canvasRef = useRef();

  // useEffect(() => {
  //   console.log(isLoading, 'isLoading');
  // }, [isLoading]);

  // useEffect(() => {
  //   console.log('model', model);
  // }, [model]);

  useEffect(() => {
    const extension = model.name?.slice(model.name.lastIndexOf('.') + 1);
    console.log('extension', extension);
    // TODO: check valid
    // const ValidCheckList = [!!model.url, !!model.url && extension === 'obj' && model.mtlUrl];
    // const isValidValue = ValidCheckList.some(item => item === true);
    // if (!isValidValue) return;
    if (model.isView) {
      console.log('extension-', extension);
      if (!model?.url?.length) {
        console.log('is not valid url?');
        setIsValid(false);
      } else if (extension === 'obj' && !model.mtlUrl) {
        console.log('is not valid obj file?');
        setIsValid(false);
      } else if (!canvasRef.current) {
        console.log('is not ready ref');
        setIsValid(false);
      } else {
        console.log('is valid');
        setIsValid(true);

        let container;
        let camera;
        let controls;
        let scene;
        let renderer;
        // let object;

        // setIsLoading(true);
        init();
        animate();
        // setIsLoading(false);

        function init() {
          container = canvasRef.current;
          if (container.querySelector('canvas')) container.querySelector('canvas').remove();

          camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
          // camera.position.set(0, 80, 50);

          controls = new OrbitControls(camera, container);
          // controls.target.set(0, -50, 0);
          // controls.rotateSpeed = 1.0;
          // controls.zoomSpeed = 1.2;
          // controls.panSpeed = 0.8;
          // controls.minDistance = 5;
          // controls.maxDistance = 100;

          scene = new THREE.Scene();
          scene.background = new THREE.Color(backgroundColor);

          const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
          scene.add(ambientLight);
          const pointLight = new THREE.PointLight(0xffffff, 0.8);
          camera.add(pointLight);

          // const light = new THREE.DirectionalLight(0xffffff, 3.0);
          // scene.add(light);

          // TEST: 안내선
          if (ENV_MODE_DEV) {
            const axes = new THREE.AxisHelper(100);
            scene.add(axes);
          }

          scene.add(camera);

          // case) 1. OBJ의 경우, 2.
          // PLY, STL의 경우 mesh 설정후 scene.add(mesh)
          let loader;
          // loader = new OBJLoader();
          // loader = new PLYLoader();
          // loader = new STLLoader();
          if (extension === 'obj') {
            loader = new OBJLoader();
          } else if (extension === 'stl') {
            loader = new STLLoader();
          } else if (extension === 'ply') {
            loader = new PLYLoader();
          }

          let index = 0;
          const files = [...model.url];
          const filesLength = files?.length;

          if (extension === 'obj') {
            console.log('obj load');
            camera.position.set(0, 100, -10);

            loadNextFile();

            function loadNextFile() {
              setIsLoading(true);
              // TODO: mtlUrl여부 체크 후 없으면 return false;
              new MTLLoader().load(teethMtl, function (materials) {
                materials.preload();
                new OBJLoader().setMaterials(materials).load(
                  model.url,
                  // teethObj,
                  function (object) {
                    let box = new THREE.Box3().setFromObject(object);
                    const boxCenter = {
                      x: -box.getCenter().x / 2,
                      y: -box.getCenter().y / 2,
                      z: -box.getCenter().z / 2,
                    };
                    // object.position.multiplyScalar(-1);
                    object.position.set(boxCenter.x, boxCenter.y, boxCenter.z);
                    object.traverse(function (child) {
                      if (child.isMesh) {
                        // TODO: 차후에 texture 매핑
                        child.material = new THREE.MeshPhongMaterial({
                          map: new THREE.TextureLoader().load(teethObjPng),
                        });
                        child.geometry.translate(boxCenter.x, boxCenter.y, boxCenter.z);
                      }
                    });

                    // object.rotation.y = -Math.PI / 2;
                    // object.rotation.x = Math.PI / 2;
                    // object.scale.multiplyScalar(1);
                    scene.add(object);

                    if (index === filesLength - 1) return;
                    index++;
                    loadNextFile();
                  },
                  function (xhr) {
                    // setIsLoading(true);
                    const percent = (xhr.loaded / xhr.total) * 100;
                    // console.log(percent, '% loaded');
                    if (percent === 100) setIsLoading(false);
                  },
                  function (error) {
                    console.log(error, 'error');
                    console.log('모델을 로드 중 오류가 발생하였습니다.');
                    setIsLoading(false);
                    AppActions.show_toast({ type: 'error', message: 'Load Error.' });
                  },
                );
              });
            }
          }
          if (extension === 'stl' || extension === 'ply') {
            console.log('stl or ply load');
            camera.position.set(0, 80, 50);

            loadNextFile();

            function loadNextFile() {
              setIsLoading(true);
              loader.load(
                files[index],
                // teethPlyTextureO,
                // teethPlyTextureX,
                function (object) {
                  console.log('index', index);
                  let material;
                  // console.log(object, 'object');
                  // Position
                  object.computeFaceNormals();
                  object.computeVertexNormals();
                  // object.center();

                  // DEBUG:  texture 입히기 오류
                  // const texture = new THREE.TextureLoader().load(teethPlyTextureOJpg);
                  // const material = new THREE.MeshBasicMaterial({
                  //   map: texture,
                  //   // emissiveMap: texture,
                  //   // alphaMap: texture,
                  // });

                  // console.log(object.hasColors, 'object.hasColors');
                  // TODO: ply파일 texture여부 확인
                  const hasTexture = model.textureUrl;
                  if (extension === 'ply') {
                    if (!hasTexture) {
                      // material = new THREE.MeshPhongMaterial({
                      //   opacity: object.alpha,
                      //   vertexColors: THREE.VertexColors,
                      // });
                      material = new THREE.MeshStandardMaterial({
                        vertexColors: THREE.VertexColors,
                      });
                    } else {
                      material = new THREE.MeshPhongMaterial({
                        color: '#b0b0b0',
                      });
                      // material = new THREE.MeshStandardMaterial({
                      //   color: 0x999999,
                      //   flatShading: true,
                      // });
                    }
                  } else {
                    material = new THREE.MeshPhongMaterial({
                      color: '#b0b0b0',
                    });
                  }

                  // const material = new THREE.MeshPhongMaterial({
                  // const material = new THREE.MeshLambertMaterial({
                  //   color: '#b0b0b0',
                  //   shininess: 1000,
                  // });
                  // const material = new THREE.MeshBasicMaterial({
                  //   // color: '0xffffff',
                  //   // specular: '0x111111',
                  //   // shininess: 200,
                  //   // TODO: 파일 체크 후 매핑
                  //   // vertexColors: THREE.FaceColors,
                  //   vertexColors: THREE.VertexColors,
                  // });

                  const mesh = new THREE.Mesh(object, material);
                  // const mesh = new THREE.Points(object, material);
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;

                  mesh.rotation.x = -Math.PI / 2;
                  mesh.rotation.z = Math.PI - Math.PI / 4;
                  // mesh.scale.set(0.75, 0.75, 0.75);
                  mesh.scale.multiplyScalar(1);

                  scene.add(mesh);

                  if (index === filesLength - 1) return;
                  index++;
                  loadNextFile();
                },
                function (xhr) {
                  // setIsLoading(true);
                  const percent = (xhr.loaded / xhr.total) * 100;
                  // console.log(percent, '% loaded');
                  if (percent === 100) setIsLoading(false);
                },
                function (error) {
                  console.log(error, 'error');
                  console.log('모델을 로드 중 오류가 발생하였습니다.');
                  setIsLoading(false);
                  AppActions.show_toast({ type: 'error', message: 'Load Error.' });
                },
              );
            }
          }

          renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(width, height);
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.gammaFactor = 2.2;
          renderer.gammaOutput = true;
          container.appendChild(renderer.domElement);
          // renderer.shadowMap.enabled = true;
          // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        function animate() {
          requestAnimationFrame(animate);
          camera.lookAt(scene.position);
          renderer.render(scene, camera);
          controls.update();
        }
      }
    }
  }, [!!canvasRef.current, model]);

  // if (isLoading) return
  return (
    <Styled.ProjectModelViewer
      data-component-name="ProjectModelViewer"
      className={className}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
    >
      {model.isView && (
        <>
          {model.url && (
            <div
              className="projectModelViewer__canvas_box"
              ref={canvasRef}
              id="canvasRef"
              style={{ touchAction: 'none' }}
            ></div>
          )}

          {isValid === false && (
            <div className="projectModelViewer__dim">
              This is not valid file.
              <br /> Please check your file, or texture file.
              <br />
              If not, uplaod a new file.
            </div>
          )}
          {isLoading && (
            <div className="projectModelViewer__loading">
              <CircularLoading visible={true} />
            </div>
          )}
        </>
      )}
    </Styled.ProjectModelViewer>
  );
});

const Styled = {
  ProjectModelViewer: styled.div`
    position: relative;
    width: ${({ width }) => `${width + 2}px`};
    height: ${({ height }) => `${height + 2}px`};
    background-color: ${({ backgroundColor }) => backgroundColor};
    .projectModelViewer__loading {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .projectModelViewer__dim {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
      font-size: 14px;
      color: #fff;
      line-height: 1.3;
      text-align: center;
    }
  `,
};
