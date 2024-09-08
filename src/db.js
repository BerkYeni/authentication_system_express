const users = new Map();

module.exports = {
  addUser: (user) => {
    users.set(user.username, user);
  },
  getUser: (username) => {
    return users.get(username);
  },
  // Add other database operations as needed
};