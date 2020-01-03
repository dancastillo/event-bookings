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

export function queryBookings() {
  return {
    query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
                price
              }
            }
          }
        `
  }
}

export function cancelBooking(bookingId) {
  return {
    query: `
            mutation CancelBooking($id: ID!) {
              cancelBooking (bookingId: $id){
                _id
                title
              }
            }
          `,
    variables: {
      id: bookingId
    }
  };
}

export function createEvent(title, price, date, description) {
  return {
    query: `
          mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
    variables: {
      title,
      price,
      date,
      description
    }
  };
}

export function queryEvents() {
  return {
    query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
  }
}

export function bookEvent(id) {
  return {
    query: `
          mutation BookEvent($id: ID!){
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
    variables: {
      id: id
    }
  }
}
