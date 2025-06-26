'''Given two arrays a[] and b[], your task is to determine whether b[] is a subset of a[].

Examples:

Input: a[] = [11, 7, 1, 13, 21, 3, 7, 3], b[] = [11, 3, 7, 1, 7]
Output: true
Explanation: b[] is a subset of a[]'''
class Solution:
    def isSubset(self, a, b):
        freq = {}

        # Count frequency of each element in a[]
        for val in a:
            if val in freq:
                freq[val] += 1
            else:
                freq[val] = 1

        # Check if each element in b[] exists in freq with enough count
        for val in b:
            if val not in freq or freq[val] == 0:
                return False
            freq[val] -= 1

        return True

                
    
    
    
    
