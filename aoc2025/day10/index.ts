const input_path: string = "input_2025-day10.txt";
// const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

// The input gives these as little endian, but machines are parsed as big endian
class Machine {
    // A bitset where bit at i is if it needs to be toggled.
    readonly indicator_bits: number;

    // A bitset where bit at i means button j (in array) toggles all corresponding bits
    readonly buttons_bits: Array<number>;
    readonly buttons: Array<Array<number>>;

    // Numbers that correspond to the target joltage for each bit in the indicator
    // Pressing a button means that its bits increment their joltage by 1
    readonly joltages: Array<number>;

    constructor(desired_indicator: number,
        button_schematic_bits: Array<number>,
        button_schematic_nums: Array<Array<number>>,
        joltage_requirements: Array<number>) {
        this.indicator_bits = desired_indicator;
        this.buttons_bits = button_schematic_bits;
        this.buttons = button_schematic_nums;
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

        // We can safely decompose buttons into binary values due to input constraints
        let button_bits = new Array<number>(wir_strs.length);
        let button_nums = new Array<Array<number>>(wir_strs.length);
        for (let w = 0; w < button_bits.length; w++) {
            const button_list = wir_strs[w]!;
            button_nums[w] = button_list
                .slice(1, button_list.length - 1)
                .split(',')
                .map(value => +value);

            // Each button layout in surrounded by parentheses
            let button = 0;
            for (let shift of button_nums[w]!) {
                button |= (1 << shift);
            }
            button_bits[w] = button;
        }

        // Joltages are just decimal numbers and have been stripped of delimiters
        let joltages = new Array<number>(jol_strs.length);
        jol_strs.forEach((value, index) => joltages[index] = parseInt(value));

        machines[i] = new Machine(indicator, button_bits, button_nums, joltages);
    }

    return machines;
}

// Constant memory powerset using generator.
//
// https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript-powerset-of-array
function* getButtonPowerset(buttons: Array<number>, offset: number = 0): Generator<Array<number>> {
    while (offset < buttons.length) {
        let first = buttons[offset++]!;
        for (let subset of getButtonPowerset(buttons, offset)) {
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
        for (const set of getButtonPowerset(machine.buttons_bits)) {
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

// Initialize a slice of length `m` with the contents `[0, 0, ..., n]` and then
// repeatedly call this function to obtain all possible combinations of `m`
// integers that sum to `n`. The function returns `false` if there is no other
// combination.
function nextCombination(combinations: Array<number>): boolean {
    let i = combinations.findLastIndex(v => v != 0);
    if (i == -1) throw new Error("No non-zero values");
    else if (i == 0) return false;

    let v = combinations[i]!;
    combinations[i - 1]! += 1;
    combinations[i] = 0;
    combinations[combinations.length - 1] = v - 1;
    return true;
}

function isButtonAvailable(i: number, mask: number): boolean {
    return (mask & (1 << i)) > 0;
}

type Entry = { i: number, v: number, key: [number, number] };

function findMin(
    joltage: Array<number>,
    available_buttons_mask: number,
    buttons: Array<Array<number>>,
): [number, number] {
    const candidates: Array<Entry> = joltage
        .map((v, i) => ({ i, v }))
        .filter(({ v }) => v > 0)
        .map(({ i, v }) => {
            const buttonCount = buttons
                .map((b, j) => ({ b, j }))
                .filter(({ j, b }) => isButtonAvailable(j, available_buttons_mask) && b.includes(i))
                .length;

            // We negate the highest joltage to mirror Rust min_by_key usage
            return { i, v, key: [buttonCount, -v] };
        });

    // Reduce using lexicographic key comparison
    if (candidates.length == 0) throw new Error("No non-zero values");
    const best = candidates.reduce((a, b) => {
        const [a1, a2] = a.key;
        const [b1, b2] = b.key;

        if (a1 != b1) return a1 < b1 ? a : b;
        return a2 < b2 ? a : b;
    });

    return [best.i, best.v];
}

// DFS solution with branch pruning.
//
// Adopted from Rust code shared by a user on reddit:
// https://github.com/michel-kraemer/adventofcode-rust/blob/main/2025/day10/src/main.rs
function twoDFS(joltage: Array<number>, available_button_mask: number, buttons: Array<Array<number>>): number {
    if (joltage.every(j => j == 0)) return 0;

    // Finding the joltage with the lowest number of combinations prunes branches as early as possible
    const [mini, min] = findMin(joltage, available_button_mask, buttons);

    // Get the buttons affected the joltage at position mini
    const matching_buttons: Array<[number, Array<number>]> = buttons
        .map((b, i) => [i, b] as [number, number[]])
        .filter(([i, b]) => isButtonAvailable(i, available_button_mask) && b.includes(mini));
    let result = Number.MAX_SAFE_INTEGER;

    if (matching_buttons.length > 0) {
        // Create a new mask to prevent adverse side effects
        let new_mask = available_button_mask;
        matching_buttons.forEach(([i, _]) => new_mask &= ~(1 << i));

        // Try all combinations of matching buttons
        let new_joltage = joltage.slice();
        let counts = new Array<number>(matching_buttons.length).fill(0);
        counts[matching_buttons.length - 1] = min;

        while (true) {
            let good = true;
            new_joltage = joltage.slice();

            outer:
            for (let bi = 0; bi < counts.length; bi++) {
                const cnt = counts[bi]!;
                if (cnt == 0) continue;

                const [_, button] = matching_buttons[bi]!;
                for (let j of button) {
                    if (new_joltage[j]! >= cnt) {
                        new_joltage[j]! -= cnt;
                    } else {
                        good = false;
                        break outer;
                    }
                }
            }

            // Recuse with decreased joltage values and with remaining buttons
            if (good) {
                let r = twoDFS(new_joltage, new_mask, buttons);
                if (r != Number.MAX_SAFE_INTEGER) {
                    result = Math.min(result, min + r);
                }
            }

            // Try the next combination, or stop the infinite loop if there isn't one
            if (!nextCombination(counts)) break;
        }
    }

    return result;
}

function two(machines: Array<Machine>): number {
    let total_fewest = 0;
    for (const machine of machines) {
        total_fewest += twoDFS(machine.joltages, (1 << machine.buttons.length) - 1, machine.buttons);
    }
    return total_fewest;
}

const machines = await parseInputLines(input_path);
const part_one = one(machines);
console.log("Part one result: ", part_one);
const part_two = two(machines);
console.log("Part two result: ", part_two);
