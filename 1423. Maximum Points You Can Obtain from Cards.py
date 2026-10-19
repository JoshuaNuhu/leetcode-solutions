class Solution:
    def maxScore(self, cards: List[int], k: int) -> int:
        # Your code goes here
        start =0
        sumnum=0
        maxsum=0
        end=0
        while start<len(cards)-1:
            sumnum+=cards[end]
            end+=1
            if end -start+1==k:
                maxsum=max(maxsum,sumnum)
                sumnum-=cards[start]
                start+=1
        return maxsum        