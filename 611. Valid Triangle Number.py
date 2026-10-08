class Solution:
    def triangleNumber(self, nums) -> int:
        bank=0
        nums.sort()
        for i in range(len(nums)-1,1,-1):
            left ,right = 0,i-1
            while left<right:
                ab=nums[left]+nums[right]
                if ab>nums[i]:
                    bank+=right-left
                    right-=1
                else:
                    left+=1
        return bank