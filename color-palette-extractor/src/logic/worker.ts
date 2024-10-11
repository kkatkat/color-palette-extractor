import KMeans from "./kmeans";
import { Result, RGB, Settings } from "./types";

self.onmessage = async (event: MessageEvent<Settings & { data: RGB[] }>) => {
    const { data, colorCount, maxIterations, tolerance, sampleSize, benchmarkMode } = event.data;

    const kmeans = new KMeans(colorCount, maxIterations, tolerance, sampleSize, benchmarkMode);

    const start = performance.now();

    const { palette, clusters } = await kmeans.fit(data, (progress) => {
        self.postMessage({ type: 'progress', payload: progress });
    });

    const end = performance.now();

    const benchmarkScore = benchmarkMode ? end - start : undefined;

    self.postMessage({ type: 'result', payload: { palette, clusters, benchmarkScore } as Result });
};