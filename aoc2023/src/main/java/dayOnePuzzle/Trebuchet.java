package dayOnePuzzle;

/* Imports are for File Readers */
import java.io.*;

import com.aoc.utils.Path;

public class Trebuchet {
	/**
	 * This method extracts the puzzle from and inputted path.
	 * 
	 * @param path The system path of the AoC Puzzle
	 * @return A string containing the formatted puzzle
	 * @throws IOException Something went wrong when reading file
	 */
	public static String puzzle(String path) throws IOException {
		BufferedReader reader = new BufferedReader(new FileReader(path));

		// Create a String Builder to Create the puzzle locally
		StringBuilder builder = new StringBuilder();

		// read the file until a -1 is returned
		int currentCharacter;
		while ((currentCharacter = reader.read()) != -1) {
			builder.append((char) currentCharacter);
			builder.append(reader.readLine());
			builder.append("\n");
		}

		// Close the reader to prevent a resource leak
		reader.close();

		// Set the puzzle equal to the String Builder
		return builder.toString();
	}

	/**
	 * The solution to the first part of AdventOfCode day 1
	 * 
	 * @param puzzle The formatted String for the Puzzle
	 * @return The sum of the digits as requested by the challenge
	 * @throws IOException Something went wrong when reading the String
	 */
	public static int sumPartOne(String puzzle) throws IOException {
		BufferedReader reader = new BufferedReader(new StringReader(puzzle));
		int currentCharacter;
		String line;
		String combination;
		StringBuilder digits = new StringBuilder();
		int sum = 0;

		// Loop through the string until exhuasted
		while ((currentCharacter = reader.read()) != -1) {
			// Assuming the loop ran, append the test character and the line
			digits.append((char) currentCharacter);
			digits.append(reader.readLine());

			// Save the line to its own varibale and reset the digits builder
			line = digits.toString();
			digits.setLength(0);

			// Loop through the line String and extract all digits
			for (int i = 0; i < line.length(); i++) {
				if (Character.isDigit(line.charAt(i))) {
					digits.append(line.charAt(i));
				}
			}
			String digitsLine = digits.toString();
			digits.setLength(0);

			// Now that digits has all the digits in the current line, create a number
			if (digitsLine.length() == 1) {
				digits.append(digitsLine.charAt(0));
				digits.append(digitsLine.charAt(0));
				combination = digits.toString();
			} else {
				digits.append(digitsLine.charAt(0));
				digits.append(digitsLine.charAt(digitsLine.length() - 1));
				combination = digits.toString();
			}

			// Create an int value based off the current combo
			try {
				int value = Integer.parseInt(combination);
				sum = sum + value;
			} catch (Exception e) {
				System.out.println("womp womp");
			}
			digits.setLength(0);
		}
		// Close readers
		reader.close();

		// return the sum
		return sum;
	}

	/**
	 * This method Splits the String into its own lines and feeds each one into A
	 * method to determine the calibration value. It sums continuously.
	 * 
	 * @param puzzle The input puzzle as a String
	 * @return The total calibration value as an int
	 */
	public static int sumPartTwo(String puzzle) throws IOException {
		BufferedReader reader = new BufferedReader(new StringReader(puzzle));
		int currentCharacter;
		String line;
		StringBuilder digits = new StringBuilder();
		int sum = 0;

		// Loop through the string until exhuasted
		while ((currentCharacter = reader.read()) != -1) {
			// Assuming the loop ran, append the test character and the line
			digits.append((char) currentCharacter);
			digits.append(reader.readLine());

			// Save the line to its own varibale and reset the digits builder
			line = digits.toString();
			digits.setLength(0);

			// Feed the Line through the real calibration method and save the result
			sum = sum + realCalibration(line);
			digits.setLength(0);
		}

		// Close reader and return sum
		reader.close();
		return sum;
	}

	/**
	 * This method searches for the first real number, spelled or numerical, in a
	 * given string. It then
	 * looks through the string and looks for the last real number in the string. It
	 * returns theses values as a single int.
	 * 
	 * @param s A single line string to examine for the above criteria
	 * @return An int that cointains the combination for the puzzle line.
	 */
	public static int realCalibration(String s) {
		// Create a String array to hold the number data
		String[] numbersAlpha = new String[] { "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" };
		int[] numbersNum = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 };

		// Create StringBuilders to keep track of the line
		StringBuilder temp = new StringBuilder();
		StringBuilder query = new StringBuilder();
		String look;

		// Create a StringBuilder to hold the calibration value
		StringBuilder calibration = new StringBuilder();

		// Create a variable to track where the look builder should go up to
		int search = 0;

		// Loop through the entire input
		int i = 0;
		while (i < s.length()) {
			temp.append(s.charAt(i));

			// append the character of temp to query from search to the length of temp
			for (int j = search; j < temp.length(); j++) {
				query.append(temp.charAt(j));
			}

			// Set the search the length of query, reset its contents, and assign to look
			search = query.length();
			look = query.toString();

			// If the current character in temp is a digit, append it
			if (Character.isDigit(temp.charAt(i))) {
				calibration.append(temp.charAt(i));
				query.setLength(0);
			}

			// If the current string of letters is a number, append it
			else {
				for (int k = 0; k < 9; k++) {
					if (look.equals(numbersAlpha[k])) {
						calibration.append(numbersNum[k]);
						query.setLength(0);
						look = "";
					}
				}
			}
			i++;
		}

		String calibrationVal = calibration.toString();

		// Look thorugh the calibration String and extract the first and last digit
		StringBuilder digits = new StringBuilder();
		digits.append(calibrationVal.charAt(0));
		digits.append(calibrationVal.charAt(calibrationVal.length() - 1));

		// Turn the digits into an int with parseInt
		String combo = digits.toString();
		try {
			int value = Integer.parseInt(combo);
			return value;
		} catch (Exception e) {
			System.out.println("womp womp");
			return -1;
		}
	}

	public static void main(String[] args) throws IOException {
		// Import the Test file for the puzzle
		String puzzle = Trebuchet
				.puzzle(Path.getPuzzle("dayOnePuzzle.txt"));
		// Print the solution to the first part of the puzzle
		System.out.println("Part One Solution:");
		int solution1 = Trebuchet.sumPartOne(puzzle);
		System.out.println(solution1);

		// Print the solution to the second part of the puzzle
		System.out.println("Part Two Solution:");
		// int solution2 = dayOnePuzzle.sumPartTwo(puzzle);
		// System.out.println(solution2);
		System.out.println("2oneeight3one");
		System.out.println(Trebuchet.realCalibration("2oneeight3one"));
	}
}
