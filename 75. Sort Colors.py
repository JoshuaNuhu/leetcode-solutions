class Solution:
    def sortColors(self, nums) :
        count=0
        for i in range(len(nums)):
            if nums[i] <nums[count]:
                new=nums[i]
                nums[i]=nums[count]
                nums[count]=new
                count+=1