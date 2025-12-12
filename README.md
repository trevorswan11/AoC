# Advent of Code
Various AoC puzzle solutions. Puzzles are not included in this repo as per AoC guidelines.

# Getting Puzzle Input
To pull your puzzle input, set the `SESSION_COOKIE` environment variable in a `.env` at the root of this repository. You can then run `python pull.py <day> <year?>`. Where year is either the current year or your input.

To get your session token:
1. Log in to the Advent of Code website in your browser.
2. Open Developer Tools (usually by pressing F12).
3. Go to the Application or Storage tab, and find the Cookies for the domain [adventofcode.com](adventofcode.com).
4. Find the cookie named session and copy its value (a long hexadecimal string).

When you run the python script, it will save your input as a text file, with the convention: `input_<year>-day<day>`. This naming scheme is adopted so that the .gitignore file can properly prevent inputs from being pushed to a repo, as requested by the creator of AoC.

Please do not repeatedly use this python tool, cache your inputs instead. There is only one input per day and it does not change per user!