class Solution(object):
    def moveZeroes(self, nums):
        """
        :type nums: List[int]
        :rtype: None Do not return anything, modify nums in-place instead.
        """
        insert = 0
        i = 0
        while i < len(nums):
            if nums[i] == 0:
                i += 1
            else:
                nums[insert] = nums[i]
                if insert != i:
                    nums[i] = 0
                insert += 1
                i += 1