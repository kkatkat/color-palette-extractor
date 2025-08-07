import { Accordion, Center, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import { PlotProps } from "./types";
import { useMemo } from "react";
import { algorithmDefinitions } from "../../logic/algorithmDefinitions";
import { visualizations } from "../../logic/visualizations";

type VisualizationContainerProps = PlotProps;

export default function VisualizationCard(props: VisualizationContainerProps) {
    const { algorithm } = props;
    const theme = useMantineTheme();

    const algSchema = useMemo(() => {
        return algorithmDefinitions[algorithm];
    }, [algorithm])

    if (!algSchema || !algSchema.visualizations || !algSchema.visualizations.length) {
        return null;
    }

    const plots = algSchema.visualizations.map((vis) => {
        const { Component, title, Icon } = visualizations[vis];

        return (
            <Accordion.Item key={title} value={title}>
                <AccordionControl icon={<Icon color={theme.colors.customColor[6]} />} title={title} />
                <Accordion.Panel>
                    <Center w={'100%'}>
                        <Component {...props} />
                    </Center>
                </Accordion.Panel>
            </Accordion.Item>
        )
    })

    return (
        <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.lg}>
            <Title order={5} mb={theme.spacing.md}>Visualizations</Title>
            <Accordion multiple={true}>
                { plots }
            </Accordion>
        </Paper>
    )
}

function AccordionControl({ icon, title }: { icon?: React.ReactNode, title: string }) {
    return (
        <Accordion.Control icon={icon}>
            <Text>{title}</Text>
        </Accordion.Control>
    )
}