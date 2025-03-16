# Cadastro de Cidadãos

Sistema de cadastro de cidadãos brasileiros com validação de CPF e busca por nome/CPF para o desafio CIENTEC.

## Funcionalidades

- Cadastro de cidadãos com nome completo e CPF
- Validação automática de CPF
- Busca por CPF ou nome
- Banco de dados em MySQL
- Testes automatizados
- Gravação de logs da aplicação (/log/app.log)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- MySQL Server

## Instalação

1. Instale as dependências:

```bash
npm install
```


2. Configure o banco de dados:
   - Renomeie o arquivo `.env.example` para `.env` e edite de acordo com as configurações de seu banco de dados.
   - Execute o script de setup do banco de dados:
```bash
npm run setup-db
```

## Executando a aplicação

Para iniciar o servidor em modo desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Executando os testes

Para executar os testes automatizados:
```bash
npm test
```

## Tecnologias utilizadas

- TypeScript
- Node.js
- MySQL
- HTML/CSS
- Jest para testes (parte bônus)
- cpf-cnpj-validator (validação de CPF)