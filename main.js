// Cauã Pereira da Silva - RM568143
// Felipe Estevo Santos - RM567780
// Igor Grave Teixeira - RM567663
// Renan dos Reis Santos - RM568540


// CIFRA ATBASH

function cifrarAtbash(mensagem) {
    const alfabetoNormal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alfabetoAtbash = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';

    const alfabetoNormalMinusc = 'abcdefghijklmnopqrstuvwxyz';
    const alfabetoAtbashMinusc = 'zyxwvutsrqponmlkjihgfedcba';

    let resultado = '';

    for (let i = 0; i < mensagem.length; i++) {
        const char = mensagem[i];
        let charCifrado = char;

        let index = alfabetoNormal.indexOf(char);
        if (index !== -1) {
            charCifrado = alfabetoAtbash[index];
        } else {
            index = alfabetoNormalMinusc.indexOf(char);
            if (index !== -1) {
                charCifrado = alfabetoAtbashMinusc[index];
            }
        }

        resultado += charCifrado;
    }

    return resultado;
}


document.addEventListener('DOMContentLoaded', () => {

    const inputTexto = document.getElementById('inputTexto');
    const botaoCifrar = document.getElementById('botaoCifrar');
    const textoResultado = document.getElementById('textoResultado');

    botaoCifrar.addEventListener('click', () => {

        const textoOriginal = inputTexto.value;

        const textoCifrado = cifrarAtbash(textoOriginal);

        textoResultado.textContent = textoCifrado;
    });

    const inputCesar = document.getElementById('inputCesar');
    const chaveCesar = document.getElementById('chaveCesar');
    const botaoCesar = document.getElementById('botaoCesar');
    const resultadoCesar = document.getElementById('resultadoCesar');

    botaoCesar.addEventListener('click', () => {
        const mensagem = inputCesar.value;
        const chaveStr = chaveCesar.value;
        const chave = parseInt(chaveStr);

        if (mensagem && !Number.isNaN(chave)) {
            const resultado = executarLogicaCifra(mensagem, chave);
            resultadoCesar.textContent = resultado;
        } else {
            resultadoCesar.textContent = "Por favor, digite uma mensagem e uma chave válida.";
        }
    });

});

// CIFRA CÉSAR

function executarLogicaCifra(mensagem, chave) {
    const k = ((chave % 26) + 26) % 26;
    let resultado = '';

    for (let i = 0; i < mensagem.length; i++) {
        const c = mensagem[i];
        const code = c.charCodeAt(0);

        if (code >= 65 && code <= 90) {
            const base = 65;
            const offset = code - base;
            const novo = (offset + k) % 26;
            resultado += String.fromCharCode(base + novo);

        } else if (code >= 97 && code <= 122) {
            const base = 97;
            const offset = code - base;
            const novo = (offset + k) % 26;
            resultado += String.fromCharCode(base + novo);

        } else {
            resultado += c;
        }
    }
    return resultado;
}

// CIFRA VIGENÈRE

function cifrarVigenere(mensagem, palavraChave, modo = 'codificar') {
    let resultado = '';
    const tamanhoChave = palavraChave.length;
    let indiceChave = 0;

    for (let i = 0; i < mensagem.length; i++) {
        const char = mensagem[i];
        const codigo = mensagem.charCodeAt(i);

        if (char >= 'A' && char <= 'Z') {
            const chave = palavraChave[indiceChave % tamanhoChave].toUpperCase().charCodeAt(0) - 65;
            const deslocamento = modo === 'codificar' ? chave : -chave;
            resultado += String.fromCharCode((codigo - 65 + deslocamento + 26) % 26 + 65);
            indiceChave++;
        } else if (char >= 'a' && char <= 'z') {
            const chave = palavraChave[indiceChave % tamanhoChave].toLowerCase().charCodeAt(0) - 97;
            const deslocamento = modo === 'codificar' ? chave : -chave;
            resultado += String.fromCharCode((codigo - 97 + deslocamento + 26) % 26 + 97);
            indiceChave++;
        } else {
            resultado += char;
        }
    }

    return resultado;
}

function executarVigenere() {
    const mensagem = document.getElementById("mensagem").value;
    const chave = document.getElementById("chave").value;
    const modo = document.getElementById("modo").value;

    if (!mensagem || !chave) {
        alert("Por favor, preencha a mensagem e a chave.");
        return;
    }

    const resultado = cifrarVigenere(mensagem, chave, modo);
    document.getElementById("resultado").textContent = resultado;
}


// CRIPTOGRAFIA RSA

function gcd(a, b) {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function modInverse(e, phi) {
    let [old_r, r] = [e, phi];
    let [old_s, s] = [1n, 0n];
    let [old_t, t] = [0n, 1n];

    while (r !== 0n) {
        let quotient = old_r / r;
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
        [old_t, t] = [t, old_t - quotient * t];
    }

    if (old_r > 1n) {
        return null;
    }

    if (old_s < 0n) {
        old_s += phi;
    }

    return old_s;
}


function modPow(base, exponent, modulus) {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) { 
            result = (result * base) % modulus;
        }
        exponent = exponent >> 1n;
        base = (base * base) % modulus;
    }
    return result;
}


const botaoRSA = document.getElementById('botaoRSA');


if (botaoRSA) {
    botaoRSA.addEventListener('click', function () {
        try {

            const p = BigInt(document.getElementById('rsaP').value);
            const q = BigInt(document.getElementById('rsaQ').value);
            const e = BigInt(document.getElementById('rsaE').value);
            const message = BigInt(document.getElementById('rsaMessage').value);
            const mode = document.getElementById('rsaMode').value;


            if (!p || !q || !e || !message) {
                alert("Por favor, preencha todos os campos (p, q, e, Mensagem).");
                return;
            }

  
            const n = p * q;
            const phi_n = (p - 1n) * (q - 1n); 

         
            if (e <= 1n || e >= phi_n || gcd(e, phi_n) !== 1n) {
                document.getElementById('resultadoRSA').textContent = `Erro: 'e' (${e}) deve ser coprimo de phi(n) (${phi_n}) e menor que ele. Tente outro 'e'.`;
                document.getElementById('rsaPublicKey').textContent = "...";
                document.getElementById('rsaPrivateKey').textContent = "...";
                return;
            }

  
            const d = modInverse(e, phi_n);

            if (d === null) {
                document.getElementById('resultadoRSA').textContent = "Erro: Não foi possível calcular o inverso modular 'd'. 'e' e 'phi(n)' não são coprimos.";
                return;
            }

    
            document.getElementById('rsaPublicKey').textContent = `n=${n}, e=${e}`;
            document.getElementById('rsaPrivateKey').textContent = `n=${n}, d=${d}`;

  
            if (message >= n) {
                document.getElementById('resultadoRSA').textContent = `Erro: A mensagem (${message}) deve ser menor que n (${n}).`;
                return;
            }

       
            let resultado;
            if (mode === 'codificar') {
             
                resultado = modPow(message, e, n);
                document.getElementById('resultadoRSA').textContent = `Texto Cifrado (C): ${resultado}`;
            } else {
               
                resultado = modPow(message, d, n);
                document.getElementById('resultadoRSA').textContent = `Texto Decifrado (M): ${resultado}`;
            }

        } catch (error) {
            console.error("Erro no RSA:", error);
            document.getElementById('resultadoRSA').textContent = "Ocorreu um erro. Verifique os valores de entrada (p, q devem ser primos) e o console.";
        }
    });
}