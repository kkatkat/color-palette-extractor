import KMeans from "./kmeans";

self.onmessage = async (event) => {
    const { data, k, maxIterations, tolerance } = event.data;
    const kmeans = new KMeans(k, maxIterations, tolerance);

    const centroids = await kmeans.fit(data, (progress) => {
        self.postMessage({ type: 'progress', payload: progress });
    });

    self.postMessage({ type: 'result', payload: centroids });
};