# commentbackend
 Backend for test job
## Install

    $ git clone https://github.com/ospberd/commentbackend
    $ cd commentbackend
    $ npm install


## Running the project

    $ node index.js

## the api server is available at http://localhost:3000/api/

## to send a comment to the server use postman
## address localhost:3000/api/{id}
  where {id} is the comment we want to reply to
  if not specified, a header comment will be added

   You can set keys in Postman using the form-data Body tab<br>
		userName  <br>
		email<br>
		homePage<br>
		attFile          - attachment file<br>
		content<br>

## To receive messages from the server
## GET   localhost:3000/api/:id?/:count?/:page?/:orderby?/:direction?

   where
   id  - id  of the message to which we want to receive answers<br>
         root - header comments<br>

 count - count of messages to receive<br>

 page - page first page = 0<br>

orderby - field for sorting<br>
     userName, email, homePage, createdAt<br>

direction -  sorting direction<br>
      ASC, DESC<br>


## to get attachment file
## GET   localhost:3000/api/download/:id

id  - id  of the message to get attachment file<br>

