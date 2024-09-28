import { Center, Group, Loader, Paper, rem, Stack, Title, useMantineTheme } from "@mantine/core";
import { RGB } from "../logic/types";
import { useMemo, useState } from "react";
import { getClosestColorName } from "../logic/functions";


export default function PaletteCard({ palette }: { palette: RGB[] }) {
    const theme = useMantineTheme();

    const [loading, setLoading] = useState(true);

    const colorNames = useMemo(() => {
        setLoading(true);

        const colorNamesMap: Map<RGB, string> = new Map();

        for (const color of palette) {
            const closestColor = getClosestColorName(color);
            colorNamesMap.set(color, closestColor);
        }

        setLoading(false);

        return colorNamesMap;
    }, [palette])

    if (loading) {
        return (
            <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.md}>
                <Center h={400}>
                    <Loader size='xl'/>
                </Center>
            </Paper>
        )

    }

    return (
        <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.md} id="results-card" style={{ position: 'relative' }}>
            
            <Stack>
                {palette.map((color, index) => (
                    <Group key={index} gap='xl'>
                        <Paper
                            style={{
                                backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                                height: rem(160),
                                width: rem(160),
                                cursor: 'pointer',
                            }}
                            withBorder
                        />
                        <Stack>
                            <Title order={5}>{colorNames.get(color)}</Title>
                            <div style={{ color: theme.colors.gray[7] }}>RGB: </div>
                            <div style={{ color: theme.colors.gray[7] }}>HEX: </div>
                        </Stack>
                    </Group>
                ))}
            </Stack>
        </Paper>

    )
}