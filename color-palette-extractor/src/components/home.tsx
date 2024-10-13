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
import benchmarkImage from '../assets/benchmark.jpg';
import { modals } from "@mantine/modals";
import VisualizationCard from "./plots/VisualizationCard";

export default function Home() {
    const theme = useMantineTheme();

    const [file, setFile] = useState<FileWithPath | null>(null);
    const [imageData, setImageData] = useState<RGB[] | null>(null);
    const [palette, setPalette] = useState<RGB[]>();
    const [clusters, setClusters] = useState<RGB[][]>();
    const [loading, setLoading] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downscaleFactor, setDownscaleFactor] = useState(10);
    const [benchmarkMode, setBenchmarkMode] = useState(false);

    const [imagePreview, setImagePreview] = useState<React.ReactNode>();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const resetState = () => {
        setFile(null);
        setImageData(null);
        setPalette(undefined);
        setLoading(false);
        setProgress(0);
        setImagePreview(null);
    }

    const colorNames = useMemo(() => {
        if (!palette) return new Map<RGB, string>();

        const colorNamesMap: Map<RGB, string> = new Map();

        for (const color of palette) {
            const closestColor = getClosestColorName(color);
            colorNamesMap.set(color, closestColor);
        }

        return colorNamesMap;
    }, [palette])

    const getImagePreview = () => {
        if (!file) return null;

        let imageUrl = URL.createObjectURL(file);

        if (benchmarkMode) {
            imageUrl = benchmarkImage;
        }

        setImagePreview(
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
    }

    useEffect(() => {
        getImagePreview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, loading, benchmarkMode])

    const getColorPalette = async (settings: Partial<Settings>) => {
        setLoading(true);
        setProgress(0);

        if (!imageData) {
            return;
        }

        const result = await trainKMeans(imageData, settings.colorCount, settings.maxIterations, settings.tolerance, settings.sampleSize, settings.benchmarkMode, (prg) => setProgress(prg * 100));

        setPalette(result.palette);
        setClusters(result.clusters);
        setLoading(false);

        if (result.benchmarkScore) {
            modals.open({
                title: <Title order={5}>Benchmark results</Title>,
                children: `Benchmark score: ${result.benchmarkScore}ms`,
                centered: true,
            })
        }
    }

    useEffect(() => {
        if (!file) {
            return;
        }

        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        setLoading(true);

        const ctx = canvas.getContext('2d');
        const image = new Image();

        image.src = benchmarkMode ? benchmarkImage : URL.createObjectURL(file);
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

            setLoading(false);
        }
    }, [file, downscaleFactor, benchmarkMode])

    useEffect(() => {
        if (palette?.length) {
            setPalette(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [benchmarkMode])

    return (
        <>
            <Container size='sm' pt={theme.spacing.lg}>
                <Group justify="space-between" align="center" mb={theme.spacing.md} wrap="nowrap">
                    <Title order={3} c={theme.primaryColor}>Color Palette Extractor</Title>
                    <Group gap={theme.spacing.xs} wrap="nowrap">
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
                        <DropzoneWrapper onDrop={(files) => {
                            setFile(files[0]);
                            setBenchmarkMode(false);
                        }} />
                    }
                    <>
                        <Center>
                            {imagePreview}
                        </Center>
                        <Collapse in={!!palette}>
                            {
                                !!palette &&
                                <PalettePreviewRail palette={palette} colorNames={colorNames} />

                            }
                        </Collapse>
                        <SettingsForm
                            onSubmit={(data) => getColorPalette(data)}
                            loading={loading}
                            downscaleFactor={downscaleFactor}
                            onDownscaleFactorChange={(value) => setDownscaleFactor(value)}
                            benchmarkMode={benchmarkMode}
                            onBenchmarkModeChange={(enabled) => setBenchmarkMode(enabled)}
                            disabled={!file}
                        />
                        <Collapse in={!!progress && progress < 100} mt={theme.spacing.md}>
                            <Progress size="xs" value={progress} />
                        </Collapse>
                    </>
                </Paper>
                {
                    palette &&
                    <>
                        {
                            clusters && 
                            <VisualizationCard centroids={palette} clusters={clusters} colorNames={colorNames} />
                        }
                        <PaletteCard palette={palette} colorNames={colorNames} loading={loading} />
                    </>
                }
                <InfoModal open={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
            </Container>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>

    )
}