package com.aoc.utils;

public class Path {
    private static String root = "C:/Users/Trevor/OneDrive/Documents/AdventOfCode/";
    private static String puzzles = root + "aoc2023/Puzzle Text Files/";

    /**
     * This method returns the full path to a file in root:
     * {@code C:/Users/Trevor/OneDrive/Documents/AdventOfCode/}
     * 
     * @param path The path to the file relative to root\
     * @return The full path as a String
     */
    public static String get(String path) {
        return root + path;
    }

    /**
     * This method returns the full path to a file in puzzles:
     * {@code C:/Users/Trevor/OneDrive/Documents/AdventOfCode/aoc2023/Puzzle Text Files/}
     * @param path The path to the file relative to the puzzle folder
     * @return The full path as a String
     */
    public static String getPuzzle(String path) {
        return puzzles + path;
    }
}
