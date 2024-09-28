export type RGB = [number, number, number];

export type Settings = {
    colorCount: number;
    maxIterations: number;
    tolerance: number;
    sampleSize: number;
}

export type WorkerMessage = 
    | { type: 'progress'; payload: number }
    | { type: 'result'; payload: RGB[] };
