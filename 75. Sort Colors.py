class Solution:
    def sortColors(self, nums) :
        i,left,right=0,0,len(nums)-1
        while i <= right:
            if i==left:
                i+=1
            elif nums[i] ==0:
                nums[i]=nums[left]
                nums[left]=0
                left+=1
            elif nums[i] ==2:
                nums[i]=nums[right]
                nums[right]=2
                right-=1