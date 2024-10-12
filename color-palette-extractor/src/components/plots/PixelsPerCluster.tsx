import Highcharts from "highcharts/highcharts";
import { PlotProps } from "./types";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

// TODO make chart be as tall as the number of clusters

export default function PixelsPerCluster({centroids, clusters, colorNames}: PlotProps) {

    const chartOptions = useMemo<Highcharts.Options>(() => {
        return {
            title: undefined,
            chart: {
                type: 'bar',
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
            series: [{
                type: 'bar',
                name: 'Colors per cluster',
                data: centroids.map((centroid, index) => {
                    return {
                        color: `rgb(${centroid}, 1)`,
                        name: colorNames.get(centroid),
                        y: clusters[index].length,
                    }
                })
            }]
        }
    }, [centroids, clusters, colorNames]);
    
    return (
        <div className="container" style={{overflowY: 'scroll'}}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions}/>
        </div>
    )
}