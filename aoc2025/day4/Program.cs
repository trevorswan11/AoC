public class Solution
{
    readonly int[][] directions = new[]
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

    public int One()
    {
        int accessible = 0;
        for (int row = 0; row < TotalRows; row++)
        {
            for (int column = 0; column < TotalColumns; column++)
            {
                char query = InputRolls[row][column];
                if (query != '@') continue;

                int surrounding = 0;
                foreach (var direction in directions)
                {
                    int row_query = row + direction[0];
                    int column_query = column + direction[1];

                    bool invalid_row = row_query < 0 || row_query >= TotalRows;
                    bool invalid_column = column_query < 0 || column_query >= TotalColumns;
                    if (invalid_row || invalid_column) continue;


                    if (InputRolls[row_query][column_query] == '@') surrounding += 1;
                }

                if (surrounding < 4) accessible += 1;
            }
        }

        return accessible;
    }

    public int Two()
    {
        // Modifications are done to this array on a rolling basis
        char[][] modify_rolls = InputRolls.Select(arr => arr.ToArray()).ToArray();

        int total_accessible = 0;
        int iter_accessible = 0;

        do
        {
            // This array mirrors the modify rolls, but does not update removes
            char[][] iter_rolls = modify_rolls.Select(arr => arr.ToArray()).ToArray();

            iter_accessible = 0;
            for (int row = 0; row < TotalRows; row++)
            {
                for (int column = 0; column < TotalColumns; column++)
                {
                    char query = iter_rolls[row][column];
                    if (query != '@') continue;

                    int surrounding = 0;
                    foreach (var direction in directions)
                    {
                        int row_query = row + direction[0];
                        int column_query = column + direction[1];

                        bool invalid_row = row_query < 0 || row_query >= TotalRows;
                        bool invalid_column = column_query < 0 || column_query >= TotalColumns;
                        if (invalid_row || invalid_column) continue;


                        if (iter_rolls[row_query][column_query] == '@') surrounding += 1;
                    }

                    if (surrounding < 4)
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
        // Solution solution = new("input_test.txt");
        int result1 = solution.One();
        Console.WriteLine($"Part one result: {result1}");
        int result2 = solution.Two();
        Console.WriteLine($"Part two result: {result2}");
    }
}
