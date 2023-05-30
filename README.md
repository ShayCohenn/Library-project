# Books.com - Library management project 

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
# 

## Working website:
### https://shaycohenn.github.io/Library-project/
#
## Backend website contains the raw data in JSON:
### https://project-test-utrw.onrender.com  
#### (*loading the site may take a few moments if the server is down*)


## Description
A simple website for maneging a library.

## Features
- Add, edit and remove new customers.
- Add and remove new books.
- Create loans, Assign books to customers.
- Alerts for customers that are late with returning their books
- Each category has a page that contains all the information of each book\loan\customer

## Loan types
Each book has it's own type.
The type determines the maximum time that the book can be loaned for

# Installation
## Copy to terminal
 - ### git clone https://github.com/ShayCohenn/Library-project-front.git
 - ### cd .\Library-project-front\
 - ### virtualenv env
 - ### .\env\Scripts\activate
 - ### pip install -r requirements.txt
#
 ## *Importent note*
 ### *The front is connected to the live server on render cloud and not to the local host from the flask app*
