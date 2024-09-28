import { ActionIcon, Anchor, Center, Group, Loader, Modal, Paper, rem, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core";
import { RGB } from "../logic/types";
import { useMemo, useState } from "react";
import { getClosestColorName } from "../logic/functions";
import { IconQuestionMark } from "@tabler/icons-react";
import ColorInfo from "./colorInfo";

export default function PaletteCard({ palette }: { palette: RGB[] }) {
    const theme = useMantineTheme();

    const [loading, setLoading] = useState(true);
    const [aboutOpen, setAboutOpen] = useState(false);

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
            <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.md} id="results-card">
                <Center h={400}>
                    <Loader size='xl' />
                </Center>
            </Paper>
        )
    }

    return (
        <>
            <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.md} id="results-card" style={{ position: 'relative' }}>
                <Tooltip label='About these results'>
                    <ActionIcon variant="light" style={{ position: 'absolute', right: theme.spacing.md, top: theme.spacing.md }} onClick={() => setAboutOpen(true)}>
                        <IconQuestionMark />
                    </ActionIcon>
                </Tooltip>
                <Stack>
                    {palette.map((color, index) => {
                        color.forEach((val, i) => color[i] = Math.round(val));

                        const colorRgb = color.reduce((acc, val, i) => `${acc}${i === 0 ? '' : ','} ${val}`, '');
                        const colorHex = color.reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '#').toUpperCase();

                        return (
                            <Group key={index} gap='md' align="normal" wrap='nowrap'>
                                <Paper
                                    style={{
                                        backgroundColor: `rgb(${colorRgb})`,
                                        height: rem(160),
                                        width: rem(160),
                                        cursor: 'pointer',
                                    }}
                                    withBorder
                                    className="color-preview"
                                    component='a'
                                    href={`https://www.colorhexa.com/${colorHex.slice(1)}`}
                                    target="_blank"
                                />
                                <Stack gap='xs'>
                                    <Title order={5}>{colorNames.get(color)}</Title>
                                    <Stack gap={0}>
                                        <ColorInfo type="RGB" color={colorRgb}/>
                                        <ColorInfo type="HEX" color={colorHex}/>
                                    </Stack>
                                </Stack>
                            </Group>
                        )
                    })}
                </Stack>
            </Paper>
            <Modal 
                opened={aboutOpen} 
                title={<Title order={5}>About these results</Title>}
                onClose={() => setAboutOpen(false)}
            >
                <Text variant="p">
                    The color names you see are sourced from a list of 1,298 named colors, publicly available on {<Anchor href="https://www.kaggle.com/datasets/avi1023/color-names" target="_blank">Kaggle</Anchor>}. The algorithm calculates the closest named color to each of the extracted colors. The RGB and HEX values and the colors in the squares are the actual values of the extracted colors, not the named ones.
                </Text>
            </Modal>
        </>
    )
}