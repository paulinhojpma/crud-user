const test = require('tape');
const supertest = require('supertest');
const app = require('./routes/index');
const bodyParser = require('body-parser');


test('GET /testaCriaFila', (t) => {
    supertest(app)
      .get('/testaCriaFila')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) =>{
        t.error(err, 'Sem erros')
        t.assert(res.body.success === true, "Desconto correto")
        t.end()  
      });
});