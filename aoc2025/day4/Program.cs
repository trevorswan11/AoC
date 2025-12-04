public class Solution
{
    static readonly int[][] directions = new[]
    {
        new[] { 1, -1  },
        new[] {  1, 0  },
        new[] {  1, 1  },
        new[] { 0, -1  },
        new[] {  0, 1  },
        new[] { -1, -1 },
        new[] {  -1, 0 },
        new[] {  -1, 1 },
    };

    readonly int TotalRows;
    readonly int TotalColumns;

    readonly string[] InputLines;
    readonly char[][] InputRolls;

    public Solution(string path)
    {
        string input = File.ReadAllText(path);
        InputLines = input.Split(new[] { "\r\n", "\n", "\r" }, StringSplitOptions.None)
            .Where(line => line.Length > 0).ToArray();
        InputRolls = InputLines.Select(line => line.ToCharArray()).ToArray();

        // The input array has lines of the same length, so column length is constant
        TotalRows = InputRolls.Length;
        TotalColumns = InputRolls[0].Length;
    }

    private static bool IsAccessible(char[][] rolls, int row, int col)
    {
        if (rolls[row][col] != '@') return false;

        int surrounding = 0;
        foreach (var direction in directions)
        {
            int row_query = row + direction[0];
            int column_query = col + direction[1];

            bool invalid_row = row_query < 0 || row_query >= rolls.Length;
            bool invalid_column = column_query < 0 || column_query >= rolls[0].Length;
            if (invalid_row || invalid_column) continue;

            if (rolls[row_query][column_query] == '@') surrounding += 1;
            if (surrounding >= 4) return false;
        }

        return true;
    }

    public int One()
    {
        int accessible = 0;
        for (int row = 0; row < TotalRows; row++)
        {
            for (int column = 0; column < TotalColumns; column++)
            {
                if (IsAccessible(InputRolls, row, column)) accessible += 1;
            }
        }

        return accessible;
    }

    public int Two()
    {
        // Modifications are done to this array on a rolling basis
        char[][] modify_rolls = new char[TotalRows][];
        for (int i = 0; i < TotalRows; i++)
        {
            modify_rolls[i] = new char[TotalColumns];
            Array.Copy(InputRolls[i], modify_rolls[i], TotalColumns);
        }

        // Pre-allocate the iteration array which mirrors modify_rolls
        char[][] iter_rolls = new char[TotalRows][];
        for (int i = 0; i < TotalRows; i++) iter_rolls[i] = new char[TotalColumns];

        int total_accessible = 0;
        int iter_accessible = 0;

        do
        {
            // Performing array copies is faster than LINQ ops here
            Array.Copy(modify_rolls, iter_rolls, TotalRows);
            for (int i = 0; i < TotalRows; i++) Array.Copy(modify_rolls[i], iter_rolls[i], TotalColumns);

            iter_accessible = 0;
            for (int row = 0; row < TotalRows; row++)
            {
                for (int column = 0; column < TotalColumns; column++)
                {
                    if (IsAccessible(iter_rolls, row, column))
                    {
                        iter_accessible += 1;
                        modify_rolls[row][column] = 'x';
                    }
                }
            }

            total_accessible += iter_accessible;
        } while (iter_accessible != 0);

        return total_accessible;
    }

    public static void Main(string[] Args)
    {
        Solution solution = new("input_2025-day4.txt");
        int result1 = solution.One();
        Console.WriteLine($"Part one result: {result1}");
        int result2 = solution.Two();
        Console.WriteLine($"Part two result: {result2}");
    }
}
