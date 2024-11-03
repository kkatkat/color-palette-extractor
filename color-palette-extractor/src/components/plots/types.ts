import { Algorithm } from "../../logic/algorithm";
import { Result, RGB } from "../../logic/types";

export type PlotProps = Result<Algorithm.KMeans> & {
    colorNames: Map<RGB, string>,
    loading?: boolean
}