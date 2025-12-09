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

    equal(other: Tile): boolean {
        return this.x == other.x && this.y == other.y;
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

class Rectangle {
    readonly a: Tile;
    readonly b: Tile;
    readonly area: number;

    constructor(a: Tile, b: Tile, area: number) {
        this.a = a;
        this.b = b;
        this.area = area;
    }

    // Defined as:
    // C...B
    // .....
    // .....
    // .....
    // A...D
    // Where it is returned as [c, d]
    otherTwo(): [Tile, Tile] {
        return [new Tile(this.a.x, this.b.y), new Tile(this.b.x, this.a.y)];
    }

    equal(other: Rectangle): boolean {
        let first_eql = this.a.equal(other.a) && this.b.equal(other.b);
        const [this_c, this_d] = this.otherTwo();
        const [other_c, other_d] = other.otherTwo();
        let other_eql = this_c.equal(other_c) && this_d.equal(other_d);
        return first_eql && other_eql;
    }
}

// Determines the max area and a list of rectangles.
//
// The rectangle list is sorted descending based on area
function sortRectangles(tiles: Array<Tile>): Array<Rectangle> {
    let rectangles = new Array<Rectangle>();

    // Brute force this part by creating all combinations
    for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            const a = tiles[i]!;
            const b = tiles[j]!;
            const area = a.rectArea(b);
            rectangles.push(new Rectangle(a, b, area));
        }
    }

    rectangles.sort((a, b) => b.area - a.area);
    return rectangles;
}

function one(tiles: Array<Tile>): number {
    return sortRectangles(tiles)[0]!.area;
}

function pointInPolygon(px: number, py: number, red_tiles: Array<Tile>): boolean {
    let inside = false;

    for (let i = 0, j = red_tiles.length - 1; i < red_tiles.length; j = i++) {
        const xi = red_tiles[i]!.x;
        const yi = red_tiles[i]!.y;
        const xj = red_tiles[j]!.x;
        const yj = red_tiles[j]!.y;

        const inside_y = (yi > py) !== (yj > py);
        const inside_ray_x = px < (xj - xi) * (py - yi) / (yj - yi + 0.0000001) + xi;
        const intersect = inside_y && inside_ray_x;

        if (intersect) inside = !inside;
    }

    return inside;
}

function makeTileSets(tiles: Array<Tile>): [Array<Tile>, Array<Tile>] {
    const red_tiles = new Array<Tile>();
    tiles.forEach(tile => red_tiles.push(new Tile(tile.x, tile.y)));
    let green_tiles = new Array<Tile>();

    // Add the boundary tiles to the green set
    for (let i = 0; i < tiles.length; i++) {
        const a = tiles[i]!;
        const b = tiles[(i + 1) % tiles.length]!;

        if (a.x == b.x) {
            // vertical segment
            const x = a.x;
            const y1 = Math.min(a.y, b.y);
            const y2 = Math.max(a.y, b.y);
            for (let y = y1; y <= y2; y++) {
                green_tiles.push(new Tile(x, y));
            }
        } else {
            // horizontal segment
            const y = a.y;
            const x1 = Math.min(a.x, b.x);
            const x2 = Math.max(a.x, b.x);
            for (let x = x1; x <= x2; x++) {
                green_tiles.push(new Tile(x, y));
            }
        }
    }

    // Add all inner points to the Set
    const xs = tiles.map(t => t.x);
    const ys = tiles.map(t => t.y);
    const min_x = Math.min(...xs) - 1;
    const max_x = Math.max(...xs) + 1;
    const min_y = Math.min(...ys) - 1;
    const max_y = Math.max(...ys) + 1;

    for (let x = min_x; x <= max_x; x++) {
        for (let y = min_y; y <= max_y; y++) {
            const query = new Tile(x, y);
            if (red_tiles.find(red => red.equal(query))) continue;
            if (green_tiles.find(green => green.equal(query))) continue;

            // Treat the tile as a point to see if it falls in
            if (pointInPolygon(x + 0.5, y + 0.5, tiles)) {
                green_tiles.push(query);
            }
        }
    }

    return [red_tiles, green_tiles];
}

function two(tiles: Array<Tile>): number | null {
    const rectangles = sortRectangles(tiles);
    const [red_set, green_set] = makeTileSets(tiles)

    // We can now just cast a ray from a rectangles edges to the bounds and check
    // Walk through the sorted rectangles until we find a good one
    for (let rectangle of rectangles) {
        const [c, d] = rectangle.otherTwo();
        if ((red_set.find(t => t.equal(c)) || green_set.find(t => t.equal(c)))
            && (red_set.find(t => t.equal(d)) || green_set.find(t => t.equal(d)))) {
            return rectangle.area;
        }
    }

    return null;
}

const tiles = await parseInputLines(input_path);
const part_one = one(tiles);
console.log("Part one result: ", part_one);
const part_two = two(tiles);
console.log("Part two result: ", part_two);
