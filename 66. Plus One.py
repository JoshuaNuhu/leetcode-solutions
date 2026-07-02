class Solution(object):
    def plusOne(self, digits):
        """
        :type digits: List[int]
        :rtype: List[int]
        """
        result = 0
        for digit in digits:
            result = (result * 10) + digit
        result+=1
        return [int(i) for i in str(result)]