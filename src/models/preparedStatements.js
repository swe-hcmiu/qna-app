module.exports.insertQuery = 'INSERT INTO ?? SET ?';

module.exports.selectAllQuery = 'SELECT * FROM ?? WHERE ?? = ?';

module.exports.selectAllQuery2 = 'SELECT * FROM ??';

module.exports.selectQuery = 'SELECT ?? FROM ?? WHERE ?? = ?';

module.exports.selectAllQueryWithConstraints = 'SELECT * FROM ?? WHERE ?? = ? LIMIT ? ORDER BY ??';

module.exports.selectQueryWithConstraints = 'SELECT ?? FROM ?? WHERE ?? = ? LIMIT ? ORDER BY ??';

module.exports.selectAllQueryWithTwoConstraints = 'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?';

module.exports.selectAllQueryWithTwoConstraints2 = 'SELECT * FROM ?? WHERE ?? = ? AND ?? <> ?';

module.exports.deleteAllQueryWithTwoConstraints = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ?';

module.exports.deleteAllQueryWithThreeConstraints = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ?';

module.exports.updateQueryWithConstraints = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';

module.exports.updateUserVoteQuery = 'UPDATE ?? SET VoteByUser = VoteByUser + 1 WHERE ?? = ?';

module.exports.updateEditorVoteQuery = 'UPDATE ?? SET VoteByEditor = VoteByEditor + 1 WHERE ?? = ?';

module.exports.cancelUserVoteQuery = 'UPDATE ?? SET VoteByUser = VoteByUser - 1 WHERE ?? = ?';

module.exports.cancelEditorVoteQuery = 'UPDATE ?? SET VoteByEditor = VoteByEditor - 1 WHERE ?? = ?';

module.exports.selectListOfVotedQuestions = `SELECT voting.QuestionId FROM voting, questions WHERE voting.QuestionId
= questions.QuestionId AND voting.UserId = ? AND questions.SessionId = ?`;
