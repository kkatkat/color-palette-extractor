import { NumberInputProps, SwitchProps, TextInputProps } from "@mantine/core";

export enum Algorithm {
    KMeans = 'k-means',
}

export type AlgorithmSettings<T extends Algorithm> = T extends Algorithm.KMeans ? {
    k: number;
    maxIterations: number;
    tolerance: number;
    sampleSize: number;
    benchmarkMode: boolean;
    kMeansPlusPlus: boolean;
} : never;

export type Setting<T extends Algorithm> = {
    [K in keyof AlgorithmSettings<T>]: {
        settingName: K;
        startingValue: AlgorithmSettings<T>[K];
        primarySetting?: boolean;
        Component?: React.ElementType;
    } & (
        AlgorithmSettings<T>[K] extends number ? NumberInputProps :
        AlgorithmSettings<T>[K] extends boolean ? SwitchProps :
        AlgorithmSettings<T>[K] extends string ? TextInputProps :
        unknown
    )
}[keyof AlgorithmSettings<T>];