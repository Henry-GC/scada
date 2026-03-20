import { useState, useEffect } from 'react';
import { scadaService } from '../services/scadaService';

export function usePlantData() {
  const [data, setData] = useState(scadaService.getState());

  useEffect(() => {
    const unsubscribe = scadaService.subscribe((newState) => {
      setData({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  return {
    ...data,
    togglePump: (id) => scadaService.togglePump(id),
    toggleValve: (id) => scadaService.toggleValve(id),
    changePumpMode: (id, mode) => scadaService.changePumpMode(id, mode),
    simulateFault: (id) => scadaService.simulateFault(id),
    toggleMaintenance: (id) => scadaService.toggleMaintenance(id),
    acknowledgeAlarm: (id) => scadaService.acknowledgeAlarm(id),
  };
}
