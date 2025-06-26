'''An ugly number is a positive integer which does not have a prime factor other than 2, 3, and 5.

Given an integer n, return true if n is an ugly number.
Example 1:

Input: n = 6
Output: true
Explanation: 6 = 2 × 3    
'''

class Solution:
 def isUgly(self,n: int) -> bool:
    if n <= 0:
        return False
    f=[2,3,5]
    for i in f:
     while n%i==0:
        n=n//i
    if n==1:
        return True    
    else:
        return False    
