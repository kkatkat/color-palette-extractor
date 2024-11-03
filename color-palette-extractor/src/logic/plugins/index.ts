import { IconCube } from "@tabler/icons-react";
import { AppPlugin } from "../types";
import MinecraftBlocksPluginComponent from "../../components/plugins/minecraftBlocks/MinecraftBlocksPluginComponent";
import { defaultPluginProps } from "./defaultPluginProps";

const plugins: AppPlugin[] = []

plugins.push({
    ...defaultPluginProps,
    name: 'Minecraft Blocks',
    description: 'Generate a list of Minecraft blocks based on the colors in the image.',
    author: 'kkatkat',
    icon: IconCube,
    Component: MinecraftBlocksPluginComponent,
})


export default Object.freeze(plugins);