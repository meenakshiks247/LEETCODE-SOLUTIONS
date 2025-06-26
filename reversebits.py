class Solution:
    def reverseBits(self, n: int) -> int:
        # Convert to 32-bit binary string
        binary_str = bin(n)[2:].zfill(32)

        # Reverse the binary string
        reversed_str = binary_str[::-1]

        # Convert back to integer
        return int(reversed_str, 2)
  

  ''' 
  bin(n)[2:] → Converts integer n to binary string (removes '0b' prefix).

  .zfill(32) → Ensures the binary string is exactly 32 bits long (with leading zeros if needed).

   [::-1] → Reverses the binary string.

   int(reversed_str, 2) → Converts the reversed binary string back to a decimal integer.
  '''