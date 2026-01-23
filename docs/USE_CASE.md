# Student Haven Hub - Use Case Diagram

This diagram describes the high-level interactions between the User (Student) and the System.

```mermaid
usecaseDiagram
    actor Student
    actor "AI System" as AI

    package "Student Haven Hub" {
        usecase "Search Properties" as UC1
        usecase "View Property Details" as UC2
        usecase "Compare Properties" as UC3
        usecase "View AI Insights" as UC4
        usecase "Manage Profile" as UC5
        usecase "Upload Profile Picture" as UC6
        usecase "Write Review" as UC7
        usecase "Upload Property Photos" as UC8
    }

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC5
    Student --> UC7
    
    UC5 ..> UC6 : <<include>>
    UC2 ..> UC4 : <<include>>
    UC7 ..> UC8 : <<include>>
    
    UC4 <-- AI : Generates
```
