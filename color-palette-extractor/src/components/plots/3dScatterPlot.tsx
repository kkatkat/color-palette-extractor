import { useMemo, useRef, useState } from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import { ActionIcon, Group, SimpleGrid, Slider, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { PlotProps } from "./types";
import { RGB } from "../../logic/types";
import React from "react";

Highcharts3d(Highcharts);

const MAX_POINTS = 2000;

export default function ScatterPlot({ centroids, clusters }: PlotProps) {
    const chartRef = useRef(null);

    const [alpha, setAlpha] = useState(0);
    const [beta, setBeta] = useState(0);
    const [viewDistance, setViewDistance] = useState(2);

    // state for the sliders because ref.current.value does not work as expected
    const [alphaState, setAlphaState] = useState(0);
    const [betaState, setBetaState] = useState(0);
    const [viewDistanceState, setViewDistanceState] = useState(2);



    // Reduce the number of points in the chart if there are too many
    const reducePoints = (clusters: RGB[][]) => {
        const totalPoints = clusters.reduce((sum, cluster) => sum + cluster.length, 0);
        if (totalPoints <= MAX_POINTS) return clusters;

        const reducedClusters = clusters.map(cluster => {
            const clusterSize = Math.floor((cluster.length / totalPoints) * MAX_POINTS);
            const shuffled = cluster.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, clusterSize);
        });

        return reducedClusters;
    };

    const reducedClusters = useMemo(() => reducePoints(clusters), [clusters]);

    const chartOptions = useMemo<Highcharts.Options>(() => {
        return {
            title: undefined,
            chart: {
                type: '3dScatter',
                renderTo: 'container',
                animation: false,
                options3d: {
                    enabled: true,
                    alpha: alpha,
                    beta: beta,
                    depth: 355,
                    viewDistance: viewDistance,
                    fitToPlot: false,
                    frame: {
                        bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                        back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                        side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                    },
                }
            },
            xAxis: {
                title: {
                    text: 'Red',
                    style: {
                        color: 'red'
                    }
                },
                min: 0,
                max: 255,
            },
            yAxis: {
                title: {
                    text: 'Green',
                    style: {
                        color: 'green'
                    }
                },
                min: 0,
                max: 255,
            },
            zAxis: {
                title: {
                    text: 'Blue',
                    style: {
                        color: 'blue'
                    }
                },
                min: 0,
                max: 255,
            },
            tooltip: {
                pointFormat: 'Red: {point.x}</br>Green: {point.y}</br>Blue: {point.z}',
            },
            series: [...reducedClusters.map((cluster, index): Highcharts.SeriesScatter3dOptions => {
                return {
                    name: `Cluster ${index + 1}`,
                    color: `rgba(${centroids[index]}, 1)`,
                    data: cluster.map((pixel) => {
                        return {
                            x: pixel[0],
                            y: pixel[1],
                            z: pixel[2],
                            color: `rgba(${pixel}, 0.5)`,
                        }
                    }),
                    type: 'scatter3d',
                    marker: {
                        symbol: 'circle',
                    }
                }
            }),
            {
                name: 'Centroids',
                color: 'black',
                data: centroids.map((centroid) => {
                    return {
                        x: centroid[0],
                        y: centroid[1],
                        z: centroid[2],
                        color: `rgba(${centroid}, 1)`,
                    }
                }),
                type: 'scatter3d',
                marker: {
                    radius: 10,
                    symbol: 'diamond',
                },
                zIndex: 1000,
            } as Highcharts.SeriesScatter3dOptions]
        }
    }, [centroids, reducedClusters, alpha, beta, viewDistance]);

    const handleFieldReset = (field: 'alpha' | 'beta' | 'viewDistance') => {
        switch (field) {
            case 'alpha':
                setAlphaState(0);
                setAlpha(0)
                break;
            case 'beta':
                setBetaState(0);
                setBeta(0);
                break;
            case 'viewDistance':
                setViewDistanceState(2);
                setViewDistance(2);
                break;
        }
    }

    return (
        <Stack w={'100%'}>
            <SimpleGrid cols={{ sm: 3, xs: 1 }}>
                <SliderField
                    label="Alpha"
                    min={-90}
                    max={90}
                    value={alphaState}
                    onChangeEnd={(value) => setAlpha(value)}
                    onChange={(value) => setAlphaState(value)}
                    onReset={() => handleFieldReset('alpha')}
                />
                <SliderField
                    label="Beta"
                    min={-180}
                    max={180}
                    value={betaState}
                    onChangeEnd={(value) => setBeta(value)}
                    onChange={(value) => setBetaState(value)}
                    onReset={() => handleFieldReset('beta')}
                />
                <SliderField
                    label="View distance"
                    min={1}
                    max={10}
                    value={viewDistanceState}
                    onChangeEnd={(value) => setViewDistance(value)}
                    onChange={(value) => setViewDistanceState(value)}
                    onReset={() => handleFieldReset('viewDistance')}
                />
            </SimpleGrid>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
        </Stack>
    )
}

type SliderFieldProps = {
    label: string;
    min: number;
    max: number;
    value: number;
    onChangeEnd: (value: number) => void;
    onChange: (value: number) => void;
    onReset: () => void;
};

function SliderField({ label, min, max, value, onChangeEnd, onChange, onReset }: SliderFieldProps) {
    return (
        <div>
            <Group justify="space-between" align="center">
                <Text size="sm">{label}</Text>
                <ActionIcon variant="light" size='xs' onClick={onReset}>
                    <IconRefresh />
                </ActionIcon>
            </Group>
            <Slider size='sm' value={value} min={min} max={max} step={1} onChangeEnd={onChangeEnd} onChange={onChange} />
        </div>
    );
};
