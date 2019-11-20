export function login(email, password) {
  return {
    query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
    variables: {
      email,
      password
    }
  };
}

export function createUser(email, password) {
  return {
    query: `
            mutation CreateUser($email: String!, $password: String!) {
              createUser(userInput: {email: $email, password: $password}) {
                _id
                email
              }
            }
          `,
      variables: {
      email,
        password
    }
  };
}
