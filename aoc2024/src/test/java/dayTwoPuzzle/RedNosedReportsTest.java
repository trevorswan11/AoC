package dayTwoPuzzle;

import org.junit.*;
import static org.junit.Assert.*;

import java.util.LinkedList;

import com.aoc.utils.*;

@SuppressWarnings("unused")
public class RedNosedReportsTest {
    private int[][] puzzle = RedNosedReportsTest.getPuzzle();

    protected static int[][] getPuzzle() {
        Read read = new Read(Path.getPathForTest("dayTwoPuzzle.txt"), Store.INT_ARRAY, " ");
        return (int[][]) read.get();
    }

    @Test
    public void partTwoTest() {
        int[] line;
        line = new int[] {1, 2, 3, 4, 5, 6};
        assertTrue(RedNosedReports.validFloor2(line));
        line = new int[] {2, 2, 3, 4, 5, 6, 7};
        assertTrue(RedNosedReports.validFloor2(line));
        line = new int[] {2, 7, 3, 4, 5, 6, 7, 6};
        assertTrue(RedNosedReports.arrayIsSorted2(line));
        assertTrue(RedNosedReports.validFloor2(line));
        assertTrue(RedNosedReports.validFloor2(line));
    }
}
