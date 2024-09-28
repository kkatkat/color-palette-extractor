import { Group, rem, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconPhoto } from "@tabler/icons-react";

type DropzoneProps = {
    onDrop: (files: File[]) => void;
};

export default function DropzoneWrapper({ onDrop }: DropzoneProps) {

    return (
        <Dropzone
            maxFiles={1}
            multiple={false}
            accept={['image/jpg', 'image/jpeg', 'image/png']}
            onDrop={onDrop}
        >
            <Group justify="center" align="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <IconPhoto
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                    stroke={1.5}
                />
                <div>
                    <Text size="xl" inline>
                        Drag an image here or click to select a file
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Accepted formats: jpg, jpeg, png
                    </Text>
                </div>
            </Group>
        </Dropzone>
    )
}