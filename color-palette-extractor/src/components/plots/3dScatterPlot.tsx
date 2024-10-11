import { useMemo, useRef } from "react"
import { RGB } from "../../logic/types"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";

Highcharts3d(Highcharts);

type ScatterPlotProps = {
    centroids: RGB[],
    clusters: RGB[][],
}

export default function ScatterPlot({ centroids, clusters }: ScatterPlotProps) {
    const chartRef = useRef(null);

    const chartOptions = useMemo<Highcharts.Options>(() => {
        return {
            title: undefined,
            chart: {
                type: '3dScatter',
                renderTo: 'container',
                animation: false,
                options3d: {
                    enabled: true,
                    alpha: 16,
                    beta: 30,
                    depth: 355,
                    viewDistance: 5,
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
            legend: false,
            tooltip: {
                pointFormat: 'Red: {point.x}</br>Green: {point.y}</br>Blue: {point.z}',
            },
            series: clusters.map((cluster, index) => {
                return {
                    name: `Cluster ${index + 1}`,
                    color: `rgba(${centroids[index]}, 1)`,
                    data: cluster.map((pixel) => {
                        return {
                            x: pixel[0],
                            y: pixel[1],
                            z: pixel[2],
                            color: `rgba(${pixel}, 1)`,
                        }
                    }),
                    type: 'scatter3d',
                    marker: {
                        symbol: 'circle',
                    }
                }
            })
        }
    }, [centroids, clusters]);

    return (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef}/>
    )
}