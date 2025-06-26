class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        n = len(nums)
        answer = []
        for i in range(n):
            if nums[i] > 0:
                break
            elif i > 0 and nums[i] == nums[i-1]:
                continue
            lo, hi = i+1, n-1
            while lo < hi:
                summ = nums[i] + nums[lo] + nums[hi]
                if summ == 0:
                    answer.append([nums[i], nums[lo], nums[hi]])
                    lo, hi = lo+1, hi-1
                    while lo < hi and nums[lo] == nums[lo-1]:
                        lo += 1
                    while lo < hi and nums[hi] == nums[hi+1]:
                        hi -= 1
                elif summ < 0:
                    lo += 1
                else:
                    hi -= 1
        
        return answer
        # Time: O(n^2) # Space: O(n) (Excluding the output)
'''### ✅ Logic Behind the **Two Pointer Solution** for the 3Sum Problem

Let’s understand the **core logic** behind how and why this solution works — not just the steps, but **why each step is necessary**.

---

### 🔹 Problem Recap

Given: an array of integers `nums`.

Task: find **all unique triplets** `(a, b, c)` such that:

```
a + b + c == 0
```

---

### 🔸 Key Idea

We need three numbers that add up to zero.

Mathematically:

```
a + b + c = 0 → c = -(a + b)
```

So, for any two numbers `a` and `b`, we want to know:
**Is there a third number `c = -(a + b)` present in the array?**

But doing this naively is **too slow** (brute force is O(n³)).

---

### 🔸 Why Sort the Array?

```python
nums.sort()
```

Sorting helps us:

1. Use the **two-pointer technique** efficiently.
2. **Avoid duplicate triplets** easily, because duplicates are now adjacent.

---

### 🔸 Fix One Element, Search for Two Others

```python
for i in range(n):
```

* Fix one element `nums[i]` at a time.
* Now the problem reduces to a **two-sum** problem:

> Find two numbers `nums[lo]` and `nums[hi]` such that:
> `nums[i] + nums[lo] + nums[hi] == 0`

This is the **heart** of the logic.

---

### 🔸 Why Two Pointers Work

In the sorted array:

* Start with `lo = i + 1` and `hi = n - 1`
* Because array is sorted:

  * If the total sum is **too small**, move `lo` right to increase the sum.
  * If the sum is **too big**, move `hi` left to decrease the sum.

This makes the search efficient — only O(n) time per fixed element.

---

### 🔸 Avoiding Duplicates

```python
if i > 0 and nums[i] == nums[i-1]: continue
```

Skip duplicate values for the first element so we don't repeat the same triplet.

```python
while lo < hi and nums[lo] == nums[lo - 1]: lo += 1
while lo < hi and nums[hi] == nums[hi + 1]: hi -= 1
```

After finding a valid triplet, we skip duplicate `lo` and `hi` values to avoid repeating the same triplet multiple times.

---

### 🔸 Summary of the Logic

* **Fix one element** → reduce to **2Sum problem**
* Use **two pointers** to find a pair that sums with the fixed element to zero
* **Avoid duplicates** by skipping repeated values
* **Sorted array** is key to efficient search and duplicate handling

---

Would you like to see this logic applied step-by-step on an example input like `[-1, 0, 1, 2, -1, -4]`?

'''