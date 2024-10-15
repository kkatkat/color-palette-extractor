import HighchartsReact from "highcharts-react-official";
import { PlotProps } from "./types";
import Highcharts from "highcharts";
import { useMemo } from "react";


export default function PieChart({ centroids, colorNames, clusters }: PlotProps) {
    const sortedData = useMemo(() => {
        return centroids.map((centroid, index) => {
            return {
                name: colorNames.get(centroid),
                y: clusters[index].length,
                color: `rgb(${centroid})`
            }
        }
        ).sort((a, b) => b.y - a.y);
    }, [clusters, centroids, colorNames]);

    const chartOptions = useMemo<Highcharts.Options>(() => {
        return {
            title: undefined,
            chart: {
                type: 'pie',
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        format: '{point.percentage:.1f}%',
                    },
                }
            },
            series: [{
                type: 'pie',
                name: 'Pixels',
                data: sortedData
            }]
        }
    }, [sortedData]);

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    )
}