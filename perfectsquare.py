#BRUTE FORCE BUT IT TAKES LONG TIME


class Solution:
    def checkPerfectNumber(self, num: int) -> bool:
        if num <= 1:
            return False

        total = 0
        for i in range(1, num):  # Check all numbers from 1 to num - 1
            if num % i == 0:
                total += i

        return total == num
    
 #OPTIMIZED SOLUTION 
class Solution:
    def checkPerfectNumber(self, num: int) -> bool:
        if num <= 1:
            return False

        total = 1  # Start with 1 since it's a divisor of all numbers
        for i in range(2, int(num**0.5) + 1):  # Check up to the square root of num
            if num % i == 0:
                total += i
                if i != num // i:  # Avoid adding the square root twice
                    total += num // i

        return total == num
    
# | `i` | `num % i == 0`?  | `num // i` | Action Taken                              | New Total        |
| --- | ---------------- | ---------- | ----------------------------------------- | ---------------- |
| 2   | Yes (36 % 2 = 0) | 18         | Add 2 and 18                              | 1 + 2 + 18 = 21  |
| 3   | Yes              | 12         | Add 3 and 12                              | 21 + 3 + 12 = 36 |
| 4   | Yes              | 9          | Add 4 and 9                               | 36 + 4 + 9 = 49  |
| 5   | No               | —          | —                                         | (no change)      |
| 6   | Yes              | 6          | Add only 6 once (because `i == num // i`) | 49 + 6 = 55      |
