import { NumberInputProps, SwitchProps, TextInputProps } from "@mantine/core";
import { Result, RGB } from "./types";

export enum Algorithm {
    KMeans = 'k-means',
}

export type AlgorithmType = `${Algorithm}`;

export type AlgorithmDefinition<T extends Algorithm> = {
    algName: string;
    description: string;
    benchmarkSettings: AlgorithmSettings<T> & { benchmarkMode: true };
    settings: Setting<T>[];
    train: (data: RGB[], onProgress: (prg: number) => void, settings: AlgorithmSettings<T>) => Promise<Result<T>>;
}

export type CommonAlgorithmSettings = {
    benchmarkMode: boolean;
}

export type AlgorithmSettings<T extends Algorithm> = CommonAlgorithmSettings & (T extends Algorithm.KMeans ? {
    k: number;
    maxIterations: number;
    tolerance: number;
    sampleSize: number;
    kMeansPlusPlus: boolean;
} : unknown)

export type Setting<T extends Algorithm = Algorithm> = {
    [K in keyof AlgorithmSettings<T>]: {
        settingName: K;
        settingType: 'number' | 'boolean' | 'string';
        startingValue: AlgorithmSettings<T>[K];
        primarySetting?: boolean;
        validate?: (value: AlgorithmSettings<T>[K]) => boolean;
        componentProps?: AlgorithmSettings<T>[K] extends number ? NumberInputProps :
                         AlgorithmSettings<T>[K] extends boolean ? SwitchProps :
                         AlgorithmSettings<T>[K] extends string ? TextInputProps :
                         object;
        Component?: React.ElementType;
    }
}[keyof AlgorithmSettings<T>];