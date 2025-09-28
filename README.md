## Project Structure

```
COMPANY-DB/
├─ src/
│  ├─ modules/
│  │  ├─ company/
│  │  │  ├─ company.type.ts            # @ObjectType() Company entity definition
│  │  │  ├─ companyResolver.ts    # Queries & Mutations for Company (CRUD)
│  │  │  └─ company.input.ts      # @InputType() classes for creating/updating Company
│  │  │
│  │  ├─ region/
│  │  │  ├─ region.type.ts             # @ObjectType() Region entity definition
│  │  │  ├─ regionResolver.ts     # Queries & Mutations for Region (CRUD)
│  │  │  └─ region.input.ts       # @InputType() classes for creating/updating Region
│  │  │
│  │  └─ branch/
│  │     ├─ branch.type.ts             # @ObjectType() Branch entity definition
│  │     ├─ branchResolver.ts     # Queries & Mutations for Branch (CRUD)
│  │     └─ branch.input.ts       # @InputType() classes for creating/updating Branch
│  │
│  ├─ core/
│  │  ├─ dynamo.ts                # DynamoDB client setup and constants
│  │  └─ createTable.ts           # Script to create DynamoDB tables locally
│  │
│  └─ index.ts                    # Entry point: starts GraphQL Yoga server
│
├─ package.json                # Project dependencies and scripts
├─ tsconfig.json               # TypeScript configuration
├─ .env                        # Environment variables (e.g., DynamoDB endpoint)
└─ README.md                   # Explain project structure and Setup Instructions

```
## Instructions to Set Up the Project

1. **Download and Activate DynamoDB Server**  
    - Download DynamoDB zip file using this link : [Click ...](https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.zip)

    - Extract `zip` file to desired folder `ex: (C:\)`
 
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
4. **Setup `.env`**
    ```env
    DYNAMODB_ENDPOINT=http://localhost:8000
    ```
5. **Create table**
    ```bash
    npm run create-table
    ```
6. **Run the Project**  
    ```bash
    npm run dev
    ```
Open GraphiQL at `http://localhost:4000/graphql`.

## Some query and mutation example using `grapgql`
```gql
# mutation CreateCompany($input: CreateCompanyInput!) {
#   createCompany(input: $input) {
#     id
#     name
#     regions { 
#       id 
#       region_name 
#       branches { id branch_name address } 
#     }
#     createdAt
#   }
# }

# Variables:
# {
#   "input": {
#     "name": "SynesisIT",
#     "regions": [
#       {
#         "region_name": "Asia",
#         "branches": [
#           { "branch_name": "Dhaka50", "address": "Mohakhali DOHS 3, 30/429" }
#         ]
#       }
#     ]
#   }
# }

# query ListCompanies {
#   listCompanies {
#     id
#     name
#     regions {
#       id
#       region_name
#       branches {
#         id
#         branch_name
#         address
#       }
#     }
#   }
# }

# mutation AddRegion($companyId: String!, $input: CreateRegionInput!) {
#   addRegion(companyId: $companyId, input: $input) {
#     id
#     region_name
#   }
# }

# Variables:
# {
#   "companyId": "757d8cfa-f0bb-4e8f-a300-213f85a05f76",
#   "input": {
#     "region_name": "America",
#     "branches": [
#       { "branch_name": "Karwan Bazar", "address": "Karwan bazar/ 2/45" },
#       { "branch_name": "Mirpur", "address": "Mirpur 6, 12/24" }
#     ]
#   }
# }

# mutation DeleteCompany($id: String!) {
#   deleteCompany(id: $id)
# }

# Variables:
# {
#   "id": "fe55ff33-aeae-42fb-9a6e-23245a244357"
# }

# mutation DeleteRegion($companyId: String!, $regionId: String!) {
#   deleteRegion(companyId: $companyId, regionId: $regionId)
# }

# Variables:
# {
#   "companyId": "757d8cfa-f0bb-4e8f-a300-213f85a05f76",
#   "regionId": "180110c2-8af3-4915-b95d-09bab11f2703"
# }

# query GetCompany($id: String!) {
#   getCompany(id: $id) {
#     id
#     name
#     regions {
#       region_name
#       branches {
#         branch_name
#       }
#     }
#   }
# }

# Variables:
# {
#   "id": "81b83e0f-47b4-4998-84cd-481dfc3ba2b2"
# }

# query CompaniesByRegion($regionName: String!) {
#   companiesByRegion(region_name: $regionName) {
#     id
#     name
#     regions {
#       id
#       region_name
#       # branches {
#       #   id
#       #   branch_name
#       #   address
#       # }
#     }
#   }
# }

# Variables:
# {
#   "regionName": "Asia"
# }

# query GetCompanyByName($companyName: String!) {
#   getCompanyByName(companyName: $companyName) {
#     id
#     name
#     regions {
#       region_name
#     }
#   }
# }

# Variables:
# {
#   "companyName": "SynesisIT"
# }

# mutation AddBranch($companyId: String!, $regionId: String!, $input: CreateBranchInput!) {
#   addBranch(companyId: $companyId, regionId: $regionId, input: $input) {
#     id
#     branch_name
#     address
#   }
# }

# Variables:
# {
#   "companyId": "81b83e0f-47b4-4998-84cd-481dfc3ba2b2",
#   "regionId": "a8ad7e0d-ed94-416d-9ec2-c7ac163f0a81",
#   "input": {
#     "branch_name": "Chittagong",
#     "address": "Riazuddin Bazar, 4000/32"
#   }
# }

```

## Sample Data Stored in `DynamoDB`
```json
{
  "data": {
    "listCompanies": [
      {
        "id": "d6e5d32b-dca6-4a1e-a55d-2b017130f080",
        "name": "SynesisIT",
        "regions": [
          {
            "id": "74e44a3c-b588-4de6-af20-68d4f0d092ee",
            "region_name": "Asia",
            "branches": [
              {
                "id": "333e465e-b052-405f-b836-9ef32903b193",
                "branch_name": "Dhaka50",
                "address": "Mohakhali DOHS 3, 30/429"
              }
            ]
          }
        ]
      },
      {
        "id": "81b83e0f-47b4-4998-84cd-481dfc3ba2b2",
        "name": "Cloudly InfoTech",
        "regions": [
          {
            "id": "a8ad7e0d-ed94-416d-9ec2-c7ac163f0a81",
            "region_name": "Africa",
            "branches": [
              {
                "id": "049896c8-6052-4a43-8435-00c289b1742f",
                "branch_name": "Dhaka2",
                "address": "Mohakhali DOHS2, 30/429"
              },
              {
                "id": "0b515ce2-1e7e-419c-a0ed-b63c3f1c1ef2",
                "branch_name": "Chittagong",
                "address": "Riazuddin Bazar, 4000/32"
              }
            ]
          },
          {
            "id": "b699f63b-546d-446b-9187-3478d85c288e",
            "region_name": "Asia",
            "branches": [
              {
                "id": "28925b69-697a-408f-9b29-d512c15c619d",
                "branch_name": "Karwan Bazar",
                "address": "Karwan bazar/ 2/45"
              },
              {
                "id": "1fa843b5-325c-4cfa-868d-5b9f3f67525f",
                "branch_name": "mirpur",
                "address": "mirpur 6, 12/24"
              }
            ]
          },
          {
            "id": "b42c5013-64a4-4091-b90e-c714cabf19ad",
            "region_name": "America",
            "branches": []
          }
        ]
      },
      {
        "id": "1c1bd704-6610-4e20-98fb-1761b02d8821",
        "name": "SynesisIT",
        "regions": [
          {
            "id": "9fbd5ffb-b550-4f29-88ae-95ca4053ece1",
            "region_name": "Asia",
            "branches": []
          }
        ]
      }
    ]
  }
}
```