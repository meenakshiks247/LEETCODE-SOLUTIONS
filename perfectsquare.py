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
    
  
