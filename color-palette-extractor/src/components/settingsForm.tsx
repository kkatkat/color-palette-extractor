import { Button, Collapse, Divider, Flex, Grid, Group, NumberInput, Stack, Switch, Text, useMantineTheme } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IconWand, IconSettings, IconPuzzle } from "@tabler/icons-react";
import { Settings } from "../logic/types";
import { modals } from "@mantine/modals";
import PluginsDialog from "./plugins/PluginsDialog";

const BENCHMARK_SETTINGS: Omit<Settings & { downscaleFactor: number }, 'benchmarkMode'> = {
    colorCount: 5,
    maxIterations: 40,
    sampleSize: 1.00,
    tolerance: 0,
    downscaleFactor: 1,
}

type SettingsFormProps = {
    onSubmit: (data: Partial<Settings>) => void;
    downscaleFactor: number;
    onDownscaleFactorChange: (value: number) => void;
    benchmarkMode: boolean;
    onBenchmarkModeChange: (enabled: boolean) => void;
    loading?: boolean;
    disabled?: boolean;
}

export default function SettingsForm({ onSubmit, loading, downscaleFactor, onDownscaleFactorChange, benchmarkMode, onBenchmarkModeChange, disabled }: SettingsFormProps) {
    const theme = useMantineTheme();

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [colorCount, setColorCount] = useState<number>(5);
    const [maxIterations, setMaxIterations] = useState<number>(100);
    const [sampleSize, setSampleSize] = useState<number>(1.00);
    const [tolerance, setTolerance] = useState<number>(0.001);
    const [kmeansPlusPlus, setKmeansPlusPlus] = useState<boolean>(true);

    const [pluginsOpen, setPluginsOpen] = useState(false);

    const validate = useCallback(() => {
        return [
            colorCount > 0,
            maxIterations > 0,
            (sampleSize > 0 && sampleSize <= 100),
            tolerance >= 0,
            downscaleFactor > 0
        ].every(Boolean);
    }, [colorCount, maxIterations, sampleSize, tolerance, downscaleFactor]);

    const settingsValid = useMemo(() => validate(), [validate]);

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }

        onSubmit({
            colorCount,
            maxIterations,
            sampleSize,
            tolerance,
            benchmarkMode
        })
    }

    const resetToDefault = () => {
        onBenchmarkModeChange(false);
        setColorCount(5);
        setMaxIterations(100);
        setSampleSize(1.00);
        setTolerance(0.001);
        onDownscaleFactorChange(10);
    }

    useEffect(() => {
        if (benchmarkMode) {
            setColorCount(BENCHMARK_SETTINGS.colorCount);
            setMaxIterations(BENCHMARK_SETTINGS.maxIterations);
            setSampleSize(BENCHMARK_SETTINGS.sampleSize);
            setTolerance(BENCHMARK_SETTINGS.tolerance);
            onDownscaleFactorChange(BENCHMARK_SETTINGS.downscaleFactor);
        } else {
            resetToDefault();
        }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [benchmarkMode])

    return (
        <Stack>
            <Group justify='space-between' mt={theme.spacing.md} gap={theme.spacing.sm}>
                <NumberInput
                    size="xl"
                    placeholder="Number of colors"
                    value={colorCount}
                    onChange={(value) => setColorCount(+value)}
                    min={1}
                    max={1000}
                    flex={1}
                    allowDecimal={false}
                    allowLeadingZeros={false}
                    allowNegative={false}
                    decimalScale={0}
                    suffix={` color${colorCount === 1 ? '' : 's'}`}
                    clampBehavior="strict"
                    disabled={benchmarkMode || disabled}
                />
                <Button
                    variant={settingsOpen ? 'filled' : 'light'}
                    size='xl'
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    disabled={loading || disabled}
                    px={theme.spacing.md}
                >
                    <IconSettings/>
                </Button>
                <Button
                    variant='light'
                    size='xl'
                    onClick={() => setPluginsOpen(true)}
                    disabled={loading || disabled}
                    px={theme.spacing.md}
                >
                    <IconPuzzle/>
                </Button>
                <Button
                    size="xl"
                    variant="light"
                    leftSection={<IconWand />}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!colorCount || !settingsValid || disabled}
                    className='btn-generate'
                >
                    Generate
                </Button>
            </Group>
            <Collapse in={settingsOpen && !disabled}>
                <Divider />
                <Flex justify='space-between' align='center'>
                    <Text fw={500} my={theme.spacing.xs}>Advanced settings</Text>
                    <Button variant='subtle' size='compact-xs' disabled={loading || disabled} onClick={resetToDefault}>
                        Reset to default
                    </Button>
                </Flex>
                <Grid>
                    <Grid.Col span={6}>
                        <NumberInput
                            label="Max iterations"
                            size="sm"
                            value={maxIterations}
                            onChange={(value) => setMaxIterations(+value)}
                            allowDecimal={false}
                            allowLeadingZeros={false}
                            allowNegative={false}
                            decimalScale={0}
                            clampBehavior="strict"
                            min={1}
                            max={10000}
                            disabled={benchmarkMode || disabled}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <NumberInput
                            label="Tolerance"
                            size="sm"
                            value={tolerance}
                            onChange={(value) => setTolerance(+value)}
                            allowDecimal={true}
                            fixedDecimalScale
                            allowNegative={false}
                            decimalScale={3}
                            clampBehavior="strict"
                            min={0}
                            max={100}
                            step={0.001}
                            disabled={benchmarkMode || disabled}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <NumberInput
                            label="Sample size"
                            size="sm"
                            value={sampleSize}
                            onChange={(value) => setSampleSize(+value)}
                            allowDecimal={true}
                            fixedDecimalScale
                            allowNegative={false}
                            decimalScale={2}
                            clampBehavior="strict"
                            min={0.01}
                            max={1}
                            step={0.01}
                            disabled={benchmarkMode || disabled}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <NumberInput
                            label="Downscale factor"
                            size="sm"
                            value={downscaleFactor}
                            onChange={(value) => onDownscaleFactorChange(+value)}
                            allowDecimal={false}
                            allowLeadingZeros={false}
                            allowNegative={false}
                            suffix="x"
                            clampBehavior="strict"
                            min={1}
                            max={100}
                            disabled={benchmarkMode || disabled}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Switch
                            checked={kmeansPlusPlus}
                            disabled={loading || disabled}
                            label='k-means++'
                            onChange={() => setKmeansPlusPlus(!kmeansPlusPlus)}
                        />

                    </Grid.Col>
                </Grid>
                <Divider my={theme.spacing.md}/>
                <Grid>
                    <Grid.Col span={6}>
                        <Switch
                            checked={benchmarkMode}
                            disabled={loading || disabled}
                            label='Benchmark mode'
                            onChange={() => {
                                if (benchmarkMode) {
                                    onBenchmarkModeChange(false);
                                    return;
                                }

                                modals.openConfirmModal({
                                    title: 'Benchmark mode',
                                    children: (
                                        <Text size="sm">
                                            Enabling benchmark mode will replace the image you uploaded with a benchmark image. The benchmark can run for as long as several minutes. Are you sure?
                                        </Text>
                                    ),
                                    centered: true,
                                    labels: { confirm: 'Confirm', cancel: 'Cancel' },                
                                    onConfirm: () => {
                                        onBenchmarkModeChange(true);
                                    },
                                })
                            }}
                        />

                    </Grid.Col>
                </Grid>
            </Collapse>
            <PluginsDialog open={pluginsOpen} onClose={() => setPluginsOpen(false)} showSearch/>
        </Stack>
    )
}