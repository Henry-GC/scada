import { plantSimulator } from './plantSimulator';

/**
 * Unified SCADA Service Layer
 * 
 * In the future, you can swap `USE_MOCK` to `false` and implement the 
 * WebSocket bindings inside the `else` blocks to connect to Node-RED.
 */
const USE_MOCK = true; // Toggle this when WebSockets are ready

class ScadaService {
  constructor() {
    this.listeners = new Set();
    
    // If using mock, subscribe to simulator changes and pipe them here
    if (USE_MOCK) {
      plantSimulator.subscribe((newState) => {
        this.notify(newState);
      });
    } else {
      // TODO: Initialize WebSocket connection (e.g. socket.io, native ws)
      // socket.on('message', (data) => this.notify(JSON.parse(data)))
    }
  }

  // --- Core Subscription ---
  
  getState() {
    if (USE_MOCK) return plantSimulator.getState();
    // TODO: Return last known WS state
    return {}; 
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

  togglePump(id) {
    if (USE_MOCK) plantSimulator.togglePump(id);
    // else socket.send(JSON.stringify({ cmd: 'togglePump', id }))
  }

  toggleValve(id) {
    if (USE_MOCK) plantSimulator.toggleValve(id);
    // else socket.send(...)
  }

  changePumpMode(id, mode) {
    if (USE_MOCK) plantSimulator.changePumpMode(id, mode);
  }

  simulateFault(id) {
    if (USE_MOCK) plantSimulator.simulateFault(id);
  }

  toggleMaintenance(id) {
    if (USE_MOCK) plantSimulator.toggleMaintenance(id);
  }

  acknowledgeAlarm(id) {
    if (USE_MOCK) plantSimulator.acknowledgeAlarm(id);
  }
}

export const scadaService = new ScadaService();
