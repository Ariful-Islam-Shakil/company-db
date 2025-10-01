import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, "CompanyDB", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    table.addGlobalSecondaryIndex({
      indexName: "gs1",
      partitionKey: { name: "gs1pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    // Lambda
    const graphqlLambda = new lambda.Function(this, "GraphQLLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "lambda.main",
      code: lambda.Code.fromAsset("../dist"),
      environment: {
        TABLE_NAME: table.tableName,
        NODE_ENV: "production",
      },
    });

    // Grant Lambda access to table
    table.grantReadWriteData(graphqlLambda);

    // API Gateway
    new apigateway.LambdaRestApi(this, "GraphQLEndpoint", {
      handler: graphqlLambda,
      proxy: true,
    });
  }
}
