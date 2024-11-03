import { AlgorithmDefinition, Algorithm } from "./algorithm";
import kmeans from "./algorithms/kmeans/schema";

const algorithmDefinitions: Record<Algorithm, AlgorithmDefinition<Algorithm>> = {
    'k-means': kmeans,
}

export { algorithmDefinitions };