import { init } from 'z3-solver'
const { Context } = await init();

// const input_path: string = "input_2025-day10.txt";
const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

// The input gives these as little endian, but machines are parsed as big endian
class Machine {
    // A bitset where bit at i is if it needs to be toggled.
    readonly indicator_bits: number;

    // A bitset where bit at i means button j (in array) toggles all corresponding bits
    readonly wirings_bits: Array<number>;
    readonly wirings: Array<Array<number>>;

    // Numbers that correspond to the target joltage for each bit in the indicator
    // Pressing a button means that its bits increment their joltage by 1
    readonly joltages: Array<number>;

    constructor(desired_indicator: number,
        wiring_schematic_bits: Array<number>,
        wiring_schematic_nums: Array<Array<number>>,
        joltage_requirements: Array<number>) {
        this.indicator_bits = desired_indicator;
        this.wirings_bits = wiring_schematic_bits;
        this.wirings = wiring_schematic_nums;
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
        let wiring_bits = new Array<number>(wir_strs.length);
        let wiring_nums = new Array<Array<number>>(wir_strs.length);
        for (let w = 0; w < wiring_bits.length; w++) {
            const wiring_list = wir_strs[w]!;
            wiring_nums[w] = wiring_list
                .slice(1, wiring_list.length - 1)
                .split(',')
                .map(value => +value);

            // Each button layout in surrounded by parentheses
            let wiring = 0;
            for (let shift of wiring_nums[w]!) {
                wiring |= (1 << shift);
            }
            wiring_bits[w] = wiring;
        }

        // Joltages are just decimal numbers and have been stripped of delimiters
        let joltages = new Array<number>(jol_strs.length);
        jol_strs.forEach((value, index) => joltages[index] = parseInt(value));

        machines[i] = new Machine(indicator, wiring_bits, wiring_nums, joltages);
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
        for (const set of getButtonPowerset(machine.wirings_bits)) {
            // The power set contains the empty set by definition
            if (set.length == 0) continue;

            const result = set.reduce((a, b) => a ^ b);
            if (machine.indicator_bits == result) {
                best_subset = Math.min(best_subset, set.length);
            }
        }

        sum_of_fewest += best_subset;
    }

    return sum_of_fewest;
}

async function optimizeMachine(machine: Machine): Promise<number> {
    const Z3 = Context('main');

    // Define all constants (button wirings)
    let variables = machine.wirings.map(button => Z3.Int.const(button.join(",")));
    let opt = new Z3.Optimize();

    // Propagate the optimizer with all of the joltage constraints
    for (let i = 0; i < machine.joltages.length; i++) {
        let vars: typeof variables = [];
        for (let j = 0; j < machine.wirings.length; j++) {
            if (machine.wirings[j]!.includes(i)) {
                vars.push(variables[j]!);
            }
        }
        console.log("Z3 initialized");

        // Sum all of the relevant variables
        const sum = vars.length === 1
            ? vars[0]!
            : Z3.Sum(vars[0]!, ...vars.slice(1));
        let constraint = Z3.Eq(sum, Z3.Int.val(machine.joltages[i]!));
        opt.add(constraint);
    }

    // Now we can attempt to minimize
    const total = variables.length === 1
        ? variables[0]!
        : Z3.Sum(variables[0]!, ...variables.slice(1));
    opt.minimize(total);
    for (let v of variables) {
        opt.add(Z3.GE(v, Z3.Int.val(0)));
    }

    let result = await opt.check();
    if (result !== 'sat' && result !== 'unknown') {
        throw new Error("Unsatisfiable machine constraints");
    }

    let model = opt.model();
    return variables.map(v => model.eval(v).ast.valueOf()).reduce((a, b) => a + b);
}

async function two(machines: Array<Machine>): Promise<number> {
    let sum_of_fewest = 0;
    for (let machine of machines) {
        sum_of_fewest += await optimizeMachine(machine);
    }
    return sum_of_fewest;
}

const machines = await parseInputLines(input_path);
const part_one = one(machines);
console.log("Part one result: ", part_one);
const part_two = await two(machines);
console.log("Part two result: ", part_two);
