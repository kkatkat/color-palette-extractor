import { Accordion, Center, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import ScatterPlot from "./3dScatterPlot";
import { IconChartBar, IconChartScatter3d } from "@tabler/icons-react";
import PixelsPerCluster from "./PixelsPerCluster";
import { PlotProps } from "./types";

type VisualizationContainerProps = PlotProps;

export default function VisualizationCard({ centroids, clusters, colorNames }: VisualizationContainerProps) {
    const theme = useMantineTheme();

    return (
        <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.lg}>
            <Title order={5} mb={theme.spacing.md}>Visualizations</Title>
            <Accordion multiple>
                <Accordion.Item key='3dScatterPlot' value="3dScatterPlot">
                    <AccordionControl icon={<IconChartScatter3d color={theme.colors.customColor[6]} />} title="3D Scatterplot" />
                    <Accordion.Panel>
                        <Center w={'100%'}>
                            <ScatterPlot centroids={centroids} clusters={clusters} colorNames={colorNames} />
                        </Center>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key='ColorsPerCluster' value="ColorsPerCluster">
                    <AccordionControl icon={<IconChartBar color={theme.colors.customColor[6]}/>} title="Pixels per cluster"/>
                    <Accordion.Panel>
                        <Center w={'100%'}>
                            <PixelsPerCluster centroids={centroids} clusters={clusters} colorNames={colorNames}/>
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