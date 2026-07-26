class Solution(object):
    def moveZeroes(self, nums):
        """
        :type nums: List[int]
        :rtype: None Do not return anything, modify nums in-place instead.
        """
        count =0
        for i in range(len(nums)):
            if i == len(nums)-1:
                break
            elif nums[i] ==0:
                nums.pop(nums[i-count])
                nums.append(0)
                count+=1
                
        
        return nums