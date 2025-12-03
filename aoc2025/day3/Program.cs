public class Solution
{
    struct ValueIndexPair
    {
        public int Value;
        public int Index;
    }

    readonly string[] InputLines;
    readonly ValueIndexPair[][] InputValues;
    readonly ulong[] BestsFactors;

    public Solution(string path)
    {
        string input = File.ReadAllText(path);
        InputLines = input.Split('\n').Where(line => line.Length > 0).ToArray();
        InputValues = InputLines.Select(line => line.Select(c => c - '0').ToArray())
            .Select(vals => vals.Select((value, index) => new ValueIndexPair { Value = value, Index = index }).ToArray())
            .ToArray();

        BestsFactors = new ulong[12];
        for (int i = 0; i < BestsFactors.Length; i++)
        {
            BestsFactors[i] = (ulong)Math.Pow(10, 11 - i);
        }
    }

    public int One()
    {
        int joltage = 0;
        foreach (var values in InputValues)
        {
            // The first digit must be the maximum in the first n-1 digits
            // Using equiv compare prioritizes the first occurrence of the max
            var first_digit = values.Take(values.Length - 1)
                .Aggregate((a, b) => (a.Value >= b.Value) ? a : b);

            // The second digit is now in the remaining part of the line
            // Using equiv compare not necessary here, but done for unity
            var second_digit = values.Skip(first_digit.Index + 1)
                .Aggregate((a, b) => (a.Value >= b.Value) ? a : b);

            int value = first_digit.Value * 10 + second_digit.Value;
            joltage += value;
        }

        return joltage;
    }

    public ulong Two()
    {
        ulong joltage = 0;

        ValueIndexPair[] bests = new ValueIndexPair[12];
        foreach (var values in InputValues)
        {
            // The first digit must be the maximum in the first n-13 digits
            // Using equiv compare prioritizes the first occurrence of the max
            var first_digit = values.Take(values.Length - 12)
                .Aggregate((a, b) => (a.Value >= b.Value) ? a : b);
            bests[0] = first_digit;

            // Grab the best 11 batteries remaining to pack
            for (int i = 1; i < 12; i++)
            {
                var last_best = bests[i - 1];
                int required_remaining = 12 - i;

                // The next digit is now in the remaining part of the line
                // Using equiv compare necessary here to not consume too much
                var next_best = values.Skip(last_best.Index + 1)
                    .Aggregate((a, b) => (a.Value >= b.Value) ? a : b);
                int actual_remaining = values.Length - next_best.Index;
                Console.WriteLine($"{actual_remaining} of {required_remaining}");

                // If we're going to run out of digits, we greedily consume
                if (actual_remaining < required_remaining)
                {
                    var acceptable_best = values.Skip(last_best.Index + 1)
                        .Take(next_best.Index + 1)
                        .Aggregate((a, b) => (a.Value >= b.Value) ? a : b);
                    bests[i] = acceptable_best;
                    continue;
                }

                bests[i] = next_best;
            }


            // Use precomputed factors to create the resulting value
            ulong value = 0;
            for (int i = 0; i < BestsFactors.Length; i++)
            {
                value += (ulong)bests[i].Value * BestsFactors[i];
            }

            Console.WriteLine(value);

            joltage += value;
        }

        return joltage;
    }

    public static void Main(string[] Args)
    {
        // Solution solution = new("input_2025-day3.txt");
        Solution solution = new("input_test.txt");
        int result1 = solution.One();
        Console.WriteLine($"Part one result: {result1}");
        ulong result2 = solution.Two();
        Console.WriteLine($"Part two result: {result2}");
    }
}
