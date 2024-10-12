import { Accordion, Center, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import { RGB } from "../../logic/types";
import ScatterPlot from "./3dScatterPlot";
import { IconChartScatter3d } from "@tabler/icons-react";

type VisualizationContainerProps = {
    centroids: RGB[],
    clusters: RGB[][],
}

export default function VisualizationCard({ centroids, clusters }: VisualizationContainerProps) {
    const theme = useMantineTheme();

    return (
        <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.lg}>
            <Title order={5} mb={theme.spacing.md}>Visualizations</Title>
            <Accordion multiple>
                <Accordion.Item key='3dScatterPlot' value="3dScatterPlot">
                    <AccordionControl icon={<IconChartScatter3d color={theme.colors.customColor[6]} />} title="3D Scatter Plot" />
                    <Accordion.Panel>
                        <Center w={'100%'}>
                            <ScatterPlot centroids={centroids} clusters={clusters} />
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