# BF Terminal Emulator for Node.js

**Note:** Requires input from user to start, type anything into the terminal and press enter and the program will start

Effectively creates a functioning Turing machine using only Brain Fuck syntax. Can read \ write data, perform loops as well as execute it's own code that was written to "internal" memory.

## UI
Shows ptr (pointer), val (value of current pointer in array), and the std out (string that is outputted).  
Below is the current memory that is stored, it can reach infinate length by incrementing the pointer.  
Beside the value of the memory is the command that will be executed if the code would be executing machine code.

## Commands
You can use however many characters you need to perform a command in one line. `>>>++.` is valid for one line.

#### ">": (0) Increment Pointer

#### "<": (1) Decrement Pointer

#### "+": (2) Increment Value

#### "-": (3) Decrement Value

#### ".": (4) Output to stdout

#### ",": (5) Start / Stop execution
If the user sends the "," command, it will start executing the code at the current pointer and will not stop unless either the end of written memory is reached or it finds another "," symbol.

#### "[": (6) Start loop
Denotes the place to start from when reaching the corresponding "]"

#### "]": (7) Stop loop
If the value at the current pointer is not 0, the loop will begin again
