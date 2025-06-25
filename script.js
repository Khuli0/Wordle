const palavraCorreta = "MELAO";

const inputs = document.querySelectorAll('.char-box');
let current = 0;
const palavraTamanho = 5;
let linhaAtual = 0;
const totalLinhas = inputs.length / palavraTamanho;

// Movimento automático ao digitar nos inputs manualmente
inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    const inicioLinha = linhaAtual * palavraTamanho;
    const fimLinha = inicioLinha + palavraTamanho;

    if (index < inicioLinha || index >= fimLinha) return;

    if (input.value.length === 1 && index < fimLinha - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    const inicioLinha = linhaAtual * palavraTamanho;
    const fimLinha = inicioLinha + palavraTamanho;

    if (index < inicioLinha || index >= fimLinha) {
      e.preventDefault(); // bloqueia digitação fora da linha atual
      return;
    }

    if (!e.key.match(/^[a-zA-Z]$/) && e.key !== 'Backspace') {
      e.preventDefault();
    }

    if (e.key === 'Backspace' && input.value === '' && index > inicioLinha) {
      inputs[index - 1].focus();
    }
  });
});

// Função de clique no teclado virtual
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
      const preenchida = inputsLinha.every(input => input.value.trim() !== '');

      if (preenchida) {
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
      } else {
        alert('Digite a palavra completa!');
      }
    } else {
      if (current >= inicioLinha && current < fimLinha) {
        inputs[current].value = letra;
        inputs[current].focus();
        current++;
      }
    }
  });
});
