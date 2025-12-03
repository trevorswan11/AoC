public class Solution
{
    readonly string Input;
    readonly string[] InputLines;

    public Solution(string path)
    {
        Input = File.ReadAllText(path);
        InputLines = Input.Split(new[] { "\r\n", "\n", "\r" }, StringSplitOptions.None)
            .Where(line => line.Length > 0).ToArray();
    }

    private static int Normalize(int dial, int adj) => (dial + adj) % 100;

    public int One()
    {
        int lock_dial = 50;
        int zero_clicks = 0;

        foreach (var line in InputLines)
        {
            int sign = line[0] == 'R' ? 1 : -1;
            string digits = line[1..];
            int adj = sign * int.Parse(digits);

            lock_dial = Normalize(lock_dial, adj);
            if (lock_dial == 0) zero_clicks += 1;
        }

        return zero_clicks;
    }

    public int Two()
    {
        int lock_dial = 50;
        int zero_clicks = 0;

        foreach (var line in InputLines)
        {
            int sign = line[0] == 'R' ? 1 : -1;
            int steps = int.Parse(line[1..]);

            // Compute the passes directly and remaining steps
            zero_clicks += steps / 100;
            int rem = steps % 100;
            int start = lock_dial;

            // We only have to consider wrapping operations for overflows
            if (rem > 0)
            {
                if (sign == 1)
                {
                    // Check if the rotation crosses or lands on the the 99 -> 0 boundary.
                    if (start + rem >= 100)
                    {
                        zero_clicks += 1;
                    }
                }
                else
                {
                    // Check if the rotation crossed the 1 -> 0 boundary and were not at zero already.
                    if (start != 0 && start - rem <= 0)
                    {
                        zero_clicks += 1;
                    }
                }

                int next_dial_temp = start + sign * rem;
                lock_dial = (next_dial_temp % 100 + 100) % 100;
            }
        }

        return zero_clicks;
    }

    public static void Main(string[] Args)
    {
        Solution solution = new("input_2025-day1.txt");
        int result1 = solution.One();
        Console.WriteLine($"Part one result: {result1}");
        int result2 = solution.Two();
        Console.WriteLine($"Part two result: {result2}");
    }
}
