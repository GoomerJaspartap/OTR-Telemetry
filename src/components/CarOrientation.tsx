import { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

interface CarOrientationProps {
  imuData: {
    acceleration: {
      x: number;
      y: number;
      z: number;
    };
    gyroscope: {
      x: number;
      y: number;
      z: number;
    };
    orientation: {
      pitch: number;
      roll: number;
      yaw: number;
    };
  };
}

export default function CarOrientation({ imuData }: CarOrientationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRef = useRef<THREE.Object3D | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const handleResize = useCallback(() => {
    if (containerRef.current && rendererRef.current && cameraRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const currentContainer = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      currentContainer.clientWidth / currentContainer.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
    currentContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7.5).normalize();
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-5, 10, -5).normalize();
    scene.add(directionalLight2);

    const gridHelper = new THREE.GridHelper(5, 10);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    const loadModel = (materials?: MTLLoader.MaterialCreator) => {
        if (materials) {
            objLoader.setMaterials(materials);
        }
        objLoader.load(
            '/assets/formula 1/Formula.obj',
            (object: THREE.Object3D) => {
                if (carRef.current) {
                    scene.remove(carRef.current);
                }

                const car = object;
                const box = new THREE.Box3().setFromObject(car);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3.0 / maxDim;
                car.scale.set(scale, scale, scale);

                box.setFromObject(car);
                box.getCenter(center);
                car.position.sub(center);
                car.position.y = -0.5;
                
                // Set rotation order to ensure consistent rotation application
                car.rotation.order = 'ZYX';
                
                scene.add(car);
                carRef.current = car;
                console.log("Car model loaded successfully.");
                if (imuData?.orientation) {
                    console.log("Setting initial rotation from imuData:", imuData.orientation);
                    carRef.current.rotation.x = THREE.MathUtils.degToRad(imuData.orientation.roll || 0);
                    carRef.current.rotation.y = THREE.MathUtils.degToRad(imuData.orientation.pitch || 0);
                    carRef.current.rotation.z = THREE.MathUtils.degToRad(imuData.orientation.yaw || 0);
                }
            },
            undefined,
            (err: unknown) => {
                console.error('Error loading OBJ model:', err);
                if (!carRef.current) { 
                    console.log("Loading fallback cube.");
                    const geometry = new THREE.BoxGeometry(1, 0.5, 2);
                    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.y = -0.25;
                    // Set rotation order and initial rotation for fallback cube too
                    cube.rotation.order = 'ZYX';
                    if (imuData?.orientation) {
                        cube.rotation.x = THREE.MathUtils.degToRad(imuData.orientation.roll || 0);
                        cube.rotation.y = THREE.MathUtils.degToRad(imuData.orientation.pitch || 0);
                        cube.rotation.z = THREE.MathUtils.degToRad(imuData.orientation.yaw || 0);
                    }
                    scene.add(cube);
                    carRef.current = cube;
                }
            }
        );
    };

    mtlLoader.load(
      '/assets/formula 1/Formula_1_mesh.mtl',
      (materials) => {
        materials.preload();
        console.log("Materials loaded:", materials);
        loadModel(materials);
      },
      undefined,
      (err: unknown) => {
        console.error('Error loading materials, trying OBJ only:', err);
        loadModel();
      }
    );

    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      console.log("Cleaning up Three.js scene");
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (carRef.current) {
          scene.remove(carRef.current);
      }
       scene.remove(gridHelper);
       
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
       if (currentContainer && rendererRef.current) {
         if (currentContainer.contains(rendererRef.current.domElement)) {
             currentContainer.removeChild(rendererRef.current.domElement);
         }
       }
       
       sceneRef.current = null;
       cameraRef.current = null;
       rendererRef.current = null;
       carRef.current = null;
    };
  }, [handleResize]);

  useEffect(() => {
    console.log("CarOrientation received imuData:", imuData);

    if (carRef.current && imuData?.orientation) { 
        // Remove the check for 'Mesh' type - apply rotation to any object
        const rollRad = THREE.MathUtils.degToRad(imuData.orientation.roll || 0);
        const pitchRad = THREE.MathUtils.degToRad(imuData.orientation.pitch || 0);
        const yawRad = THREE.MathUtils.degToRad(imuData.orientation.yaw || 0);

        console.log(`Applying rotation (radians) -> Roll (X): ${rollRad}, Pitch (Y): ${pitchRad}, Yaw (Z): ${yawRad}`);

        carRef.current.rotation.x = rollRad;
        carRef.current.rotation.y = pitchRad;
        carRef.current.rotation.z = yawRad;
    }
  }, [imuData]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
} 