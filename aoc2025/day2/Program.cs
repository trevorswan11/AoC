using System;
using System.Linq;
using System.Collections.Generic;

public class Solution
{
    readonly string[][] InputBounds;

    public Solution(string path)
    {
        string input = File.ReadAllText(path);
        InputBounds = input.Split(',').Select(line => line.Split('-')).ToArray();
    }

    private static int CountDigits(ulong number) => number > 0 ? (int)Math.Floor(Math.Log10(number)) + 1 : 1;

    public ulong One()
    {
        ulong invalid_sum = 0;

        foreach (var bound in InputBounds)
        {
            ulong lower = ulong.Parse(bound[0]);
            ulong upper = ulong.Parse(bound[1]);

            for (ulong val = lower; val <= upper; val++)
            {
                int digits = CountDigits(val);
                if (digits % 2 != 0) continue;
                int halfway_point = digits / 2;

                string val_str = val.ToString();
                string first_half = val_str[0..halfway_point];
                string second_half = val_str[halfway_point..];

                if (first_half.Equals(second_half))
                {
                    invalid_sum += val;
                }
            }
        }

        return invalid_sum;
    }

    private static bool IsInvalid(ulong n)
    {
        var s = n.ToString();
        int len = s.Length;

        for (int subLen = 1; subLen <= len / 2; subLen++)
        {
            if (len % subLen != 0) continue;
            string pattern = s.Substring(0, subLen);
            string repeated = string.Concat(Enumerable.Repeat(pattern, len / subLen));
            if (repeated == s) return true;
        }
        return false;
    }

    public ulong Two()
    {
        ulong invalid_sum = 0;

        foreach (var bound in InputBounds)
        {
            ulong lower = ulong.Parse(bound[0]);
            ulong upper = ulong.Parse(bound[1]);

            for (ulong val = lower; val <= upper; val++)
            {
                if (IsInvalid(val)) invalid_sum += val;
            }
        }

        return invalid_sum;
    }

    public static void Main(string[] Args)
    {
        Solution solution = new("input.txt");
        ulong result1 = solution.One();
        Console.WriteLine($"Part one result: {result1}");
        ulong result2 = solution.Two();
        Console.WriteLine($"Part two result: {result2}");
    }
}
