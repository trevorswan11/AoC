// const input_path: string = "input_2025-day8.txt";
const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

class Coordinate {
    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    distance(other: Coordinate): number {
        const xs = (this.x - other.x) ** 2;
        const ys = (this.y - other.y) ** 2;
        const zs = (this.z - other.z) ** 2;

        return xs + ys + zs;
    }
};

async function parseInputLines(path: string): Promise<Array<Coordinate>> {
    const lines = await readInputLines(path);
    const coordinates = new Array<Coordinate>(lines.length);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        const values = line.split(",");

        coordinates[i] = new Coordinate(
            parseInt(values[0]!),
            parseInt(values[1]!),
            parseInt(values[2]!),
        );
    }

    return coordinates;
}

console.log("Hello, World!");