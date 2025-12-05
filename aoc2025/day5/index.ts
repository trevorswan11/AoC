const input_path: string = "input_2025-day5.txt";

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

let buckets: Array<Range> = new Array<Range>();
let ids: Array<number> = new Array<number>();

const lines = await readInputLines(input_path);
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
        buckets.push(new Range(parseInt(numbers[0]!), parseInt(numbers[1]!)));
    }
}

console.log(buckets.length);
console.log(ids.length);
