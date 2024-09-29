import { ActionIcon, Center, Collapse, Container, Group, Image as MantineImage, Paper, Progress, Title, useMantineTheme } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useEffect, useMemo, useRef, useState } from "react";
import DropzoneWrapper from "./dropzone";
import { getClosestColorName, getPixels } from "../logic/functions";
import { RGB, Settings } from "../logic/types";
import SettingsForm from "./settingsForm";
import { trainKMeans } from "../logic/kmeans";
import PaletteCard from "./paletteCard";
import { IconBrandGithub, IconInfoCircle, IconX } from "@tabler/icons-react";
import InfoModal from "./infoModal";
import PalettePreviewRail from "./palettePreviewRail";

export default function Home() {
    const theme = useMantineTheme();

    const [file, setFile] = useState<FileWithPath | null>(null);
    const [imageData, setImageData] = useState<RGB[] | null>(null);
    const [palette, setPalette] = useState<RGB[]>();
    const [loading, setLoading] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downscaleFactor, setDownscaleFactor] = useState(10);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const resetState = () => {
        setFile(null);
        setImageData(null);
        setPalette(undefined);
        setLoading(false);
        setProgress(0);
    }

    const colorNames = useMemo(() => {
        if (!palette) return new Map();

        const colorNamesMap: Map<RGB, string> = new Map();

        for (const color of palette) {
            const closestColor = getClosestColorName(color);
            colorNamesMap.set(color, closestColor);
        }

        return colorNamesMap;
    }, [palette])

    const imagePreview = useMemo(() => {
        if (!file) return null;

        const imageUrl = URL.createObjectURL(file);

        return (
            <Paper style={{ position: 'relative', width: '100%' }} withBorder shadow="md">
                <ActionIcon
                    style={{
                        position: 'absolute',
                        top: theme.spacing.md,
                        right: theme.spacing.md
                    }}
                    color={theme.colors.red[6]}
                    onClick={resetState}
                    disabled={loading}
                >
                    <IconX />
                </ActionIcon>
                <MantineImage radius='md' src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} width='100%' />
            </Paper>
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, loading])

    const getColorPalette = async (settings: Partial<Settings>) => {
        setLoading(true);
        setProgress(0);

        if (!imageData) {
            return;
        }

        const centroids = await trainKMeans(imageData, settings.colorCount, settings.maxIterations, settings.tolerance, settings.sampleSize, (prg) => setProgress(prg * 100));

        setPalette(centroids);
        setLoading(false);
    }

    useEffect(() => {
        if (!file) {
            return;
        }

        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        const image = new Image();

        image.src = URL.createObjectURL(file);
        image.onload = () => {
            const adjustedWidth = Math.floor(image.width / downscaleFactor);
            const adjustedHeight = Math.floor(image.height / downscaleFactor);

            canvas.width = adjustedWidth
            canvas.height = adjustedHeight
            ctx?.drawImage(image, 0, 0, adjustedWidth, adjustedHeight);

            if (ctx) {
                const clampedArray = ctx.getImageData(0, 0, adjustedWidth, adjustedHeight, { colorSpace: 'srgb' }).data

                setImageData(getPixels(clampedArray));
            }
        }
    }, [file, downscaleFactor])

    return (
        <>
            <Container size='sm' pt={theme.spacing.lg}>
                <Group justify="space-between" align="center" mb={theme.spacing.md} wrap="nowrap">
                    <Title order={3} c={theme.primaryColor}>Color Palette Extractor</Title>
                    <Group gap={theme.spacing.xs}>
                        <ActionIcon variant="light" size='lg' onClick={() => setInfoModalOpen(true)}>
                            <IconInfoCircle />
                        </ActionIcon>
                        <ActionIcon variant="light" size='lg' component='a' href="https://github.com/kkatkat/color-palette-extractor" target="_blank">
                            <IconBrandGithub />
                        </ActionIcon>
                    </Group>
                </Group>
                <Paper p={theme.spacing.md} shadow="xs" withBorder mb={theme.spacing.lg}>
                    {
                        !file &&
                        <DropzoneWrapper onDrop={(files) => setFile(files[0])} />
                    }
                    {
                        file &&
                        <>
                            <Center>
                                {imagePreview}
                            </Center>
                            <Collapse in={!!palette}>
                            {
                                !!palette &&
                                <PalettePreviewRail palette={palette} colorNames={colorNames}/>

                            }
                            </Collapse>
                            <SettingsForm onSubmit={(data) => getColorPalette(data)} loading={loading} downscaleFactor={downscaleFactor} onDownscaleFactorChange={(value) => setDownscaleFactor(value)} />
                            <Collapse in={!!progress && progress < 100} mt={theme.spacing.md}>
                                <Progress size="xs" value={progress} />
                            </Collapse>
                        </>

                    }
                </Paper>
                {
                    palette &&
                    <PaletteCard palette={palette} colorNames={colorNames} loading={loading}/>
                }
            <InfoModal open={infoModalOpen} onClose={() => setInfoModalOpen(false)}/>
            </Container>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>

    )
}