import { ComponentType } from "react";
import { Algorithm } from "./algorithm";

export type RGB = [number, number, number];

export type Result<T extends Algorithm> = {
    algorithm: Algorithm;
    benchmarkScore?: number;
} & (T extends Algorithm.KMeans ? {
    palette: RGB[];
    clusters: RGB[][];
} : unknown);

export type WorkerMessage = 
    | { type: 'progress'; payload: number }
    | { type: 'result'; payload: Result<Algorithm> };

export type AppPlugin = {
    name: string;
    description: string;
    author: string;
    icon: ComponentType;
    Component: ComponentType;
    allowedAlgorithms?: Set<Algorithm>
}

