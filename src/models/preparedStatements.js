module.exports.insertQuery = 'INSERT INTO ?? SET ?';

module.exports.selectAllQuery = 'SELECT * FROM ?? WHERE ?? = ?';

module.exports.selectAllQuery2 = 'SELECT * FROM ??';

module.exports.selectQuery = 'SELECT ?? FROM ?? WHERE ?? = ?';

module.exports.selectAllQueryWithConstraints = 'SELECT * FROM ?? WHERE ?? = ? LIMIT ? ORDER BY ??';

module.exports.selectQueryWithConstraints = 'SELECT ?? FROM ?? WHERE ?? = ? LIMIT ? ORDER BY ??';

module.exports.selectAllQueryWithTwoConstraints = 'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?';

module.exports.selectAllQueryWithTwoConstraints2 = 'SELECT * FROM ?? WHERE ?? = ? AND ?? <> ?';

module.exports.deleteQuery = 'DELETE FROM ?? WHERE ?? = ?';

module.exports.deleteAllQueryWithTwoConstraints = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ?';

module.exports.deleteAllQueryWithThreeConstraints = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ?';

module.exports.updateQueryWithConstraints = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';

module.exports.updateUserVoteQuery = 'UPDATE ?? SET VoteByUser = VoteByUser + 1 WHERE ?? = ?';

module.exports.updateEditorVoteQuery = 'UPDATE ?? SET VoteByEditor = VoteByEditor + 1 WHERE ?? = ?';

module.exports.cancelUserVoteQuery = 'UPDATE ?? SET VoteByUser = VoteByUser - 1 WHERE ?? = ?';

module.exports.cancelEditorVoteQuery = 'UPDATE ?? SET VoteByEditor = VoteByEditor - 1 WHERE ?? = ?';

module.exports.selectListOfVotedQuestions = `SELECT voting.QuestionId FROM voting, questions WHERE voting.QuestionId
= questions.QuestionId AND voting.UserId = ? AND questions.SessionId = ?`;

module.exports.deleteUsersInVotingTableOfSession = 'DELETE FROM users WHERE Provider = ? AND UserId IN (SELECT DISTINCT voting.UserId FROM voting, questions WHERE voting.QuestionId = questions.QuestionId AND SessionId = ?)';

module.exports.deleteUsersInQuestionsTableOfSession = 'DELETE FROM users WHERE Provider = ? AND UserId IN (SELECT DISTINCT UserId FROM questions WHERE SessionId = ?)';

module.exports.selectNewestQuestions = `SELECT * FROM questions WHERE SessionId = ? AND Status = "UNANSWERED" 
ORDER BY Time DESC`;

module.exports.selectTopFavoriteQuestions = `SELECT * FROM questions WHERE SessionId = ? AND Status = "UNANSWERED" 
ORDER BY VoteByEditor DESC, VoteByUser DESC`;

module.exports.selectAnsweredQuestions = `SELECT * FROM questions WHERE SessionId = ? AND Status = "ANSWERED" 
ORDER BY Time DESC`;

module.exports.selectPendingQuestions = `SELECT * FROM questions WHERE SessionId = ? AND Status = "PENDING" ORDER BY 
Time DESC`;
