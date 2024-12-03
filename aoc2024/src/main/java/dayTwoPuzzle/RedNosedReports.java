package dayTwoPuzzle;

import java.util.LinkedList;

import com.aoc.utils.*;

@SuppressWarnings("unused")
public class RedNosedReports {
    private static Store type = Store.STRING;

    public static String getPuzzle() {
        Read read = new Read(Path.getPath("dayTwoPuzzle.txt"), type);
        return read.get().toString();
    }
    public static void main(String[] args) {
        String contents = getPuzzle();
        System.out.println(contents);
    }
}
