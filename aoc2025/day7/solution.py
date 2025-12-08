input_test = """.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
"""

lines = input_test.split()
beams = [1 if x == "S" else 0 for x in lines[0]]

part_one = 0

for i in range(2, len(lines), 2):
	line = lines[i]
	for c_idx, c in enumerate(line):
		if c == "^" and beams[c_idx] == 1:
			beams[c_idx] = 0
			beams[c_idx - 1] = 1
			beams[c_idx + 1] = 1
			part_one += 1

print("Part one result: ", part_one)

# Part two
beams = [1 if x == "S" else 0 for x in lines[0]]

part_two = 0

for i in range(2, len(lines), 2):
	line = lines[i]
	for c_idx, c in enumerate(line):
		if c == "^" and beams[c_idx] != 0:
			print(beams)			

			# Key is to accumulate over time
			if beams[c_idx - 1] == 0:
				beams[c_idx - 1] = beams[c_idx]
			else:
				beams[c_idx - 1] += beams[c_idx]
			
			if beams[c_idx + 1] == 0:
				beams[c_idx + 1] = beams[c_idx]
			else:
				beams[c_idx + 1] += beams[c_idx]
			
			# We still zero out on hit since it splits out
			beams[c_idx] = 0
			
for beam in beams:
	part_two += beam

print("Part two result: ", part_two)
