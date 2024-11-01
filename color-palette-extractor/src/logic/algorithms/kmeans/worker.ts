import { Algorithm, AlgorithmSettings } from "../../algorithm";
import KMeans from "./kmeans";
import { Result, RGB } from "../../types";

self.onmessage = async (event: MessageEvent<{settings: AlgorithmSettings<Algorithm> } & { data: RGB[] }>) => {
    const { data, settings } = event.data;

    const kmeans = new KMeans(settings);

    const start = performance.now();

    const result = await kmeans.fit(data, (progress) => {
        self.postMessage({ type: 'progress', payload: progress });
    });

    const end = performance.now();

    const benchmarkScore = settings.benchmarkMode ? end - start : undefined;

    self.postMessage({ type: 'result', payload: { ...result, benchmarkScore } as Result });
};