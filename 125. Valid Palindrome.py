class Solution(object):
    def isPalindrome(self, s):
        s=s.lower()
        word = [i for i in s if i in "abcdefghijklmnopqrstuvwxyz1234567890"]
        rev_s=word[::-1]
        if rev_s ==word:
            return True 
        else:
            return False     
