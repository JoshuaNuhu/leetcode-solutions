class Solution(object):
    def majorityElement(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        hashmap={}
        for i in nums:
            
                hashmap[i]=hashmap.get(i,0)+1
            
        return max(hashmap,key=hashmap.get)