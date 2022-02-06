import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
// import FullScreenLoading from 'components/base/loading/FullScreenLoading';
import CircularLoading from 'components/base/loading/CircularLoading';
import { AppActions } from 'store/actionCreators';
import { ENV_MODE_DEV } from 'lib/setting';
import { extractExtension } from 'lib/library';
import _ from 'lodash';
import MuiButton from 'components/common/button/MuiButton';
import ZoomOutMapSharpIcon from '@material-ui/icons/ZoomOutMapSharp';

// const teethMtl = require('static/files/model3d/teeth/obj/teeth.mtl');
// const teethObj = require('static/files/model3d/teeth/obj/teeth.obj');
// const teethObjPng = require('static/files/model3d/teeth/obj/teeth.png');
// const teethPlyTextureO = require('static/files/model3d/teeth/ply/textureO/MandibularAnatomy.ply');
// const teethPlyTextureOJpg = require('static/files/model3d/teeth/ply/textureO/MandibularAnatomy.jpg');
// const teethPlyTextureX = require('static/files/model3d/teeth/ply/textureX/teeth.ply');
// const teethStl = require('static/files/model3d/teeth/stl/teeth.stl');
//
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
  // model = { isView: null, name: '', url: '', textureUrl: '', mtlUrl: '' },
  model = [],
}) {
  const [isLoading, setIsLoading] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [renderCount, setRenderCount] = useState(0);
  const canvasRef = useRef();
  const [resetConfig, setResetConfig] = useState(null);
  // const [camera, setCamera] = useState(new THREE.PerspectiveCamera(10, width / height, 1, 1000));

  // useEffect(() => {
  //   console.log(isLoading, 'isLoading');
  // }, [isLoading]);

  // useEffect(() => {
  //   console.log('model', model);
  // }, [model]);

  useEffect(() => {
    const isExistNotValidObj = model.some(item => item.isValidObj === false);

    // if (!isExistNotValidObj && !!canvasRef.current && !!model?.length) {
    // console.log('!!canvasRef.current', !!canvasRef.current);
    // console.log('!!model?.length', !!model?.length);
    // console.log('!!model?.length', model);
    if ((!!canvasRef.current, resetConfig !== false)) {
      // console.log('is valid');

      let container;
      let camera, scene, controls;
      // let scene, controls;
      let renderer;
      let group;
      let meshGroup = [],
        meshSizeGroup = [];
      // let object;

      // let renderLength = 0;
      let cameraRatioY = 6.613;
      let cameraRatioZ = 0.877;

      init();
      animate();

      function init() {
        setRenderCount(0);

        container = canvasRef.current;
        if (container.querySelector('canvas')) container.querySelector('canvas').remove();

        // camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
        // camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        camera = new THREE.PerspectiveCamera(10, width / height, 1, 1000);
        // camera position set 고정
        // camera.position.set(0, 80, 50);
        // camera.position.set(0, 80, 0);
        let dist = height / (2 * Math.tan((camera.fov * Math.PI) / 360));
        let vFOV = (camera.fov * Math.PI) / 180;
        let visibleHeight = 2 * Math.tan(vFOV / 2) * dist;
        // console.log('visibleHeight', visibleHeight);
        // console.log('dist', dist);
        // camera.position.z = (425 / 2) * Math.sqrt(3);
        // camera.position.z = 10;
        // cameraTarget = new THREE.Vector3( 0, - 0.1, 0 );

        // TODO: 적용예정
        camera.position.z = (height / 2 + dist) * 3.5;
        // camera.position.z = visibleHeight / 2 + dist;
        // camera.position.z = height / 2 / 5;

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);
        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        // const light = new THREE.DirectionalLight(0xffffff, 3.0);
        // scene.add(light);

        // TEST: 안내선
        const axes = new THREE.AxisHelper(100);
        scene.add(axes);
        // if (ENV_MODE_DEV) {
        //   const axes = new THREE.AxisHelper(100);
        //   scene.add(axes);
        // }

        scene.add(camera);

        // const floorGeometry = new THREE.PlaneGeometry(4, 4);
        // const floorMaterial = new THREE.MeshStandardMaterial({
        //   color: 0xeeeeee,
        //   roughness: 1.0,
        //   metalness: 0.0,
        // });
        // const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        // floor.rotation.x = -Math.PI / 2;
        // floor.receiveShadow = true;
        // scene.add(floor);

        // group 추가
        group = new THREE.Group();
        scene.add(group);

        // scene생성 후 멀티 파일 로더
        model.forEach((item, idx) => {
          // console.log('model.length', model.length);
          // console.log('item idx', idx);
          // loadiing start
          setIsLoading(true);

          // const extension = item.name?.slice(item.name.lastIndexOf('.') + 1);
          const extension = extractExtension(item.name);
          // console.log('extension', extension);

          if (!item.isValidObj && item.isView) {
            return AppActions.show_toast({
              type: 'error',
              message: 'This is not valid file. Please check your file source.',
            });
          }

          // 1. OBJ의 경우,
          // 2. PLY, STL의 경우 mesh 설정후 scene.add(mesh)
          let loader;
          // loader = new OBJLoader();
          // loader = new PLYLoader();
          // loader = new STLLoader();
          // if (extension === 'obj') {
          //   loader = new OBJLoader();
          // } else if (extension === 'stl') {
          //   loader = new STLLoader();
          // } else if (extension === 'ply') {
          //   loader = new PLYLoader();
          // }

          const file = item.url;
          // texture여부 확인
          const hasTexture = !!item?.textureUrl;
          // let index = 0;
          // const files = [...model.url];
          // const filesLength = files?.length;

          if (extension === 'obj') {
            console.log('obj load');
            // camera.position.set(0, 100, -10);

            loadNextFile();

            function loadNextFile() {
              loader = new OBJLoader();
              // TODO: mtlUrl여부 체크 후 없으면 return false;
              new MTLLoader().load(item.mtlUrl, function (materials) {
                materials.preload();
                loader.setMaterials(materials).load(
                  file,
                  // model.url,
                  // teethObj,
                  function (object) {
                    let box = new THREE.Box3().setFromObject(object);
                    // box.getCenter(object.position);
                    // console.log('box', box);
                    // object.position.multiplyScalar(-1);
                    // object.position.set(boxCenter.x, boxCenter.y, boxCenter.z);

                    // success code
                    // let box = new THREE.Box3().setFromObject(mesh);
                    // let sizeY = box.max.y - box.min.y;
                    // let sizeZ = box.max.z - box.min.z;
                    // let sizeYZ = { sizeY, sizeZ };

                    object.traverse(function (child) {
                      if (child.isMesh) {
                        // TODO: 차후에 texture 매핑
                        // child.material = new THREE.MeshPhongMaterial({
                        child.material = new THREE.MeshPhongMaterial({
                          map: new THREE.TextureLoader().load(item.textureUrl),
                          side: THREE.DoubleSide,
                        });
                        // TODO: 적용예정
                        if (model?.length === 1) {
                          child.geometry.translate(
                            -box.getCenter().x,
                            -box.getCenter().y,
                            -box.getCenter().z,
                          );
                        }
                      }
                    });

                    // object.rotation.x = Math.PI / 2;
                    // object.rotation.y = -Math.PI / 2;
                    object.rotation.x = -Math.PI / 2;
                    object.rotation.z = Math.PI - Math.PI / 4;
                    // object.scale.multiplyScalar(1);

                    // scene.add(object);
                    group.add(object);

                    // TODO: 적용예정
                    const cameraPositionValue = setCameraPosition(group, camera.fov);
                    camera.position.z = cameraPositionValue;

                    if (model?.length > 1) {
                      alignCenterGroup(group);
                    }

                    // meshGroup.push(object);
                    // console.log('meshGroup', meshGroup);

                    // if (index === filesLength - 1) return;
                    // index++;
                    // loadNextFile();
                  },
                  function (xhr) {
                    // setIsLoading(true);
                    const percent = (xhr.loaded / xhr.total) * 100;
                    console.log(percent, '% loaded');
                    if (percent === 100) {
                      setRenderCount(draft => draft + 1);
                    }
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
            if (extension === 'stl') {
              console.log('stl load');
              loader = new STLLoader();
            } else if (extension === 'ply') {
              console.log('ply load');
              loader = new PLYLoader();
            }
            // camera.position.set(0, 80, 50);

            loadNextFile();

            function loadNextFile() {
              loader.load(
                file,
                // files[index],
                // teethPlyTextureO,
                // teethPlyTextureX,
                function (object) {
                  // console.log('index', index);
                  let material;
                  // console.log(object, 'object');
                  // position
                  object.computeFaceNormals();
                  object.computeVertexNormals();
                  // object.computeBoundingBox();

                  // DEBUG:  texture 입히기 오류
                  // const texture = new THREE.TextureLoader().load(teethPlyTextureOJpg);
                  // const material = new THREE.MeshBasicMaterial({
                  //   map: texture,
                  //   // emissiveMap: texture,
                  //   // alphaMap: texture,
                  // });

                  // console.log(object.hasColors, 'object.hasColors');
                  let materialOption = {
                    side: THREE.DoubleSide,
                  };
                  if (extension === 'ply') {
                    console.log('object', object);
                    if (object.attributes?.color) {
                      console.log('has color');
                      // ply 자체 point color 적용
                      material = new THREE.MeshStandardMaterial({
                        ...materialOption,
                        vertexColors: THREE.VertexColors,
                      });
                    }
                    if (hasTexture) {
                      // texture 잆을경우 색상입힘, 별도 작동 X
                      console.log('has texture');
                      // ISSUE: ply texture file
                      // the PLYLoader does not support texture coordinates. [https://github.com/mrdoob/three.js/issues/14735]
                      // Looking at THREE.PLYLoader sources, it doesn't seem to support loading the texture coords.
                      // PLY file format doesn't define a single standard for storing texture UV coordinates inside the PLY file.
                      // 오류로 인해 색깔 입힘
                      // materialOption = {
                      //   ...materialOption,
                      //   map: new THREE.TextureLoader().load(item.textureUrl),
                      // };
                      // materialOption = {
                      //   // emissive: '#ffffff',
                      //   // emissiveMap: new THREE.TextureLoader().load(item.textureUrl),
                      //   map: new THREE.TextureLoader().load(item.textureUrl),
                      // };
                      // var max = object.boundingBox.max,
                      //   min = object.boundingBox.min;
                      // var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
                      // var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
                      // var faces = object.faces;

                      // object.faceVertexUvs[0] = [];

                      // for (var i = 0; i < faces.length; i++) {
                      //   var v1 = object.vertices[faces[i].a],
                      //     v2 = object.vertices[faces[i].b],
                      //     v3 = object.vertices[faces[i].c];

                      //   object.faceVertexUvs[0].push([
                      //     new THREE.Vector2(
                      //       (v1.x + offset.x) / range.x,
                      //       (v1.y + offset.y) / range.y,
                      //     ),
                      //     new THREE.Vector2(
                      //       (v2.x + offset.x) / range.x,
                      //       (v2.y + offset.y) / range.y,
                      //     ),
                      //     new THREE.Vector2(
                      //       (v3.x + offset.x) / range.x,
                      //       (v3.y + offset.y) / range.y,
                      //     ),
                      //   ]);
                      // }
                      // object.uvsNeedUpdate = true;

                      // assignUVs(object);
                    }
                    material = new THREE.MeshStandardMaterial({
                      ...materialOption,
                      color: item.viewColor || '#b0b0b0',
                    });
                  } else {
                    // stl material 적용
                    material = new THREE.MeshPhongMaterial({
                      ...materialOption,
                      color: item.viewColor || '#b0b0b0',
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
                  //   // vertexColors: THREE.FaceColors,
                  //   vertexColors: THREE.VertexColors,
                  // });

                  const mesh = new THREE.Mesh(object, material);
                  // const mesh = new THREE.Points(object, material);
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;

                  // rotation 회전 기본 세팅
                  mesh.rotation.x = -Math.PI / 2;
                  mesh.rotation.z = Math.PI - Math.PI / 4;
                  // mesh.scale.set(0.75, 0.75, 0.75);
                  mesh.scale.multiplyScalar(1);

                  // success code
                  let box = new THREE.Box3().setFromObject(mesh);
                  // console.log('box.getSize()', box.getSize());
                  // console.log('box.getCenter()', box.getCenter());
                  // TODO: 적용예정
                  if (model?.length === 1) {
                    object.center();
                    // object.osition(boxCenter.x, boxCenter.y, boxCenter.z);
                  } else {
                    // mesh.translateX(boxCenter.x);
                    // mesh.translateX(boxCenter.y);
                  }
                  // let sizeY = box.max.y - box.min.y;
                  // let sizeY = box.getSize().y;
                  // let sizeZ = box.getSize().z;
                  // let sizeYZ = { sizeY, sizeZ };

                  // scene.add(mesh);
                  group.add(mesh);

                  // TODO: 적용예정
                  const cameraPositionValue = setCameraPosition(group, camera.fov);
                  camera.position.z = cameraPositionValue;

                  if (model?.length > 1) {
                    alignCenterGroup(group);
                  }

                  // if (model?.length > 1) {
                  //   console.log('group center');
                  //   box = new THREE.Box3().setFromObject(group);
                  //   box = new THREE.Box3().setFromObject(group);
                  //   camera.position.x = groupBox.getCenter().x / 2;
                  //   camera.position.y = groupBox.getCenter().y / 2;
                  // }
                  // meshGroup.push(mesh);
                  // console.log('meshGroup', meshGroup);
                  // console.log(group.children);

                  // let dist = camera.position.z - mesh.position.z;
                  // let dist = height / 2 / Math.tan((Math.PI * camera.fov) / 360);
                  // let fov = 2 * Math.atan(height / (20 * dist)) * (180 / Math.PI);
                  // console.log(item.name, '-dist: ', dist);
                  // camera.fov = scale;
                  // camera.updateProjectionMatrix();

                  // let scaleFov = 2 * Math.atan(height / (100 * dist)) * (180 / Math.PI);
                  // mesh.scale.set(scaleFov, scaleFov, scaleFov);

                  // if (index === filesLength - 1) return;
                  // index++;
                  // loadNextFile();
                },
                function (xhr) {
                  // setIsLoading(true);
                  const percent = (xhr.loaded / xhr.total) * 100;
                  console.log(percent, '% loaded');
                  if (percent === 100) {
                    setRenderCount(draft => draft + 1);
                  }
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
        });

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.gammaFactor = 2.2;
        renderer.gammaOutput = true;
        // renderer.outputEncoding = THREE.sRGBEncoding;
        // renderer.shadowMap.enabled = true;
        // renderer.xr.enabled = true;
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // controls

        // controls = new OrbitControls(camera, container);
        controls = new TrackballControls(camera, container);
        controls.mouseButtons = {
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        };
        controls.rotateSpeed = 3;
        controls.panSpeed = 0.05;
        controls.maxDistance = 1000;
        // controls.staticMoving = false;
        // controls.enabled = true;
        // controls.zoomSpeed = 1.2;
        // controls.noZoom = false;
        // controls.noPan = false;
        // controls.panCamera();
        // controls.update();

        // controls.minPolarAngle = 0; // radians
        // controls.maxPolarAngle = Math.PI; // radians
        // controls.minAzimuthAngle = -Math.PI * 2; // radians
        // controls.maxAzimuthAngle = Math.PI * 2;

        // controls.target.set(0, 0, -180);
        // controls.target.set(0, 580, 650);s
        // controls.rotateSpeed = 1.0;
        // controls.zoomSpeed = 1.2;
        // controls.panSpeed = 0.8;
        // controls.minDistance = 5;
        // controls.maxDistance = 100;
        // controls.enableDamping = true;
        // controls.autoRotate = true;
        // console.log('c', controls.getPolarAngle());

        // animate();
        // }

        // console.log('meshGroup', meshGroup);
        // console.log('meshSizeGroup', meshSizeGroup);
        // let cameraZoomRatioY = sizeY * 6.613;
        //           let cameraZoomRatioZ = sizeZ * 0.877;
        //           camera.position.set(0, cameraZoomRatioY, cameraZoomRatioZ);
        // console.log('meshGroup.children', meshGroup.children);
        // const meshGroup = Object.keys(group).reduce((acc, curr) => {
        //   // console.log(curr === children);
        //   console.log('curr', curr);
        //   // const obj = { [curr]: null };
        //   return acc.concat(curr);
        // }, []);
        // console.log('meshGroup', meshGroup);
        // Objects(group).forEach(item => {
        //   console.log('work');
        //   console.log('item', item);
        // });
        // group
        // let dist = camera.position.z - mesh.position.z;
        // camera.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
        // camera.updateProjectionMatrix();
        //
        // var cameraZ = camera.position.z;
        // var planeZ = 1;
        // var distance = cameraZ - planeZ;
        // var aspect = width / height;
        // var vFov = (camera.fov * Math.PI) / 180;
        // var planeHeightAtDistance = 2 * Math.tan(vFov / 2) * distance;
        // var planeWidthAtDistance = planeHeightAtDistance * aspect;
        // camera.aspect = planeHeightAtDistance / planeWidthAtDistance;
        // camera.updateProjectionMatrix();
        //
        // window.addEventListener('resize', onWindowResize);
      }

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      //
      function setCameraPosition(group, cameraFov) {
        let groupBox = new THREE.Box3().setFromObject(group);
        let groupMaxSize = Math.max(groupBox.getSize().x, groupBox.getSize().y);
        let viewBoxPadding = 0;

        // let vFov = (cameraFov * Math.PI) / 180;
        // vFov = 2 * Math.atan(width / width / height / (2 * dist)) * (180 / Math.PI);
        // console.log('vFov', vFov);
        let dist = groupMaxSize / 2 / Math.tan((cameraFov * Math.PI) / 360);
        // console.log('vFov', vFov);
        // let visibleHeight = 2 * Math.tan(vFov / 2) * dist;
        // console.log('visible comparison', visibleHeight, ', ', visibleHeight);
        // console.log('visibleHeight', visibleHeight);

        // return groupMaxSize / 2 + dist - dist;
        return groupMaxSize / 2 + dist + viewBoxPadding;
        //
        // Convert camera fov degrees to radians
        // var fov = cameraFov * ( Math.PI / 180 );

        // // Calculate the camera distance
        // var distance = Math.abs( maxSizeY.sizeY / Math.sin( fov / 2 ) );
      }

      function alignCenterGroup(group) {
        // console.log('group center');
        let groupBox = new THREE.Box3().setFromObject(group);
        // console.log('groupBox.getSize()', groupBox.getSize());
        // console.log('groupBox.getCenter()', groupBox.getCenter());
        group.translateX(-groupBox.getCenter().x);
        group.translateY(-groupBox.getCenter().y);
      }

      //
      function animate() {
        // camera.lookAt(scene.position);
        // renderer.setAnimationLoop(render);
        requestAnimationFrame(animate);
        controls.update();
        render();
      }

      function render() {
        renderer.render(scene, camera);
      }

      // 기존 animate, render
      // function animate() {
      //   camera.lookAt(scene.position);
      // setAnimationLoop 사용시 삭제
      //   requestAnimationFrame(animate);
      //   renderer.setAnimationLoop(render);

      // render 따로 뺄 경우 삭제
      //   renderer.render(scene, camera);
      // }

      // function render() {
      //   renderer.render(scene, camera);
      // }
      // camera.fov = 2 * Math.atan(300 / (2 * 10)) * (180 / Math.PI);
      // camera.update();
    }

    if (resetConfig) setResetConfig(false);
  }, [!!canvasRef.current, model, resetConfig]);

  useEffect(() => {
    if (!!model.length) setResetConfig(true);

    // camera.fov = 2 * Math.atan(300 / (2 * 10)) * (180 / Math.PI);
    // camera.updateMatrix();
  }, [model.length]);

  useEffect(() => {
    // console.log('model.length', model.length);
    // console.log('renderCount', renderCount);
    if (renderCount === model.length) setIsLoading(false);
  }, [renderCount]);

  // if (isLoading) return
  return (
    <Styled.ProjectModelViewer
      data-component-name="ProjectModelViewer"
      className={className}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
    >
      <>
        <button
          // disableElevation
          // variant="contained"
          // color="primary"
          onClick={() => setResetConfig(true)}
          className="btn-reset projectModelViewer__fit_btn"
        >
          <ZoomOutMapSharpIcon />
          {/* Fit to zone */}
        </button>
        {!!model.length && (
          <div
            className="projectModelViewer__canvas_box"
            ref={canvasRef}
            id="canvasRef"
            style={{ touchAction: 'none' }}
          ></div>
        )}

        {isLoading && (
          <div className="projectModelViewer__loading">
            <CircularLoading visible={true} />
          </div>
        )}
      </>
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
    .projectModelViewer__fit_btn {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 30px;
      color: gray;
      svg {
        font-size: inherit;
      }
    }
  `,
};
