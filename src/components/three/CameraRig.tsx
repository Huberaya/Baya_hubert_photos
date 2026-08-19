'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';

export default function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((_, delta) => {
    camera.position.x = MathUtils.damp(camera.position.x, pointer.x * .45, 3, delta);
    camera.position.y = MathUtils.damp(camera.position.y, pointer.y * .25, 3, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}
