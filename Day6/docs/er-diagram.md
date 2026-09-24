# Support Ticket Database - ER Diagram

## Entities

### Users
- id (PK)
- name
- email

### Customers
- id (PK)
- name
- email

### Categories
- id (PK)
- name

### Tickets
- id (PK)
- customer_id (FK)
- category_id (FK)
- title
- description
- status
- created_at

### Comments
- id (PK)
- ticket_id (FK)
- user_id (FK)
- message
- created_at

### Assignments
- id (PK)
- ticket_id (FK)
- user_id (FK)
- assigned_at

### Status History
- id (PK)
- ticket_id (FK)
- status
- changed_by (FK)
- changed_at



## RelationShips



## Relationships

```text
Customers
    │
    │ 1:N
    ▼
 Tickets
    │
    ├──────── 1:N ──────── Comments
    │                         │
    │                         │ N:1
    │                         ▼
    │                       Users
    │
    ├──────── 1:N ──────── Assignments
    │                         │
    │                         │ N:1
    │                         ▼
    │                       Users
    │
    └──────── 1:N ──────── Status History
                              │
                              │ N:1
                              ▼
                            Users

Categories
    │
    │ 1:N
    ▼
 Tickets


## ER Diagram

```mermaid
erDiagram

    USERS {
        int id PK
        varchar name
        varchar email UK
    }

    CUSTOMERS {
        int id PK
        varchar name
        varchar email UK
    }

    CATEGORIES {
        int id PK
        varchar name
    }

    TICKETS {
        int id PK
        int customer_id FK
        int category_id FK
        varchar title
        text description
        varchar status
        timestamp created_at
    }

    COMMENTS {
        int id PK
        int ticket_id FK
        int user_id FK
        text message
        timestamp created_at
    }

    ASSIGNMENTS {
        int id PK
        int ticket_id FK
        int user_id FK
        timestamp assigned_at
    }

    STATUS_HISTORY {
        int id PK
        int ticket_id FK
        varchar status
        int changed_by FK
        timestamp changed_at
    }

    CUSTOMERS ||--o{ TICKETS : creates
    CATEGORIES ||--o{ TICKETS : contains
    TICKETS ||--o{ COMMENTS : has
    USERS ||--o{ COMMENTS : writes
    TICKETS ||--o{ ASSIGNMENTS : has
    USERS ||--o{ ASSIGNMENTS : receives
    TICKETS ||--o{ STATUS_HISTORY : tracks
    USERS ||--o{ STATUS_HISTORY : changes
```


## ER Diagram

```mermaid
erDiagram
    CUSTOMERS ||--o{ TICKETS : creates
    TICKETS ||--o{ COMMENTS : has
    USERS ||--o{ COMMENTS : writes
```