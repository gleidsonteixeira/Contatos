
let listaParaBusca = [];

function listar(){
    fetch("https://63388a25383946bc7fe9a891.mockapi.io/contatos")
    .then(res => res.json())
    .then(res => {
        popular(res);
    });
} listar();

function popular(res){
    let lista = ( res || []);
    if(lista.length > 0){
        contatos.innerHTML = '';
        lista
        .sort((a, b) => {
            let nomeA = a.nome.toLowerCase(),
                nomeB = b.nome.toLowerCase();
            if (nomeA < nomeB) {
                return -1;
            }
            if (nomeB > nomeA) {
                return 1;
            }
            return 0;
        })
        .forEach(element => {
            listaParaBusca = lista;
            contatos.innerHTML += 
            `
            <li class="list-group-item" id="li${element.id}">
                <div class="contato">
                    <div class="contato-nome">
                        <div class="contato-nome-zero">
                            <span>${element.nome[0].toUpperCase()}</span>
                        </div>
                        <h6 class="ms-2">
                            <span class="text-truncate" style="max-width: 150px;">${element.nome}</span>
                            ${element.telefone}
                        </h6>
                    </div>
                    <div class="btn-group" role="group" aria-label="Ações">
                        <button onclick="listarUm(${element.id})" type="button" class="btn btn-outline-primary" data-bs-toggle="offcanvas" data-bs-target="#editarCanvas" aria-controls="editarCanvas"><i class="bi bi-pencil"></i></button>
                        <button onclick="deletar(${element.id})" type="button" class="btn btn-outline-primary"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </li>
            `; 
        });
        contatos.style.display = "block";
        loading.style.display = "none";
    }else{
        contatos.innerHTML = 
        `
        <li class="list-group-item">
            <div class="contato">
                <div class="alert alert-secondary w-100 mb-0 text-center" role="alert">
                    Nenhum contato encontrado
                </div>
            </div>
        </li>
        `;
        contatos.style.display = "block";
        loading.style.display = "none";
    }
}

function listarUm(id){
    fetch("https://63388a25383946bc7fe9a891.mockapi.io/contatos/" + id)
    .then(res => res.json())
    .then(res => {
        idEditar.value = res.id;
        nomeEditar.value = res.nome;
        telefoneEditar.value = res.telefone;
    });
}

function criar(){
    event.preventDefault();

    criarBtn.setAttribute("disabled", true);
    criarBtn.innerHTML = "Aguarde...";

    let contato = {
        nome: nome.value.toLowerCase(),
        telefone: telefone.value.toLowerCase()
    }

    fetch("https://63388a25383946bc7fe9a891.mockapi.io/contatos", {
        method: "POST",
        headers: {
            "Content-type": "application/json" 
        },
        body: JSON.stringify(contato)
    })
    .then(res => res.json())
    .then(res => {
        formCriar.reset();
        criarBtn.innerHTML = "Adicionar";
        criarBtn.removeAttribute("disabled");
        listar()
    });
}

function editar(){
    event.preventDefault();

    editarBtn.setAttribute("disabled", true);
    editarBtn.innerHTML = "Aguarde...";

    let id = idEditar.value;
    let contato = {
        nome: nomeEditar.value.toLowerCase(),
        telefone: telefoneEditar.value.toLowerCase()
    }

    fetch("https://63388a25383946bc7fe9a891.mockapi.io/contatos/" + id, {
        method: "PUT",
        headers: {
            "Content-type": "application/json" 
        },
        body: JSON.stringify(contato)
    })
    .then(res => res.json())
    .then(res => {
        editarBtn.innerHTML = "Atualizar";
        editarBtn.removeAttribute("disabled");
        bsOffcanvas.hide();
        listar();
    });
}

function pesquisar(){
    let palavra = pesquisa.value.toLowerCase();
    if(palavra.length > 2){
        let nomes = listaParaBusca.filter((contato) =>{
            return contato.nome.toLowerCase().indexOf(palavra) >= 0;
        });
        let telefones = listaParaBusca.filter((contato) =>{
            return contato.telefone.toLowerCase().indexOf(palavra) >= 0;
        });
        let contatos = [...nomes, ...telefones]
        popular(contatos);
    }else if(palavra.length == 0){
        listar();
    }else{
        return;
    }
}

async function deletar(id){
    contatos.style.display = "none";
    loading.style.display = "block";
    await fetch("https://63388a25383946bc7fe9a891.mockapi.io/contatos/" + id, {
        method: "DELETE"
    });
    listar();
}