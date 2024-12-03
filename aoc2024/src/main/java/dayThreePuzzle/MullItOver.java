package dayThreePuzzle;

import com.aoc.utils.*;

public class MullItOver {
    private static Store type = Store.STRING;

    public static String getPuzzle() {
        Read read = new Read(Path.getPath("dayThreePuzzle.txt"), type);
        return read.get().toString();
    }
    public static void main(String[] args) {
        String contents = getPuzzle();
        System.out.println(contents);
    }
}
