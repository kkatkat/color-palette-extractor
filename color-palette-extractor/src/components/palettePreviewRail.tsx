import { Box, Group, Paper, Tooltip, useMantineTheme } from "@mantine/core";
import { RGB } from "../logic/types";


export default function PalettePreviewRail({ palette, colorNames }: { palette: RGB[], colorNames: Map<RGB, string> }) {
    const theme = useMantineTheme();

    return (
        <Paper withBorder shadow="xs" mt={theme.spacing.md} p={0} style={{overflow: 'hidden'}}>
            <Group justify="center" gap={0} m={0} p={0} grow>
                {
                    palette.map((color, index) => (
                        <Tooltip label={colorNames.get(color)} key={index} >
                            <Box 
                                style={{
                                    backgroundColor: `rgb(${color})`, 
                                    height: '50px', 
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = 'scaleX(1.5)';
                                    (e.currentTarget as HTMLElement).style.zIndex = '9999';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = 'scaleX(1)';
                                    (e.currentTarget as HTMLElement).style.zIndex = '2';
                                }}
                                onClick={() => {
                                    const element = document.getElementById(`color-${index}`);
                                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                    // make the element 'pop' (scale up and down)
                                    if (element) {
                                        setTimeout(() => {
                                            element.style.transform = 'scale(1.3)';
                                        }, 1000);
                                    }

                                    setTimeout(() => {
                                        if (element) {
                                            element.style.transform = 'scale(1)';
                                        }
                                    }, 1400);
                                }}
                            />
                        </Tooltip>

                    ))
                }
            </Group>

        </Paper>
    )
}