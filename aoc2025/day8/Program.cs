class Solution
{
    struct Junction
    {
        public int X;
        public int Y;
        public int Z;

        public Junction(int x, int y, int z)
        {
            X = x;
            Y = y;
            Z = z;
        }
    };

    readonly string[] InputLines;
    readonly Junction[] JunctionBoxes;

    public Solution(string path)
    {
        string input = File.ReadAllText(path);
        InputLines = input.Split(new[] { "\r\n", "\n", "\r" }, StringSplitOptions.None)
            .Where(line => line.Length > 0).ToArray();
        JunctionBoxes = InputLines.Select(line => line.Split(','))
            .Select(vals => new Junction(int.Parse(vals[0]), int.Parse(vals[1]), int.Parse(vals[2])))
            .ToArray();
    }

    struct EuclideanDistance
    {
        public int IndexA;
        public int IndexB;
        public long Distance;

        public EuclideanDistance(int a, int b, long distance)
        {
            IndexA = a;
            IndexB = b;
            Distance = distance;
        }
    };

    private static long DistanceSquared(Junction a, Junction b)
    {
        long dx = a.X - b.X;
        long dy = a.Y - b.Y;
        long dz = a.Z - b.Z;
        return dx * dx + dy * dy + dz * dz;
    }

    private List<EuclideanDistance> MakeSortedDistances()
    {
        int junction_count = JunctionBoxes.Length;
        int number_of_edges = (junction_count * (junction_count - 1)) / 2;
        var distances = new List<EuclideanDistance>(number_of_edges);

        // Generate pairwise euclidean distances for all combinations
        for (int i = 0; i < junction_count; i++)
        {
            for (int j = i + 1; j < junction_count; j++)
            {
                long distance = DistanceSquared(JunctionBoxes[i], JunctionBoxes[j]);
                distances.Add(new EuclideanDistance(i, j, distance));
            }
        }

        // Sort the distances to follow Kruskal's algorithm
        distances.Sort((a, b) => a.Distance.CompareTo(b.Distance));
        return distances;
    }

    private (int[], int[]) MakeDSU()
    {
        int junction_count = JunctionBoxes.Length;

        // Parent and rank align with Disjoint Union Set algorithm/ds
        var parent = new int[junction_count];
        var rank = new int[junction_count];
        for (int i = 0; i < junction_count; i++)
        {
            parent[i] = i;
            rank[i] = 0;
        }

        return (parent, rank);
    }

    // Direct implementation from this page: https://en.wikipedia.org/wiki/Disjoint-set_data_structure
    public long One(int number_to_take)
    {
        int junction_count = JunctionBoxes.Length;
        var distances = MakeSortedDistances();
        var top_pairs = distances.Take(number_to_take).ToList();
        var (parent, rank) = MakeDSU();

        foreach (var distance in top_pairs)
        {
            Union(parent, rank, distance.IndexA, distance.IndexB);
        }

        // This is the MakeSet function from the wiki
        var network_sizes = new Dictionary<int, int>();
        for (int i = 0; i < junction_count; i++)
        {
            int root = Find(parent, i);
            if (!network_sizes.ContainsKey(root))
            {
                network_sizes[root] = 0;
            }
            network_sizes[root] += 1;
        }

        var largest_three = network_sizes.Values.OrderByDescending(x => x).Take(3).ToArray();
        long result = (long)largest_three[0] * largest_three[1] * largest_three[2];
        return result;
    }

    public long Two()
    {
        var distances = MakeSortedDistances();
        var (parent, rank) = MakeDSU();

        // We're taking all distances since we place everything in a single circuit now
        int component_count = JunctionBoxes.Length;
        foreach (var distance in distances)
        {
            int root_a = Find(parent, distance.IndexA);
            int root_b = Find(parent, distance.IndexB);

            if (root_a != root_b)
            {
                Union(parent, rank, distance.IndexA, distance.IndexB);
                component_count--;

                // We can return out of the loop once we have only one component left
                if (component_count == 1)
                {
                    return (long)JunctionBoxes[distance.IndexA].X * JunctionBoxes[distance.IndexB].X;
                }
            }
        }

        // This realistically should never be reached
        return -1;
    }

    private static int Find(int[] parent, int x)
    {
        if (parent[x] != x)
        {
            parent[x] = Find(parent, parent[x]);
        }
        return parent[x];
    }

    private static void Union(int[] parent, int[] rank, int x, int y)
    {
        int root_x = Find(parent, x);
        int root_y = Find(parent, y);

        // If x and y are already in the same set then return
        if (root_x == root_y)
        {
            return;
        }

        // Slightly different from wikipedia page because we're using an array of parents rather than members
        if (rank[root_x] < rank[root_y])
        {
            parent[root_x] = root_y;
        }
        else if (rank[root_x] > rank[root_y])
        {
            parent[root_y] = root_x;
        }
        else
        {
            parent[root_y] = root_x;
            rank[root_x] += 1;
        }
    }

    public static void Main(string[] Args)
    {
        const string input_path = "input_2025-day8.txt";
        // const string input_path = "input_test.txt";
        Solution solution = new Solution(input_path);

        long result1 = solution.One(input_path.Equals("input_test.txt") ? 10 : 1000);
        Console.WriteLine($"Part one result: {result1}");

        long result2 = solution.Two();
        Console.WriteLine($"Part two result: {result2}");
    }
}
