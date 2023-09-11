const mysql = require('mysql');
const objectConnection = require('../../../configs/database.config');
const { hashPassword } = require('../helpers/authHelper');
const responseMessage = require('../helpers/responseMessage');

// REGISTER FOR USER
const registerUser = async (req, res) => {
  try {
    const passwordHashed = await hashPassword(req.body.password);
    const connection = mysql.createPool(objectConnection);
    const sqlQuery = 'CALL RegisterCandidate(?,?,?,?)';
    connection.query(
      sqlQuery,
      [req.body.full_name, req.body.phone, req.body.email, passwordHashed],
      function checkErrorOfQuery(err) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.sqlMessage, null, 'Fail', null));
        }
        return res
          .status(200)
          .json(
            responseMessage('Đăng ký thành công.!', null, 'Success.', null)
          );
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage('Error.....', null, 'Error', null));
  }
  return null;
};
module.exports = {
  registerUser,
};
