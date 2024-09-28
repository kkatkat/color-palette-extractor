import KMeans from "./kmeans";
import { RGB, Settings } from "./types";

self.onmessage = async (event: MessageEvent<Settings & { data: RGB[] }>) => {
    const { data, colorCount, maxIterations, tolerance, sampleSize } = event.data;

    const kmeans = new KMeans(colorCount, maxIterations, tolerance, sampleSize);

    const centroids = await kmeans.fit(data, (progress) => {
        self.postMessage({ type: 'progress', payload: progress });
    });

    self.postMessage({ type: 'result', payload: centroids });
};