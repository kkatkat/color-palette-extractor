import { Accordion, Center, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import ScatterPlot from "./3dScatterPlot";
import { IconChartBar, IconChartPie, IconChartScatter3d } from "@tabler/icons-react";
import PixelsPerCluster from "./PixelsPerCluster";
import { PlotProps } from "./types";
import PieChart from "./PieChart";

type VisualizationContainerProps = PlotProps;

export default function VisualizationCard({ centroids, clusters, colorNames, loading }: VisualizationContainerProps) {
    const theme = useMantineTheme();

    const plots: { Component: React.ComponentType<PlotProps>; title: string; icon: JSX.Element }[] = [
        {
            Component: ScatterPlot,
            title: '3D Scatterplot',
            icon: <IconChartScatter3d color={theme.colors.customColor[6]} />
        },
        {
            Component: PixelsPerCluster,
            title: 'Pixels per cluster',
            icon: <IconChartBar color={theme.colors.customColor[6]} />
        },
        {
            Component: PieChart,
            title: 'Distribution',
            icon: <IconChartPie color={theme.colors.customColor[6]} />
        }
    ];

    return (
        <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.lg}>
            <Title order={5} mb={theme.spacing.md}>Visualizations</Title>
            <Accordion multiple={true}>
                {
                    plots.map(({ Component, title, icon }) => (
                        <Accordion.Item key={title} value={title}>
                            <AccordionControl icon={icon} title={title} />
                            <Accordion.Panel>
                                <Center w={'100%'}>
                                    <Component centroids={centroids} clusters={clusters} colorNames={colorNames} loading={loading} />
                                </Center>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))
                }
            </Accordion>
        </Paper>
    )
}

function AccordionControl({ icon, title }: {icon?: React.ReactNode, title: string }) {
    return (
        <Accordion.Control icon={icon}>
            <Text>{title}</Text>
        </Accordion.Control>
    )
}