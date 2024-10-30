import { ComponentType } from "react";
import { Algorithm } from "./algorithm";

export type RGB = [number, number, number];

export type Settings = {
    colorCount: number;
    maxIterations: number;
    tolerance: number;
    sampleSize: number;
    benchmarkMode: boolean;
};

export type Result = {
    palette: RGB[];
    clusters: RGB[][];
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

