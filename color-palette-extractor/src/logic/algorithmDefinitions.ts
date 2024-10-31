import { Algorithm, AlgorithmSettings, Setting } from "./algorithm";
import { Result, RGB } from "./types";

export type AlgorithmDefinition<T extends Algorithm> = {
    algName: string;
    description: string;
    settings: Setting<T>[];
    train: (data: RGB[], onProgress: (prg: number) => void, settings: AlgorithmSettings<T>) => Promise<Result>;
}

export const algorithmDefinitions: Record<Algorithm, AlgorithmDefinition<Algorithm>> = {
    'k-means': {
        algName: 'K-means',
        description: 'A simple clustering algorithm that partitions data into k number of clusters.',
        train: () => new Promise(() => { }),
        settings: [{
            settingName: 'k',
            primarySetting: true,
            startingValue: 5,
            //
            placeholder: 'Number of colors',
            min: 1,
            max: 1000,
            flex: 1,
            allowDecimal: true,
            allowLeadingZeros: false,
            allowNegative: false,
            decimalScale: 0,
            clampBehavior: 'strict',
        },
        {
            settingName: 'maxIterations',
            startingValue: 100,
            //
            allowDecimal: false,
            allowLeadingZeros: false,
            allowNegative: false,
            decimalScale: 0,
            clampBehavior: 'strict',
            min: 1,
            max: 10000,
        },
        {
            settingName: 'tolerance',
            startingValue: 0.001,
            //
            allowDecimal: true,
            fixedDecimalScale: true,
            allowNegative: false,
            decimalScale: 3,
            clampBehavior: 'strict',
            min: 0,
            max: 100,
            step: 0.001,
        },
        {
            settingName: 'kMeansPlusPlus',
            startingValue: true,
            //
            label: 'Use k-means++',
            description: 'Use k-means++ initialization algorithm to improve the quality of the clusters.',
        }
    ]
    },
}
