package dayFourPuzzle;

import com.aoc.utils.*;

public class CeresSearch {
    private static Store type = Store.STR_ARRAY;

    protected static String[] getPuzzle() {
        Read read = new Read(Path.getPath("dayFourPuzzle.txt"), type);
        return (String[]) read.get();
    }

    public static int puzzleOne(String[] grid) {
        int count = 0;
        int rows = grid.length;
        int cols = grid[0].length();
        String word = "XMAS";

        // Check all directions: right, down, diagonal down-right, diagonal down-left, and their reverses

        // Horizontal and vertical check
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                // Check right (horizontal)
                if (j + word.length() <= cols && grid[i].substring(j, j + word.length()).equals(word)) {
                    count++;
                }

                // Check down (vertical)
                if (i + word.length() <= rows) {
                    StringBuilder vertical = new StringBuilder();
                    for (int k = 0; k < word.length(); k++) {
                        vertical.append(grid[i + k].charAt(j));
                    }
                    if (vertical.toString().equals(word)) {
                        count++;
                    }
                }

                // Check diagonal down-right
                if (i + word.length() <= rows && j + word.length() <= cols) {
                    StringBuilder diagonal1 = new StringBuilder();
                    for (int k = 0; k < word.length(); k++) {
                        diagonal1.append(grid[i + k].charAt(j + k));
                    }
                    if (diagonal1.toString().equals(word)) {
                        count++;
                    }
                }

                // Check diagonal down-left
                if (i + word.length() <= rows && j - word.length() + 1 >= 0) {
                    StringBuilder diagonal2 = new StringBuilder();
                    for (int k = 0; k < word.length(); k++) {
                        diagonal2.append(grid[i + k].charAt(j - k));
                    }
                    if (diagonal2.toString().equals(word)) {
                        count++;
                    }
                }

                // Check for the word backwards (right, down, diagonal)
                if (j + word.length() <= cols && grid[i].substring(j, j + word.length()).equals(new StringBuilder(word).reverse().toString())) {
                    count++;
                }

                if (i + word.length() <= rows) {
                    StringBuilder verticalReverse = new StringBuilder();
                    for (int k = 0; k < word.length(); k++) {
                        verticalReverse.append(grid[i + k].charAt(j));
                    }
                    if (verticalReverse.toString().equals(new StringBuilder(word).reverse().toString())) {
                        count++;
                    }
                }

                // Check diagonal down-right reverse
                if (i + word.length() <= rows && j + word.length() <= cols) {
                    StringBuilder diagonal1Reverse = new StringBuilder();
                    for (int k = 0; k < word.length(); k++) {
                        diagonal1Reverse.append(grid[i + k].charAt(j + k));
                    }
                    if (diagonal1Reverse.toString().equals(new StringBuilder(word).reverse().toString())) {
                        count++;
                    }
                }

                // Check diagonal down-left reverse
                if (i + word.length() <= rows && j - word.length() + 1 >= 0) {
                    StringBuilder diagonal2Reverse = new StringBuilder();
                    for (int k = 0; k < word.length(); k++) {
                        diagonal2Reverse.append(grid[i + k].charAt(j - k));
                    }
                    if (diagonal2Reverse.toString().equals(new StringBuilder(word).reverse().toString())) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    public static int puzzleTwo(String[] grid) {
        int count = 0;
        int rows = grid.length;
        int cols = grid[0].length();

        // Check each possible "X" shape starting from each cell in the grid
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                // Check if we can form an X shape in both directions (forwards and backwards)
                if (i - 1 >= 0 && i + 1 < rows && j - 1 >= 0 && j + 1 < cols) {
                    // Check forwards MAS pattern
                    if (grid[i].charAt(j) == 'M' &&
                        grid[i - 1].charAt(j + 1) == 'A' &&
                        grid[i + 1].charAt(j - 1) == 'S' &&
                        grid[i - 1].charAt(j) == 'M' &&
                        grid[i + 1].charAt(j + 1) == 'S') {
                        count++;
                    }
                    // Check backwards MAS pattern
                    if (grid[i].charAt(j) == 'S' &&
                        grid[i - 1].charAt(j + 1) == 'A' &&
                        grid[i + 1].charAt(j - 1) == 'M' &&
                        grid[i - 1].charAt(j) == 'S' &&
                        grid[i + 1].charAt(j + 1) == 'M') {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    public static void main(String[] args) {
        String[] contents = getPuzzle();
        System.out.println(puzzleOne(contents));
        System.out.println(puzzleTwo(contents));
    }
}
