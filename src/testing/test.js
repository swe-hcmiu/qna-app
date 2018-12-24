const req = require('supertest');
const { expect } = require('chai');
const dumpObject = require('./dumpObject');
const app = require('../../app');

const authenticateUser = req.agent(app);

before((done) => {
  authenticateUser
    .post('/users/login')
    .send(dumpObject.user)
    .end((err, res) => {
      // console.log(res);
      if (err) { done(err); }
      expect(res.status).to.equal(200);
      expect('Location', '/api/sessions');
      // console.log('RESSSSSS', res);
      done();
    });
});

describe('/api/session/', () => {
  it('POST method, Create a session, statusCode 200, msg success, sessionId number', (done) => {
    authenticateUser
      .post('/api/sessions')
      .send(dumpObject.newSession)
      .end((err, res) => {
        // console.log(res.body);
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.msg).to.equal('create session success!');
        expect(res.body.sessionId).to.be.a('number');
        const id = res.body.sessionId;
        dumpObject.sessionId = id;
        done();
      });
  });

  it('GET method, get List of session, status code 200, recevie list of session', (done) => {
    authenticateUser
      .get('/api/sessions')
      .end((err, res) => {
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});


describe('/api/session/:sessionId', () => {
  it('GET method, get a specific session, statusCode 200, msg success, sessionId must be number number', (done) => {
    req(app)
      .get(`/api/sessions/${dumpObject.sessionId}`)
      .send(dumpObject.newSession)
      .end((err, res) => {
        // console.log(res.body);
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.any.keys('session', 'role', 'listOfNewestQuestion', 'listOfTopFavoriteQuestion', 'listOfAnweredQuestion');
        done();
      });
  });

  it('DELETE method, delete a session, status code 200, recevie msg success!', (done) => {
    authenticateUser
      .delete(`/api/sessions/${dumpObject.sessionId}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body.msg).to.equal('delete session success!');

        done();
      });
  });
});

describe('/:sessionId/questions/', () => {
  // create a session before post question
  before((done) => {
    authenticateUser
      .post('/api/sessions')
      .send(dumpObject.newSession)
      .end((err, res) => {
        // console.log(res.body);
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.msg).to.equal('create session success!');
        expect(res.body.sessionId).to.be.a('number');
        const id = res.body.sessionId;
        dumpObject.sessionId = id;
        done();
      });
  });

  // delete session after testing
  after((done) => {
    authenticateUser
      .delete(`/api/sessions/${dumpObject.sessionId}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.statusCode).to.equal(200);
        expect(res.body.msg).to.equal('delete session success!');

        done();
      });
  });

  it('POST api/sessions/:sessionId/questions, statusCode 200, create 15 question test, return question Id', (done) => {
    for (let i = 0; i < 14; i += 1) {
      authenticateUser
        .post(`/api/sessions/${dumpObject.sessionId}/questions`)
        .send(dumpObject.newQuestion)
        .end((err, res) => {
          // console.log(dumpObject.newQuestion);
          if (err) { done(err); }
          expect(res.status).to.equal(200);
          expect(res.body.questionId).to.be.a('number');
          const Id = res.body.questionId;
          dumpObject.questionId = Id;
        });
    }
    done();
  });


  it('GET api/sessions/:sessionId/questions/newest, statusCode 200, return list question ', (done) => {
    authenticateUser
      .get(`/api/sessions/${dumpObject.sessionId}/questions/newest`)
      .end((err, res) => {
        // console.log(res.body);
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        res.body.forEach((element) => {
          expect(element).to.include.any.keys('QuestionId', 'SessionId, UserId, Title, Content, VoteByUser, VoteByEditor, Status, CreatetionTime, UpdateTime');
        });
        done();
      });
  });

  // it('GET api/sessions/:sessionId/top, statusCode 200, return list top 10 question', (done) => {
  //   authenticateUser
  //     .get(`/api/sessions/${dumpObject.sessionId}/questions/top`)
  //     .end((err, res) => {
  //       if (err) { done(err); }
  //       // console.log(res.body);
  //       expect(res.status).to.equal(200);
  //       expect(res.body).to.be.an('array');
  //       expect(res.body.length).to.equal(10);
  //       res.body.forEach((element) => {
  //         expect(element).to.include.any.keys('QuestionId', 'SessionId, UserId, Title, Content, VoteByUser, VoteByEditor, Status, CreatetionTime, UpdateTime');
  //       });
  //       done();
  //     });
  // });

  it('GET api/sessions/:sessionId/answered, statusCode 200, return list answered', (done) => {
    authenticateUser
      .get(`/api/sessions/${dumpObject.sessionId}/questions/answered`)
      .end((err, res) => {
        if (err) { done(err); }
        // console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        res.body.forEach((element) => {
          expect(element).to.include.any.keys('QuestionId', 'SessionId, UserId, Title, Content, VoteByUser, VoteByEditor, Status, CreatetionTime, UpdateTime');
          expect(element.status).to.equal('ANSWERED');
        });
        done();
      });
  });

  it('GET api/sessions/:sessionId/answered, statusCode 200, return list answered', (done) => {
    authenticateUser
      .get(`/api/sessions/${dumpObject.sessionId}/questions/pending`)
      .end((err, res) => {
        if (err) { done(err); }
        // console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        res.body.forEach((element) => {
          expect(element).to.include.any.keys('QuestionId', 'SessionId, UserId, Title, Content, VoteByUser, VoteByEditor, Status, CreatetionTime, UpdateTime');
          expect(element.status).to.equal('PENDING');
        });
        done();
      });
  });

  it('GET api/sessions/:sessionId/:questionId, statusCode 200, return a specific question', (done) => {
    authenticateUser
      .get(`/api/sessions/${dumpObject.sessionId}/questions/${dumpObject.questionId}`)
      .end((err, res) => {
        if (err) { done(err); }
        // console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.any.keys('QuestionId', 'SessionId, UserId, Title, Content, VoteByUser, VoteByEditor, Status, CreatetionTime, UpdateTime');
        // dumpObject.Status = res.body.Status;
        done();
      });
  });

  it('PUT api/sessions/:sessionId/:questionId/vote, statusCode 200, user vote, USER', (done) => {
    authenticateUser
      .put(`/api/sessions/${dumpObject.sessionId}/questions/${dumpObject.questionId}/vote`)
      .end((err, res) => {
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('PUT api/sessions/:sessionId/:questionId/vote, statusCode 200, anonymus vote', (done) => {
    req.agent(app)
      .put(`/api/sessions/${dumpObject.sessionId}/questions/${dumpObject.questionId}/vote`)
      .end((err, res) => {
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('DELETE api/sessions/:sessionId/:questionId/vote, statusCode 200, user deni vote', (done) => {
    authenticateUser
      .delete(`/api/sessions/${dumpObject.sessionId}/questions/${dumpObject.questionId}/vote`)
      .end((err, res) => {
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('PUT api/sessions/:sessionId/:questionId/vote, statusCode 200, user change status', (done) => {
    // let newStatus = null;
    authenticateUser
      .put(`/api/sessions/${dumpObject.sessionId}/questions/${dumpObject.questionId}/status`)
      .send(dumpObject.status)
      .end((err, res) => {
        if (err) { done(err); }
        // console.log(res);
        expect(res.status).to.equal(200);
        authenticateUser
          .get(`/api/sessions/${dumpObject.sessionId}/questions/${dumpObject.questionId}`)
          .end((error, result) => {
            if (error) { done(error); }
            // console.log('resulttttttt', result.body.Status);
            // console.log('result', dumpObject.status.Status);
            expect(result.body.Status).to.equal(dumpObject.status.Status);
          });
        // expect().to.equal(dumpObject.status);
        done();
      });
  });
});

describe('/:sessionId/editors', () => {
  // create a session before post question
  before((done) => {
    authenticateUser
      .post('/api/sessions')
      .send(dumpObject.newSession)
      .end((err, res) => {
        // console.log(res.body);
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.msg).to.equal('create session success!');
        expect(res.body.sessionId).to.be.a('number');
        const id = res.body.sessionId;
        dumpObject.sessionId = id;
        done();
      });
  });

  it('GET /:sessionId/editors => return session editor, sttCode: 200', (done) => {
    authenticateUser
      .get(`/api/sessions/${dumpObject.sessionId}/editors`)
      .end((err, res) => {
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done(err);
      });
  });

  // it('GET info user', (done) => {
  //   authenticateUser
  //     .get('/api/users/info')
  //     .end((err, res) => {
  //       // console.log('AAAAA', res.body);
  //       if (err) { done(err); }
  //       expect(res.status).to.equal(200);
  //       dumpObject.userId.UserId = res.body.UserId;
  //       console.log(dumpObject.userId);
  //       done();
  //     });
  // });

  it('POST /:sessionId/editors/permissons sttCode: 200, give permission', (done) => {
    authenticateUser
      .post(`/api/sessions/${dumpObject.sessionId}/editors/permissions`)
      .send(dumpObject.UserId)
      .end((err, res) => {
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('POST /:sessionId/editors/permissons sttCode: 200, remove permission', (done) => {
    authenticateUser
      .delete(`/api/sessions/${dumpObject.sessionId}/editors/permissions`)
      .send(dumpObject.UserId)
      .end((err, res) => {
        if (err) { done(err); }
        expect(res.status).to.equal(200);
        done(err);
      });
  });
});
