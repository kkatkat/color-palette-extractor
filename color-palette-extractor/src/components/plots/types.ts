import { RGB } from "../../logic/types";

export type PlotProps = {
    centroids: RGB[],
    clusters: RGB[][],
    colorNames: Map<RGB, string>,
    loading?: boolean
}