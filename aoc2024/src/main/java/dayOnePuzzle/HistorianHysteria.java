package dayOnePuzzle;

import java.util.HashMap;
import java.util.PriorityQueue;

import com.aoc.utils.*;

public class HistorianHysteria {
    private static Store type = Store.INT_ARRAY;

    protected static int[][] getPuzzle() {
        Read read = new Read(Path.getPath("dayOnePuzzle.txt"), type, "\\s+");
        return (int[][]) read.get();
    }

    protected static int[][] transpose(int[][] contents) {
        int[][] result = new int[2][];
        int[] left = new int[contents.length];
        int[] right = new int[contents.length];
        int i = 0;
        for (int[] line : contents) {
            left[i] = line[0];
            right[i++] = line[1];
        }
        result[0] = left;
        result[1] = right;
        return result;
    }

    public static int puzzleOne(int[][] contents) {
        int[][] transposed = transpose(contents);
        PriorityQueue<Integer> left = new PriorityQueue<>();
        PriorityQueue<Integer> right = new PriorityQueue<>();
        for (int i = 0; i < transposed[0].length; i++) {
            left.add(transposed[0][i]);
            right.add(transposed[1][i]);
        }

        int sum = 0;
        while (!left.isEmpty())
            sum += Math.abs(left.poll() - right.poll());
        return sum;
    }

    public static int puzzleTwo(int[][] contents) {
        int[][] transposed = transpose(contents);
        HashMap<Integer, Integer> frequencies = new HashMap<>();
        for (int num : transposed[1]) {
            frequencies.put(num, frequencies.getOrDefault(num, 0) + 1);
        }

        int sum = 0;
        for (int num : transposed[0]) {
            if (frequencies.containsKey(num))
                sum += num * frequencies.get(num);
        }
        return sum;

    }

    public static void main(String[] args) {
        int[][] contents = getPuzzle();
        System.out.println(puzzleOne(contents));
        System.out.println(puzzleTwo(contents));
    }
}
