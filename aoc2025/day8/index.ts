// const input_path: string = "input_2025-day8.txt";
const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

function one(): number {
    return 0;
}

function two(): number {
    return 0;
}

const lines = await readInputLines(input_path);
const part_one = one();
console.log("Part one result: ", part_one);
const part_two = two();
console.log("Part two result: ", part_two);
