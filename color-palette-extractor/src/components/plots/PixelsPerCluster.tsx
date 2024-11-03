import Highcharts from "highcharts/highcharts";
import { PlotProps } from "./types";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { scrollToColor } from "../../logic/functions";

export default function PixelsPerCluster({ palette, clusters, colorNames }: PlotProps) {

    const chartOptions = useMemo<Highcharts.Options>(() => {
        return {
            title: undefined,
            chart: {
                type: 'bar',
                height: Math.max(clusters.length * 40, 250),
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
                            scrollToColor(event.point.index);
                        }
                    }
                }
            },
            series: [{
                type: 'bar',
                name: 'Pixels in cluster',
                data: palette.map((centroid, index) => {
                    return {
                        color: `rgb(${centroid}, 1)`,
                        name: colorNames.get(centroid),
                        label: colorNames.get(centroid),
                        y: clusters[index].length,
                    }
                })
            }]
        }
    }, [palette, clusters, colorNames]);

    return (
        <div className="container" style={{ overflowY: 'scroll', maxHeight: '500px' }}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    )
}