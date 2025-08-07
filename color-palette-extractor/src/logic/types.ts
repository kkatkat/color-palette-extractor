import { ComponentType } from "react";
import { Algorithm } from "./algorithm";

export type RGB = [number, number, number];

export type CommonResult = {
    algorithm: Algorithm;
    palette: RGB[];
    benchmarkScore?: number;
}

export type KMeansResult = CommonResult & {
    clusters: RGB[][];
}

export type Result<T extends Algorithm = Algorithm> =
    T extends Algorithm.KMeans ? KMeansResult :
    never;

export type WorkerMessage<T extends Algorithm> = 
    | { type: 'progress'; payload: number }
    | { type: 'result'; payload: Result<T> };

export type AppPlugin = {
    name: string;
    description: string;
    author: string;
    icon: ComponentType;
    Component: ComponentType;
    allowedAlgorithms?: Set<Algorithm>
}

