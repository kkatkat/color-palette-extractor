import { RGB } from "./types";

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