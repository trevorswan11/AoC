#include <fstream>
#include <iostream>
#include <queue>
#include <sstream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

std::vector<std::pair<int, int>>
parse_rules(const std::vector<std::string> &lines) {
  std::vector<std::pair<int, int>> rules;
  for (const std::string &line : lines) {
    size_t bar = line.find('|');
    int a = std::stoi(line.substr(0, bar));
    int b = std::stoi(line.substr(bar + 1));
    rules.emplace_back(a, b);
  }
  return rules;
}

bool is_valid_update(const std::vector<int> &update,
                     const std::vector<std::pair<int, int>> &rules) {
  std::unordered_map<int, int> index_map;
  for (size_t i = 0; i < update.size(); i++) {
    index_map[update[i]] = i;
  }

  for (const auto &[a, b] : rules) {
    if (index_map.count(a) && index_map.count(b) &&
        index_map[a] >= index_map[b]) {
      return false;
    }
  }
  return true;
}

int get_middle(const std::vector<int> &update) {
  return update[update.size() / 2];
}

std::vector<int> parse_update_line(const std::string &line) {
  std::vector<int> result;
  std::stringstream ss(line);
  std::string token;
  while (std::getline(ss, token, ',')) {
    result.push_back(std::stoi(token));
  }
  return result;
}

void part_one(const std::vector<std::string> &rule_lines,
              const std::vector<std::string> &update_lines) {
  auto rules = parse_rules(rule_lines);
  int total = 0;

  for (const std::string &update_str : update_lines) {
    std::vector<int> update = parse_update_line(update_str);
    if (is_valid_update(update, rules)) {
      total += get_middle(update);
    }
  }
  std::cout << "Part 1: " << total << std::endl;
}

std::vector<int>
topological_sort(const std::vector<int> &update,
                 const std::vector<std::pair<int, int>> &all_rules) {
  std::unordered_map<int, std::vector<int>> adj;
  std::unordered_map<int, int> in_degree;
  std::unordered_set<int> nodes(update.begin(), update.end());

  // Initialize in-degrees
  for (int node : nodes) {
    in_degree[node] = 0;
  }

  // Build graph using only relevant rules
  for (const auto &[a, b] : all_rules) {
    if (nodes.count(a) && nodes.count(b)) {
      adj[a].push_back(b);
      in_degree[b]++;
    }
  }

  // Kahn's algorithm
  std::queue<int> q;
  for (const auto &[node, degree] : in_degree) {
    if (degree == 0) {
      q.push(node);
    }
  }

  std::vector<int> result;
  while (!q.empty()) {
    int node = q.front();
    q.pop();
    result.push_back(node);
    for (int neighbor : adj[node]) {
      if (--in_degree[neighbor] == 0) {
        q.push(neighbor);
      }
    }
  }

  // In case of cycle (shouldn't happen), return partial result
  return result;
}

void part_two(const std::vector<std::string> &rule_lines,
              const std::vector<std::string> &update_lines) {
  auto rules = parse_rules(rule_lines);
  int total_valid = 0;
  int total_corrected = 0;

  for (const std::string &update_str : update_lines) {
    std::vector<int> update = parse_update_line(update_str);
    if (is_valid_update(update, rules)) {
      total_valid += get_middle(update);
    } else {
      std::vector<int> sorted = topological_sort(update, rules);
      if (sorted.size() == update.size()) {
        total_corrected += get_middle(sorted);
      } else {
        std::cerr << "Warning: Incomplete topological sort\n";
      }
    }
  }
  std::cout << "Part 2: " << total_corrected << std::endl;
}

int main() {
  std::ifstream input("dayFivePuzzle.txt");
  if (!input) {
    std::cerr << "Failed to open dayFivePuzzle.txt" << std::endl;
    return 1;
  }

  std::vector<std::string> rule_lines;
  std::vector<std::string> update_lines;
  std::string line;
  bool reading_rules = true;

  while (std::getline(input, line)) {
    if (line.empty()) {
      reading_rules = false;
      continue;
    }
    if (reading_rules) {
      rule_lines.push_back(line);
    } else {
      update_lines.push_back(line);
    }
  }
  input.close();
  part_one(rule_lines, update_lines);
  part_two(rule_lines, update_lines);
}
