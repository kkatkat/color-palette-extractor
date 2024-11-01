import { ComponentType } from "react";
import { Algorithm } from "./algorithm";

export type RGB = [number, number, number];

export type Result = {
    palette: RGB[];
    clusters: RGB[][];
    algorithm: Algorithm;
    benchmarkScore?: number;
}

export type WorkerMessage = 
    | { type: 'progress'; payload: number }
    | { type: 'result'; payload: Result };

export type AppPlugin = {
    name: string;
    description: string;
    author: string;
    icon: ComponentType;
    Component: ComponentType;
    allowedAlgorithms?: Set<Algorithm>
}

