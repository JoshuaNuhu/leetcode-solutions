class Solution(object):
    def isValid(self, s):
        """
        :type s: str
        :rtype: bool
        """
        open_backet=["{","(","["]
        stacks=[]
        for i in s:
            if i in open_backet:
                stacks.append(i)
            elif i == ")" and stacks and stacks[-1]=="(":
                stacks.pop()
            elif i == "]" and stacks and stacks[-1]=="[":
                stacks.pop()
            elif i == "}" and stacks and stacks[-1]=="{":
                stacks.pop()
            elif i in ")}]":
                return False
        if len(stacks)==0:
            return True
        else:
            return False                
