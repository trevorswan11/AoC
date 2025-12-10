const input_path: string = "input_2025-day9.txt";
// const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

class Tile {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    rectArea(other: Tile): number {
        const dx = Math.abs(this.x - other.x) + 1;
        const dy = Math.abs(this.y - other.y) + 1;
        return dx * dy;
    }
}

async function parseInputLines(path: string): Promise<Array<Tile>> {
    const lines = await readInputLines(path);
    let tiles = new Array<Tile>(lines.length);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        const [x, y] = line.split(',');
        tiles[i] = new Tile(parseInt(x!), parseInt(y!));
    }
    return tiles;
}

function one(tiles: Array<Tile>): number {
    let max_area = 0;
    for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            const a = tiles[i]!;
            const b = tiles[j]!;
            const area = a.rectArea(b);
            max_area = Math.max(area, max_area);
        }
    }
    return max_area
}

function checkCollisions(tiles: Array<Tile>, tile_0: Tile, tile_1: Tile, idx_0: number, idx_1: number): boolean {
    const rect_0 = getRect(tile_0, tile_1);
    for (let i = 0; i < tiles.length; i++) {
        let j = (i + 1) % tiles.length;

        // We can skip over rectangles that have been contended with already
        if (i == idx_0 || i == idx_1) {
            continue;
        } else if (j == idx_0 || j == idx_1) {
            continue;
        }

        const rect_1 = getRect(tiles[i]!, tiles[j]!);

        // Use AABB collision to check if we collide with anything
        if (rect_0.left < rect_1.right &&
            rect_0.right > rect_1.left &&
            rect_0.top < rect_1.bottom &&
            rect_0.bottom > rect_1.top) {
            return false;
        }
    }

    return true;
}

function getRect(tile_0: Tile, tile_1: Tile) {
    let left = tile_0.x;
    let right = tile_1.x;
    let top = tile_0.y;
    let bottom = tile_1.y;

    // Adjust based on true position of horizontal coords
    if (right < left) {
        left = tile_1.x;
        right = tile_0.x;
    }

    // Adjust based on true position of vertical coords
    if (bottom < top) {
        top = tile_1.y;
        bottom = tile_0.y;
    }

    return { left, right, top, bottom };
}

function two(tiles: Array<Tile>): number {
    let max_area = 0;

    for (let i = 0; i < tiles.length - 1; i++) {
        const tile_0 = tiles[i]!;
        for (let j = i + 1; j < tiles.length; j++) {
            const tile_1 = tiles[j]!;
            if (checkCollisions(tiles, tile_0, tile_1, i, j)) {
                max_area = Math.max(max_area, tile_0.rectArea(tile_1));
            }
        }
    }

    return max_area;
}

const tiles = await parseInputLines(input_path);
const part_one = one(tiles);
console.log("Part one result: ", part_one);
const part_two = two(tiles);
console.log("Part two result: ", part_two);
