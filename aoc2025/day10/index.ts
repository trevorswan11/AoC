// const input_path: string = "input_2025-day10.txt";
const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

// The input gives these as little endian, but machines are parsed as big endian
class Machine {
    // A bitset where bit at i is if it needs to be toggled.
    readonly indicator: number;

    // A bitset where bit at i means button j (in array) toggles all corresponding bits
    readonly wirings: Array<number>;

    // Numbers that correspond to the target joltage for each bit in the indicator
    // Pressing a button means that its bits increment their joltage by 1
    readonly joltages: Array<number>;

    constructor(desired_indicator: number, wiring_schematics: Array<number>, joltage_requirements: Array<number>) {
        this.indicator = desired_indicator;
        this.wirings = wiring_schematics;
        this.joltages = joltage_requirements;
    }
}

async function parseInputLines(path: string): Promise<Array<Machine>> {
    const lines = await readInputLines(path);
    let machines = new Array<Machine>(lines.length);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        let ind_str = line.substring(line.indexOf('['), line.lastIndexOf(']') + 1);
        let wir_strs = line.substring(line.indexOf('('), line.lastIndexOf(')') + 1).split(' ');
        let jol_strs = line.substring(line.indexOf('{') + 1, line.lastIndexOf('}')).split(',');

        // Each indicator is surrounded by square brackets that we can omit
        let indicator = 0;
        for (let j = 1; j < ind_str.length - 1; j++) {
            const bit_idx = j - 1;
            if (ind_str[j] === "#") {
                indicator |= (1 << bit_idx);
            }
        }

        // We can safely decompose wirings into binary values due to input constraints
        let wirings = new Array<number>(wir_strs.length);
        for (let w = 0; w < wirings.length; w++) {
            const wiring_list = wir_strs[w]!;

            // Each button layout in surrounded by parentheses
            let wiring = 0;
            for (let entangled of wiring_list.slice(1, wiring_list.length - 1).split(',')) {
                const shift = +entangled;
                wiring |= (1 << shift);
            }
            wirings[w] = wiring;
        }

        // Joltages are just decimal numbers and have been stripped of delimiters
        let joltages = new Array<number>(jol_strs.length);
        jol_strs.forEach((value, index) => joltages[index] = parseInt(value));

        machines[i] = new Machine(indicator, wirings, joltages);
    }

    return machines;
}

// Constant memory powerset using generator.
//
// https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript-powerset-of-array
function* getButtonPowerset(wirings: Array<number>, offset: number = 0): Generator<Array<number>> {
    while (offset < wirings.length) {
        let first = wirings[offset++]!;
        for (let subset of getButtonPowerset(wirings, offset)) {
            subset.push(first);
            yield subset;
        }
    }

    yield [];
}

function one(machines: Array<Machine>): number {
    let sum_of_fewest = 0;
    for (let machine of machines) {
        let best_subset = Number.MAX_SAFE_INTEGER;

        // Super brute force, but reduction is xor so order independent
        for (const set of getButtonPowerset(machine.wirings)) {
            // The power set contains the empty set by definition
            if (set.length == 0) continue;

            const result = set.reduce((a, b) => a ^ b);
            if (machine.indicator == result) {
                best_subset = Math.min(best_subset, set.length);
            }
        }

        sum_of_fewest += best_subset;
    }

    return sum_of_fewest;
}

// Brainstorming for part 2
// Example: [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
/*



*/

async function twoZ3(machines: Array<Machine>): Promise<number> {
    let sum_of_fewest = 0;

    return sum_of_fewest;
}

function two(machines: Array<Machine>): number {
    let sum_of_fewest = 0;
    return sum_of_fewest;
}

const machines = await parseInputLines(input_path);
const part_one = one(machines);
console.log("Part one result: ", part_one);
const part_two = two(machines);
console.log("Part two result: ", part_two);
