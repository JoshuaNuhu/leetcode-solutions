def twosum(nums,target):
    right=0
    left=len(nums)-1
    while left<right:
        if nums[right]+nums[left]>target:
            left-=1
        elif nums[right]+nums[left]<target:
            right+=1
        else:
            return[right+1,left+1]

