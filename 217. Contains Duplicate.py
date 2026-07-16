class Solution(object):
    def containsDuplicate(self, nums):
        """
        :type nums: List[int]
        :rtype: bool
        """        
        hashmap={}
        for i in nums:
            if i not in hashmap:
                hashmap[i]=hashmap.get(i,0)+1
            else:
                return True
        return False
        