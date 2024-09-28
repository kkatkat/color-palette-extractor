import { Paper, useMantineTheme } from "@mantine/core";
import { RGB } from "../logic/types";


export default function PaletteCard({ palette }: { palette: RGB[] }) {
    const theme = useMantineTheme();

    return (
        <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.md}>
            {palette.map((color, index) => (
                <div key={index} style={{ backgroundColor: `rgb(${color.join(',')})`, height: 50, width: 50 }} />
            ))}
        </Paper>

    )
}