def max_area(self, heights) -> int:
    left,right=0,len(heights)-1
    area=0
    count=0
    while left<right:
        if heights[left]==heights[right]:
            new_area=heights[left]+(right-left)
            area= new_area if new_area>area else area
        elif count%2==0:
            count+=1
            left+=1
        else:
            count+=1
            right-=1
    return area