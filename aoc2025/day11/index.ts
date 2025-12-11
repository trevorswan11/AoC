const input_path: string = "input_2025-day11.txt";
// const input_path: string = "input_test1.txt";
// const input_path: string = "input_test2.txt";

async function readInputLines(path: string): Promise<Array<string>> {
    const input = await Bun.file(path).text();
    return input.split(/\r?\n/).filter((line) => line.length > 0);
}

type Graph = Record<string, Set<string>>

async function parseInputLines(path: string): Promise<Graph> {
    const lines = await readInputLines(path);
    let graph: Graph = {};
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        const [head, rest] = line.split(':');
        const nodes = rest!.split(' ').filter(str => str.length > 0)
        graph[head!] = new Set(nodes);
    }
    return graph;
}

function findAllParents(graph: Graph, key: string): Graph {
    const Q = [key];
    const parents: Graph = {};

    // BFS over the graph with a queue to get parents
    while (Q.length > 0) {
        const v = Q.shift()!;
        const neighbors = graph[v] ?? [];
        for (const w of neighbors) {
            if (!parents[w]) {
                parents[w] = new Set();
            }
            parents[w].add(v);
            Q.push(w);
        }
    }

    return parents;
}

function findAllPaths(parents: Graph, from: string, to: string): Array<Array<string>> {
    if (from === to) return [[from]];

    const p = parents[to];
    if (!p) return [];

    const result = new Array<Array<string>>();
    for (const x of p) {
        const subpaths = findAllPaths(parents, from, x);
        for (const y of subpaths) {
            result.push([...y, to]);
        }
    }
    return result;
}

// Finds all paths between you and out.
//
// Using BFS algorithm implemented in Python here:
// https://stackoverflow.com/questions/9535819/find-all-paths-between-two-graph-nodes
function one(graph: Graph): number {
    const your_parents = findAllParents(graph, "you");
    const paths = findAllPaths(your_parents, "you", "out");
    return paths.length;
}

function countConstrainedSvrOutPaths(
    graph: Graph,
    from: string,
    to: string,
    needs_fft: boolean = true,
    needs_dac: boolean = true,
    memo = new Map<string, number>()
): number {
    const key = `${from}|${needs_fft}|${needs_dac}`;
    if (memo.has(key)) return memo.get(key)!;

    // Check if we need to meet constraints still and memoize for the node
    const still_needs_fft = needs_fft && from !== "fft";
    const still_needs_dac = needs_dac && from !== "dac";

    if (from === to) {
        const val = (still_needs_fft || still_needs_dac) ? 0 : 1;
        memo.set(key, val);
        return val;
    }

    // Recursively count paths forwards through the graph
    let total_paths = 0;
    for (const next of graph[from] ?? []) {
        total_paths += countConstrainedSvrOutPaths(
            graph,
            next,
            to,
            still_needs_fft,
            still_needs_dac,
            memo
        );
    }

    memo.set(key, total_paths);
    return total_paths;
}

// Uses memoized DFS to count the paths from svr to out that go through fft and dac
function two(graph: Graph): number {
    return countConstrainedSvrOutPaths(graph, "svr", "out");
}

const graph = await parseInputLines(input_path);

if (input_path !== "input_test2.txt") {
    const part_one = one(graph);
    console.log("Part one result: ", part_one);
}

if (input_path !== "input_test1.txt") {
    const part_two = two(graph);
    console.log("Part two result: ", part_two);
}
