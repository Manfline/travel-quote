# Descrição
Esta API é capaz de calcular o menor preço possível de
passagens, independentemente do número de conexões necessárias.

# Instalação e Execução
Para utilizar esse projeto é necessário utilizar o Docker e Docker Compose

Buildando uma imagem 
```docker
$ docker-compose up -d
```

# Testes
```js
$ npm test // executa os testes unitarios
$ npm run cover // executa e mostra a cobertura dos testes
```

# Configuração
Para modificar a porta da API consule o arquivo .env na raiz do projeto

# Exemplos
```js
Request
GET /quote/GRU/SCL
Response
{
  route: 'GRU,BRC,SCL',
  price: 15
}

POST /quote
Body
{
  from: 'BRC',
  to: 'BA',
  price: 15
}
Response
{ 
  message: 'Rota adicionada com sucesso'
}
```