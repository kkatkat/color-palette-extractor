import { UnstyledButton } from "@mantine/core";
import { AppPlugin } from "../../logic/types";

type PluginListItemProps = {
    plugin: AppPlugin;
    onClick: (pluginName: string) => void;
}

export default function PluginListItem({ plugin, onClick }: PluginListItemProps) {

    return (
        <UnstyledButton>
            {plugin.name}
        </UnstyledButton>
    )
}