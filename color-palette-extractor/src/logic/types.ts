export type RGB = [number, number, number];

export type Settings = {
    colorCount: number;
    maxIterations: number;
    tolerance: number;
    sampleSize: number;
    benchmarkMode: boolean;
};

export type Result = {
    palette: RGB[];
    benchmarkScore?: number;
}

export type WorkerMessage = 
    | { type: 'progress'; payload: number }
    | { type: 'result'; payload: Result };


