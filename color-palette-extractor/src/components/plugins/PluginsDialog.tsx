import { ActionIcon, Modal, Stack, TextInput, Title, useMantineTheme } from "@mantine/core";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import plugins from "../../logic/plugins";
import PluginListItem from "./PluginListItem";

type PluginsDialogProps = {
    open: boolean;
    onClose: () => void;
    showSearch?: boolean;
}

export default function PluginsDialog({ open, onClose, showSearch }: PluginsDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const theme = useMantineTheme();

    return (
        <Modal 
            opened={open} 
            onClose={onClose}
            title={<Title order={5}>Plugins</Title>}
            size='xl'
        >
            {
                showSearch && (
                    <TextInput
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.currentTarget.value)} 
                        size="lg"
                        placeholder="Search plugins..."
                        leftSection={<IconSearch />}
                        rightSection={
                            <ActionIcon variant="transparent" onClick={() => setSearchTerm('')}>
                                <IconTrash/>
                            </ActionIcon>
                        }
                    />
                )
            }
            <Stack gap={theme.spacing.md} mt={theme.spacing.md}>
            {
                plugins.map((plugin) => <PluginListItem plugin={plugin}/>)
            }
            </Stack>
        </Modal>
    )

}