def quick(arr, l, r):
    guard = arr[l]
    while l < r:
        while l < r and arr[r] >= guard:
            r -= 1
        if l < r:
            arr[l] = arr[r]
        while l < r and arr[l] <= guard:
            l += 1
        if l < r:
            arr[r] = arr[l]
    arr[l] = guard
    return l

def part(arr, l, r):
    if l < r:
        index = quick(arr, l, r)
        part(arr, l, index - 1)
        part(arr, index + 1, r)

num = [3,1,2,5,4,6,3]
l = 0
r = len(num) - 1
part(num, l, r)
print(num)