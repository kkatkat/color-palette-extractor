import { AlgorithmDefinition, Algorithm } from "./algorithm";
import kmeans from "./algorithms/kmeans/schema";

const algorithmDefinitions: { [K in Algorithm]: AlgorithmDefinition<K> } = {
    'k-means': kmeans,
}

export { algorithmDefinitions };