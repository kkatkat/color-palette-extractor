import { Accordion, Center, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import ScatterPlot from "./3dScatterPlot";
import { IconChartBar, IconChartPie, IconChartScatter3d } from "@tabler/icons-react";
import PixelsPerCluster from "./PixelsPerCluster";
import { PlotProps } from "./types";
import PieChart from "./PieChart";

type VisualizationContainerProps = PlotProps;

export default function VisualizationCard({ centroids, clusters, colorNames, loading }: VisualizationContainerProps) {
    const theme = useMantineTheme();

    return (
        <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.lg}>
            <Title order={5} mb={theme.spacing.md}>Visualizations</Title>
            <Accordion multiple={false}>
                <Accordion.Item key='3dScatterPlot' value="3dScatterPlot">
                    <AccordionControl icon={<IconChartScatter3d color={theme.colors.customColor[6]} />} title="3D Scatterplot" />
                    <Accordion.Panel>
                        <Center w={'100%'}>
                            <ScatterPlot centroids={centroids} clusters={clusters} colorNames={colorNames} loading={loading} />
                        </Center>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key='ColorsPerCluster' value="ColorsPerCluster">
                    <AccordionControl icon={<IconChartBar color={theme.colors.customColor[6]}/>} title="Pixels per cluster"/>
                    <Accordion.Panel>
                        <Center w={'100%'}>
                            <PixelsPerCluster centroids={centroids} clusters={clusters} colorNames={colorNames} loading={loading}/>
                        </Center>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key="Distribution" value="Distribution">
                    <AccordionControl icon={<IconChartPie color={theme.colors.customColor[6]}/>} title="Distribution"/>
                    <Accordion.Panel>
                        <Center w={'100%'}>
                            <PieChart centroids={centroids} clusters={clusters} colorNames={colorNames} loading={loading}/>
                        </Center>
                    </Accordion.Panel>
                </Accordion.Item>
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