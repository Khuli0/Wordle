let palavraCorreta; // ⚡ agora pode ser reatribuída

const inputs = document.querySelectorAll('.char-box');
let current = 0;
const palavraTamanho = 5;
let linhaAtual = 0;
const totalLinhas = inputs.length / palavraTamanho;

// ----------------------------
// CARREGA PALAVRAS DO JSON
// ----------------------------
fetch("palavras.json")
  .then(response => response.json())
  .then(lista => {
    const aleatoria = lista[Math.floor(Math.random() * lista.length)];
    palavraCorreta = aleatoria.toUpperCase();
    console.log("Palavra correta:", palavraCorreta);
    iniciarJogo(); // ⚡ inicia o jogo só depois de carregar a palavra
  })
  .catch(erro => {
    console.error("Erro ao carregar palavras:", erro);
    alert("Erro ao carregar palavras.");
  });

// ----------------------------
// FUNÇÃO INICIAR JOGO
// ----------------------------
function iniciarJogo() {
  // 🔹 foca no primeiro input
  inputs[0].focus();

  // ----------------------------
  // Movimento automático e navegação
  // ----------------------------
  inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      const inicioLinha = linhaAtual * palavraTamanho;
      const fimLinha = inicioLinha + palavraTamanho;

      if (index < inicioLinha || index >= fimLinha) return;

      if (input.value.length === 1 && index < fimLinha - 1) {
        inputs[index + 1].focus();
        current = index + 1;
      } else {
        current = index;
      }
    });

    input.addEventListener('keydown', (e) => {
      const inicioLinha = linhaAtual * palavraTamanho;
      const fimLinha = inicioLinha + palavraTamanho;

      // Bloqueia digitação fora da linha atual
      if (index < inicioLinha || index >= fimLinha) {
        e.preventDefault();
        return;
      }

      // Permite letras, backspace, enter e setas
      if (!e.key.match(/^[a-zA-Z]$/) && !['Backspace','Enter','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      // Backspace
      if (e.key === 'Backspace' && input.value === '' && index > inicioLinha) {
        inputs[index - 1].focus();
        current = index - 1;
      }

      // Enter físico
      if (e.key === 'Enter') {
        verificarPalavra();
      }

      // Navegação com setas
      if (e.key === 'ArrowLeft' && index > inicioLinha) {
        e.preventDefault();
        inputs[index - 1].focus();
        current = index - 1;
      }
      if (e.key === 'ArrowRight' && index < fimLinha - 1) {
        e.preventDefault();
        inputs[index + 1].focus();
        current = index + 1;
      }
    });
  });

  // ----------------------------
  // Teclado virtual
  // ----------------------------
  document.querySelectorAll('.teclado button').forEach(btn => {
    btn.addEventListener('click', () => {
      const letra = btn.textContent.toUpperCase();
      const inicioLinha = linhaAtual * palavraTamanho;
      const fimLinha = inicioLinha + palavraTamanho;
      const inputsLinha = Array.from(inputs).slice(inicioLinha, fimLinha);

      if (letra === '←') {
        if (current > inicioLinha) {
          current--;
          inputs[current].value = '';
          inputs[current].focus();
        }
      } else if (letra === 'ENTER') {
        verificarPalavra();
      } else {
        if (current >= inicioLinha && current < fimLinha) {
          inputs[current].value = letra;
          inputs[current].focus();
          current++;
        }
      }
    });
  });
}

// ----------------------------
// Função que verifica a palavra
// ----------------------------
function verificarPalavra() {
  const inicioLinha = linhaAtual * palavraTamanho;
  const fimLinha = inicioLinha + palavraTamanho;
  const inputsLinha = Array.from(inputs).slice(inicioLinha, fimLinha);
  const preenchida = inputsLinha.every(input => input.value.trim() !== '');

  if (!preenchida) {
    alert('Digite a palavra completa!');
    return;
  }

  let palavra = '';

  inputsLinha.forEach((input, index) => {
    const letraDigitada = input.value.toUpperCase();
    palavra += letraDigitada;

    if (letraDigitada === palavraCorreta[index]) {
      input.style.backgroundColor = 'green';
      input.style.color = 'white';
    } else if (palavraCorreta.includes(letraDigitada)) {
      input.style.backgroundColor = 'gold';
      input.style.color = 'black';
    } else {
      input.style.backgroundColor = 'gray';
      input.style.color = 'white';
    }
  });

  if (palavra === palavraCorreta) {
    setTimeout(() => alert('🎉 Acertou!'), 100);
  } else {
    linhaAtual++;
    if (linhaAtual < totalLinhas) {
      current = linhaAtual * palavraTamanho;
      inputs[current].focus();
    } else {
      setTimeout(() => alert(`☠️ Fim do jogo! A palavra era: ${palavraCorreta}`), 100);
    }
  }
}

// ----------------------------
// Função modal
// ----------------------------
const modal = document.getElementById("modal");
const abrirBtn = document.getElementById("abrirModal");

abrirBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
