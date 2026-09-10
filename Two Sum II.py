def twosum(nums,target):
    for i in range(len(nums)):
        next_num= i+1
        while next_num<=len(nums)-1:
            if nums[i]+nums[next_num]==target:
                return [i,next_num]
            else:
                next_num+=1
