// import { defineAuth } from '@aws-amplify/backend';

// /**
//  * Define and configure your auth resource
//  * @see https://docs.amplify.aws/gen2/build-a-backend/auth
//  */
// export const auth = defineAuth({
//   loginWith: {
//     email: true,
//   },
//   userAttributes: {
//     preferredUsername: {
//       mutable: true,
//       required: true
//     }
//   }
// });

// import { referenceAuth } from '@aws-amplify/backend';

// export const auth = referenceAuth({
//   userPoolId: process.env.AWS_USER_POOL_ID!,
//   identityPoolId: process.env.AWS_IDENTITY_POOL_ID!,
//   authRoleArn: process.env.AWS_AUTH_ROLE_ARN!,
//   unauthRoleArn: process.env.AWS_UNAUTH_ROLE_ARN!,
//   userPoolClientId: process.env.AWS_CLIENT_ID!,
// });