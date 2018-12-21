const createRandomString = (length) => {
  let str = '';
  for (; str.length < length; str += Math.random().toString(36).substr(2));
  return str.substr(0, length);
};

module.exports = {
  user: {
    username: 'thanhtung',
    password: '123',
  },
  newSession: {
    // sessionName: fuzzer.mutate.string('userNameT2est'),
    sessionName: createRandomString(10),
    sessionType: 'DEFAULT',
  },
  newQuestion: {
    title: createRandomString(10),
    content: createRandomString(50),
  },
  sessionId: null,
  questionId: null,
  status: {
    Status: 'ANSWERED',
  },
  UserId: { 
    userId: '1',
  },
};
