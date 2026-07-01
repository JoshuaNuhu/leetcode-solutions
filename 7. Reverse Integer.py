class Solution:
    def reverse(self, x: int) -> int:
        num=str(x)

        if num[0] == "-":
                rnum=num.replace("-", "")
                rnum=rnum[::-1]
                reversed_int=-int(rnum)
        else:
                    rnum=num[::-1]
                    reversed_int=int(rnum)
        if not (-2147483648 <= reversed_int <= 2147483647):
                    return 0
        return reversed_int