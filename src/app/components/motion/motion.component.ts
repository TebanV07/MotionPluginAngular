import { Component, OnInit, OnDestroy } from "@angular/core"
import { MotionService } from "./Services/motion.service"
import { MotionData } from "./Model/MotionData.model"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-motion",
  templateUrl: "./motion.component.html",
  styleUrls: ["./motion.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class MotionComponent implements OnInit, OnDestroy {
  motionData: MotionData = {}
  orientationMatrix: number[] = []
  isDarkMode = false
  showMatrix = false

  // Step counter variables
  stepCount = 0
  lastAcceleration = 0
  accelerationThreshold = 1.2 // Threshold to detect a step (m/s²)
  lastStepTime = 0
  minStepInterval = 300 // Minimum time between steps (ms)

  // Add these properties to the class
  orientationScaleFactor = 0.5 // Factor para reducir la sensibilidad del movimiento
  smoothedOrientation = { pitch: 0, roll: 0, yaw: 0 }
  smoothingFactor = 0.2 // Factor de suavizado (0-1), valores más bajos = más suavizado

  constructor(private motionS: MotionService) {
    // Detectar preferencia de tema del sistema
    this.isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  ngOnInit(): void {
    this.motionS.startMotionDetection((data: MotionData) => {
      this.motionData = data
      this.updateOrientationMatrix()
      this.smoothOrientation()
      this.detectStep()
    })
  }

  private detectStep(): void {
    if (!this.motionData.acceleration) return

    // Calculate the magnitude of acceleration (excluding gravity)
    const { x = 0, y = 0, z = 0 } = this.motionData.acceleration
    const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z)

    const currentTime = Date.now()

    // Detect a step when:
    // 1. Acceleration crosses the threshold (from below to above)
    // 2. Enough time has passed since the last step (to avoid counting bounces)
    if (
      this.lastAcceleration < this.accelerationThreshold &&
      accelerationMagnitude >= this.accelerationThreshold &&
      currentTime - this.lastStepTime > this.minStepInterval
    ) {
      this.stepCount++
      this.lastStepTime = currentTime
    }

    this.lastAcceleration = accelerationMagnitude
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

  // Add this method after updateOrientationMatrix()
  private smoothOrientation(): void {
    if (!this.motionData.orientation) return

    const { pitch = 0, roll = 0, yaw = 0 } = this.motionData.orientation

    // Aplicar suavizado a los valores de orientación
    this.smoothedOrientation.pitch =
      this.smoothedOrientation.pitch * (1 - this.smoothingFactor) + pitch * this.smoothingFactor
    this.smoothedOrientation.roll =
      this.smoothedOrientation.roll * (1 - this.smoothingFactor) + roll * this.smoothingFactor
    this.smoothedOrientation.yaw =
      this.smoothedOrientation.yaw * (1 - this.smoothingFactor) + yaw * this.smoothingFactor
  }

  // Add this method to get scaled orientation values for the 3D model
  getScaledOrientation(axis: string): number {
    if (axis === "pitch") {
      return this.smoothedOrientation.pitch * this.orientationScaleFactor
    } else if (axis === "roll") {
      return this.smoothedOrientation.roll * this.orientationScaleFactor
    } else if (axis === "yaw") {
      return this.smoothedOrientation.yaw * this.orientationScaleFactor
    }
    return 0
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode
  }

  toggleMatrix(): void {
    this.showMatrix = !this.showMatrix
  }

  resetStepCount(): void {
    this.stepCount = 0
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

  // Calcular la magnitud de aceleración para el podómetro
  getAccelerationMagnitude(): number {
    if (!this.motionData.acceleration) return 0

    const { x = 0, y = 0, z = 0 } = this.motionData.acceleration
    return Math.sqrt(x * x + y * y + z * z)
  }

  // Add this method to your component class
  formatNumber(value: number | undefined, format: string): string {
    if (value === undefined) return "0.00"

    // Parse the format string to determine decimal places
    const parts = format.split("-")
    const minDecimals = Number.parseInt(parts[1], 10) || 0
    const maxDecimals = Number.parseInt(parts[2], 10) || 0

    return value.toFixed(maxDecimals)
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection()
  }
}

