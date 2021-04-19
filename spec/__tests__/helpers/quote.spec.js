const Helper = require('../../../src/helpers/quote');

describe('A classe Quote', () => {
  test('O metodo toJson deve converter uma linha csv em json', () => {
    const res = Helper.toJson('GRU,BRC,10');
    expect(res).toHaveProperty('from', 'GRU');
    expect(res).toHaveProperty('to', 'BRC');
    expect(res).toHaveProperty('price', 10);
  });

  test('O metodo getMinPriceRoute deve retornar a rota de menor preço', () => {
    const routes = [
      {
        price: 20
      },
      {
        price: 5
      },
      { price: 10 }
    ];
    const res = Helper.getMinPriceRoute(routes);
    expect(res).toHaveProperty('price', 5);
  });

  test('O metodo getConnections deve retornar um array contendo as conexões desde a origem até a atual rota', () => {
    const res = Helper.getConnections(
      [Helper.toJson('AAA,BBB,15'), Helper.toJson('BBB,CCC,10')],
      Helper.toJson('CCC,DDD,7')
    );
    expect(res[0]).toHaveProperty('from', 'AAA');
    expect(res[0]).toHaveProperty('to', 'BBB');
    expect(res[0]).toHaveProperty('price', 15);

    expect(res[1]).toHaveProperty('from', 'BBB');
    expect(res[1]).toHaveProperty('to', 'CCC');
    expect(res[1]).toHaveProperty('price', 10);

    expect(res[2]).toHaveProperty('from', 'CCC');
    expect(res[2]).toHaveProperty('to', 'DDD');
    expect(res[2]).toHaveProperty('price', 7);
  });

  test('O metodo getTotalPriceConnections deve retornar preço total entre as conexões', () => {
    const routes = [
      {
        price: 20
      },
      {
        price: 5
      },
      { price: 10 }
    ];
    const res = Helper.getTotalPriceConnections(routes);
    expect(res).toBe(35);
  });

  test('O metodo getTravelRoutes deve retornar as rotas no formato \'AA,BB\'', () => {
    const routes = [
      Helper.toJson('AAA,BBB,15'),
      Helper.toJson('BBB,CCC,10'),
      Helper.toJson('CCC,DDD,7')
    ];
    const res = Helper.getTravelRoutes(routes);
    expect(res).toBe('AAA,BBB,CCC,DDD');
  });

  test('O metodo toLine transformar um json em uma nova linha csv', () => {
    const route = Helper.toJson('AAA,BBB,15');
    const res = Helper.toLine(route);
    expect(res).toBe('AAA,BBB,15');
  });
});
