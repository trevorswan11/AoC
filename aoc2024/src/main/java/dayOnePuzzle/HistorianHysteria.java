package dayOnePuzzle;

import java.util.LinkedList;

import com.aoc.utils.*;

@SuppressWarnings("unchecked")
public class HistorianHysteria {
    private static Store type = Store.LIST;

    public static LinkedList<String> getPuzzle() {
        Read read = new Read(Path.getPath("dayOnePuzzle.txt"), type);
        return (LinkedList<String>) read.get();
    }

    public static void main(String[] args) {
        LinkedList<String> contents = getPuzzle();
        System.out.println(contents.getLast());
    }
}
