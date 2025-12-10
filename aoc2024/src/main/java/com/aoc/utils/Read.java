package com.aoc.utils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class Read {
    private String name;
    private Store type;
    private LinkedList<String> textList = null;
    private String[] textArray = null;
    private String textString = null;
    private int[][] intArray = null;

    /**
     * Creates a new Read instance with a set path and return type.
     *
     * @param name The name of the Puzzle Text File
     * @param type The desired return type of the stored file's data
     * @throws IllegalArgumentException If the type enum is invalid
     */
    public Read(String name, Store type) throws IllegalArgumentException {
        this.name = name;
        this.type = type;
        switch (type) {
            case STR_ARRAY:
                this.textArray = read2StringARR();
                break;
            case INT_ARRAY:
                this.intArray = read2IntARR(" ");
                break;
            case LIST:
                this.textList = read2LL();
                break;
            case STRING:
                this.textString = read2STRING();
                break;
            default:
                throw new IllegalArgumentException("Store type is invalid.");
        }
    }

    /**
     * Creates a new Read instance with a set path and return type.
     *
     * @param name The name of the Puzzle Text File
     * @param type The desired return type of the stored file's data. For this constructor, the type must be numeric.
     * @param separator The regex expression to separate the numbers in the file
     * @throws IllegalArgumentException If the type enum is invalid
     */
    public Read(String name, Store type, String separator) throws IllegalArgumentException {
        this.name = name;
        this.type = type;
        switch (type) {
            case INT_ARRAY:
                this.intArray = read2IntARR(separator);
                break;
            default:
                throw new IllegalArgumentException("Store type is invalid.");
        }
    }

    /**
     * Returns the representation of the Text.
     *
     * @return The file representation as an object.
     * @apiNote The output should always be type-casted
     * @throws IllegalArgumentException If the type enum is invalid
     */
    public Object get() throws IllegalArgumentException {
        switch (this.type) {
            case STR_ARRAY:
                return textArray;
            case INT_ARRAY:
                return intArray;
            case LIST:
                return textList;
            case STRING:
                return textString;
            default:
                throw new IllegalArgumentException("Store type is invalid.");
        }
    }

    /**
     * Reads the contents from the path and stores lines as nodes in a linked list.
     *
     * @return The head of a linked list with file lines in each node
     */
    private LinkedList<String> read2LL() {
        LinkedList<String> contents = new LinkedList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(name))) {
            String line;
            while ((line = br.readLine()) != null) {
                contents.add(line);
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
        return contents;
    }

    /**
     * Reads the contents from the path and stores lines as elements in an array.
     *
     * @return The array that is the file lines in each cell
     */
    private String[] read2StringARR() {
        return read2LL().toArray(new String[0]);
    }

    /**
     * Reads the contents from the path and to a 2D int array
     *
     * @param separator The separator to use for the space between values
     * @return The int array with each line being an array and each element being a number
     * @apiNote This should only be used when the entire dataset is made up of ints
     */
    private int[][] read2IntARR(String separator) {
        List<int[]> tempList = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(name))) {
            String line;
            while ((line = br.readLine()) != null) {
                // Split the line into string array and convert each element to an integer
                String[] values = line.split(separator);
                int[] row = new int[values.length];
                for (int i = 0; i < values.length; i++) {
                    row[i] = Integer.parseInt(values[i]);
                }
                tempList.add(row);
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }

        // Convert the ArrayList to a 2D array
        int[][] result = new int[tempList.size()][];
        for (int i = 0; i < tempList.size(); i++) {
            result[i] = tempList.get(i);
        }

        return result;
    }

    /**
     * Reads the contents from the path and stores as a String.
     *
     * @return The String is formatted exactly as given
     */
    private String read2STRING() {
        String[] arr = read2StringARR();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < arr.length; i++) {
            sb.append(arr[i]).append(i == arr.length - 1 ? "" : "\n");
        }
        System.out.println(sb.toString());
        return sb.toString();
    }
}
