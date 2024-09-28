import { RGB } from "./types";
import colorNames from '../color_names.json'

const COLORS = Object.entries(colorNames).map(([name, rgb]) => {
    return {
        name,
        rgb: rgb as RGB
    }
});

export function getPixels(array: Uint8ClampedArray): RGB[] {
    const pixels = [];

    for (let i = 0; i < array.length; i += 4) {
        // push only RGB values, ignore alpha
        pixels.push([array[i], array[i + 1], array[i + 2]] as RGB);
    }

    return pixels;
}

export function euclideanDistance(a: RGB, b: RGB) {
    return Math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2 + (a[2] - b[2])**2);
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getClosestColorName(color: RGB): string {
    const distances = COLORS.map((namedColor) => {
        return {
            name: namedColor.name,
            distance: euclideanDistance(namedColor.rgb, color)
        }
    });

    return distances.reduce((prev, current) => {
        return prev.distance < current.distance ? prev : current;
    }, distances[0]).name;
}