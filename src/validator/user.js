const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = {
  async validateRegisterInput(data) {
    const description = [];
    const dataTemp = data;

    dataTemp.FirstName = !isEmpty(dataTemp.FirstName) ? dataTemp.FirstName : '';
    dataTemp.LastName = !isEmpty(dataTemp.LastName) ? dataTemp.LastName : '';
    // dataTemp.email = !isEmpty(dataTemp.email) ? dataTemp.email : '';
    dataTemp.UserName = !isEmpty(dataTemp.UserName) ? dataTemp.UserName : '';
    dataTemp.UserPass = !isEmpty(dataTemp.UserPass) ? dataTemp.UserPass : '';
    dataTemp.UserPass2 = !isEmpty(dataTemp.UserPass2) ? dataTemp.UserPass2 : '';

    if (!Validator.isLength(dataTemp.FirstName, { min: 2, max: 30 })) {
      description.push({ FirstName: 'first name must between 2 and 30 characters' });
    }

    if (!Validator.isLength(dataTemp.LastName, { min: 2, max: 30 })) {
      description.push({ LastName: 'last name must between 2 and 30 characters' });
    }

    if (!Validator.isLength(dataTemp.UserName, { min: 2, max: 30 })) {
      description.push({ UserName: 'user name must between 2 and 30 characters' });
    }

    if (!Validator.isLength(dataTemp.UserPass, { min: 2, max: 30 })) {
      description.push({ UserPass: 'password must between 2 and 30 characters' });
    }

    if (!isEmpty(description)) {
      const err = new Error('Invalid input');
      err.description = description;
      throw err;
    }
  },

  async validateUserLogin(data) {
    if (!data.user) {
      const err = new Error('Authorization required');
      err.description = { user: 'user must login' };
      throw err;
    }
  }
}