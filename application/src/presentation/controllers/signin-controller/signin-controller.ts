

export default class SigninController {
  handle() {
    return {
      statusCode: 400,
      body: 'Invalid email is provided'
    }
  }
}