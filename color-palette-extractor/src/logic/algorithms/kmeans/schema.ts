import { Algorithm, AlgorithmDefinition } from "../../algorithm";
import { trainKMeans } from "./kmeans";

const schema: AlgorithmDefinition<Algorithm.KMeans> = {
    algName: 'K-means',
    description: 'A simple clustering algorithm that partitions data into k number of clusters.',
    train: trainKMeans,
    benchmarkSettings: {
        k: 5,
        maxIterations: 40,
        sampleSize: 1.00,
        tolerance: 0,
        kMeansPlusPlus: false,
        benchmarkMode: true,
    },
    settings: [{
        settingName: 'k',
        settingType: 'number',
        primarySetting: true,
        startingValue: 5,
        validate: (value: number) => +value > 0,
        componentProps: {
            placeholder: 'Number of colors',
            min: 1,
            max: 1000,
            flex: 1,
            allowDecimal: true,
            allowLeadingZeros: false,
            allowNegative: false,
            decimalScale: 0,
            clampBehavior: 'strict',
        }
    },
    {
        settingName: 'maxIterations',
        settingType: 'number',
        startingValue: 100,
        validate: (value: number) => value > 0,
        componentProps: {
            description: 'Maximum number of iterations before the algorithm stops (it may stop earlier if the centroids converge).',
            label: 'Max iterations',
            allowDecimal: false,
            allowLeadingZeros: false,
            allowNegative: false,
            decimalScale: 0,
            clampBehavior: 'strict',
            min: 1,
            max: 10000,
        }
    },
    {
        settingName: 'tolerance',
        settingType: 'number',
        startingValue: 0.001,
        validate: (value: number) => value >= 0,
        componentProps: {
            description: 'Minimum change in the centroids to continue the iterations.',
            label: 'Tolerance',
            allowDecimal: true,
            fixedDecimalScale: true,
            allowNegative: false,
            decimalScale: 3,
            clampBehavior: 'strict',
            min: 0,
            max: 100,
            step: 0.001,
        }
    },
    {
        settingName: 'sampleSize',
        settingType: 'number',
        startingValue: 1,
        validate: (value: number) => value > 0 && value <= 1,
        componentProps: {
            description: 'Fraction of the data to sample for faster computation.',
            label: 'Sample size',
            allowDecimal: true,
            fixedDecimalScale: true,
            allowNegative: false,
            decimalScale: 2,
            clampBehavior: 'strict',
            min: 0.01,
            max: 1,
            step: 0.01,
        }
    },
    {
        settingName: 'kMeansPlusPlus',
        settingType: 'boolean',
        startingValue: true,
        validate: () => true,
        componentProps: {
            label: 'Use k-means++',
            description: 'Use k-means++ initialization algorithm to improve the quality of the clusters.',
        }
    }
    ]
}

export default schema;