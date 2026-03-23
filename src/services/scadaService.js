import { plantSimulator } from './plantSimulator';

/**
 * Unified SCADA Service Layer
 * 
 * Conectado a Node-RED via WebSocket para lectura de datos.
 */
const USE_MOCK = false; // Cambiar a true si se quiere usar el simulador local (plantSimulator)
const WS_URL = `ws://${window.location.hostname}:1880/ws/scada`;

class ScadaService {
  constructor() {
    this.listeners = new Set();

    // Estado inicial para cuando se usa Node-RED
    this.state = {
      tanks: [
        { id: 100, name: 'Cárcamo de Bombeo', level: 0, flowIn: 0, flowOut: 0 },
        { id: 200, name: 'Reservorio', level: 0, flowIn: 0, flowOut: 0 }
      ],
      pumps: [
        { id: 101, name: 'Bomba Principal', status: 'STOP', mode: 'AUTO', fault: false, maintenance: false },
        { id: 102, name: 'Bomba Secundaria', status: 'STOP', mode: 'AUTO', fault: false, maintenance: false }
      ],
      valves: [
        { id: 101, name: 'Válvula Entrada', status: 'CLOSED' },
        { id: 200, name: 'Válvula Salida', status: 'CLOSED' }
      ],
      systemHealth: 'GOOD',
      alarms: [],
      history: { tank100: [], tank200: [] },
      obstructionSensor: 0
    };

    if (USE_MOCK) {
      plantSimulator.subscribe((newState) => {
        this.notify(newState);
      });
    } else {
      this.initWebSocket();
    }
  }

  initWebSocket() {
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('Conectado a Node-RED via WebSocket en', WS_URL);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.updateStateFromNodeRed(data);
      } catch (error) {
        console.error('Error parseando datos del websocket:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket desconectado, reintentando...');
      setTimeout(() => this.initWebSocket(), 5000); // Reconnect
    };

    this.ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      this.ws.close();
    };
  }

  updateStateFromNodeRed(data) {
    // Mapeo de datos desde el payload de Node-RED al estado del UI

    // Niveles de los tanques
    if (data.nivel_carcamo !== undefined) {
      this.state.tanks[0].level = data.nivel_carcamo;
    }
    if (data.nivel_reservorio !== undefined) {
      this.state.tanks[1].level = data.nivel_reservorio;
    }

    // Estado de las bombas
    if (data.bomba_1 !== undefined) {
      this.state.pumps[0].status = data.bomba_1 ? 'RUN' : 'STOP';
    }
    if (data.bomba_2 !== undefined) {
      this.state.pumps[1].status = data.bomba_2 ? 'RUN' : 'STOP';
    }

    // Estado de las válvulas
    if (data.val_carcamo_estado !== undefined) {
      this.state.valves[0].status = data.val_carcamo_estado ? 'OPEN' : 'CLOSED';
    }
    if (data.val_reservorio_estado !== undefined) {
      this.state.valves[1].status = data.val_reservorio_estado ? 'OPEN' : 'CLOSED';
    }

    // Sensor de obstrucción
    if (data.sensor_obstruccion !== undefined) {
      this.state.obstructionSensor = data.sensor_obstruccion;
    }

    // Alarma de obstrucción
    if (data.alarma_obstruccion !== undefined) {
      if (data.alarma_obstruccion) {
        this.state.systemHealth = 'CRITICAL';
        const existingAlarm = this.state.alarms.find(a => a.id === 'obstruccion');
        if (!existingAlarm || existingAlarm.state === 'ACKNOWLEDGED') {
          this.state.alarms.unshift({
            id: 'obstruccion',
            timestamp: new Date(data.timestamp || Date.now()).toLocaleTimeString(),
            message: 'Alarma de Obstrucción Detectada',
            severity: 'CRITICAL',
            state: 'ACTIVE'
          });
        }
      } else {
        this.state.systemHealth = 'GOOD';
        // Auto-resolver alarma de obstruccion si ya no está presente
        const alarm = this.state.alarms.find(a => a.id === 'obstruccion' && a.state === 'ACTIVE');
        if (alarm) {
          alarm.state = 'RESOLVED';
        }
      }
    }

    // Actualizar historial
    const timeStr = new Date(data.timestamp || Date.now()).toLocaleTimeString();

    this.state.history.tank100.push({ time: timeStr, level: this.state.tanks[0].level });
    if (this.state.history.tank100.length > 60) this.state.history.tank100.shift();

    this.state.history.tank200.push({ time: timeStr, level: this.state.tanks[1].level });
    if (this.state.history.tank200.length > 60) this.state.history.tank200.shift();

    this.notify(this.state);
  }

  // --- Core Subscription ---

  getState() {
    if (USE_MOCK) return plantSimulator.getState();
    return this.state;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => this.listeners.delete(callback);
  }

  notify(state) {
    for (const listener of this.listeners) {
      listener(state);
    }
  }

  // --- Commands (Write to PLC) ---

  send(command, value = true) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ command, value }));
    } else {
      console.error('No hay conexión con el servidor SCADA');
    }
  }

  togglePump(action) {
    if (USE_MOCK) {
      if (typeof action === 'number') plantSimulator.togglePump(action);
      return;
    }

    const cmd = action === 'START' ? 'MARCHA_BOMBAS' : 'PARO_BOMBAS';
    this.send(cmd);
  }

  toggleValve(id, action) {
    if (USE_MOCK) {
      plantSimulator.toggleValve(id);
      return;
    }

    let targetStatus = action;
    if (!targetStatus) {
      const valve = this.state.valves.find(v => v.id === id);
      targetStatus = valve && valve.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    }

    let cmd = '';
    if (id === 101) cmd = targetStatus === 'OPEN' ? 'CARCAMO_ABRIR' : 'CARCAMO_CERRAR';
    if (id === 200) cmd = targetStatus === 'OPEN' ? 'RESERVORIO_ABRIR' : 'RESERVORIO_CERRAR';

    if (cmd) this.send(cmd);
  }

  changePumpMode(id, mode) {
    if (USE_MOCK) plantSimulator.changePumpMode(id, mode);
    else console.log('Escritura websocket omitida por ahora (changePumpMode)', id, mode);
  }

  simulateFault(id) {
    if (USE_MOCK) plantSimulator.simulateFault(id);
  }

  toggleMaintenance(id) {
    if (USE_MOCK) {
      plantSimulator.toggleMaintenance(id);
    } else {
      const pump = this.state.pumps.find(p => p.id === id);
      if (pump) {
        pump.maintenance = !pump.maintenance;
        this.notify(this.state);
        this.send(id === 101 ? 'MANTENIMIENTO_BOMBA_1' : 'MANTENIMIENTO_BOMBA_2', pump.maintenance);
      }
    }
  }

  acknowledgeAlarm(id) {
    if (USE_MOCK) plantSimulator.acknowledgeAlarm(id);
    else {
      const a = this.state.alarms.find(a => a.id === id);
      if (a) {
        a.state = 'ACKNOWLEDGED';
        this.notify(this.state);
      }
    }
  }
}

export const scadaService = new ScadaService();
