import { Button, Collapse, Divider, Grid, Group, NumberInput, Stack, Text, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { IconWand, IconSettings } from "@tabler/icons-react";
import { Settings } from "../logic/types";

type SettingsFormProps = {
    onSubmit: (data: Partial<Settings>) => void;
    downscaleFactor: number;
    onDownscaleFactorChange: (value: number) => void;
    loading?: boolean;
}

export default function SettingsForm({ onSubmit, loading, downscaleFactor, onDownscaleFactorChange }: SettingsFormProps) {
    const theme = useMantineTheme();

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [colorCount, setColorCount] = useState<number>(5);
    const [maxIterations, setMaxIterations] = useState<number>(100);
    const [sampleSize, setSampleSize] = useState<number>(1.00);

    const validate = () => {
        return [
            colorCount > 0,
            maxIterations > 0,
            (sampleSize > 0 && sampleSize <= 100),
            downscaleFactor > 0
        ].every(Boolean);
    }

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }

        onSubmit({
            colorCount,
            maxIterations,
            sampleSize
        })
    }

    return (
        <Stack>
            <Group justify='space-between' mt={theme.spacing.md}>
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
                />
                <Button
                    variant={settingsOpen ? 'filled' : 'light'}
                    size='xl'
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    disabled={loading}
                >
                    <IconSettings />
                </Button>
                <Button
                    size="xl"
                    variant="light"
                    leftSection={<IconWand />}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!colorCount}
                    className='btn-generate'
                >
                    Generate
                </Button>
            </Group>
            <Collapse in={settingsOpen}>
                <Divider />
                <Text fw={500} my={theme.spacing.xs}>Advanced settings</Text>
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
                        />
                    </Grid.Col>
                </Grid>
            </Collapse>
        </Stack>
    )
}