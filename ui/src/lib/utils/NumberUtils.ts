export function getRandomInt(min: number, max: number): number {
    if (min > max) {
        throw new Error("min should not be greater than max");
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
