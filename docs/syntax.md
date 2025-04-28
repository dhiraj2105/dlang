# 📚 dlang Syntax Documentation

## 📝 Introduction

`dlang` is a basic interpreted programming language designed for learning and experimentation. This document outlines the syntax rules, keywords, operators, and examples for the language.

---

## 🔑 Keywords

These are reserved words in `dlang`. They have special meanings and cannot be used as variable names.

| Keyword | Description                  |
| ------- | ---------------------------- |
| `let`   | Variable declaration         |
| `print` | Print output to console      |
| `if`    | Conditional statement        |
| `else`  | Else part of the conditional |
| `while` | Loop statement               |
| `#`     | Comment                      |

### Example:

```dlang
let x = 10
print x


📐 Variables
Variables are declared using the let keyword.

let <variable_name> = <value>;

Example:
let x = 10    # Declares variable x with value 10
let y = "hello" # Declares variable y with value "hello"


➗ Arithmetic Operators
dlang supports basic arithmetic operations:

+: Addition
-: Subtraction
*: Multiplication
/: Division

Example:
let sum = 5 + 3
let diff = 10 - 4
let product = 4 * 6
let quotient = 8 / 2


🖨️ Print Statement
To display output, use the print keyword.

Example:
let message = "Hello, World!"
print message


🖋️ Comments
dlang supports single-line comments starting with #.

Example:
# This is a comment
let x = 10 # This is also a comment


🔄 Conditional Statements (if-else)
Use if and else for conditional execution.

Example:
let x = 5
if x > 0
    print "Positive number"
else
    print "Non-positive number"


🔁 Looping (while)
while loops execute as long as the condition is true.

Example:
let i = 0
while i < 5
    print i
    i = i + 1

Break and Continue
let num = 0
while num < 10 {
    print num
    if num == 5 {
        continue
    }
    if num == 8 {
        break
    }
    num = num + 1
}


```

Functions :

```dlang
# Function without params , args, return
function greet() {
  print "Hello World"
}

greet()


# Function with arguments and params and return
function sum(a,b){
  dede a + b # 'dede' is the keyword used instead of return | in Hindi dede means to give
}

let num1 = 1
let num2 = 2

let res = sum(num1, num2)
print res

print sum(5,10)
```

🧑‍💻 Final Notes
dlang is still in early development; new features will be added over time.

Syntax is designed to be simple and beginner-friendly for learning purposes.
