const input_path: string = "input_2025-day7.txt";
// const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

async function one(): Promise<number> {
    const lines = await readInputLines(input_path);

    let total_split = 0;
    let beams = new Array<boolean>(lines[0]!.length).fill(false);

    // The first line starts the beam with an S, and there is only one
    const first_line = lines[0]!;
    beams[first_line.indexOf("S")] = true;

    // The lines in between splitters aren't necessary, and neither is the last line
    for (let i = 2; i < lines.length - 1; i += 2) {
        const line = lines[i]!;

        for (let j = 0; j < line.length; j++) {
            // We only care about where a splitter is, which is given by a carrot
            if (line[j]! === "^" && beams[j]!) {
                // Hitting a splitter blocks below but propagates left and right
                // Bounds checking can be smart, but the input is structured that these are valid
                beams[j]! = false;
                beams[j - 1]! = true;
                beams[j + 1]! = true;

                total_split += 1;
            }
        }
    }

    return total_split;
}

async function two(): Promise<number> {
    const lines = await readInputLines(input_path);
    let beams = new Array<number>(lines[0]!.length).fill(0);

    // The first line starts the beam with an S, and there is only one
    const first_line = lines[0]!;
    beams[first_line.indexOf("S")] = 1;

    // The lines in between splitters aren't necessary, and neither is the last line
    for (let i = 2; i < lines.length; i += 2) {
        const line = lines[i]!;

        for (let j = 0; j < line.length; j++) {
            // We only care about where a splitter is, which is given by a carrot
            if (line[j]! === "^" && beams[j]! != 0) {
                // Hitting a splitter blocks below but propagates left and right at the same time
                if (beams[j - 1]! == 0) {
                    beams[j - 1]! = beams[j]!;
                } else {
                    beams[j - 1]! += beams[j]!;
                }

                if (beams[j + 1]! == 0) {
                    beams[j + 1]! = beams[j]!;
                } else {
                    beams[j + 1]! += beams[j]!;
                }

                beams[j]! = 0;
            }
        }
    }

    return beams.reduce((a, b) => a + b);
}

const part_one = await one();
console.log("Part one result: ", part_one);
const part_two = await two();
console.log("Part two result: ", part_two);
