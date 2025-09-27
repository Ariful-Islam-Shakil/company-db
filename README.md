## Project Structure and File Folders

```
company-db/
│
│
├─ src/
│  ├─ index.ts                 # Entry point: start GraphQL Yoga server
│  ├─ dynamo.ts                # DynamoDB client setup and constants
│  ├─ createTable.ts           # Script to create DynamoDB tables locally
│  │
│  ├─ entity/                  # GraphQL object types and input types
│  │  ├─ Company.ts            # @ObjectType() Company entity
│  │  ├─ Region.ts             # @ObjectType() Region entity
│  │  ├─ Branch.ts             # @ObjectType() Branch entity
│  │  └─ inputs.ts             # @InputType() classes for mutations (input)
│  │
│  └─resolvers/               # GraphQL resolver classes
│     ├─ CompanyResolver.ts    # Queries & Mutations for Company
│     ├─ RegionResolver.ts     # Region-specific operations
│     └─ BranchResolver.ts     # Branch-specific operations
│ 
├─ package.json                # Project dependencies and scripts
├─ tsconfig.json               # TypeScript configuration
└─ .env                        # Environment variables (e.g., DynamoDB endpoint)

```
## Instructions to Set Up the Project
### Download DynamoDB locally
[Download link ...](https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.zip)


1. **Download and Activate DynamoDB Server**  
    - Download DynamoDB using the provided link : [Click ...](https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.zip)

    - Extract Zip file to desired folder `ex: (C:\)`
 
    - Move to extracted folder and activate the server by executing:
    ```bash
    cd C:\dynamodb_local_latest
    java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 8000
    ```

2. **Clone the GitHub Repository**  
    ```bash
    git clone "https://github.com/Ariful-Islam-Shakil/company-db.git"
    cd company-db
    ```

3. **Install Packages**  
    ```bash
    npm install
    ```
4. **Create table**
    ```bash
    npm run create-table
    ```
4. **Run the Project**  
    ```bash
    npm run dev
    ```
Open GraphiQL at `http://localhost:4000/graphql`.
