package com.aoc.utils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedList;

public class Read {
    private String name;
    private Store type;
    private LinkedList<String> textList = null;
    private String[] textArray = null;
    private String textString = null;

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
            case ARRAY:
                this.textArray = read2ARR();
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
     * Returns the representation of the Text.
     * 
     * @return The file representation as an object.
     * @apiNote The output should always be type-casted
     * @throws IllegalArgumentException If the type enum is invalid
     */
    public Object get() throws IllegalArgumentException {
        switch (this.type) {
            case ARRAY:
                return textArray;
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
    private String[] read2ARR() {
        return read2LL().toArray(new String[0]);
    }

    /**
     * Reads the contents from the path and stores as a String.
     * 
     * @return The String is formatted exactly as given
     */
    private String read2STRING() {
        String[] arr = read2ARR();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < arr.length; i++) {
            sb.append(arr[i]).append(i == arr.length - 1 ? "" : "\n");
        }
        System.out.println(sb.toString());
        return sb.toString();
    }
}
