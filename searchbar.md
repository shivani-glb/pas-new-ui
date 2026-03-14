Can you also integrate the search bar suggestions for each individual word as soon as user types new word we will try to search with at least 3 characters given for a word.

API is 
```curl
curl -X 'GET' \
  'http://127.0.0.1:8000/suggest?query=Ai&limit=10' \
  -H 'accept: application/json'
```
response:
```json
{
  "query": "Ai",
  "suggestions": [
    {
      "word": "ai girls",
      "source": "prefix",
      "score": 1
    },
    {
      "word": "airdrop",
      "source": "prefix",
      "score": 1
    }
  ]
}
```

along with this we will also show user with category after the horizontal saparator line :

like this :sugestion popup

user: Comp
Suggestion: Computer \n Computer Offers \n Computerised

horizontal line in the sugestion popup:---
Category 1 > Subcategory 1 | Computer
Category 1 > Subcatergory 2 | Computer
Category 2 > Subcartegory 1 | Computer
Category 2 > Subcartegory 2 | Computer
Category 3 > Subcartegory 1 | Computer

Pop finshed here