import { Algorithm } from "../algorithm";
import { AppPlugin } from "../types";

export const defaultPluginProps: Partial<AppPlugin> = {
    allowedAlgorithms: new Set([Algorithm.KMeans]),
}