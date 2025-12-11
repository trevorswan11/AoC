using Microsoft.Z3;
using System.Runtime.InteropServices;

class Solution
{
    public class Machine
    {
        // Bitset where bit i is required to be toggled.
        public int IndicatorBits { get; }

        // Bitset form of each wiring's toggles
        public List<int> WiringBits { get; }

        // Explicit numeric list of toggle locations per button
        public List<List<int>> Wirings { get; }

        // Numeric jolt requirements for part 2 only
        public List<int> Joltages { get; }

        public Machine(int desiredIndicator,
                       List<int> wiringBits,
                       List<List<int>> wiringNums,
                       List<int> joltageRequirements)
        {
            IndicatorBits = desiredIndicator;
            WiringBits = wiringBits;
            Wirings = wiringNums;
            Joltages = joltageRequirements;
        }
    }

    readonly string[] InputLines;
    readonly List<Machine> Machines;

    public Solution(string path)
    {
        string input = File.ReadAllText(path);
        InputLines = input.Split(new[] { "\r\n", "\n", "\r" }, StringSplitOptions.None)
            .Where(line => line.Length > 0).ToArray();
        Machines = new List<Machine>(InputLines.Length);

        foreach (var line in InputLines)
        {
            // Extract [###..] indicator section
            int indStart = line.IndexOf('[');
            int indEnd = line.LastIndexOf(']');
            string indStr = line.Substring(indStart, indEnd - indStart + 1);

            // Parse indicator pattern into a binary value
            int indicator = 0;
            for (int j = 1; j < indStr.Length - 1; j++)
            {
                int bitIndex = j - 1;
                if (indStr[j] == '#') indicator |= (1 << bitIndex);
            }

            // Extract (...) wiring sections
            int wirStart = line.IndexOf('(');
            int wirEnd = line.LastIndexOf(')');
            string wirBlock = line.Substring(wirStart, wirEnd - wirStart + 1);
            string[] wirStrs = wirBlock.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            // Parse wiring patterns into both the binary form (1) and explicit form (2)
            var wiringBits = new List<int>(wirStrs.Length);
            var wiringNums = new List<List<int>>(wirStrs.Length);

            foreach (var wstr in wirStrs)
            {
                string inside = wstr.Substring(1, wstr.Length - 2);
                var shifts = inside.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                   .Select(int.Parse)
                                   .ToList();

                wiringNums.Add(shifts);

                // This bitmask is safe since the input limits button length
                int bitmask = 0;
                foreach (int shift in shifts) bitmask |= (1 << shift);

                wiringBits.Add(bitmask);
            }

            // Extract {1,2,3} joltage numbers
            int jolStart = line.IndexOf('{') + 1;
            int jolEnd = line.LastIndexOf('}');
            string[] jolStrs = line.Substring(jolStart, jolEnd - jolStart)
                                   .Split(',', StringSplitOptions.RemoveEmptyEntries);

            // Explicitly parse the joltages
            var joltages = jolStrs.Select(int.Parse).ToList();
            Machines.Add(new Machine(indicator, wiringBits, wiringNums, joltages));
        }
    }

    // Constant memory power set using generator.
    private static IEnumerable<List<int>> ButtonPowerSet(List<int> items)
    {
        int n = items.Count;
        int total = 1 << n;

        for (int mask = 1; mask < total; mask++)  // skip empty set
        {
            var subset = new List<int>();
            for (int i = 0; i < n; i++)
                if ((mask & (1 << i)) != 0)
                    subset.Add(items[i]);
            yield return subset;
        }
    }

    public int One()
    {
        int sum_of_fewest = 0;
        foreach (var machine in Machines)
        {
            var best_subset = int.MaxValue;

            // Super brute force, but reduction is xor so order independent
            foreach (var set in ButtonPowerSet(machine.WiringBits))
            {
                // The power set contains the empty set by definition
                if (set.Count == 0) continue;

                var result = set.Aggregate((a, b) => a ^ b);
                if (machine.IndicatorBits == result)
                {
                    best_subset = Math.Min(best_subset, set.Count);
                }
            }

            sum_of_fewest += best_subset;
        }

        return sum_of_fewest;
    }

    public long Two()
    {
        long sum_of_fewest = 0;
        foreach (var machine in Machines)
        {
            using var ctx = new Context();
            using var opt = ctx.MkOptimize();

            // Generate all of the presses and constrain them to be positive
            var presses_list = Enumerable.Range(0, machine.Wirings.Count)
                .Select(i => ctx.MkIntConst($"p{i}"))
                .ToList();
            presses_list.ForEach(press => opt.Add(ctx.MkGe(press, ctx.MkInt(0))));
            var presses = presses_list.ToArray();

            // Constrain the button sums to be equal to the corresponding joltages
            for (int i = 0; i < machine.Joltages.Count; i++)
            {
                var affecting = presses.Where((_, j) => machine.Wirings[j].Contains(i)).ToArray();
                if (affecting.Length > 0)
                {
                    var sum = affecting.Length == 1 ? affecting[0] : ctx.MkAdd(affecting);
                    opt.Add(ctx.MkEq(sum, ctx.MkInt(machine.Joltages[i])));
                }
            }

            // Now we can run the optimizer
            opt.MkMinimize(presses.Length == 1 ? presses[0] : ctx.MkAdd(presses));
            if (opt.Check() != Status.SATISFIABLE) return -1;

            sum_of_fewest += presses.Sum(p => ((IntNum)opt.Model.Evaluate(p, true)).Int64);
        }
        return sum_of_fewest;
    }

    public static void Main(string[] Args)
    {
        const string input_path = "input_2025-day10.txt";
        // const string input_path = "input_test.txt";
        Solution solution = new Solution(input_path);

        int result1 = solution.One();
        Console.WriteLine($"Part one result: {result1}");

        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            Console.WriteLine($"Part two result: None (Cannot run Z3 on non-Windows systems)");
        }
        else
        {
            long result2 = solution.Two();
            Console.WriteLine($"Part two result: {result2}");
        }
    }
}
