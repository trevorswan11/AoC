package dayFourPuzzle;

import java.io.*;
import org.junit.*;

import com.aoc.utils.Path;

public class ScratchcardsTest {
	// Field to hold the puzzle 
	private int[][] puzzle;

	// Helper method to get puzzle from path
	private int[][] getPuzzle() throws IOException {
		return Scratchcards.puzzle(Path.getPuzzle("dayFourPuzzle.txt"));
	}

	// Test the first part of the challenge
	@Test
	public void partOneTest() throws IOException {
		puzzle = this.getPuzzle();
		int solution = Scratchcards.cardSum(puzzle);
		System.out.println(solution);
	} 

	// Test the second part of the challenge
	@Test
	public void partTwoTest() throws IOException {
	}
}
