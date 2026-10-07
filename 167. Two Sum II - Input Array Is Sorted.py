class Solution(object):
    def twoSum(self, nums, target):
        """
        :type numbers: List[int]
        :type target: int
        :rtype: List[int]
        """
        left,right=0,len(nums)-1
        while left<right:
            apx=nums[left]+nums[right]
            if apx==target:
                return [left+1,right+1]
            elif apx<target:
                left+=1
            else:
                right-=1
        return False