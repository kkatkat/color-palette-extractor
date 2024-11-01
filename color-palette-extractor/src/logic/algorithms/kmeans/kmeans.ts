import { Algorithm, AlgorithmSettings } from '../../algorithm';
import { euclideanDistance, randomInt } from "../../functions";
import { Result, RGB, WorkerMessage } from "../../types";

const BENCHMARK_CENTROIDS: RGB[] = [
    [255, 255, 255],
    [0, 0, 0],
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
];

export default class KMeans {
    private maxIterations: number;
    private k: number;
    private tolerance: number;
    private sampleSize: number;
    private centroids: RGB[];
    private clusters: RGB[][];
    
    constructor({k = 5, maxIterations = 100, tolerance = 0.001, sampleSize = 1, benchmarkMode = false}: AlgorithmSettings<Algorithm.KMeans>) {
        this.k = k;
        this.maxIterations = maxIterations;
        this.tolerance = tolerance;
        this.sampleSize = sampleSize;
        this.centroids = benchmarkMode ? BENCHMARK_CENTROIDS : [];
        this.clusters = [];
    }

    async fit(data: RGB[], progressCallback?: (progress: number) => void): Promise<Result> {
        data = await this.resample(data);

        // Initialize centroids if not provided (by benchmark mode = true)
        if (!this.centroids.length) {
            for (let i = 0; i < this.k; i++) {
                this.centroids[i] = data[randomInt(0, data.length - 1)];
            }
        }

        for (let i = 0; i < this.maxIterations; i++) {
            //console.log('Iteration:', i + 1);

            for (let j = 0; j < this.k; j++) {
                this.clusters[j] = [];
            }

            for (const pixel of data) {
                const distances = this.centroids.map((centroid) => euclideanDistance(centroid, pixel));
                const closestCentroidIndex = distances.indexOf(Math.min(...distances));

                this.clusters[closestCentroidIndex].push(pixel);
            }

            const oldCentroids = this.centroids.slice();

            // Calculate new centroids
            for (let i = 0; i < this.k; i++) {
                const cluster = this.clusters[i];

                if (cluster.length) {
                    const r = cluster.map((pixel) => pixel[0]).reduce((a, b) => a + b) / cluster.length;
                    const g = cluster.map((pixel) => pixel[1]).reduce((a, b) => a + b) / cluster.length;
                    const b = cluster.map((pixel) => pixel[2]).reduce((a, b) => a + b) / cluster.length;

                    this.centroids[i] = [r, g, b] as RGB;
                }
            }

            // Early stopping
            let converged = true;
            for (let i = 0; i < this.k; i++) {
                const dist = euclideanDistance(oldCentroids[i], this.centroids[i]);
                
                //console.log(dist)

                if (dist > this.tolerance) {
                    converged = false;
                }
            }

            // Report progress
            if (progressCallback) {
                progressCallback(converged ? 1 : (i + 1) / this.maxIterations);
            }

            if (converged || i === this.maxIterations - 1) {
                return { palette: this.centroids, clusters: this.clusters, algorithm: Algorithm.KMeans };
            }
        }

        return { palette: this.centroids, clusters: this.clusters, algorithm: Algorithm.KMeans };
    };

    private async resample(data: RGB[]) {
        console.log('Number of pixels:', data.length);

        if (this.sampleSize === 1) {
            return data;
        }

        const sampleAmount = Math.floor(this.sampleSize * data.length);

        const sample = [];

        for (let i = 0; i < sampleAmount; i++) {
            sample.push(data[randomInt(0, data.length - 1)]);
        }

        console.log('Number of pixels after resampling:', sample.length);

        return sample;
    }
}

export async function trainKMeans(data: RGB[], onProgress: (progress: number) => void, settings: AlgorithmSettings<Algorithm.KMeans>): Promise<Result> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('./worker.ts', import.meta.url), {
            type: 'module',
        });
        
        worker.postMessage({ 
            data, 
            settings,
        });

        worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
            if (event.data.type === 'progress' && onProgress) {
                onProgress(event.data.payload);
            } else if (event.data.type === 'result') {
                resolve(event.data.payload);
                worker.terminate();
            }
        };

        worker.onerror = (error) => {
            reject(error);
            worker.terminate();
        };
    });
}