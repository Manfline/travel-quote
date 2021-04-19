const request = require('supertest');
const FileStream = require('../../../../src/utils/FileStream');
const Helper = require('../../../../src/helpers/quote');
const HttpStatus = require('http-status-codes');
const server = require('../../../../src/server');

describe('A rota /quote', () => {
  beforeAll(() => {
    process.env.PATH_ROUTES = 'spec/__mocks__/routes.csv';
  });

  afterAll(() => server.close());

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('[POST] /', () => {
    afterAll(() => {
      const wl = FileStream.writeLine(process.env.PATH_ROUTES, {});
      [
        'GRU,BRC,10\n',
        'GRU,SCL,18\n',
        'GRU,ORL,56\n',
        'GRU,CDG,75\n',
        'SCL,ORL,20\n',
        'BRC,SCL,5\n',
        'ORL,CDG,5\n',
        'BRC,BA,10'
      ].forEach(row => {
        wl.write(row);
      });
    });
    test('Deve inserir uma linha no arquivo csv', async done => {
      const resPost = await request(server)
        .post('/quote')
        .type('form')
        .send(Helper.toJson('SP,RJ,50'));

      const resGet = await request(server).get('/quote/SP/RJ');
      expect(resGet.statusCode).toEqual(HttpStatus.OK);
      expect(resGet.body).toHaveProperty('route', 'SP,RJ');
      expect(resGet.body).toHaveProperty('price', 50);
      expect(resPost.statusCode).toEqual(HttpStatus.OK);
      expect(resPost.body).toHaveProperty(
        'message',
        'Rota adicionada com sucesso'
      );
      done();
    });

    test('Deve retornar 500 caso algum erro aconteça', async done => {
      const error = 'Algum erro ocorreu';
      const temp = FileStream.writeLine;
      FileStream.writeLine = jest.fn(() => {
        throw new Error(error);
      });
      const res = await request(server).post('/quote');
      expect(res.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty('message', error);
      FileStream.writeLine = temp;
      done();
    });

    test('Deve retornar 500 caso algum erro aconteça durante a inserção da linha', async done => {
      const error = 'Algum erro ocorreu';
      const temp = FileStream.writeLine;
      FileStream.writeLine = () => ({
        write: jest.fn((l, callback) => {
          callback(new Error(error));
        })
      });
      const res = await request(server).post('/quote');
      expect(res.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty('message', error);
      FileStream.writeLine = temp;
      done();
    });
  });

  describe('[GET] /:fom/:to', () => {
    test('Deve retornar a rota com o menor preço possivel', async done => {
      const res = await request(server).get('/quote/GRU/BRC');
      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.body).toHaveProperty('route', 'GRU,BRC');
      expect(res.body).toHaveProperty('price', 10);

      done();
    });

    test('Deve retornar mensagem de não encontrado caso não encontre o destino ou a origem da viagem', async done => {
      const res = await request(server).get('/quote/GRUT/BRC');
      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.body).toHaveProperty(
        'message',
        'Origem ou destino não encontrado'
      );
      done();
    });

    test('Deve retornar 500 caso algum erro aconteça', async done => {
      const error = 'Algum erro ocorreu';
      const temp = FileStream.readLine;
      FileStream.readLine = jest.fn(() => {
        throw new Error(error);
      });
      const res = await request(server).get('/quote/GRUT/BRC');
      expect(res.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty('message', error);
      FileStream.readLine = temp;
      done();
    });

    test('Deve retornar 500 caso algum erro aconteça durante o processamento da linha', async done => {
      const error = 'Algum erro ocorreu';
      const temp = Helper.toJson;
      Helper.toJson = jest.fn(() => {
        throw new Error(error);
      });
      const res = await request(server).get('/quote/GRUT/BRC');
      expect(res.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty('message', error);
      Helper.toJson = temp;
      done();
    });

    test('Deve retornar 500 caso algum erro aconteça durante o processamento da resposta', async done => {
      const error = 'Algum erro ocorreu';
      const temp = Helper.getTotalPriceConnections;
      Helper.getTotalPriceConnections = jest.fn(() => {
        throw new Error(error);
      });
      const res = await request(server).get('/quote/GRU/BRC');
      expect(res.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toHaveProperty('message', error);
      Helper.getTotalPriceConnections = temp;
      done();
    });
  });
});
