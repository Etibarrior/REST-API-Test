# TEST WORK - REST API
REST API server with bearer token auth

Language: ***JavaScript***

Database: ***PostgreSQL***

# Description
### API (JSON)
- ***/signin [POST]*** - request for bearer token by id and password


- ***/signup [POST]*** - creation of new user.

  - Fields id and password. Id - phone number or email. After signup add field `id_type` - phone or email.

  - In case of successful signup - return token.


- ***/info [GET]*** - returns user id and id type


- ***/logout [GET]*** - with param `all`:

  - true - removes all users bearer tokens 
  - false - removes only current token
# Commands to start
 ```
 npm i
 
 npm run start
```

#### *code by Kirill Maryukhna*
