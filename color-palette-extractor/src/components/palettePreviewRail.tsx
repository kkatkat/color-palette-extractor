import { Box, Group, Paper, useMantineTheme } from "@mantine/core";
import { RGB } from "../logic/types";


export default function PalettePreviewRail({ palette }: { palette?: RGB[] }) {
    const theme = useMantineTheme();

    if (!palette) {
        return null;
    }

    return (
        <Paper withBorder shadow="xs" mt={theme.spacing.md} p={0} style={{overflow: 'hidden'}}>
            <Group justify='space-between' display='flex' gap={0} m={0} p={0}>
                {
                    palette.map((color, index) => (
                        <Box 
                            key={index} 
                            style={{
                                flexGrow: 1, 
                                backgroundColor: `rgb(${color})`, 
                                height: '50px', 
                                cursor: 'pointer',
                                margin: 0,
                                transition: 'transform 0.1s',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = 'scale(1.5)';
                                (e.currentTarget as HTMLElement).style.zIndex = '9999';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                                (e.currentTarget as HTMLElement).style.zIndex = '2';
                            }}
                            onClick={() => {
                                window.scrollTo({
                                    top: document.getElementById(`color-${index}`)!.offsetTop,
                                    behavior: 'smooth'
                                })
                            }}
                        />
                    ))
                }
            </Group>

        </Paper>
    )
}