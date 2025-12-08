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

class Pair {
    distance: number;
    a: Coordinate;
    b: Coordinate;

    constructor(distance: number, a: Coordinate, b: Coordinate) {
        this.distance = distance;
        this.a = a;
        this.b = b;
    }
}

type CircuitSet = Set<Set<Coordinate>>;
type CircuitMap = Map<Coordinate, Set<Coordinate>>;

function joinClosest(pairs: Array<Pair>, circuit_set: CircuitSet, circuit_map: CircuitMap): Pair | null {
    const next = pairs.pop()!;
    const circuit_a = circuit_map.get(next.a)!;
    const circuit_b = circuit_map.get(next.b)!;
    if (circuit_a === circuit_b) return null;
    
    let set = new Set<Coordinate>();
    circuit_a.forEach(ca => set.add(ca));
    circuit_b.forEach(cb => set.add(cb));
    
    circuit_set.add(set);
    circuit_set.delete(circuit_a);
    circuit_set.delete(circuit_b);
    
    set.forEach(c => circuit_map.set(c, set));
    return next;
}

async function solution(): Promise<[number, number]> {
    const coordinates = await parseInputLines(input_path);
    const cap = (coordinates.length * (coordinates.length - 1)) / 2;
    let pairs = new Array<Pair>(cap);
    let pair_idx = 0;

    // We're going to do n * n search hence the capacity
    for (let i = 0; i < coordinates.length; i++) {
        for (let j = i + 1; j < coordinates.length; j++) {
            const a = coordinates[i]!;
            const b = coordinates[j]!;
            pairs[pair_idx++] = new Pair(a.distance(b), a, b);
        }
    }
    pairs.sort((a, b) => b.distance - a.distance);

    // Create data structures for the solution
    let circuit_map: CircuitMap = new Map();
    let circuit_set: CircuitSet = new Set();

    for (let coord of coordinates) {
        let set = new Set<Coordinate>();
        set.add(coord);
        circuit_set.add(set);
        circuit_map.set(coord, set);
    }

    // Pop out the first coordinates
    for (let i = 0; i < coordinates.length; i++) {
        joinClosest(pairs, circuit_set, circuit_map);
    }

    // Part 1 calculation
    let sizes = new Array<number>();
    circuit_set.forEach(set => sizes.push(set.size));
    sizes.sort((a, b) => b - a);
    const part_one = sizes.slice(0, 3).reduce((a, b) => a * b);

    // Part 2 calculation
    // let distance: Pair | null = null;
    // while (circuit_set.size > 0) {
    //     distance = joinClosest(pairs, circuit_set, circuit_map);
    // }

    return [part_one, 0];
}

const [part_one, part_two] = await solution();
console.log("Part one result: ", part_one);
console.log("Part two result: ", part_two);
