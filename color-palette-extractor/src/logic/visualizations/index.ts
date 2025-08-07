import { IconProps, IconChartScatter3d, IconChartBar, IconChartPie } from "@tabler/icons-react";
import ScatterPlot from "../../components/plots/3dScatterPlot";
import PixelsPerCluster from "../../components/plots/PixelsPerCluster";
import PieChart from "../../components/plots/PieChart";

export type AvailableVisualization = '3dScatterPlot' | 'PixelsPerCluster' | 'PieChart';

type VisualizationsMap = Record<AvailableVisualization, {
    title: string;
    Icon: React.ComponentType<IconProps>;
    Component: React.ComponentType<any>;
}>;

export const visualizations: VisualizationsMap = {
    '3dScatterPlot': {
        title: '3D Scatterplot',
        Icon: IconChartScatter3d,
        Component: ScatterPlot,
    },
    'PixelsPerCluster': {
        title: 'Pixels per cluster',
        Icon: IconChartBar,
        Component: PixelsPerCluster,
    },
    'PieChart': {
        title: 'Distribution',
        Icon: IconChartPie,
        Component: PieChart,
    }
}