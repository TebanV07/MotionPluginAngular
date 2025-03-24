import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { MotionData } from '../Model/MotionData.model';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private accelListener?: PluginListenerHandle;
  private gyroListener?: PluginListenerHandle;
  private lastUpdate: number = 0;
  private readonly UPDATE_INTERVAL = 16; // ~60fps

  constructor() { }

  async startMotionDetection(callback: (data: MotionData) => void) {
    const motionData: MotionData = {};
    
    try {
      // Nota: En Capacitor v5, Motion no tiene un método requestPermissions explícito.
      // Los permisos se manejan implícitamente por el SO (iOS pedirá permiso automáticamente)
      this.accelListener = await Motion.addListener('accel', (event) => {
        const now = Date.now();
        if (now - this.lastUpdate < this.UPDATE_INTERVAL) return;

        motionData.acceleration = {
          x: event.acceleration.x,
          y: event.acceleration.y,
          z: event.acceleration.z,
          timestamp: now
        };

        this.calculateOrientation(motionData);
        callback(motionData);
        this.lastUpdate = now;
      });

      this.gyroListener = await Motion.addListener('orientation', (event) => {
        const now = Date.now();
        if (now - this.lastUpdate < this.UPDATE_INTERVAL) return;

        motionData.rotation = {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
          timestamp: now
        };

        this.calculateOrientation(motionData);
        callback(motionData);
        this.lastUpdate = now;
      });
    } catch (e) {
      console.error('Error starting motion detection:', e);
      throw e; // Propagar el error para manejo en el componente
    }
  }

  private calculateOrientation(motionData: MotionData) {
    if (motionData.acceleration && motionData.rotation) {
      const { x, y, z } = motionData.acceleration;
      const pitch = Math.atan2(-x, Math.sqrt(y * y + z * z)) * 180 / Math.PI;
      const roll = Math.atan2(y, z) * 180 / Math.PI;
      const yaw = motionData.rotation.alpha;

      motionData.orientation = {
        pitch: Number(pitch.toFixed(2)),
        roll: Number(roll.toFixed(2)),
        yaw: Number(yaw.toFixed(2))
      };
    }
  }

  async stopMotionDetection() {
    try {
      if (this.accelListener) await this.accelListener.remove();
      if (this.gyroListener) await this.gyroListener.remove();
      this.accelListener = undefined;
      this.gyroListener = undefined;
    } catch (e) {
      console.error('Error stopping motion detection:', e);
    }
  }
}