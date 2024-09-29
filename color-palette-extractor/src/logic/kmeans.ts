import { euclideanDistance, randomInt } from "./functions";
import { RGB, WorkerMessage } from "./types";

export default class KMeans {
    private maxIterations: number;
    private k: number;
    private tolerance: number;
    private sampleSize: number;
    private centroids: RGB[];
    private clusters: RGB[][];
    
    constructor(k: number = 5, maxIterations: number = 100, tolerance: number = 0.001, sampleSize: number = 1) {
        this.k = k;
        this.maxIterations = maxIterations;
        this.tolerance = tolerance;
        this.sampleSize = sampleSize;
        this.centroids = [];
        this.clusters = [];
    }

    async fit(data: RGB[], progressCallback?: (progress: number) => void): Promise<RGB[]> {
        data = await this.resample(data);

        // Initialize centroids
        for (let i = 0; i < this.k; i++) {
            this.centroids[i] = data[randomInt(0, data.length - 1)];
        }

        for (let i = 0; i < this.maxIterations; i++) {
            console.log('Iteration:', i + 1);

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
                
                console.log(dist)

                if (dist > this.tolerance) {
                    converged = false;
                }
            }

            // Report progress
            if (progressCallback) {
                progressCallback(converged ? 1 : (i + 1) / this.maxIterations);
            }

            if (converged || i === this.maxIterations - 1) {
                return this.centroids;
            }
        }

        return this.centroids;
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

export async function trainKMeans(data: RGB[], colorCount?: number, maxIterations?: number, tolerance?: number, sampleSize?: number, onProgress?: (progress: number) => void): Promise<RGB[]> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('./worker.ts', import.meta.url), {
            type: 'module',
        });
        worker.postMessage({ data, colorCount, maxIterations, tolerance, sampleSize });

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