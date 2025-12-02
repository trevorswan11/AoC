import sys
import http.client
from datetime import datetime
from pathlib import Path

AOC_DOMAIN: str = "adventofcode.com"
CURRENT_YEAR: int = datetime.now().year


# Validates the required dotenv file and environment variable
def env_cookie() -> str | None:
    dotenv = Path(".env")

    if not dotenv.exists():
        print("Could not locate a .env file in the cwd")
        dotenv.touch()
        dotenv.write_text('SESSION_COOKIE="<your token here>"\n')
        print(
            "I've created a .env file for you with the required variable for you to set"
        )
        return None

    session_line: str | None = None
    with open(dotenv, "r") as f:
        for line in f.readlines():
            if line.startswith("SESSION_COOKIE"):
                session_line = line
                break

    if session_line is None:
        print("Failed to locate SESSION_COOKIE environment variable")
        return None

    kv = session_line.strip().split("=")
    if len(kv) != 2:
        print(
            "Malformed .env entry. Line should only contain a key/value pair separated by '='"
        )
        return None

    assert kv[0] == "SESSION_COOKIE"
    return kv[1].strip("'\"")


def request_input(day: int, year: int, cookie: str) -> str | None:
    endpoint = f"/{year}/day/{day}/input"
    header = {"Cookie": f"session={cookie}"}

    conn = http.client.HTTPSConnection(AOC_DOMAIN)
    conn.request("GET", endpoint, headers=header)
    response = conn.getresponse()
    if response.status != 200:
        print(f"Error fetching input. Status code: {response.status} {response.reason}")
        return None

    return response.read().decode("utf-8")


if __name__ == "__main__":
    args = sys.argv
    args.pop(0)
    if len(args) == 0:
        print("Usage: python pull.py <day> <year?>")
        exit(1)

    try:
        day: int = int(args[0])
        year: int = CURRENT_YEAR if len(args) == 1 else int(args[1])
    except ValueError:
        print("Failed to parse input into integer values")
        exit(1)

    # Validate the users input so the endpoint is queried nicely
    if day < 0 or day > 25:
        print(f"Advent of code only goes from December 1 to 25, got {day}")
        exit(1)
    elif year < 2015:
        print(f"Advent of code was first created in 2015, got {year}")
        exit(1)
    elif year > CURRENT_YEAR:
        print(
            f"Cannot request puzzles from the future, got {year} but it's {CURRENT_YEAR}"
        )
        exit(1)

    cookie = env_cookie() or exit(1)
    input = request_input(day, year, cookie) or exit(1)

    # Process the data and write it to disk if it doesn't exist
    output = Path(f"input_{year}-day{day}.txt")
    if output.exists():
        print(f"File {output} already exists!")
        exit(1)

    with open(output, "+w") as f:
        f.write(input)
