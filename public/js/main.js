function formatCPF(cpf) {
    return cpf.replace(/\D/g, '')
             .replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        e.target.value = formatCPF(value);
    }
});

document.getElementById('citizenForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    
    try {
        const response = await fetch('/api/citizens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, cpf })
        });

        const data = await response.json();
        
        const messageDiv = document.getElementById('message');
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Cidadão cadastrado com sucesso!';
            document.getElementById('citizenForm').reset();
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.error || 'Erro ao cadastrar cidadão';
        }
        messageDiv.style.display = 'block';
    } catch (error) {
        console.error('Erro:', error);
    }
});

async function searchCitizen() {
    const searchType = document.getElementById('searchType').value;
    const query = document.getElementById('searchQuery').value;
    
    try {
        const response = await fetch(`/api/citizens?${searchType}=${query}`);
        const data = await response.json();
        
        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.innerHTML = '';

        if (!data || data.error || (Array.isArray(data) && data.length === 0)) {
            resultsDiv.innerHTML = `
                <div class="message-box error">
                    <p>Não foi possível encontrar nenhuma pessoa com ${searchType === 'cpf' ? 'o CPF' : 'o nome'}: <strong>${query}</strong></p>
                    <p>Por favor, verifique os dados e tente novamente.</p>
                </div>
            `;
            return;
        }

        const citizens = Array.isArray(data) ? data : [data];

        citizens.forEach(citizen => {
            const citizenCard = document.createElement('div');
            citizenCard.className = 'citizen-card';
            citizenCard.innerHTML = `
                <p><strong>Nome:</strong> ${citizen.name}</p>
                <p><strong>CPF:</strong> ${formatCPF(citizen.cpf)}</p>
            `;
            resultsDiv.appendChild(citizenCard);
        });
    } catch (error) {
        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.innerHTML = `
            <div class="message-box error">
                <p>Ocorreu um erro ao realizar a consulta.</p>
                <p>Por favor, tente novamente mais tarde.</p>
            </div>
        `;
        console.error('Erro:', error);
    }
}