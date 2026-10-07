def max_area(self, heights) -> int:
    left,right=0,len(heights)-1
    area=0
    while left<right:
        new_area=heights[left]*(right-left) if heights[left]<=heights[right] else heights[right]*(right-left)
        area= new_area if new_area>area else area
        if heights[left]==heights[right]:
            left+=1
        elif heights[left]< heights[right]:
            left+=1
        else:
            right-=1
    return area