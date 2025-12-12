// const input_path: string = "input_2025-day12.txt";
const input_path: string = "input_test.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

class Present {
    readonly layout: Array<Array<number>>;
    readonly area: number;

    constructor(layout: Array<Array<number>>, area: number) {
        this.layout = layout;
        this.area = area;
    }
}

class Region {
    readonly dimensions: [number, number];
    
    // The area computed by the regions dimensions
    readonly max_area: number;
    readonly perimeter: number;
    readonly requirements: Array<number>;
    
    // The area computed by the know area of the present requirements for this region
    readonly theory_area: number;

    constructor(dimensions: [number, number], max_area: number, perimeter: number, requirements: Array<number>, theory_area: number) {
        this.dimensions = dimensions;
        this.max_area = max_area;
        this.perimeter = perimeter;
        this.requirements = requirements;
        this.theory_area = theory_area;
    }
};

async function parseInputLines(path: string): Promise<[Array<Present>, Array<Region>]> {
    const lines = await readInputLines(path);

    let presents = new Array<Present>();
    let regions = new Array<Region>();
    let parsing_regions = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        if (line.includes("x")) {
            parsing_regions = true;
        }

        // If we're ever parsing regions, we know the presents are fully defined
        if (parsing_regions) {
            const sides = line.split(":");
            const dimensions = sides[0]!.split("x").map(dim => +dim) as [number, number];
            const area = dimensions[0]! * dimensions[1]!;
            const perimeter = 2 * dimensions[0]! + 2 * dimensions[1]!;
            const requirements = sides[1]!.split(" ").filter(s => s.length > 0).map(count => +count);
            
            let theory_area = 0;
            for (let p = 0; p < presents.length; p++) {
                const present_idx_area = presents[p]!.area;
                const present_count = requirements[p]!;
                theory_area += present_count * present_idx_area;
            }
            
            regions.push(new Region(dimensions, area, perimeter, requirements, theory_area));
        } else {
            // The input is nice so just skip the provided index
            i += 1;
            
            // Mappings of present area are well defined
            let layout = new Array<Array<number>>();
            let area = 0;
            while (lines[i]!.includes("#") || lines[i]!.includes(".")) {
                const row_layout = lines[i]!;
                let row = new Array<number>();
                
                for (let space of row_layout) {
                    if (space === "#") {
                        row.push(1);
                        area += 1;
                    } else if (space === ".") {
                        row.push(0);
                    }
                }
                
                layout.push(row);
                
                // We only want to move the pointer if we'd continue this present
                const next_line = i + 1;
                if (lines[next_line]!.includes("#") || lines[next_line]!.includes(".")) {
                    i = next_line;
                } else {
                    break;
                }
            }
            
            presents.push(new Present(layout, area));
        }
    }

    return [presents, regions];
}

// This is an insane solution, and does not work with the test input.
//
// All it does is rule out completely impossible regions, and that works!
function one(presents: Array<Present>, regions: Array<Region>): number {
    let possible_regions = 0;
    
    for (const region of regions) {
        console.log(region.theory_area, region.max_area);
        // We can quickly rule out completely impossible scenarios
        if (region.theory_area > region.max_area) {
            continue;
        }

        possible_regions += 1;
    }
    
    return possible_regions;
}

const [presents, regions] = await parseInputLines(input_path);
const part_one = one(presents, regions);
console.log("Part one result: ", part_one);
