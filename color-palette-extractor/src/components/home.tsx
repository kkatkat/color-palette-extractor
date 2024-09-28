import { ActionIcon, Center, Collapse, Container, Group, Image as MantineImage, Paper, Progress, Title, useMantineTheme } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useEffect, useMemo, useRef, useState } from "react";
import DropzoneWrapper from "./dropzone";
import { getPixels } from "../logic/functions";
import { RGB, Settings } from "../logic/types";
import SettingsForm from "./settingsForm";
import { trainKMeans } from "../logic/kmeans";
import PaletteCard from "./paletteCard";
import { IconBrandGithub, IconInfoCircle, IconX } from "@tabler/icons-react";
import InfoModal from "./infoModal";

export default function Home() {
    const theme = useMantineTheme();

    const [file, setFile] = useState<FileWithPath | null>(null);
    const [imageData, setImageData] = useState<RGB[] | null>(null);
    const [palette, setPalette] = useState<RGB[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const resetState = () => {
        setFile(null);
        setImageData(null);
        setPalette(null);
        setLoading(false);
        setProgress(0);
    }

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

        const centroids = await trainKMeans(imageData, settings.colorCount, settings.maxIterations, settings.tolerance, (prg) => setProgress(prg * 100));

        window.scrollTo({
            top: document.getElementById('results-card')?.offsetTop,
            behavior: 'smooth',
        })

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
            canvas.width = image.width;
            canvas.height = image.height;
            ctx?.drawImage(image, 0, 0, image.width, image.height);

            if (ctx) {
                const clampedArray = ctx.getImageData(0, 0, image.width, image.height, { colorSpace: 'srgb' }).data

                setImageData(getPixels(clampedArray));
            }
        }
    }, [file])

    return (
        <>
            <Container size='sm' pt={theme.spacing.lg}>
                <Group justify="space-between" align="center" mb={theme.spacing.md}>
                    <Title order={3} c={theme.primaryColor}>Color Palette Extractor</Title>
                    <Group gap={theme.spacing.xs}>
                        <ActionIcon variant="light" size='lg' onClick={() => setInfoModalOpen(true)}>
                            <IconInfoCircle />
                        </ActionIcon>
                        <ActionIcon variant="light" size='lg'>
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
                            <SettingsForm onSubmit={(data) => getColorPalette(data)} loading={loading} />
                            <Collapse in={!!progress} mt={theme.spacing.md}>
                                <Progress size="xs" value={progress} />
                            </Collapse>
                        </>

                    }
                </Paper>
                {
                    palette &&
                    <PaletteCard palette={palette}/>
                }
            <InfoModal open={infoModalOpen} onClose={() => setInfoModalOpen(false)}/>
            </Container>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>

    )
}