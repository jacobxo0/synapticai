# GDPR Process Flows

## Data Access Request Flow

```mermaid
graph TD
    A[User Initiates Request] --> B[System Verification]
    B --> C[Request Logging]
    C --> D[Data Collection]
    D --> E[Data Preparation]
    E --> F[Secure Package Creation]
    F --> G[Notification]
    G --> H[Access Granted]
    H --> I[Audit Log Update]
    
    subgraph Verification
    B --> B1[Identity Check]
    B1 --> B2[Permission Validation]
    B2 --> B3[Consent Check]
    end
    
    subgraph Data Handling
    D --> D1[Profile Data]
    D --> D2[Mood Logs]
    D --> D3[Conversations]
    D --> D4[Goals]
    D --> D5[Therapist Notes]
    end
```

## Data Export Flow

```mermaid
graph TD
    A[User Selects Data] --> B[Permission Check]
    B --> C[Data Collection]
    C --> D[Format Conversion]
    D --> E[Package Creation]
    E --> F[Secure Storage]
    F --> G[Link Generation]
    G --> H[User Notification]
    H --> I[Download]
    I --> J[Link Expiration]
    
    subgraph Data Types
    C --> C1[Structured Data]
    C --> C2[Unstructured Data]
    C --> C3[Media Files]
    end
    
    subgraph Security
    E --> E1[Encryption]
    E1 --> E2[Integrity Check]
    E2 --> E3[Access Control]
    end
```

## Right to be Forgotten Flow

```mermaid
graph TD
    A[Deletion Request] --> B[Identity Verification]
    B --> C[Grace Period Start]
    C --> D[Data Marking]
    D --> E[Backup Handling]
    E --> F[Deletion Process]
    F --> G[Confirmation]
    G --> H[Audit Update]
    
    subgraph Verification
    B --> B1[Multi-factor Auth]
    B1 --> B2[Security Questions]
    B2 --> B3[Email Confirmation]
    end
    
    subgraph Data Handling
    D --> D1[Primary Data]
    D --> D2[Backup Data]
    D --> D3[Logs]
    D --> D4[Analytics]
    end
    
    subgraph Notification
    G --> G1[User Email]
    G --> G2[Therapist Alert]
    G --> G3[Org Admin Notice]
    end
```

## Consent Management Flow

```mermaid
graph TD
    A[Consent Request] --> B[User Review]
    B --> C[Consent Decision]
    C --> D[Consent Recording]
    D --> E[Access Update]
    E --> F[Notification]
    
    subgraph Types
    C --> C1[Data Processing]
    C --> C2[Therapist Access]
    C --> C3[Org Sharing]
    C --> C4[Marketing]
    end
    
    subgraph Management
    D --> D1[Consent DB]
    D --> D2[Expiry Tracking]
    D --> D3[Renewal Queue]
    end
```

## Access Control Flow

```mermaid
graph TD
    A[Access Attempt] --> B[Authentication]
    B --> C[Role Check]
    C --> D[Permission Check]
    D --> E[Consent Check]
    E --> F[Access Grant]
    F --> G[Activity Log]
    
    subgraph Authentication
    B --> B1[Credentials]
    B --> B2[2FA]
    B --> B3[Device Check]
    end
    
    subgraph Authorization
    C --> C1[Role Hierarchy]
    C --> C2[Scope Check]
    C --> C3[Time-based]
    end
    
    subgraph Monitoring
    G --> G1[Access Log]
    G --> G2[Anomaly Detection]
    G --> G3[Alert System]
    end
```

## Key Components

1. **Identity Verification**
   - Multi-factor authentication
   - Security questions
   - Email confirmation
   - Device fingerprinting

2. **Data Handling**
   - Structured data processing
   - Unstructured data management
   - Media file handling
   - Backup procedures

3. **Security Measures**
   - End-to-end encryption
   - Access control lists
   - Audit logging
   - Anomaly detection

4. **Notification System**
   - Email notifications
   - In-app alerts
   - Status updates
   - Confirmation messages

5. **Audit System**
   - Access logging
   - Activity tracking
   - Compliance monitoring
   - Report generation 