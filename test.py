# def palindrome(s1):
#     return s1 == s1[::-1]

  # True

def palindrome(s2):
    for i in range(len(s2)//2):
        if s2[i] != s2[-i-1]:
            return False
    return True  
print(palindrome("racecar"))

def vowels(s):
    vowels = "aeiouAEIOU" 
    count = 0
    for char in s:
        if char in vowels:
            count += 1
    return count
print(vowels("Hello World")) 

def words(s):
    words = s.split()
    rev = words[::-1]
    ans = " ".join(rev)
    print(ans)
words("Hello World")

def repeating(s):
    freq = {}
    for char in s:
            freq[char] = freq.get(char,0)+1
    for char in s:
        if freq[char]==1:
            return char
    return None
print(repeating("gaurgav")) 

def duplicate(s):
    ans = ""
    freq = set()
    for char in s:
        if char not in freq:
            ans += char
            freq.add(char)
    return ans
print(duplicate("gaurgav"))       
               