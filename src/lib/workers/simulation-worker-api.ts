import * as Comlink from 'comlink';
import type { SimulationWorkerAPI } from './simulation.worker';

let worker: Worker | null = null;
let workerAPI: Comlink.Remote<SimulationWorkerAPI> | null = null;
let workers: Worker[] = [];
let workerAPIs: Comlink.Remote<SimulationWorkerAPI>[] = [];

export function getSimulationWorker(): Comlink.Remote<SimulationWorkerAPI> {
  if (!worker) {
    worker = new Worker(new URL('./simulation.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerAPI = Comlink.wrap<SimulationWorkerAPI>(worker);
  }
  return workerAPI!;
}

export function releaseSimulationWorker(): void {
  if (workerAPI) {
    workerAPI[Comlink.releaseProxy]();
    workerAPI = null;
  }
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

export function createWorkerPool(size: number): Comlink.Remote<SimulationWorkerAPI>[] {
  releaseWorkerPool();

  workers = [];
  workerAPIs = [];

  for (let i = 0; i < size; i++) {
    const worker = new Worker(new URL('./simulation.worker.ts', import.meta.url), { type: 'module' });
    const api = Comlink.wrap<SimulationWorkerAPI>(worker);

    workers.push(worker);
    workerAPIs.push(api);
  }

  return workerAPIs;
}

export function releaseWorkerPool(): void {
  workerAPIs.forEach((api) => api[Comlink.releaseProxy]());
  workerAPIs = [];

  workers.forEach((w) => w.terminate());
  workers = [];
}
