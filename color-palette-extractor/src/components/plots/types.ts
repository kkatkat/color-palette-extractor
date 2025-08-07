import { Algorithm } from "../../logic/algorithm";
import { Result, RGB } from "../../logic/types";

export type PlotProps<T extends Algorithm = Algorithm> = {
    colorNames: Map<RGB, string>,
    loading?: boolean
} & Result<T>