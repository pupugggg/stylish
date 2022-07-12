# STYLiSH

Online Shopping for trending Clothes & Fashion

## Table of Contents  

* [DEMO](#demo)

* [Architecture](#backend--architectrue)

* [Frontend](#frontend)

* [Tools](#tools--environment--concept)

## DEMO

[SITE](http://18.182.2.156)

You can Login with demo account:

| Email        | password |
|--------------|----------|
| u1@gmail.com | u1       |

Please use this card if you want to purchase the products:
| Card Number         | Expiration | CCV |
|---------------------|------------|-----|
| 4242 4242 4242 4242 | 01/23      | 123 |

you can go to [SITE](http://18.182.2.156) directly or click the image below to Watch the demo video on youtube

[DEMO VIDEO FOR MAIN PAGE](https://youtu.be/DMfvIkqlywI)
[![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://youtu.be/DMfvIkqlywI)

[DEMO VIDEO FOR CMS](https://youtu.be/DDJIV2Nv6No)
[![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://youtu.be/DDJIV2Nv6No)

## BACKEND & ARCHITECTRUE

![alt text](/images/Architecture.svg)

* NGINX

  apply reverse proxy and SSL encryption to secure the connection betweeon server and client

* Rate Limiter

  Implement [Leaky Bucky algorithm](https://en.wikipedia.org/wiki/Rate_limiting) using Redis to prvent DDOS attack

* Routes

  The requests are distributed baseed on their target url by routes.
  routes in this project can be catagoried into public route and privte route. The public route can be accessed by everyone. The private route can only be accessed by loggedin user. the route will forward the requests to controller for further operation.

* Controllers

  The controllers will validate and parse the request into the data. After the request data be passed to model and return the desired result, the controller will send the respond back to client.

* models

  The model in this project not only interact with the database but also defined the schema of the database using ORM.

* Cache
  
  To ensure better user experience and to stable database utilization, read through policy is implemented using redis.
* MySQL

  Here is the schema:
  ![alt text](/images/schema.svg)

* Payment
  The payment service is prvided by [TapPay SDK](https://docs.tappaysdk.com/tutorial/zh/home.html#home), there are three main step to complete payment process:
  ![alt-img](https://docs.tappaysdk.com/images/Welcome/pay_by_prime_flow.jpeg)

  1. Send credit card information to TapPay server then recieve unique key called prime.
  
  2. Send the prime to the backend server, the server will forward the prime along with the purchase detail to bank server.

  3. Once the backend server recieved the payment response, the response will be stored in DB by transcation.

## FRONTEND

* React

  This project use react to speed up the development.

* Redux

  Redux can prevent the overhead of state consistent management among hierarchical react components. Redux can also provide more maintainable way to change the state (i.e. one-way data flow) when it comes to state editing.

## TOOLS & ENVIRONMENT & CONCEPT

* Languages
  1. HTML, CSS
  2. Javascript
* Backend Environment and Framework
  1. Linux
  2. Node.js
  3. Express.js
* SQL Database
  1. CRUD Operations: MySQL
  2. Indexing, Primary Key, Foreign Key and Joins
  3. Transaction and ACID
  4. Data Model: One-to-One, One-to-Many, Many-to-Many
  5. Database Normalization
  6. Security and SQL Injection.
  7. Query Builder and ORM
  8. Backup and Migration
* Cloude Service
  1. AWS EC2
  2. AWS Auto Scaling:Load Balancer
* Key Concept
  1. Version Control
  2. Asynchronous: callback, Promise and async/await
  3. Javascript Event Loop
  4. MVC design pattern
  5. RESTful APIs
  6. Unit Test
  7. Load Test: Artillery
  8. Availability and Scalability
  9. Coding styles and Code Readability
