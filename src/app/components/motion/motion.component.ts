import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { MotionService } from "./Services/motion.service"
import { MotionData } from "./Model/MotionData.model"

@Component({
  selector: "app-motion",
  templateUrl: "./motion.component.html",
  styleUrls: ["./motion.component.scss"],
})
export class MotionComponent implements OnInit, OnDestroy {
  motionData: MotionData = {}
  orientationMatrix: number[] = []
  isDarkMode = false
  showMatrix = false

  constructor(private motionS: MotionService) {
    // Detectar preferencia de tema del sistema
    this.isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  ngOnInit(): void {
    this.motionS.startMotionDetection((data: MotionData) => {
      this.motionData = data
      this.updateOrientationMatrix()
    })
  }

  private updateOrientationMatrix() {
    if (this.motionData.orientation) {
      const { pitch, roll, yaw } = this.motionData.orientation

      // Convertir a radianes
      const p = (pitch * Math.PI) / 180
      const r = (roll * Math.PI) / 180
      const y = (yaw * Math.PI) / 180

      // Calcular matriz de rotación simple
      const cosP = Math.cos(p),
        sinP = Math.sin(p)
      const cosR = Math.cos(r),
        sinR = Math.sin(r)
      const cosY = Math.cos(y),
        sinY = Math.sin(y)

      this.orientationMatrix = [
        cosY * cosR,
        cosY * sinR * sinP - sinY * cosP,
        cosY * sinR * cosP + sinY * sinP,
        sinY * cosR,
        sinY * sinR * sinP + cosY * cosP,
        sinY * sinR * cosP - cosY * sinP,
        -sinR,
        cosR * sinP,
        cosR * cosP,
      ]
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode
  }

  toggleMatrix(): void {
    this.showMatrix = !this.showMatrix
  }

  // Métodos para visualizaciones
  getAccelTilt(axis: string): number {
    if (!this.motionData.acceleration) return 0

    const value = axis === "x" ? this.motionData.acceleration.x || 0 : this.motionData.acceleration.y || 0

    // Limitar la inclinación a un máximo de 45 grados
    return Math.min(Math.max(value * 5, -45), 45)
  }

  getBarWidth(sensor: string, axis: string): string {
    let value = 0
    let maxValue = 10 // Valor predeterminado

    if (sensor === "accel" && this.motionData.acceleration) {
      if (axis === "x") value = this.motionData.acceleration.x || 0
      if (axis === "y") value = this.motionData.acceleration.y || 0
      if (axis === "z") value = this.motionData.acceleration.z || 0
      maxValue = 10 // m/s²
    } else if (sensor === "gyro" && this.motionData.rotation) {
      if (axis === "alpha") value = this.motionData.rotation.alpha || 0
      if (axis === "beta") value = this.motionData.rotation.beta || 0
      if (axis === "gamma") value = this.motionData.rotation.gamma || 0
      maxValue = 180 // grados
    } else if (sensor === "orientation" && this.motionData.orientation) {
      if (axis === "pitch") value = this.motionData.orientation.pitch || 0
      if (axis === "roll") value = this.motionData.orientation.roll || 0
      if (axis === "yaw") value = this.motionData.orientation.yaw || 0
      maxValue = 180 // grados
    }

    // Calcular porcentaje (valor absoluto para la barra)
    const percentage = Math.min((Math.abs(value) / maxValue) * 100, 100)
    return `${percentage}%`
  }

  isPositive(sensor: string, axis: string): boolean {
    let value = 0

    if (sensor === "accel" && this.motionData.acceleration) {
      if (axis === "x") value = this.motionData.acceleration.x || 0
      if (axis === "y") value = this.motionData.acceleration.y || 0
      if (axis === "z") value = this.motionData.acceleration.z || 0
    } else if (sensor === "gyro" && this.motionData.rotation) {
      if (axis === "alpha") value = this.motionData.rotation.alpha || 0
      if (axis === "beta") value = this.motionData.rotation.beta || 0
      if (axis === "gamma") value = this.motionData.rotation.gamma || 0
    } else if (sensor === "orientation" && this.motionData.orientation) {
      if (axis === "pitch") value = this.motionData.orientation.pitch || 0
      if (axis === "roll") value = this.motionData.orientation.roll || 0
      if (axis === "yaw") value = this.motionData.orientation.yaw || 0
    }

    return value >= 0
  }

  getCircularGradient(type: string): string {
    let degree = 0

    if (type === "alpha" && this.motionData.rotation) {
      degree = this.motionData.rotation.alpha || 0
    }

    // Normalizar a 360 grados
    degree = ((degree % 360) + 360) % 360

    return `conic-gradient(var(--secondary-color) ${degree}deg, var(--border-color) 0deg)`
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection()
  }
}

