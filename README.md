# Proyecto Sensores de Movimiento Angular

Este proyecto proporciona un componente y servicio reutilizable para acceder a los datos del acelerómetro y giroscopio del dispositivo en aplicaciones móviles. Es un recurso educativo diseñado para clases de programación móvil, permitiendo a los estudiantes implementar funcionalidades basadas en el movimiento y rotación del dispositivo.

## Descripción

El proyecto incluye:
- Un componente Angular que muestra los datos del acelerómetro (x, y, z) y giroscopio (alpha, beta, gamma)
- Un servicio que maneja la comunicación con los sensores del dispositivo
- Implementación usando Capacitor para acceso nativo al hardware
- Interfaz organizada para visualizar datos de ambos sensores en tiempo real

## Instalación

### Requisitos Previos
- Node.js y npm instalados
- Angular CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd ProyectAcelerometer
```

2. Instalar dependencias:
```bash
npm install
```

### Configuración para Android

1. Construir el proyecto:
```bash
ng build
npx cap add android
npx cap sync
```

2. Abrir en Android Studio:
```bash
npx cap open android
```

3. Ejecutar la aplicación desde Android Studio

### Configuración para iOS

1. Construir el proyecto:
```bash
ng build
npx cap add ios
npx cap sync
```

2. Abrir en Xcode:
```bash
npx cap open ios
```

3. Ejecutar la aplicación desde Xcode

## Implementación del Componente y Servicio

1. Copiar el servicio del acelerómetro de `src/app/Services/` a tu proyecto
2. Copiar el componente de `src/app/app.component.*` a tu proyecto
3. Importar y configurar en tu módulo/componente principal

## Ideas de Aplicaciones

### 1. Contador de Pasos Simple
Una aplicación básica que utiliza el acelerómetro para contar pasos. Ideal para aprender a procesar datos del acelerómetro y establecer umbrales de detección de movimiento. Perfecto como primer proyecto para entender el funcionamiento de los sensores.

### 2. Rotador de Imágenes
Una aplicación que rota una imagen según la orientación del dispositivo usando el giroscopio. Excelente para aprender sobre los eventos de orientación y transformaciones básicas de elementos en pantalla.


### 3. Medidor de Ángulos
Una aplicación básica que muestra el ángulo de inclinación del dispositivo. Usa el acelerómetro para calcular ángulos simples. Ideal para practicar operaciones matemáticas básicas con datos de sensores.


## Contribución

Este proyecto está diseñado como recurso educativo. Se anima a los estudiantes a experimentar, modificar y mejorar el código base para sus propios proyectos.

## Licencia

Este proyecto está disponible como recurso educativo de libre uso.