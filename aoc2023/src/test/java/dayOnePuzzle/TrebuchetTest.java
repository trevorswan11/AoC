package dayOnePuzzle;

import org.junit.*;

import com.aoc.utils.Path;

import java.io.*;

public class TrebuchetTest {
	private String puzzle;

	// Helper method to get puzzle file
	private String getPuzzle() throws IOException {
		return Trebuchet.puzzle(Path.getPathForTest("dayOnePuzzle.txt"));
	}

	// Run the test for the first part
	@Test
	public void partOne() throws IOException {
		puzzle = this.getPuzzle();
		int solution = Trebuchet.sumPartOne(puzzle);
		System.out.println(solution);
	}

	// Run the test for the second part
	@Test
	public void partTwo() throws IOException {
		puzzle = this.getPuzzle();
		int solution = Trebuchet.sumPartTwo(puzzle);
		System.out.println(solution);
	}
}
