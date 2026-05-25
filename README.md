# ENGWEB2026-Normal

Projeto desenvolvido para o exame normal de Engenharia Web 2026. A solução está organizada de acordo com os dois exercícios do enunciado.

A estrutura principal do repositório é a seguinte:

- `ex1`: serviço de dados para a coleção de jogos de tabuleiro.
- `ex2`: serviço de dados e página estática para a lista de leituras.

## Dados e persistência

### Exercício 1

No primeiro exercício foi usada a base de dados `jogostabuleiro`, tendo como coleção principal `jogos`, conforme indicado no enunciado.

O ficheiro com os dados dos jogos encontra-se em:

```bash
ex1/api/dados/jogos.json
```

No arranque da aplicação, a API confirma se a coleção ainda não tem documentos. Caso esteja vazia, os dados são carregados automaticamente a partir do ficheiro JSON. Para tornar as pesquisas diretas mais simples, o identificador `id` presente no dataset é também guardado como `_id` no MongoDB.

### Exercício 2

Para a lista de leituras foi criada a base de dados `leituras`, usando a coleção `livros`.

O ficheiro usado para povoar inicialmente a base de dados está em:

```bash
ex2/api/dados/livros.json
```

Tal como no exercício anterior, a importação inicial só é feita quando a coleção ainda se encontra vazia.

## Execução dos serviços

### Exercício 1

Para arrancar a aplicação do primeiro exercício, deve-se entrar na pasta correspondente e iniciar os containers:

```bash
cd ex1
docker compose up --build
```

Depois de o Docker Compose terminar o arranque, ficam disponíveis os seguintes endereços:

- API: `http://localhost:17000`
- Documentação Swagger: `http://localhost:17000/api-docs`

Se for necessário reiniciar tudo do zero, incluindo apagar os volumes da base de dados, pode ser usado:

```bash
docker compose down -v
```

### Exercício 2

Para executar o segundo exercício:

```bash
cd ex2
docker compose up --build
```

Com os serviços ativos, é possível aceder a:

- API: `http://localhost:19020/api/livros`
- Interface Web: `http://localhost:19021`

Neste exercício, o serviço de MongoDB não está publicado para fora do Docker. A comunicação com a base de dados é feita apenas pela API, através da rede interna criada pelo `docker-compose`.

Para parar os serviços e remover também os volumes associados:

```bash
docker compose down -v
```

## Exemplos de teste com curl

### Exercício 1

Obter todos os jogos:

```bash
curl http://localhost:17000/jogos
```

Consultar um jogo específico através do seu identificador:

```bash
curl http://localhost:17000/jogos/catan
```

Listar jogos associados a uma determinada editora:

```bash
curl "http://localhost:17000/jogos?editora=KOSMOS"
```

Obter a lista de autores:

```bash
curl http://localhost:17000/autores
```

Obter a lista de categorias:

```bash
curl http://localhost:17000/categorias
```

Inserir um novo jogo:

```bash
curl -X POST http://localhost:17000/jogos \
  -H "Content-Type: application/json" \
  -d '{"id":"teste-jogo","name":"Teste Jogo","year":2026,"category":"Family","minPlayers":2,"maxPlayers":4,"playingTimeMinutes":30,"descriptionEN":"Jogo de teste.","autores":[{"id":"autor-teste","name":"Autor Teste"}],"editoras":[{"id":"editora-teste","name":"Editora Teste","country":"Portugal"}],"mecanicas":[],"premios":[]}'
```

Atualizar informação de um jogo:

```bash
curl -X PUT http://localhost:17000/jogos/teste-jogo \
  -H "Content-Type: application/json" \
  -d '{"playingTimeMinutes":45}'
```

Remover o jogo criado para teste:

```bash
curl -X DELETE http://localhost:17000/jogos/teste-jogo
```

### Exercício 2

Consultar todos os livros:

```bash
curl http://localhost:19020/api/livros
```

Pesquisar livros pelo título ou pelo autor:

```bash
curl "http://localhost:19020/api/livros?search=Kafka"
```

Criar um novo livro:

```bash
curl -X POST http://localhost:19020/api/livros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Livro de Teste","autor":"Autor Teste","paginas":123,"genero":"Teste"}'
```

Alterar o estado de leitura de um livro:

```bash
curl -X PUT http://localhost:19020/api/livros/ID_DO_LIVRO \
  -H "Content-Type: application/json" \
  -d '{"lido":true}'
```

Apagar um livro:

```bash
curl -X DELETE http://localhost:19020/api/livros/ID_DO_LIVRO
```

## Queries do exercício 1

As queries MongoDB correspondentes ao ponto 1.2 do enunciado encontram-se em:

```bash
ex1/queries.txt
```

## Verificação dos requisitos

- [x] O repositório contém a pasta `ex1`.
- [x] O repositório contém a pasta `ex2`.
- [x] No exercício 1, a base de dados usada é `jogostabuleiro`.
- [x] No exercício 1, a coleção principal chama-se `jogos`.
- [x] O ficheiro `queries.txt` foi incluído no exercício 1.
- [x] A rota `GET /jogos` está implementada.
- [x] A rota `GET /jogos/:id` está implementada.
- [x] A rota `GET /jogos?editora=EEEE` está implementada.
- [x] A rota `GET /autores` está implementada.
- [x] A rota `GET /categorias` está implementada.
- [x] A rota `POST /jogos` está implementada.
- [x] A rota `PUT /jogos/:id` está implementada.
- [x] A rota `DELETE /jogos/:id` está implementada.
- [x] A documentação Swagger está disponível em `/api-docs`.
- [x] O exercício 1 inclui Dockerfile e `docker-compose.yml`.
- [x] O exercício 2 inclui um modelo Mongoose para os livros.
- [x] O exercício 2 inclui um dataset inicial com 6 livros.
- [x] A rota `GET /api/livros`, incluindo pesquisa com `?search=X`, está implementada.
- [x] A rota `POST /api/livros` está implementada.
- [x] A rota `PUT /api/livros/:id` altera o campo `lido`.
- [x] A rota `DELETE /api/livros/:id` está implementada.
- [x] A API do exercício 2 está exposta na porta `19020`.
- [x] A interface estática é servida por Nginx na porta `19021`.
- [x] O MongoDB do exercício 2 não fica acessível diretamente a partir do exterior.
