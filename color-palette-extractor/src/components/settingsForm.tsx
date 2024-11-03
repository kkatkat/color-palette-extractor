import { Button, Collapse, Divider, Flex, Grid, Group, NumberInput, Select, Stack, Switch, Text, Tooltip, useMantineTheme } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IconWand, IconSettings, IconPuzzle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import PluginsDialog from "./plugins/PluginsDialog";
import { Algorithm, AlgorithmDefinition, AlgorithmSettings, AlgorithmType } from "../logic/algorithm";
import { algorithmDefinitions } from "../logic/algorithmDefinitions";
import AutoInput from "./generic/AutoInput";

type SettingsFormProps = {
    onSubmit: (parameters: AlgorithmSettings<Algorithm>, algorithmDefinition: AlgorithmDefinition<Algorithm>) => void;
    downscaleFactor: number;
    onDownscaleFactorChange: (value: number) => void;
    benchmarkMode: boolean;
    onBenchmarkModeChange: (enabled: boolean) => void;
    loading?: boolean;
    disabled?: boolean;
}

export default function SettingsForm({ onSubmit, loading, downscaleFactor, onDownscaleFactorChange, benchmarkMode, onBenchmarkModeChange, disabled }: SettingsFormProps) {
    const theme = useMantineTheme();

    const [algorithm, setAlgorithm] = useState<AlgorithmType>('k-means');
    const [parameters, setParameters] = useState<AlgorithmSettings<Algorithm>>({});
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [pluginsOpen, setPluginsOpen] = useState(false);

    const algorithmDefinition = useMemo(() => algorithmDefinitions[algorithm], [algorithm]);

    useEffect(() => {
        resetParameters(algorithm);
    }, [algorithmDefinition])

    const validate = useCallback(() => {
        return algorithmDefinition.settings.every(({ validate, settingName }) => validate?.(parameters[settingName]) ?? true);
    }, [parameters]);

    const settingsValid = useMemo(() => validate(), [validate]);

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }

        onSubmit(parameters, algorithmDefinition);
    }

    const resetToDefault = () => {
        onBenchmarkModeChange(false);
        onDownscaleFactorChange(10);

        setAlgorithm('k-means');
        resetParameters('k-means');
    }

    const resetParameters = (algorithm: AlgorithmType) => {
        setParameters(algorithmDefinitions[algorithm].settings.reduce((acc, setting) => {
            acc[setting.settingName] = setting.startingValue;
            return acc;
        }, {} as AlgorithmSettings<Algorithm>))
    }

    useEffect(() => {
        if (benchmarkMode) {
            setAlgorithm('k-means');
            setParameters(algorithmDefinition.benchmarkSettings);

            onDownscaleFactorChange(1);
        } else {
            resetToDefault();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [benchmarkMode])

    return (
        <Stack>
            <Group justify='space-between' mt={theme.spacing.md} gap={theme.spacing.sm}>
                {
                    algorithmDefinition.settings.filter((setting) => setting.primarySetting).map((setting) => (
                        <AutoInput 
                            {...setting} 
                            value={parameters[setting.settingName]} 
                            onChange={(value) => setParameters({...parameters, [setting.settingName]: value})}
                            extraProps={{
                                disabled: benchmarkMode || disabled,
                                error: setting?.validate ? !setting.validate?.(parameters[setting.settingName]) : false,
                                suffix: setting.settingName === 'k' ? ` color${parameters[setting.settingName] === 1 ? '' : 's'}` : undefined,
                            }}

                        />
                    ))
                }
                <Button
                    variant={settingsOpen ? 'filled' : 'light'}
                    size='xl'
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    disabled={loading || disabled}
                    px={theme.spacing.md}
                >
                    <IconSettings />
                </Button>
                <Tooltip label="Plugins: coming soon!">
                    <Button
                        variant='light'
                        size='xl'
                        onClick={() => setPluginsOpen(true)}
                        disabled={true}
                        px={theme.spacing.md}
                    >
                        <IconPuzzle />
                    </Button>
                </Tooltip>
                <Button
                    size="xl"
                    variant="light"
                    leftSection={<IconWand />}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!settingsValid || disabled}
                    className='btn-generate'
                >
                    Generate
                </Button>
            </Group>
            <Collapse in={settingsOpen && !disabled}>
                <Divider/>
                <Flex justify='space-between' align='center'>
                    <Text fw={500} my={theme.spacing.xs}>Advanced settings</Text>
                    <Button variant='subtle' size='compact-xs' disabled={loading || disabled} onClick={resetToDefault}>
                        Reset to default
                    </Button>
                </Flex>
                <Select
                    label='Algorithm'
                    value={algorithm}
                    onChange={(value) => setAlgorithm(value as AlgorithmType)}
                    data={Object.values(Algorithm)}
                    allowDeselect={false}
                    disabled={benchmarkMode || disabled}
                />
                <Divider my={theme.spacing.md} label='Algorithm-specific settings' labelPosition='left' />
                <Grid>
                    {
                        algorithmDefinition.settings.filter((setting) => !setting.primarySetting).map((setting) => (
                            <Grid.Col span={12}>
                                <AutoInput 
                                    {...setting} 
                                    value={parameters[setting.settingName]} 
                                    onChange={(value) => setParameters({...parameters, [setting.settingName]: value})}
                                    extraProps={{
                                        disabled: benchmarkMode || disabled,
                                        error: !setting.validate?.(parameters[setting.settingName]),
                                    }}
                                />
                            </Grid.Col>
                        ))
                    }
                </Grid>
                <Divider my={theme.spacing.md} label='General settings' labelPosition='left' />
                <Grid>
                    <Grid.Col span={12}>
                        <NumberInput
                            label="Downscale factor"
                            description="The width and height of the image will be divided by this number to speed up the processing. Lowering the factor will result in much longer processing times."
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
                    <Grid.Col span={12}>
                        <Switch
                            checked={benchmarkMode}
                            disabled={loading || disabled}
                            label='Benchmark mode'
                            description="Check your machine's performance"
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
            <PluginsDialog open={pluginsOpen} onClose={() => setPluginsOpen(false)} showSearch />
        </Stack>
    )
}