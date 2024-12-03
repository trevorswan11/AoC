package dayFourPuzzle;

import java.io.*;

import com.aoc.utils.Path;

public class Scratchcards {
	/**
	 * This helper method adds Zeros in front of any number that is single digit
	 * 
	 * @param s The unformatted input String
	 * @return A String with formatted zeros
	 */
	private static String zeroFix(String s) {
		// Create a StringReader to handle the reformatting of the input
		StringBuilder format = new StringBuilder();

		// Loop through the String until done
		int i = 0;
		while (i < s.length()) {
			// if the first character is not a digit, make it a 0
			if (i == 0 && !Character.isDigit(s.charAt(0))) {
				format.append(0);
			}

			// Otherwise check the surrounding characters at spaces
			else if (s.charAt(i) == ' ') {
				// If leading is digit and previous is space, append 0
				if (((s.charAt(i - 1)) == ' ') && (Character.isDigit(s.charAt(i + 1)))) {
					format.append(0);
				}

				// Otherwise append the next character
				else {
					format.append(s.charAt(i));
				}
			}

			// Append the next character if none of the above triggered
			else {
				format.append(s.charAt(i));
			}
			i++;
		}
		return format.toString();
	}

	/**
	 * This helper method counts the number of spaces to get the correct number of
	 * two-digit numbers in the line of the input for this challenge
	 * 
	 * @param line The current of the puzzle
	 * @return An int indicating the number of elements (digits) in the String
	 */
	private static int numel(String line) {
		// initialize a spaces counter
		int spaces = 0;

		// Loop through the entire the line
		for (int i = 0; i < line.length(); i++) {
			// If the current index is a space, add to counter
			if (line.charAt(i) == ' ') {
				spaces = spaces + 1;
			}
		}

		// The number of elements is one greater than the spaces count
		return spaces + 1;
	}

	/**
	 * This helper method determines how many winning numbers a card has
	 * 
	 * @param card An int[] of the cards contents
	 * @return An int value of the number of elements found before -1
	 */
	private static int numberWinning(int[] card) {
		// Loop through the array until -1 is found
		int numVal = 0;
		for (int i = 0; i < card.length && card[i] != -1; i++) {
			numVal = i;
		}
		;
		return numVal + 1;
	}

	/**
	 * This helper method determines how many actual numbers a card has
	 * 
	 * @param card An int[] of the card's contents
	 * @return An int value of the number of elements found after -1
	 */
	private static int numberContent(int[] card) {
		// Get the index of the -1
		int negativeOne = numberWinning(card) + 1;
		return card.length - negativeOne;
	}

	/**
	 * This method receives the puzzle string and returns it as a multidimensional
	 * array. The formatting of this array is the winning numbers, then -1, then the
	 * card numbers. There are 199 lines of cards in the puzzle, so this method only
	 * works with this specific puzzle.
	 * 
	 * @param path A String of the puzzle information formatted as given
	 * @return a multidimensional integer array with each 'row' containing a card
	 *         and each 'column' containing the next number in the card. The winning
	 *         numbers and card numbers are separated by a -1
	 */
	public static int[][] puzzle(String path) throws IOException {
		// Create a BufferedReader
		BufferedReader reader = new BufferedReader(new FileReader(path));

		// Initialize an empty 199 by n array of integers
		int[][] array = new int[199][];

		// Create a variable to handle where the program is in array
		int arrayIndex = 0;

		// Read the puzzle string until -1 is returned
		while (reader.read() != -1) {
			// Create a string to hold the line contents
			String line = reader.readLine();

			// Create a StringBuilder to reformat the input
			StringBuilder format = new StringBuilder();

			// Don't append anything to the builder until the index is two after the :
			int i = 0;
			boolean colon = true;
			while (i < line.length()) {
				// If the index is past the colon, then append the next character
				if (!colon) {
					// Append a -1 if | is found
					if (line.charAt(i) == '|') {
						format.append(-1);
					}

					// Otherwise append the actual character
					else {
						format.append(line.charAt(i));
					}
					i++;
				}

				// If the index is at the colon, adjust the index
				else if (line.charAt(i) == ':') {
					i = i + 2;
					colon = false;
				}

				// Otherwise increment the index
				else {
					i++;
				}
			}

			// Set the line String to the formatted line
			line = zeroFix(format.toString());
			int[] temp = new int[numel(line)];

			// Create a variable to look through the line
			int lineIdx = 0;

			// Parse the line String to extract all the digits
			for (int j = 0; j < line.length(); j++) {
				// Try to put the next integer in the string in the array
				try {
					String nextInt;

					// Get the next integer from the string if one digit
					if (line.charAt(lineIdx) == 0) {
						nextInt = "" + line.charAt(lineIdx);
					}

					// Otherwise append both digits
					else {
						nextInt = line.charAt(lineIdx) + "" + line.charAt(lineIdx + 1);
					}

					// Insert the integer in the string and increment index
					temp[j] = Integer.parseInt(nextInt);
					lineIdx += 3;
				}
				// Otherwise throw an error
				catch (Exception e) {
				}
			}
			array[arrayIndex] = temp;
			arrayIndex++;
		}

		// Close the FileReader
		reader.close();

		// Return the array of integers
		return array;
	}

	/**
	 * This method determines the value of the card stored in a 1D array according
	 * to the AoC guidelines. The -1 in the array separates the winning numbers (on
	 * the left), with the card's contents (on the right)
	 * 
	 * @param line An int[] value that represents the cards contents
	 * @return The value of the card as an int. The first match sets the card's
	 *         value to 1. Each subsequent match doubles the value of the card.
	 *         Cards start at 0 by default.
	 */
	public static int cardValue(int[] card) {
		// Create an int for the card's value
		int value = 0;
		int temp;

		// Create two arrays to hold the winning and the contents
		int[] winners = new int[numberWinning(card)];
		int[] contents = new int[numberContent(card)];

		// Extract the winning numbers into the winners arrays
		temp = 0;
		for (int i = 0; i < numberWinning(card); i++) {
			winners[temp] = card[i];
			temp++;
		}

		// Extract the contents into the content array
		temp = 0;
		for (int i = numberWinning(card) + 1; i < card.length; i++) {
			contents[temp] = card[i];
			temp++;
		}

		// Compare each value in the contents to the winners
		for (int i = 0; i < contents.length; i++) {
			// Go through each of the winners
			for (int j = 0; j < winners.length; j++) {
				// If the value is 0, set it to 1 initially
				if (contents[i] == winners[j] && value == 0) {
					value = 1;
				}

				// If the value is anything else, double it
				else if (contents[i] == winners[j]) {
					value = value * 2;
				}
			}
		}

		// Return the value of the card
		return value;
	}

	/**
	 * This method sums up al of the values for the cards in the input. It can
	 * handle any size puzzle as long as it is formatted in a way where -1 separates
	 * the winners on the left and contents on the right.
	 * 
	 * @param array A 2D array with the rows being the individual cards
	 * @return An int of the sum of the total points of the cards
	 */
	public static int cardSum(int[][] array) {
		// Create a variable to hold the sum information
		int sum = 0;

		// Add the sum of each row to the sum variable
		for (int i = 0; i < array.length; i++) {
			sum = sum + cardValue(array[i]);
		}
		return sum;
	}

	public static void main(String[] args) throws IOException {
		// Extract the puzzle from the file path
		int[][] puzzle = puzzle(Path.getPath("dayFourPuzzle.txt"));

		// Print the sum of the value of the cards
		int solutionOne = cardSum(puzzle);
		System.out.println(solutionOne);
	}
}
