'use strict';

const bcrypt = require('bcryptjs');
const SEED_USER = {
  name: 'root',
  email: 'root@boun.cr',
  password: 'password'
}
const isDone = [true, false]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10), null),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
      .then(userId => queryInterface.bulkInsert('Todos',
        Array.from({ length: 10 }).map((_, i) =>
        ({
          name: `name-${i}`,
          UserId: userId,
          isDone: isDone[Math.floor(Math.random() * isDone.length)],
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {}))
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Todos', null, {})
      .then(() => queryInterface.bulkDelete('Users', null, {}))
  }
};
