import Highcharts from "highcharts/highcharts";
import { PlotProps } from "./types";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

// TODO make chart be as tall as the number of clusters

export default function PixelsPerCluster({ centroids, clusters, colorNames }: PlotProps) {

    const chartOptions = useMemo<Highcharts.Options>(() => {
        return {
            title: undefined,
            chart: {
                type: 'bar',
                height: clusters.length * 40,
            },
            xAxis: {
                type: 'category',
            },
            yAxis: {
                title: {
                    text: 'Number of pixels'
                },
                min: 0,
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    dataSorting: {
                        enabled: true,
                        sortKey: 'y',
                    },
                    events: {
                        click: (event) => {
                            console.log(event)
                        }
                    }
                }
            },
            series: [{
                type: 'bar',
                name: 'Pixels in cluster',
                data: centroids.map((centroid, index) => {
                    return {
                        color: `rgb(${centroid}, 1)`,
                        name: colorNames.get(centroid),
                        label: colorNames.get(centroid),
                        y: clusters[index].length,
                    }
                })
            }]
        }
    }, [centroids, clusters, colorNames]);

    return (
        <div className="container" style={{ overflowY: 'scroll', maxHeight: '500px' }}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    )
}