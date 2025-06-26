'''Input: n = 19
Output: true
Explanation:
1^2 + 9^2 = 82
8^2 + 2^2 = 68
6^2 + 8^2 = 100
1^2 + 0^2 + 0^2 = 1'''


class Solution:
    def isHappy(self, n: int) -> bool:
        seen = set()
        
        while n != 1 and n not in seen:
            seen.add(n)
            s = 0
            num = n
            while num > 0:
                r = num % 10
                s += r * r
                num //= 10
            n = s
        
        return n == 1
