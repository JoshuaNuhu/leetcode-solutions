def threeSum(nums):
    """
    :type nums: List[int]
    :rtype: List[List[int]]
    """
    nums=nums.sort()
    left=len(nums)-1
    right=0
    while True:
        if nums[right]+ nums[round(len(nums)/2)]+nums[left]>0:
            left-=1
        elif nums[right]+ nums[round(len(nums)/2)]+nums[left]<0:
            right+=1
        else:
            return [nums[right],nums[round(len(nums)/2)],nums[left]]
threeSum([-1,0,1,2,-1,-4])