import re
import os

file_path = os.path.join('dayThreePuzzle.txt')

def part_one():
    pattern = r"mul\((\d{1,3}),(\d{1,3})\)"
    result = 0

    with open(file_path, 'r') as file:
        for line in file:
            matches = re.findall(pattern, line)
            total_sum = sum(int(x) * int(y) for x, y in matches)
            result += total_sum
    print(result)

def part_two():
    enabled = True  # mul instructions are enabled by default
    total_sum = 0

    # Regular expressions to match mul(X, Y), do() and don't()
    mul_pattern = r"mul\((\d+),(\d+)\)"
    do_pattern = r"do\(\)"
    dont_pattern = r"don't\(\)"

    # Combine the patterns to find all relevant parts (mul, do, don't)
    combined_pattern = f"({mul_pattern})|({do_pattern})|({dont_pattern})"

    with open(file_path, 'r') as file:
        for memory in file:
            # Iterate through the memory string to match instructions
            i = 0
            while i < len(memory):
                match = re.match(combined_pattern, memory[i:])

                if match:
                    # If a mul instruction is found
                    if match.group(1):
                        x, y = int(match.group(2)), int(match.group(3))
                        if enabled:
                            total_sum += x * y
                        i += len(match.group(0))  # Move past the mul instruction
                        continue

                    # If do() is found, enable mul instructions
                    elif match.group(4):
                        enabled = True
                        i += len(match.group(4))  # Move past the do() instruction
                        continue

                    # If don't() is found, disable mul instructions
                    elif match.group(5):
                        enabled = False
                        i += len(match.group(5))  # Move past the don't() instruction
                        continue
                
                # Move to the next character if no match is found
                i += 1

        print(total_sum)

part_one()
part_two()