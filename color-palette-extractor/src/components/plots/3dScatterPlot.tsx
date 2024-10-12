import { useMemo, useRef, useState } from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import { ActionIcon, Group, SimpleGrid, Slider, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { PlotProps } from "./types";

Highcharts3d(Highcharts);

export default function ScatterPlot({ centroids, clusters }: PlotProps) {
    const chartRef = useRef(null);

    const [alpha, setAlpha] = useState(0);
    const [beta, setBeta] = useState(0);
    const [viewDistance, setViewDistance] = useState(2);

    const alphaSliderRef = useRef(null);
    const betaSliderRef = useRef(null);
    const viewDistanceSliderRef = useRef(null);

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
            series: [...clusters.map((cluster, index): Highcharts.SeriesScatter3dOptions => {
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
    }, [centroids, clusters, alpha, beta, viewDistance]);

    const handleFieldReset = (field: 'alpha' | 'beta' | 'viewDistance') => {
        switch (field) {
            case 'alpha':
                //alphaSliderRef.current?.reset(); // TODO fix this = slider should reset to its default value
                setAlpha(0)
                break;
            case 'beta':
                setBeta(0);
                break;
            case 'viewDistance':
                setViewDistance(2);
                break;
        }
    }

    return (
        <Stack w={'100%'}>
            <SimpleGrid cols={{ sm: 3, xs: 1}}>
                <SliderField 
                    label="Alpha" 
                    min={-90} 
                    max={90} 
                    defaultValue={0} 
                    ref={alphaSliderRef} 
                    onChangeEnd={(value) => setAlpha(value)} 
                    onReset={() => handleFieldReset('alpha')}
                />
                <SliderField
                    label="Beta" 
                    min={-180} 
                    max={180} 
                    defaultValue={0} 
                    ref={betaSliderRef} 
                    onChangeEnd={(value) => setBeta(value)} 
                    onReset={() => handleFieldReset('beta')}
                />
                <SliderField
                    label="View distance" 
                    min={1} 
                    max={10} 
                    defaultValue={2} 
                    ref={viewDistanceSliderRef} 
                    onChangeEnd={(value) => setViewDistance(value)} 
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
    defaultValue: number;
    ref: React.RefObject<HTMLDivElement>;
    onChangeEnd: (value: number) => void;
    onReset: () => void;
};

function SliderField({ label, min, max, defaultValue, ref, onChangeEnd, onReset }: SliderFieldProps) {
    return (
        <div>
            <Group justify="space-between" align="center">
                <Text size="sm">{label}</Text>
                <ActionIcon variant="light" size='xs' onClick={onReset}>
                    <IconRefresh />
                </ActionIcon>
            </Group>
            <Slider size='sm' defaultValue={defaultValue} min={min} max={max} step={1} onChangeEnd={onChangeEnd} ref={ref} />
        </div>
    );
}