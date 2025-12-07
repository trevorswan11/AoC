const input_path: string = "input_2025-day6.txt";
// const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

enum Op {
    ADD,
    MUL,
}

class SensibleColumn {
    operation: Op;
    row_values: Array<number>;

    constructor(op: Op, rows: Array<number>) {
        this.operation = op;
        this.row_values = rows;
    }

    static async parseInputLines(path: string): Promise<Array<SensibleColumn>> {
        const lines = await readInputLines(path);

        // We can default initialize the columns array to save allocations
        const num_columns = lines[0]!
            .split(" ")
            .filter((str) => str.length > 0).length;
        let columns: Array<SensibleColumn> = new Array<SensibleColumn>(
            num_columns,
        );
        for (let i = 0; i < num_columns; i++) {
            columns[i] = new SensibleColumn(
                Op.ADD,
                new Array<number>(lines.length - 1),
            );
        }

        // Iterating through the lines is now easy with an allocated buffer
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]!;

            // The input is split by some amount of spaces
            const rows = line.split(" ").filter((str) => str.length > 0);
            for (let j = 0; j < rows.length; j++) {
                const row = rows[j]!;

                if (i != lines.length - 1) {
                    columns[j]!.row_values[i] = parseInt(row);
                } else {
                    columns[j]!.operation = row === "+" ? Op.ADD : Op.MUL;
                }
            }
        }

        return columns;
    }

    reducer(): (previous: number, next: number) => number {
        return (previous: number, next: number) => {
            switch (this.operation) {
                case Op.ADD:
                    return previous + next;
                case Op.MUL:
                    return previous * next;
            }
        };
    }
}

async function one(): Promise<number> {
    const columns = await SensibleColumn.parseInputLines(input_path);
    let grand_total: number = 0;

    // Finding this solution is as simple as folding every column based on op
    for (let column of columns) {
        grand_total += column.row_values.reduce(column.reducer());
    }

    return grand_total;
}

async function two(): Promise<number> {
    const lines = await readInputLines(input_path);
    let grand_total = 0;

    // These drive per-operator accumulation
    let column_accumulator = 0;
    let accumulator_operator = Op.ADD;

    // Since we didn't trim input and AoC is consistent, line[n] == line[m] for all
    for (let walker = 0; walker < lines[0]!.length; walker++) {
        // We know an operation starts at an operator, so go backwards
        if (lines.at(-1)![walker]! === "+" || lines.at(-1)![walker]! === "*") {
            // We hit a new operator, so we have to reset the accumulator and op
            grand_total += column_accumulator;

            // Each operator has its own default value to prevent zeroing out
            if (lines.at(-1)![walker]! === "+") {
                accumulator_operator = Op.ADD;
                column_accumulator = 0;
            } else if (lines.at(-1)![walker]! === "*") {
                accumulator_operator = Op.MUL;
                column_accumulator = 1;
            }
        }

        // Now we have to move down the lines until the operator line
        let top_down = 0;
        for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i]!;
            // We only want to accumulate valid digits
            if (line[walker]! !== " ") {
                top_down = 10 * top_down + parseInt(line[walker]!);
            } else {
                // Constraint: spaces mark the end of a number
                continue;
            }
        }

        // We can now add to the accumulator, making sure we don't zero out multiplies
        switch (accumulator_operator) {
            case Op.ADD:
                column_accumulator += top_down;
                break;
            case Op.MUL:
                // The inner digit parser may be zero right before the next operator cycle
                column_accumulator *= Math.max(1, top_down);
                break;
        }
    }

    // Add the final accumulator
    grand_total += column_accumulator;
    return grand_total;
}

const part_one = await one();
console.log("Part one result: ", part_one);
const part_two = await two();
console.log("Part two result: ", part_two);
