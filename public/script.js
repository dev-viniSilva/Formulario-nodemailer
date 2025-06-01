const formulario = document.getElementById("formulario");
const nome = document.getElementById("nome");
const sobrenome = document.getElementById("sobrenome");
const cep = document.getElementById("cep");
const rua = document.getElementById("rua");
const bairro = document.getElementById("bairro");
const idade = document.getElementById("idade");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");
const textDeInvalidation = document.getElementById("invalidCEP");
const erroIdade = document.getElementById("erroIdade");

let enderecoValido = false;
function validarIdade() {
  return parseInt(idade.value) >= 18;
}

cep.addEventListener("blur", async () => {
  const cepValido = await verificarCep();
  enderecoValido = cepValido;
});

[rua, bairro, cidade, estado].forEach(campo => {
  campo.addEventListener("input", () => {
    enderecoValido = false;
  });
});

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  const cepValido = await verificarCep();
  const idadeValida = validarIdade();

  if (!cepValido) {
    cep.focus();
    return;
  }

  if (!idadeValida) {
    erroIdade.innerHTML = 'Voce nao pode se cadastrar, pois e menor de 18 anos';
    idade.focus();
    return;
  } else {
    erroIdade.innerHTML = '';
  }

  const formData = new FormData(formulario);
  const dados = Object.fromEntries(formData.entries());

  try {
  fetch('https://formulario-nodemailer.onrender.com/enviar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dados)
});


    const mensagemDiv = document.getElementById('mensagem');

    if (resposta.ok) {
      mensagemDiv.textContent = 'Email enviado com sucesso!';
      mensagemDiv.style.color = 'green';
      formulario.reset();
    } else {
      mensagemDiv.textContent = 'Erro ao enviar o email.';
      mensagemDiv.style.color = 'red';
    }
  } catch (erro) {
    console.error('Erro na requisicao:', erro);
    document.getElementById('mensagem').textContent = 'Erro na conexao com o servidor.';
  }
});

async function verificarCep() {
  const cepNumeros = cep.value.replace(/\D/g, '');

  if (cepNumeros.length !== 8) {
    textDeInvalidation.innerHTML = "CEP invalido";
    return false;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
    const data = await response.json();

    if (data.erro) {
      textDeInvalidation.innerHTML = "CEP nao encontrado.";
      return false;
    }

    textDeInvalidation.innerHTML = "";
    rua.value = data.logradouro || "";
    bairro.value = data.bairro || "";
    cidade.value = data.localidade || "";
    estado.value = data.uf || "";

    M.updateTextFields();
    return true;

  } catch (error) {
    textDeInvalidation.innerHTML = "Erro ao buscar o CEP.";
    return false;
  }
}
