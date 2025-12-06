const input_path: string = "input_2025-day5.txt";
// const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.trimEnd().split(/\r?\n/);
}

class Range {
    lower: number;
    upper: number;

    constructor(lower_bound: number, upper_bound: number) {
        this.lower = lower_bound;
        this.upper = upper_bound;
    }
}

async function parseInputLines(
    path: string,
): Promise<[Array<Range>, Array<number>]> {
    let buckets: Array<Range> = new Array<Range>();
    let ids: Array<number> = new Array<number>();

    const lines = await readInputLines(path);
    let populate_ids: boolean = false;

    for (let line of lines) {
        if (line.length == 0) {
            populate_ids = true;
            continue;
        }

        // The input is split at a newline to go from range to id
        if (populate_ids) {
            ids.push(parseInt(line));
        } else {
            const numbers = line.split("-");
            buckets.push(
                new Range(parseInt(numbers[0]!), parseInt(numbers[1]!)),
            );
        }
    }

    return [buckets, ids];
}

function one(buckets: Array<Range>, fresh: Array<number>): number {
    let number_fresh = 0;

    for (let target of fresh) {
        for (let bucket of buckets) {
            // A fresh id should only be counted once in a pass
            if (target >= bucket.lower && target <= bucket.upper) {
                number_fresh += 1;
                break;
            }
        }
    }

    return number_fresh;
}

function two(buckets: Array<Range>): number {
    let total_fresh = 0;
    buckets.sort((a: Range, b: Range) => a.lower - b.lower);

    let current_lower = buckets[0]!.lower;
    let current_upper = buckets[0]!.upper;

    for (let bucket of buckets) {
        if (bucket.lower > current_upper + 1) {
            // disjoint interval: count previous one
            total_fresh += current_upper - current_lower + 1;
            current_lower = bucket.lower;
            current_upper = bucket.upper;
        } else {
            // overlapping or touching: extend
            current_upper = Math.max(current_upper, bucket.upper);
        }
    }

    // add last merged interval
    total_fresh += current_upper - current_lower + 1;

    return total_fresh;
}

const input = parseInputLines(input_path);
let [buckets, ids] = await input;

const part_one = one(buckets, ids);
console.log("Part one result: ", part_one);
const part_two = two(buckets);
console.log("Part two result: ", part_two);
