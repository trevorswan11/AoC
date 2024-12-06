package dayTwoPuzzle;

import java.util.LinkedList;

import com.aoc.utils.*;

@SuppressWarnings("unused")
public class RedNosedReports {
    private static Store type = Store.INT_ARRAY;

    protected static int[][] getPuzzle() {
        Read read = new Read(Path.getPath("dayTwoPuzzle.txt"), type, " ");
        return (int[][]) read.get();
    }

    protected static boolean arrayIsSorted(int[] line) {
        if (line == null || line.length < 2)
            return true;
        boolean ascending = true,
        descending = true;
        for (int i = 0; i < line.length - 1; i++) {
            if (line[i] < line[i + 1])
                descending = false;
            else if (line[i] > line[i + 1])
                ascending = false;
        }

        return ascending || descending;
    }

    protected static boolean validFloor(int[] line) {
        if (!arrayIsSorted(line)) return false;
        for (int i = 0; i < line.length - 1; i++) {
            int diff = Math.abs(line[i] - line[i + 1]);
            if (diff == 0 || diff > 3)
                return false;
        }
        return true;
    }
    
    public static int puzzleOne(int[][] contents) {
        int total = 0;
        for (int[] line : contents) {
            total += validFloor(line) ? 1 : 0;
        }
        return total;
    }
    
    protected static boolean arrayIsSorted2(int[] arr) {
        int violationCount = 0;
        int violationIndex = -1;

        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] < arr[i + 1]) {
                continue;
            } else if (arr[i] > arr[i + 1]) {
                violationCount++;
                violationIndex = i;
            }
        }
        if (violationCount > 1) {
            return false;
        }
        if (violationCount == 1) {
            return isSortedAfterRemoval(arr, violationIndex);
        }
        return true;
    }

    private static boolean isSortedAfterRemoval(int[] arr, int violationIndex) {
        int[] newArr1 = new int[arr.length - 1];
        int[] newArr2 = new int[arr.length - 1];
        for (int i = 0, j = 0; i < arr.length; i++) {
            if (i == violationIndex) {
                continue;
            }
            newArr1[j++] = arr[i];
        }
        for (int i = 0, j = 0; i < arr.length; i++) {
            if (i == violationIndex + 1) {
                continue;
            }
            newArr2[j++] = arr[i];
        }
        return isSortedArray(newArr1) || isSortedArray(newArr2);
    }

    private static boolean isSortedArray(int[] arr) {
        boolean ascending = true;
        boolean descending = true;

        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] < arr[i + 1]) {
                descending = false;
            } else if (arr[i] > arr[i + 1]) {
                ascending = false;
            }
        }

        return ascending || descending;
    }

    protected static boolean validFloor2(int[] line) {
        if (!arrayIsSorted2(line)) return false;
        int count = 0;
        for (int i = 0; i < line.length - 1; i++) {
            int diff = Math.abs(line[i] - line[i + 1]);
            if (diff == 0 || diff > 3) {
                count += ( (i == 0) ? 1 : (i == line.length - 1) ? 1 : 2);
                if (count > 3)
                    return false;
            }
        }
        return true;
    }

    public static int puzzleTwo(int[][] contents) {
        // TODO
        int total = 0;
        for (int[] line : contents) {
            total += validFloor2(line) ? 1 : 0;
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] contents = getPuzzle();
        System.out.println(puzzleOne(contents));
        System.out.println(puzzleTwo(contents));
    }
}
