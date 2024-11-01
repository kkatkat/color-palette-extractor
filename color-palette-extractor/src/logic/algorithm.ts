import { NumberInputProps, SwitchProps, TextInputProps } from "@mantine/core";
import { Result, RGB } from "./types";

export enum Algorithm {
    KMeans = 'k-means',
}

export type AlgorithmType = `${Algorithm}`;

export type AlgorithmDefinition<T extends Algorithm> = {
    algName: string;
    description: string;
    settings: Setting<T>[];
    train: (data: RGB[], onProgress: (prg: number) => void, settings: AlgorithmSettings<T>) => Promise<Result>;
}

export type AlgorithmSettings<T extends Algorithm> = T extends Algorithm.KMeans ? {
    k: number;
    maxIterations: number;
    tolerance: number;
    sampleSize: number;
    benchmarkMode: boolean;
    kMeansPlusPlus: boolean;
} : unknown;

export type Setting<T extends Algorithm> = {
    [K in keyof AlgorithmSettings<T>]: {
        settingName: K;
        settingType: 'number' | 'boolean' | 'string';
        startingValue: AlgorithmSettings<T>[K];
        primarySetting?: boolean;
        validate?: (value: AlgorithmSettings<T>[K]) => boolean;
        Component?: React.ElementType;
    } & (
        AlgorithmSettings<T>[K] extends number ? NumberInputProps :
        AlgorithmSettings<T>[K] extends boolean ? SwitchProps :
        AlgorithmSettings<T>[K] extends string ? TextInputProps :
        unknown
    )
}[keyof AlgorithmSettings<T>];