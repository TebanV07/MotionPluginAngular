import { Component, OnInit, OnDestroy } from '@angular/core';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrls: ['./motion.component.scss']
})
export class MotionComponent implements OnInit, OnDestroy {
  motionData: MotionData = {};
  orientationMatrix: number[] = [];

  constructor(private motionS: MotionService) {}

  ngOnInit(): void {
    this.motionS.startMotionDetection((data: MotionData) => {
      this.motionData = data;
      this.updateOrientationMatrix();
    });
  }

  private updateOrientationMatrix() {
    if (this.motionData.orientation) {
      const { pitch, roll, yaw } = this.motionData.orientation;
      
      // Convertir a radianes
      const p = pitch * Math.PI / 180;
      const r = roll * Math.PI / 180;
      const y = yaw * Math.PI / 180;

      // Calcular matriz de rotación simple
      const cosP = Math.cos(p), sinP = Math.sin(p);
      const cosR = Math.cos(r), sinR = Math.sin(r);
      const cosY = Math.cos(y), sinY = Math.sin(y);

      this.orientationMatrix = [
        cosY * cosR, cosY * sinR * sinP - sinY * cosP, cosY * sinR * cosP + sinY * sinP,
        sinY * cosR, sinY * sinR * sinP + cosY * cosP, sinY * sinR * cosP - cosY * sinP,
        -sinR, cosR * sinP, cosR * cosP
      ];
    }
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }
}