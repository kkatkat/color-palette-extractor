import { Center, Paper, useMantineTheme } from "@mantine/core";
import { RGB } from "../../logic/types";
import ScatterPlot from "./3dScatterPlot";

type VisualizationContainerProps = {
    centroids: RGB[],
    clusters: RGB[][],
}

export default function VisualizationCard({ centroids, clusters }: VisualizationContainerProps) {
    const theme = useMantineTheme();

    return (
        <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.lg}>
            <Center w={'100%'}>
                <ScatterPlot centroids={centroids} clusters={clusters} />
            </Center>
        </Paper>
    )
}