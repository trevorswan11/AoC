package com.aoc.utils;

import java.nio.file.Paths;

public class Path {
    private static String year = "aoc2023";
    private static String location = "Puzzle Text Files";
    public String puzzleName;

    /**
     * Sets the puzzle name
     *
     * @param name The name of the Puzzle Text File
     */
    public Path(String name) {
        this.puzzleName = name;
    }

    /**
     * Returns the path of the puzzle file.
     *
     * @return The full path of the puzzle file as a String
     */
    public String getPath() {
        java.nio.file.Path path = Paths.get(year, location, puzzleName);
        return path.toAbsolutePath().toString();
    }

    /**
     * Returns the path of the puzzle file.
     *
     * @return The full path of the puzzle file as a String
     */
    public  String getPathForTest() {
        java.nio.file.Path path = Paths.get(location, puzzleName);
        return path.toAbsolutePath().toString();
    }

    /**
     * Returns the path of the puzzle file.
     *
     * @param name The name of the Puzzle Text File
     * @return The full path of the puzzle file as a String
     */
    public static String getPath(String name) {
        java.nio.file.Path path = Paths.get(year, location, name);
        return path.toAbsolutePath().toString();
    }

    /**
     * Returns the path of the puzzle file.
     *
     * @param name The name of the Puzzle Text File
     * @return The full path of the puzzle file as a String
     */
    public static String getPathForTest(String name) {
        java.nio.file.Path path = Paths.get(location, name);
        return path.toAbsolutePath().toString();
    }
}
