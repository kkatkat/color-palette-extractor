import { Button, CopyButton, Group, Text, Tooltip } from "@mantine/core";

type ColorInfoProps = {
    type: 'RGB' | 'HEX';
    color: string;
}

export default function ColorInfo({ type, color }: ColorInfoProps) {

    return (
        <Group gap={2} align="center" wrap="nowrap">
            <Text>{type}:</Text>
            <CopyButton value={color}>
                {
                    ({ copied, copy }) => (
                        <Tooltip label='Copy to clipboard'>
                            <Button variant='subtle' size='compact-sm' onClick={copy}>{copied ? 'Copied' : color}</Button>
                        </Tooltip>
                    )
                }
            </CopyButton>
        </Group>
    )
}