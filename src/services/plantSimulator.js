class PlantSimulator {
  constructor() {
    this.state = {
      tanks: [
        { id: 100, name: 'Tanque Agua Bruta', level: 0, flowIn: 0, flowOut: 0 },
        { id: 200, name: 'Tanque Agua Tratada', level: 100, flowIn: 0, flowOut: 0 }
      ],
      pumps: [
        { id: 101, name: 'Bomba Transferencia 1', status: 'STOP', mode: 'AUTO', fault: false, maintenance: false },
        { id: 102, name: 'Bomba Respaldo 2', status: 'STOP', mode: 'AUTO', fault: false, maintenance: false }
      ],
      valves: [
        { id: 101, name: 'Válvula Entrada', status: 'CLOSED' },
        { id: 200, name: 'Válvula Salida', status: 'CLOSED' }
      ],
      systemHealth: 'GOOD',
      alarms: []
    };
    this.listeners = new Set();
    this.intervalId = null;
    this.history = { tank100: [], tank200: [] };
    
    // Seed initial history
    const now = Date.now();
    for (let i = 60; i >= 0; i--) {
      this.history.tank100.push({ time: new Date(now - i * 1000).toLocaleTimeString(), level: 0 });
      this.history.tank200.push({ time: new Date(now - i * 1000).toLocaleTimeString(), level: 100 });
    }

    this.startSimulation();
  }

  // --- Exposed Interface ---

  getState() {
    return { ...this.state, history: this.history };
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const listener of this.listeners) listener(this.getState());
  }

  togglePump(id) {
    const p = this.state.pumps.find(p => p.id === id);
    if (p && !p.fault && !p.maintenance) {
      p.status = p.status === 'RUN' ? 'STOP' : 'RUN';
      this.notify();
    }
  }

  toggleValve(id) {
    const v = this.state.valves.find(v => v.id === id);
    if (v) {
      v.status = v.status === 'OPEN' ? 'CLOSED' : 'OPEN';
      this.notify();
    }
  }

  changePumpMode(id, mode) {
    const p = this.state.pumps.find(p => p.id === id);
    if (p) {
      p.mode = mode;
      // If switching to MANUAL, ensure safety stop
      if (mode === 'MANUAL') p.status = 'STOP';
      this.notify();
    }
  }

  simulateFault(id) {
    const p = this.state.pumps.find(p => p.id === id);
    if (p) {
      p.fault = !p.fault;
      if (p.fault) {
        p.status = 'STOP';
        this.addAlarm(`P-${id} Fault Detected`, 'CRITICAL');
      }
      this.notify();
    }
  }

  toggleMaintenance(id) {
    const p = this.state.pumps.find(p => p.id === id);
    if (p) {
      p.maintenance = !p.maintenance;
      if (p.maintenance) {
        p.status = 'STOP';
        p.mode = 'MANUAL'; // Force manual so auto logic ignores it
        this.addAlarm(`P-${id} Lockout for Maintenance`, 'WARNING');
      }
      this.notify();
    }
  }

  addAlarm(message, severity) {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    this.state.alarms.unshift({
      id, timestamp: new Date().toLocaleTimeString(), message, severity, state: 'ACTIVE'
    });
    if (this.state.alarms.length > 50) this.state.alarms.pop();
  }

  acknowledgeAlarm(id) {
    const a = this.state.alarms.find(a => a.id === id);
    if (a) { a.state = 'ACKNOWLEDGED'; this.notify(); }
  }

  // --- Core Simulation Loop ---

  startSimulation() {
    this.intervalId = setInterval(() => {
      const t100 = this.state.tanks[0];
      const t200 = this.state.tanks[1];
      const p101 = this.state.pumps[0]; // Main
      const p102 = this.state.pumps[1]; // Backup
      const v101 = this.state.valves[0];
      const v200 = this.state.valves[1];

      // Physical Model Logic
      t100.flowIn = v101.status === 'OPEN' ? 12 : 0;
      
      let transferRate = 0;
      let activePumpsCount = 0;
      if (p101.status === 'RUN') activePumpsCount++;
      if (p102.status === 'RUN') activePumpsCount++;

      // Combined logic (if both run, more water is moved, up to a limit)
      if (activePumpsCount > 0) {
        if (t100.level > 0.5) transferRate = 8 * activePumpsCount;
        else if (t100.level > 0) transferRate = t100.level * 10;
      }
      
      t100.flowOut = transferRate;
      t200.flowIn = transferRate;
      t200.flowOut = v200.status === 'OPEN' ? 10 : 0;

      // Integration
      t100.level = Math.max(0, Math.min(100, t100.level + (t100.flowIn - t100.flowOut) * 0.1));
      t200.level = Math.max(0, Math.min(100, t200.level + (t200.flowIn - t200.flowOut) * 0.1));

      // Automated Level Alarms
      this.state.tanks.forEach(tank => {
        if (tank.level > 90) {
          if (!this.state.alarms.find(a => a.message.includes(`T-${tank.id} High`) && a.state === 'ACTIVE')) {
            this.addAlarm(`T-${tank.id} High Level (>90%)`, 'CRITICAL');
          }
        } else if (tank.level < 10) {
          if (!this.state.alarms.find(a => a.message.includes(`T-${tank.id} Low`) && a.state === 'ACTIVE')) {
            this.addAlarm(`T-${tank.id} Low Level (<10%)`, 'WARNING');
          }
        }
      });

      // ============================================
      // FAILOVER / AUTO MODE LOGIC
      // ============================================
      
      // Determine if the system DEMANDS water transfer
      const needsWaterTransfer = t100.level > 10 && t200.level < 80;
      const mustStopTransfer = t100.level < 5 || t200.level > 95;

      const p101Available = p101.mode === 'AUTO' && !p101.fault && !p101.maintenance;
      const p102Available = p102.mode === 'AUTO' && !p102.fault && !p102.maintenance;

      // Stop condition always overrides
      if (mustStopTransfer) {
        if (p101.mode === 'AUTO' && p101.status === 'RUN') p101.status = 'STOP';
        if (p102.mode === 'AUTO' && p102.status === 'RUN') p102.status = 'STOP';
      } else if (needsWaterTransfer) {
        // Try to run P-101 (Main)
        if (p101Available) {
          if (p101.status === 'STOP') p101.status = 'RUN';
          // Ensure P-102 is off if P-101 handles everything gracefully
          if (p102.mode === 'AUTO' && p102.status === 'RUN') p102.status = 'STOP';
        }
        // If P-101 unavailable cleanly, kick in P-102
        else if (p102Available) {
          if (p102.status === 'STOP') {
             p102.status = 'RUN';
             this.addAlarm('P-102 Backup Engaged (Failover)', 'WARNING');
          }
        }
      }

      // Record History
      const timeStr = new Date().toLocaleTimeString();
      this.history.tank100.push({ time: timeStr, level: Number(t100.level.toFixed(1)) });
      if (this.history.tank100.length > 60) this.history.tank100.shift();

      this.history.tank200.push({ time: timeStr, level: Number(t200.level.toFixed(1)) });
      if (this.history.tank200.length > 60) this.history.tank200.shift();

      // System Health evaluation based on alarms
      const activeCritical = this.state.alarms.some(a => a.severity === 'CRITICAL' && a.state === 'ACTIVE');
      const activeWarns = this.state.alarms.some(a => a.severity === 'WARNING' && a.state === 'ACTIVE');
      
      if (activeCritical) this.state.systemHealth = 'CRITICAL';
      else if (activeWarns) this.state.systemHealth = 'WARNING';
      else this.state.systemHealth = 'GOOD';

      this.notify();
    }, 1000);
  }

  stopSimulation() {
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
  }
}

export const plantSimulator = new PlantSimulator();
