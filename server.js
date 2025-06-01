require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SENHA
  }
});

app.get('/teste', (req, res) => {
  res.send('Servidor ativo');
});

app.post('/enviar', async (req, res) => {
  const { nome, sobrenome, idade, cep, rua, bairro, cidade, estado } = req.body;

  const formularioPreenchedo = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Novo corredor para o NY75',
    text: `
      Nome: ${nome} ${sobrenome}
      Idade: ${idade}
      CEP: ${cep}
      Rua: ${rua}
      Bairro: ${bairro}
      Cidade: ${cidade}
      Estado: ${estado}
    `
  };

  try {
    await transporter.sendMail(formularioPreenchedo);
    res.status(200).send('Email enviado com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao enviar o email');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
