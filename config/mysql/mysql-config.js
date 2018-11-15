const { Model, knexSnakeCaseMappers } = require('objection');
const Knex = require('knex');

const knexConfig = require('../../knexfile');

// const knex = Knex(Object.assign(knexConfig[process.env.NODE_ENV], knexSnakeCaseMappers()));
const knex = Knex(Object.assign(knexConfig['development'], knexSnakeCaseMappers()));

// if (process.env.DEBUG) {
  knex.on('query', (queryData) => {
    console.log(queryData);
  });
//}

Model.knex(knex);

module.exports = {
  Model,
};
