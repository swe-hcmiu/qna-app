const apiBenchmark = require('api-benchmark');
const fs = require('fs');


const services = {
  nodeJS: 'http://localhost:3000/',
};

const routes = {
  getListOfSessions: {
    method: 'get',
    route: 'api/sessions',
  },
};

const options = {
  debug: true,
  runMode: 'parallel',
  minSamples: 500,
  maxTime: 5,
};

apiBenchmark.compare(services, routes, options, (err, results) => {
  apiBenchmark.getHtml(results, (error, html) => {
    fs.writeFileSync('benchmarks.html', html);
  });
});
