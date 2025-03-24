export interface MotionData {
  acceleration?: { 
      x: number; 
      y: number; 
      z: number;
      timestamp?: number;
  };
  rotation?: { 
      alpha: number; 
      beta: number; 
      gamma: number;
      timestamp?: number;
  };
  orientation?: {
      pitch: number;
      roll: number;
      yaw: number;
  };
}