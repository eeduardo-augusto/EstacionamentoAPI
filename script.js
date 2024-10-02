function openTab(evt, tabName) {
    const tabcontents = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }

    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.tablink').click();
});

// Reserva de Vaga
document.getElementById('reservaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const placa = document.getElementById('placaReserva').value.toUpperCase();
    const numeroApartamento = document.getElementById('numeroApartamentoReserva').value;
    const blocoApartamento = document.getElementById('blocoApartamentoReserva').value.toUpperCase();
    const numeroVaga = parseInt(document.getElementById('numeroVagaReserva').value);

    if (!placa.match(/^[A-Z]{3}\d{4}$/)) {
        alert('Deve estar no formato "ABC1234".');
        return;
    }

    if (isNaN(numeroVaga) || numeroVaga <= 0) {
        alert('Número da vaga inválido!');
        return;
    }

    const reserva = {
        placa,
        numeroApartamento,
        blocoApartamento,
        numeroVaga
    };

    // Enviando a reserva para a API externa usando fetch
    fetch('https://crudcrud.com/api/98e868d0ae4c416791b86dc5a3e515cf/reservas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reserva)
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Erro ao salvar a reserva na API.');
        }
        return response.json();
    }).then((data) => {
        alert('Vaga reservada com sucesso!');
        document.getElementById('reservaForm').reset();
    }).catch((error) => {
        alert('Erro ao salvar reserva: ' + error.message);
    });
});

// Cadastro de Veículos
document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const placa = document.getElementById('placaCadastro').value.toUpperCase();
    const nomeProprietario = document.getElementById('nomeProprietario').value;
    const modeloVeiculo = document.getElementById('modeloVeiculo').value;
    const corVeiculo = document.getElementById('corVeiculo').value;

    if (!placa.match(/^[A-Z]{3}\d{4}$/)) {
        alert('Deve estar no formato "ABC1234".');
        return;
    }

    const veiculo = {
        placa,
        nomeProprietario,
        modeloVeiculo,
        corVeiculo
    };

    // Enviando os dados do veículo para a API externa usando fetch
    fetch('https://crudcrud.com/api/98e868d0ae4c416791b86dc5a3e515cf/veiculos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(veiculo)
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Erro ao salvar o veículo na API.');
        }
        return response.json();
    }).then((data) => {
        alert('Veículo cadastrado com sucesso!');
        document.getElementById('cadastroForm').reset();
    }).catch((error) => {
        alert('Erro ao salvar veículo: ' + error.message);
    });
});

// Consulta de Vagas usando API
document.getElementById('mostrarTodas').addEventListener('click', function () {
    fetch('https://crudcrud.com/api/98e868d0ae4c416791b86dc5a3e515cf/reservas', {
        method: 'GET'
    })
        .then((response) => response.json())
        .then((reservas) => {
            const tabela = document.getElementById('tabelaVagas').getElementsByTagName('tbody')[0];
            tabela.innerHTML = ''; // Limpa a tabela antes de inserir os novos dados
            reservas.forEach((reserva) => {
                const linha = tabela.insertRow();

                const cellVaga = linha.insertCell(0);
                cellVaga.textContent = reserva.numeroVaga;

                const cellPlaca = linha.insertCell(1);
                cellPlaca.textContent = reserva.placa;

                const cellApartamento = linha.insertCell(2);
                cellApartamento.textContent = reserva.numeroApartamento;

                const cellBloco = linha.insertCell(3);
                cellBloco.textContent = reserva.blocoApartamento;

                const cellAcoes = linha.insertCell(4);
                const btnRemove = document.createElement('button');
                btnRemove.textContent = 'Remover';
                btnRemove.addEventListener('click', function () {
                    const aptUser = prompt('Digite o número do seu apartamento:');
                    const blocoUser = prompt('Digite o bloco do seu apartamento:').toUpperCase();
                    if (aptUser === reserva.numeroApartamento && blocoUser === reserva.blocoApartamento) {
                        const confirmRemove = confirm(`Tem certeza que deseja remover a reserva da vaga ${reserva.numeroVaga}?`);
                        if (confirmRemove) {
                            // Remover a reserva da API
                            fetch(`https://crudcrud.com/api/98e868d0ae4c416791b86dc5a3e515cf/reservas/${reserva._id}`, {
                                method: 'DELETE'
                            })
                                .then(() => {
                                    alert('Reserva removida com sucesso!');
                                    exibirVagas(false);
                                })
                                .catch((error) => {
                                    alert('Erro ao remover reserva: ' + error.message);
                                });
                        }
                    } else {
                        alert('Autorização inválida. Você não pode remover esta reserva.');
                    }
                });

                cellAcoes.appendChild(btnRemove);
            });
        })
        .catch((error) => {
            alert('Erro ao buscar vagas: ' + error.message);
        });
});

// Função para obter todas as vagas
function obterTodasVagas() {
    const maxVagas = 100;
    const vagas = [];
    for (let i = 1; i <= maxVagas; i++) {
        vagas.push(i);
    }
    return vagas;
}
