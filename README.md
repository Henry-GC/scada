# Sistema SCADA - Frontend React

Este repositorio contiene el frontend web de un sistema SCADA (Supervisión, Control y Adquisición de Datos) diseñado para monitorear y controlar un proceso industrial que involucra tanques (Cárcamo y Reservorio), bombas y válvulas.

## Arquitectura del Sistema

El sistema fue diseñado para operar con la siguiente arquitectura distribuida:

1.  **Frontend (Este repositorio):** Desarrollado con React, Vite y Tailwind CSS (usando shadcn/ui). Proporciona la interfaz gráfica (HMI) para los operadores, permitiendo la visualización en tiempo real de los procesos y el envío de comandos de control.
2.  **Backend / Middleware (Node-RED):** Actúa como el puente central de comunicación y procesamiento de la lógica de negocio. Expone un servidor WebSocket para interactuar bidireccionalmente con el frontend.
3.  **Hardware (PLC - Controlador Lógico Programable):** Node-RED se comunica directamente con el PLC físico en campo a través de **nodos S7** (protocolo de comunicación de Siemens S7). Node-RED lee los registros y marcas del PLC y escribe las instrucciones generadas por los operadores.

### Comunicación en Tiempo Real (WebSockets)

Para cumplir con la baja latencia requerida por una aplicación SCADA, la comunicación entre el frontend y Node-RED se realiza a través de **WebSockets**. La gestión de esta conexión se encuentra centralizada en el archivo `src/services/scadaService.js`.

-   **Endpoint de Conexión:** `ws://<hostname_actual>:1880/ws/scada`
-   **Lectura de Datos:** El frontend recibe continuamente un payload en formato JSON desde Node-RED que incluye: niveles de los tanques, estados de operación de bombas (RUN/STOP), estado de válvulas (OPEN/CLOSED), lectura de sensores (ej. sensor de obstrucción) y alarmas de salud del sistema.
-   **Escritura de Comandos:** Las acciones ejecutadas por el usuario en la UI (encender bomba, abrir válvula, poner equipo en mantenimiento) se traducen en un mensaje JSON específico y se envían por WebSocket a Node-RED. Node-RED filtra este comando y acciona el nodo S7 respectivo de escritura hacia el PLC.

## Características de la Interfaz

*   **Vista General (Overview):** Mímico interactivo del proceso industrial que ilustra el Cárcamo de Bombeo (1800 m³) y Reservorio (2500 m³), flujos en tuberías (animados mediante CSS), e indicadores de bombas y válvulas en tiempo real.
*   **Panel de Control (Control):** Permite gestionar los arranques, paros y el establecimiento en modo mantenimiento de las bombas, así como la apertura/cierre de la válvulas correspondientes.
*   **Gestión de Alarmas:** Detección y notificación en pantalla de fallos reportados por el PLC (por ejemplo, obstrucción de las mecánicas). Soporta reconocimiento (acknowledge) de averías.
*   **Tendencias (Trends):** Representación visual de datos en gráficos en tiempo real (Recharts) que reflejan el histórico inmediato del nivel de los depósitos.

## Requisitos Previos

*   **Node.js** (v18 recomendada o superior).
*   Gestor de dependencias **pnpm** (recomendado, el proyecto incluye `pnpm-lock.yaml`) o `npm`.
*   Un servidor con **Node-RED** ejecutándose en la misma red en el puerto `1880`, con los nodos pertinentes de WebSockets y Siemens S7 debidamente instalados y configurados.

## Instalación y Configuración para Desarrollo Local

1.  **Clonar este repositorio e ingresar al directorio del frontend.**
2.  **Instalar las dependencias:**
    ```bash
    pnpm install
    # o bien
    npm install
    ```
3.  **Ejecutar el servidor local de desarrollo de Vite:**
    ```bash
    pnpm run dev
    # o bien
    npm run dev
    ```
4.  **Acceso:** Abre tu navegador y accede a la URL devuelta por Vite (normalmente `http://localhost:5173`).

> **Tip para Pruebas (Mock Mode):**
> Si Node-RED y el PLC no están disponibles durante el desarrollo de UI o componentes, puedes activar el simulador local editando `src/services/scadaService.js` y cambiando la variable `USE_MOCK = true;`. Esto cargará una planta simulada matemáticamente sin requerir la conexión de WebSockets.
