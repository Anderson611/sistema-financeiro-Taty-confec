/* =========================================================
   IMAGENS DO PAINEL
========================================================= */

const imagensPadraoPainel = {
    1: "casa.png",
    2: "compra.png",
    3: "boleto.png",
    4: "credito.png",
    5: "dados.png",
    6: "divida.png"
};

function getSavedImage(slot) {
    try {
        return localStorage.getItem(`tatyImagemPainel${slot}`)
            || imagensPadraoPainel[slot]
            || "";
    } catch (error) {
        return imagensPadraoPainel[slot] || "";
    }
}

function removerImagemPainel(slot) {
    localStorage.removeItem(`tatyImagemPainel${slot}`);

    if (typeof sessao !== "undefined" && sessao?.tipo === "admin") {
        paginaDashboard();
    }
}

document.addEventListener("change", function(event) {
    const input = event.target.closest("[data-upload-slot]");

    if (!input || !input.files || !input.files[0]) return;

    const file = input.files[0];
    const slot = input.dataset.uploadSlot;

    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) {
        alert("Selecione uma imagem JPG, PNG, WebP ou GIF.");
        input.value = "";
        return;
    }

    if (file.size > 1024 * 1024) {
        alert("A imagem deve ter no máximo 1 MB.");
        input.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function() {
        try {
            localStorage.setItem(`tatyImagemPainel${slot}`, reader.result);
            paginaDashboard();
        } catch (error) {
            alert("Não foi possível salvar a imagem. O armazenamento do navegador pode estar cheio.");
        }
    };

    reader.readAsDataURL(file);
});


/* =========================================================
   BANCO LOCAL DE DEMONSTRAÇÃO
========================================================= */

const bancoInicial = {
    clientes: [
        {
            id: 1,
            nome: "Maria da Silva",
            cpf: "11111111111",
            telefone: "88999999999",
            email: "maria@email.com",
            cidade: "Meruoca",
            limite: 1500,
            creditoUsado: 650,
            senha: "1234",
            status: "Ativo"
        },
        {
            id: 2,
            nome: "João Oliveira",
            cpf: "22222222222",
            telefone: "88988888888",
            email: "joao@email.com",
            cidade: "Sobral",
            limite: 1000,
            creditoUsado: 900,
            senha: "1234",
            status: "Ativo"
        }
    ],

    compras: [
        {
            id: 1,
            clienteId: 1,
            descricao: "Compra de roupas",
            data: "2026-09-05",
            valor: 600,
            parcelas: 3
        },
        {
            id: 2,
            clienteId: 1,
            descricao: "Compra de vestidos",
            data: "2026-09-20",
            valor: 300,
            parcelas: 2
        },
        {
            id: 3,
            clienteId: 2,
            descricao: "Compra de roupas",
            data: "2026-08-20",
            valor: 900,
            parcelas: 3
        }
    ],

    parcelas: [
        {
            id: 1,
            compraId: 1,
            clienteId: 1,
            numero: 1,
            valor: 200,
            vencimento: "2026-10-10",
            status: "Pendente"
        },
        {
            id: 2,
            compraId: 1,
            clienteId: 1,
            numero: 2,
            valor: 200,
            vencimento: "2026-11-10",
            status: "Pendente"
        },
        {
            id: 3,
            compraId: 1,
            clienteId: 1,
            numero: 3,
            valor: 200,
            vencimento: "2026-12-10",
            status: "Pendente"
        },
        {
            id: 4,
            compraId: 2,
            clienteId: 1,
            numero: 1,
            valor: 150,
            vencimento: "2026-10-20",
            status: "Pago"
        },
        {
            id: 5,
            compraId: 2,
            clienteId: 1,
            numero: 2,
            valor: 150,
            vencimento: "2026-11-20",
            status: "Pendente"
        },
        {
            id: 6,
            compraId: 3,
            clienteId: 2,
            numero: 1,
            valor: 300,
            vencimento: "2026-09-20",
            status: "Atrasada"
        },
        {
            id: 7,
            compraId: 3,
            clienteId: 2,
            numero: 2,
            valor: 300,
            vencimento: "2026-10-20",
            status: "Pendente"
        },
        {
            id: 8,
            compraId: 3,
            clienteId: 2,
            numero: 3,
            valor: 300,
            vencimento: "2026-11-20",
            status: "Pendente"
        }
    ],

    negociacoes: []
};


/* =========================================================
   LOCAL STORAGE
========================================================= */

let db = JSON.parse(localStorage.getItem("tatyDb")) || bancoInicial;

function salvarBanco() {
    localStorage.setItem("tatyDb", JSON.stringify(db));
}


/* =========================================================
   SESSÃO
========================================================= */

let sessao = null;

function iniciarSistema(tipo, usuario) {
    sessao = { tipo, usuario };

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    montarMenu();

    if (tipo === "admin") {
        document.getElementById("topUserName").textContent = "Administrador";
        document.getElementById("avatar").textContent = "AD";
        abrirPagina("dashboard");
    } else {
        document.getElementById("topUserName").textContent = usuario.nome;
        document.getElementById("avatar").textContent =
            usuario.nome.substring(0, 2).toUpperCase();

        abrirPagina("clienteInicio");
    }
}


/* =========================================================
   LOGIN E CADASTRO
========================================================= */

function alterarLogin(tipo) {
    const cliente = document.getElementById("loginClienteForm");
    const cadastro = document.getElementById("cadastroClienteForm");
    const admin = document.getElementById("loginAdminForm");

    const tabCliente = document.getElementById("tabCliente");
    const tabAdmin = document.getElementById("tabAdmin");
    const tabEntrar = document.getElementById("tabEntrarCliente");
    const tabCadastrar = document.getElementById("tabCadastrarCliente");

    if (tipo === "cliente") {
        cliente.classList.remove("hidden");
        cadastro.classList.add("hidden");
        admin.classList.add("hidden");

        tabCliente.classList.add("active");
        tabAdmin.classList.remove("active");
        tabEntrar.classList.add("active");
        tabCadastrar.classList.remove("active");
    } else {
        cliente.classList.add("hidden");
        cadastro.classList.add("hidden");
        admin.classList.remove("hidden");

        tabCliente.classList.remove("active");
        tabAdmin.classList.add("active");
        tabEntrar.classList.remove("active");
        tabCadastrar.classList.remove("active");
    }
}

function alternarClienteAcesso(tipo) {
    const login = document.getElementById("loginClienteForm");
    const cadastro = document.getElementById("cadastroClienteForm");
    const entrar = document.getElementById("tabEntrarCliente");
    const cadastrar = document.getElementById("tabCadastrarCliente");

    if (tipo === "cadastrar") {
        login.classList.add("hidden");
        cadastro.classList.remove("hidden");
        entrar.classList.remove("active");
        cadastrar.classList.add("active");
    } else {
        login.classList.remove("hidden");
        cadastro.classList.add("hidden");
        entrar.classList.add("active");
        cadastrar.classList.remove("active");
    }
}

function cadastrarClienteInicial(event) {
    event.preventDefault();

    const nome = document.getElementById("cadNome").value.trim();
    const cpf = document.getElementById("cadCpf").value.replace(/\D/g, "");
    const telefone = document.getElementById("cadTelefone").value.replace(/\D/g, "");
    const email = document.getElementById("cadEmail").value.trim();
    const cidade = document.getElementById("cadCidade").value.trim();
    const senha = document.getElementById("cadSenha").value;
    const confirmacao = document.getElementById("cadSenhaConfirmacao").value;

    if (cpf.length !== 11) {
        alert("Digite um CPF válido com 11 números.");
        return;
    }

    if (telefone.length < 10) {
        alert("Digite um WhatsApp válido.");
        return;
    }

    if (senha !== confirmacao) {
        alert("As senhas não conferem.");
        return;
    }

    if (db.clientes.some(c => c.cpf === cpf)) {
        alert("Este CPF já possui cadastro. Use a opção Entrar.");
        return;
    }

    const cliente = {
        id: Date.now(),
        nome,
        cpf,
        telefone,
        email,
        cidade,
        limite: 0,
        creditoUsado: 0,
        senha,
        status: "Ativo"
    };

    db.clientes.push(cliente);
    salvarBanco();

    event.target.reset();

    document.getElementById("loginCpf").value = cpf;
    document.getElementById("loginSenhaCliente").value = senha;

    alternarClienteAcesso("entrar");

    alert("Cadastro realizado com sucesso! Agora você já pode entrar no sistema.");
}

document.getElementById("loginClienteForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const cpf = document.getElementById("loginCpf").value.replace(/\D/g, "");
    const senha = document.getElementById("loginSenhaCliente").value;

    const cliente = db.clientes.find(c => c.cpf === cpf && c.senha === senha);

    if (!cliente) {
        alert("CPF ou senha incorretos.");
        return;
    }

    iniciarSistema("cliente", cliente);
});

document.getElementById("loginAdminForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const usuario = document.getElementById("loginAdmin").value;
    const senha = document.getElementById("loginSenhaAdmin").value;

    if (usuario === "admin" && senha === "1234") {
        iniciarSistema("admin", { nome: "Administrador" });
    } else {
        alert("Usuário ou senha incorretos.");
    }
});

function logout() {
    sessao = null;

    document.getElementById("app").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("loginClienteForm").reset();
    document.getElementById("loginAdminForm").reset();
}


/* =========================================================
   MENU
========================================================= */

function montarMenu() {
    const menu = document.getElementById("menu");

    if (sessao.tipo === "admin") {
        menu.innerHTML = `
            <button onclick="abrirPagina('dashboard')">📊 Dashboard</button>
            <button onclick="abrirPagina('clientes')">👥 Clientes</button>
            <button onclick="abrirPagina('compras')">🛍️ Compras</button>
            <button onclick="abrirPagina('parcelas')">🧾 Boletos e Parcelas</button>
            <button onclick="abrirPagina('creditos')">💳 Créditos</button>
            <button onclick="abrirPagina('dividas')">⚠️ Dívidas</button>
            <button onclick="abrirPagina('negociacoes')">🤝 Negociações</button>
            <button onclick="abrirPagina('alertas')">📱 WhatsApp / Alertas</button>
        `;

        document.getElementById("sidebarSubtitle").textContent =
            "Painel administrativo";
    } else {
        menu.innerHTML = `
            <button onclick="abrirPagina('clienteInicio')">🏠 Início</button>
            <button onclick="abrirPagina('clienteCompras')">🛍️ Minhas compras</button>
            <button onclick="abrirPagina('clienteBoletos')">🧾 Meus boletos</button>
            <button onclick="abrirPagina('clienteCredito')">💳 Meus créditos</button>
            <button onclick="abrirPagina('clienteDividas')">⚠️ Minhas dívidas</button>
            <button onclick="abrirPagina('clienteDados')">👤 Meus dados</button>
        `;

        document.getElementById("sidebarSubtitle").textContent =
            "Área do cliente";
    }
}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function abrirPagina(pagina) {
    const content = document.getElementById("content");

    const titulos = {
        dashboard: "Dashboard",
        clientes: "Clientes",
        compras: "Compras",
        parcelas: "Boletos e Parcelas",
        creditos: "Controle de Créditos",
        dividas: "Controle de Dívidas",
        negociacoes: "Negociações",
        alertas: "Alertas WhatsApp",
        clienteInicio: "Minha conta",
        clienteCompras: "Minhas compras",
        clienteBoletos: "Meus boletos",
        clienteCredito: "Meu crédito",
        clienteDividas: "Minhas dívidas",
        clienteDados: "Meus dados"
    };

    document.getElementById("topTitle").textContent =
        titulos[pagina] || "Taty Confecções";

    if (pagina === "dashboard") paginaDashboard();
    else if (pagina === "clientes") paginaClientes();
    else if (pagina === "compras") paginaCompras();
    else if (pagina === "parcelas") paginaParcelas();
    else if (pagina === "creditos") paginaCreditos();
    else if (pagina === "dividas") paginaDividas();
    else if (pagina === "negociacoes") paginaNegociacoes();
    else if (pagina === "alertas") paginaAlertas();
    else if (pagina === "clienteInicio") paginaClienteInicio();
    else if (pagina === "clienteCompras") paginaClienteCompras();
    else if (pagina === "clienteBoletos") paginaClienteBoletos();
    else if (pagina === "clienteCredito") paginaClienteCredito();
    else if (pagina === "clienteDividas") paginaClienteDividas();
    else if (pagina === "clienteDados") paginaClienteDados();

    document.querySelectorAll(".menu button").forEach(button => {
        button.classList.toggle(
            "active",
            button.getAttribute("onclick")?.includes(`'${pagina}'`)
        );
    });

    fecharSidebarMobile();
}


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function dataBR(data) {
    if (!data) return "-";

    const partes = String(data).split("-");
    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function hojeISO() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function obterCliente(id) {
    return db.clientes.find(cliente => Number(cliente.id) === Number(id));
}

function obterCompra(id) {
    return db.compras.find(compra => Number(compra.id) === Number(id));
}

function nomeCliente(id) {
    return obterCliente(id)?.nome || "Cliente não encontrado";
}

function statusParcela(parcela) {
    if (parcela.status === "Pago") return "Pago";

    if (parcela.vencimento < hojeISO()) return "Atrasada";

    return parcela.status || "Pendente";
}

function classeStatus(status) {
    if (status === "Pago" || status === "Ativo") return "badge badge-success";
    if (status === "Atrasada" || status === "Inativo") return "badge badge-danger";
    if (status === "Pendente") return "badge badge-warning";

    return "badge badge-info";
}

function proximoId(lista) {
    return lista.length
        ? Math.max(...lista.map(item => Number(item.id) || 0)) + 1
        : 1;
}

function escapeHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function parcelasCliente(clienteId) {
    return db.parcelas.filter(p => Number(p.clienteId) === Number(clienteId));
}

function comprasCliente(clienteId) {
    return db.compras.filter(c => Number(c.clienteId) === Number(clienteId));
}

function saldoCliente(clienteId) {
    return parcelasCliente(clienteId)
        .filter(p => statusParcela(p) !== "Pago")
        .reduce((total, p) => total + Number(p.valor || 0), 0);
}

function parcelasAtrasadas(clienteId) {
    return parcelasCliente(clienteId).filter(p => statusParcela(p) === "Atrasada");
}

function atualizarBanco() {
    salvarBanco();

    if (sessao?.tipo === "admin") {
        paginaDashboard();
    }
}


/* =========================================================
   DASHBOARD ADMINISTRATIVO
========================================================= */

function paginaDashboard() {
    const content = document.getElementById("content");

    const totalClientes = db.clientes.length;

    const totalCompras = db.compras.reduce(
        (soma, compra) => soma + Number(compra.valor || 0), 0
    );

    const totalReceber = db.parcelas
        .filter(p => statusParcela(p) !== "Pago")
        .reduce((soma, p) => soma + Number(p.valor || 0), 0);

    const totalAtrasado = db.parcelas
        .filter(p => statusParcela(p) === "Atrasada")
        .reduce((soma, p) => soma + Number(p.valor || 0), 0);

    const atalhos = [
        {
            titulo: "Clientes",
            descricao: "Gerencie os clientes cadastrados",
            imagem: 1,
            pagina: "clientes"
        },
        {
            titulo: "Compras",
            descricao: "Consulte e registre compras",
            imagem: 2,
            pagina: "compras"
        },
        {
            titulo: "Boletos e parcelas",
            descricao: "Acompanhe vencimentos e pagamentos",
            imagem: 3,
            pagina: "parcelas"
        },
        {
            titulo: "Crédito",
            descricao: "Controle limites e saldos",
            imagem: 4,
            pagina: "creditos"
        },
        {
            titulo: "Relatórios",
            descricao: "Consulte os dados do sistema",
            imagem: 5,
            pagina: "dividas"
        },
        {
            titulo: "Dívidas",
            descricao: "Acompanhe débitos em aberto",
            imagem: 6,
            pagina: "dividas"
        }
    ];

    content.innerHTML = `
        <div class="page-title">
            <h1>Dashboard administrativo</h1>
            <p>Resumo financeiro e acesso rápido às funcionalidades da Taty Confecções.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-label">Clientes cadastrados</div>
                <div class="stat-value">${totalClientes}</div>
                <div class="stat-description">Total de clientes registrados</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🛍️</div>
                <div class="stat-label">Compras registradas</div>
                <div class="stat-value">${moeda(totalCompras)}</div>
                <div class="stat-description">Valor acumulado das compras</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🧾</div>
                <div class="stat-label">Total a receber</div>
                <div class="stat-value">${moeda(totalReceber)}</div>
                <div class="stat-description">Parcelas ainda não pagas</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">⚠️</div>
                <div class="stat-label">Valor em atraso</div>
                <div class="stat-value">${moeda(totalAtrasado)}</div>
                <div class="stat-description">Parcelas vencidas e não pagas</div>
            </div>
        </div>

        <div class="card">
            <h2>Acesso rápido</h2>
            <p>Selecione uma área para continuar.</p>

            <div class="image-grid">
                ${atalhos.map(item => `
                    <div class="image-card">
                        <img src="${getSavedImage(item.imagem)}"
                             alt="${escapeHTML(item.titulo)}"
                             onerror="this.onerror=null;this.src='${imagensPadraoPainel[item.imagem]}'">

                        <div class="image-card-body">
                            <h3>${escapeHTML(item.titulo)}</h3>
                            <p>${escapeHTML(item.descricao)}</p>

                            <button class="btn btn-primary"
                                    onclick="abrirPagina('${item.pagina}')">
                                Acessar
                            </button>

                            <div style="margin-top:12px;">
                                <label class="btn btn-light">
                                    Trocar imagem
                                    <input type="file"
                                           accept="image/png,image/jpeg,image/webp,image/gif"
                                           data-upload-slot="${item.imagem}"
                                           hidden>
                                </label>

                                <button class="btn btn-light"
                                        onclick="removerImagemPainel(${item.imagem})">
                                    Restaurar
                                </button>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>

        <div class="card">
            <h2>Parcelas próximas do vencimento</h2>
            ${renderTabelaParcelas(
                db.parcelas
                    .filter(p => statusParcela(p) !== "Pago")
                    .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
                    .slice(0, 8),
                true
            )}
        </div>
    `;
}

function renderTabelaParcelas(parcelas, mostrarCliente = false) {
    if (!parcelas.length) {
        return `<div class="empty">Nenhuma parcela encontrada.</div>`;
    }

    return `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        ${mostrarCliente ? "<th>Cliente</th>" : ""}
                        <th>Compra</th>
                        <th>Parcela</th>
                        <th>Vencimento</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${parcelas.map(p => {
                        const compra = obterCompra(p.compraId);
                        const status = statusParcela(p);

                        return `
                            <tr>
                                ${mostrarCliente
                                    ? `<td>${escapeHTML(nomeCliente(p.clienteId))}</td>`
                                    : ""}
                                <td>${escapeHTML(compra?.descricao || "Compra")}</td>
                                <td>${p.numero || "-"}</td>
                                <td>${dataBR(p.vencimento)}</td>
                                <td>${moeda(p.valor)}</td>
                                <td><span class="${classeStatus(status)}">${escapeHTML(status)}</span></td>
                                <td>
                                    ${status !== "Pago"
                                        ? `<button class="btn btn-success" onclick="marcarParcelaPaga(${p.id})">Marcar paga</button>`
                                        : ""}
                                    <button class="btn btn-light" onclick="gerarBoleto(${p.id})">Boleto</button>
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}


/* =========================================================
   CLIENTES
========================================================= */

function paginaClientes() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="page-title">
            <h1>Clientes</h1>
            <p>Cadastre, consulte e atualize os dados dos clientes.</p>
        </div>

        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                <h2>Lista de clientes</h2>
                <button class="btn btn-primary" onclick="modalNovoCliente()">+ Novo cliente</button>
            </div>

            <div class="filters">
                <input id="filtroCliente" class="form-control"
                       placeholder="Buscar por nome, CPF ou telefone"
                       oninput="filtrarTabelaClientes()">
            </div>

            <div id="tabelaClientes"></div>
        </div>
    `;

    renderClientesTabela(db.clientes);
}

function renderClientesTabela(clientes) {
    const destino = document.getElementById("tabelaClientes");
    if (!destino) return;

    if (!clientes.length) {
        destino.innerHTML = `<div class="empty">Nenhum cliente encontrado.</div>`;
        return;
    }

    destino.innerHTML = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Limite</th>
                        <th>Crédito usado</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientes.map(c => `
                        <tr>
                            <td>${escapeHTML(c.nome)}</td>
                            <td>${escapeHTML(c.cpf)}</td>
                            <td>${escapeHTML(c.telefone || "-")}</td>
                            <td>${moeda(c.limite)}</td>
                            <td>${moeda(c.creditoUsado)}</td>
                            <td><span class="${classeStatus(c.status)}">${escapeHTML(c.status)}</span></td>
                            <td>
                                <button class="btn btn-primary" onclick="editarCliente(${c.id})">Editar</button>
                                <button class="btn btn-light" onclick="verCliente(${c.id})">Ver</button>
                                <button class="btn btn-danger" onclick="excluirCliente(${c.id})">Excluir</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function filtrarTabelaClientes() {
    const termo = document.getElementById("filtroCliente").value.toLowerCase();

    const filtrados = db.clientes.filter(c =>
        c.nome.toLowerCase().includes(termo) ||
        c.cpf.includes(termo.replace(/\D/g, "")) ||
        String(c.telefone || "").includes(termo.replace(/\D/g, ""))
    );

    renderClientesTabela(filtrados);
}

function modalNovoCliente() {
    abrirModal("Cadastrar cliente", `
        <form onsubmit="salvarNovoCliente(event)">
            <div class="grid-2">
                <div class="form-group">
                    <label>Nome completo</label>
                    <input class="form-control" name="nome" required>
                </div>

                <div class="form-group">
                    <label>CPF</label>
                    <input class="form-control" name="cpf" maxlength="14" required>
                </div>

                <div class="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input class="form-control" name="telefone" required>
                </div>

                <div class="form-group">
                    <label>E-mail</label>
                    <input class="form-control" name="email" type="email">
                </div>

                <div class="form-group">
                    <label>Cidade</label>
                    <input class="form-control" name="cidade">
                </div>

                <div class="form-group">
                    <label>Limite de crédito</label>
                    <input class="form-control" name="limite" type="number" min="0" step="0.01" value="0">
                </div>

                <div class="form-group">
                    <label>Senha inicial</label>
                    <input class="form-control" name="senha" value="1234" required>
                </div>

                <div class="form-group">
                    <label>Status</label>
                    <select class="form-control" name="status">
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                </div>
            </div>

            <button class="btn btn-primary" type="submit">Salvar cliente</button>
        </form>
    `);
}

function salvarNovoCliente(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const cpf = String(form.get("cpf")).replace(/\D/g, "");

    if (cpf.length !== 11) {
        alert("O CPF deve conter 11 números.");
        return;
    }

    if (db.clientes.some(c => c.cpf === cpf)) {
        alert("Já existe um cliente com este CPF.");
        return;
    }

    db.clientes.push({
        id: proximoId(db.clientes),
        nome: String(form.get("nome")).trim(),
        cpf,
        telefone: String(form.get("telefone") || "").replace(/\D/g, ""),
        email: String(form.get("email") || "").trim(),
        cidade: String(form.get("cidade") || "").trim(),
        limite: Number(form.get("limite") || 0),
        creditoUsado: 0,
        senha: String(form.get("senha")),
        status: String(form.get("status") || "Ativo")
    });

    salvarBanco();
    fecharModal();
    paginaClientes();
}

function editarCliente(id) {
    const cliente = obterCliente(id);
    if (!cliente) return;

    abrirModal("Editar cliente", `
        <form onsubmit="atualizarCliente(event, ${cliente.id})">
            <div class="grid-2">
                <div class="form-group">
                    <label>Nome completo</label>
                    <input class="form-control" name="nome" value="${escapeHTML(cliente.nome)}" required>
                </div>

                <div class="form-group">
                    <label>CPF</label>
                    <input class="form-control" value="${escapeHTML(cliente.cpf)}" disabled>
                </div>

                <div class="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input class="form-control" name="telefone" value="${escapeHTML(cliente.telefone || "")}">
                </div>

                <div class="form-group">
                    <label>E-mail</label>
                    <input class="form-control" name="email" type="email" value="${escapeHTML(cliente.email || "")}">
                </div>

                <div class="form-group">
                    <label>Cidade</label>
                    <input class="form-control" name="cidade" value="${escapeHTML(cliente.cidade || "")}">
                </div>

                <div class="form-group">
                    <label>Limite de crédito</label>
                    <input class="form-control" name="limite" type="number" min="0" step="0.01" value="${Number(cliente.limite || 0)}">
                </div>

                <div class="form-group">
                    <label>Crédito utilizado</label>
                    <input class="form-control" name="creditoUsado" type="number" min="0" step="0.01" value="${Number(cliente.creditoUsado || 0)}">
                </div>

                <div class="form-group">
                    <label>Status</label>
                    <select class="form-control" name="status">
                        <option ${cliente.status === "Ativo" ? "selected" : ""}>Ativo</option>
                        <option ${cliente.status === "Inativo" ? "selected" : ""}>Inativo</option>
                    </select>
                </div>
            </div>

            <button class="btn btn-primary" type="submit">Salvar alterações</button>
        </form>
    `);
}

function atualizarCliente(event, id) {
    event.preventDefault();

    const cliente = obterCliente(id);
    if (!cliente) return;

    const form = new FormData(event.target);

    cliente.nome = String(form.get("nome")).trim();
    cliente.telefone = String(form.get("telefone") || "").replace(/\D/g, "");
    cliente.email = String(form.get("email") || "").trim();
    cliente.cidade = String(form.get("cidade") || "").trim();
    cliente.limite = Number(form.get("limite") || 0);
    cliente.creditoUsado = Number(form.get("creditoUsado") || 0);
    cliente.status = String(form.get("status"));

    salvarBanco();
    fecharModal();
    paginaClientes();
}

function verCliente(id) {
    const c = obterCliente(id);
    if (!c) return;

    abrirModal("Detalhes do cliente", `
        <div class="grid-2">
            <p><strong>Nome:</strong><br>${escapeHTML(c.nome)}</p>
            <p><strong>CPF:</strong><br>${escapeHTML(c.cpf)}</p>
            <p><strong>Telefone:</strong><br>${escapeHTML(c.telefone || "-")}</p>
            <p><strong>E-mail:</strong><br>${escapeHTML(c.email || "-")}</p>
            <p><strong>Cidade:</strong><br>${escapeHTML(c.cidade || "-")}</p>
            <p><strong>Limite:</strong><br>${moeda(c.limite)}</p>
            <p><strong>Crédito utilizado:</strong><br>${moeda(c.creditoUsado)}</p>
            <p><strong>Saldo disponível:</strong><br>${moeda(Number(c.limite || 0) - Number(c.creditoUsado || 0))}</p>
        </div>
    `);
}

function excluirCliente(id) {
    const cliente = obterCliente(id);
    if (!cliente) return;

    if (db.compras.some(c => Number(c.clienteId) === Number(id))) {
        alert("Este cliente possui compras registradas. Não é possível excluí-lo sem preservar o histórico.");
        return;
    }

    if (!confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) return;

    db.clientes = db.clientes.filter(c => Number(c.id) !== Number(id));
    salvarBanco();
    paginaClientes();
}


/* =========================================================
   COMPRAS
========================================================= */

function paginaCompras() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="page-title">
            <h1>Compras</h1>
            <p>Registre compras, parcelas e valores dos clientes.</p>
        </div>

        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                <h2>Histórico de compras</h2>
                <button class="btn btn-primary" onclick="modalNovaCompra()">+ Registrar compra</button>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Descrição</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Parcelas</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.compras.map(c => `
                            <tr>
                                <td>${escapeHTML(nomeCliente(c.clienteId))}</td>
                                <td>${escapeHTML(c.descricao)}</td>
                                <td>${dataBR(c.data)}</td>
                                <td>${moeda(c.valor)}</td>
                                <td>${c.parcelas}</td>
                                <td>
                                    <button class="btn btn-light" onclick="verCompra(${c.id})">Detalhes</button>
                                    <button class="btn btn-danger" onclick="excluirCompra(${c.id})">Excluir</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function modalNovaCompra() {
    if (!db.clientes.length) {
        alert("Cadastre um cliente antes de registrar uma compra.");
        return;
    }

    abrirModal("Registrar compra", `
        <form onsubmit="salvarCompra(event)">
            <div class="form-group">
                <label>Cliente</label>
                <select class="form-control" name="clienteId" required>
                    ${db.clientes.map(c => `
                        <option value="${c.id}">${escapeHTML(c.nome)} — ${escapeHTML(c.cpf)}</option>
                    `).join("")}
                </select>
            </div>

            <div class="form-group">
                <label>Descrição da compra</label>
                <input class="form-control" name="descricao" placeholder="Ex.: roupas, vestidos..." required>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Data da compra</label>
                    <input class="form-control" name="data" type="date" value="${hojeISO()}" required>
                </div>

                <div class="form-group">
                    <label>Valor total (R$)</label>
                    <input class="form-control" name="valor" type="number" min="0.01" step="0.01" required>
                </div>

                <div class="form-group">
                    <label>Quantidade de parcelas</label>
                    <input class="form-control" name="parcelas" type="number" min="1" max="60" value="1" required>
                </div>

                <div class="form-group">
                    <label>Primeiro vencimento</label>
                    <input class="form-control" name="vencimento" type="date" value="${hojeISO()}" required>
                </div>
            </div>

            <div class="alert alert-info">
                O valor total será dividido igualmente entre as parcelas.
            </div>

            <button class="btn btn-primary" type="submit">Salvar compra</button>
        </form>
    `);
}

function salvarCompra(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const clienteId = Number(form.get("clienteId"));
    const cliente = obterCliente(clienteId);
    const valor = Number(form.get("valor"));
    const quantidade = Number(form.get("parcelas"));
    const data = String(form.get("data"));
    const primeiroVencimento = String(form.get("vencimento"));

    if (!cliente || valor <= 0 || quantidade < 1) {
        alert("Confira os dados da compra.");
        return;
    }

    const saldoDisponivel =
        Number(cliente.limite || 0) - Number(cliente.creditoUsado || 0);

    if (valor > saldoDisponivel) {
        const continuar = confirm(
            `A compra é de ${moeda(valor)}, mas o saldo disponível é ${moeda(saldoDisponivel)}. Deseja registrar mesmo assim?`
        );

        if (!continuar) return;
    }

    const compraId = proximoId(db.compras);

    db.compras.push({
        id: compraId,
        clienteId,
        descricao: String(form.get("descricao")).trim(),
        data,
        valor,
        parcelas: quantidade
    });

    const valorParcela = Math.round((valor / quantidade) * 100) / 100;
    let somaParcelas = 0;

    for (let i = 1; i <= quantidade; i++) {
        let valorAtual = valorParcela;

        if (i === quantidade) {
            valorAtual = Math.round((valor - somaParcelas) * 100) / 100;
        } else {
            somaParcelas += valorAtual;
        }

        const vencimento = new Date(`${primeiroVencimento}T12:00:00`);
        vencimento.setMonth(vencimento.getMonth() + i - 1);

        db.parcelas.push({
            id: proximoId(db.parcelas),
            compraId,
            clienteId,
            numero: i,
            valor: valorAtual,
            vencimento: `${vencimento.getFullYear()}-${String(vencimento.getMonth() + 1).padStart(2, "0")}-${String(vencimento.getDate()).padStart(2, "0")}`,
            status: "Pendente"
        });
    }

    cliente.creditoUsado = Number(cliente.creditoUsado || 0) + valor;

    salvarBanco();
    fecharModal();
    paginaCompras();

    alert("Compra registrada e parcelas geradas com sucesso.");
}

function verCompra(id) {
    const compra = obterCompra(id);
    if (!compra) return;

    const parcelas = db.parcelas.filter(p => Number(p.compraId) === Number(id));

    abrirModal("Detalhes da compra", `
        <p><strong>Cliente:</strong> ${escapeHTML(nomeCliente(compra.clienteId))}</p>
        <p><strong>Descrição:</strong> ${escapeHTML(compra.descricao)}</p>
        <p><strong>Data:</strong> ${dataBR(compra.data)}</p>
        <p><strong>Valor total:</strong> ${moeda(compra.valor)}</p>
        <hr>
        <h3>Parcelas</h3>
        ${renderTabelaParcelas(parcelas)}
    `);
}

function excluirCompra(id) {
    const compra = obterCompra(id);
    if (!compra) return;

    if (!confirm("Deseja excluir esta compra e as parcelas associadas?")) return;

    const parcelas = db.parcelas.filter(p => Number(p.compraId) === Number(id));

    if (parcelas.some(p => statusParcela(p) === "Pago")) {
        alert("Esta compra possui parcelas pagas. Preserve o histórico e não exclua a compra.");
        return;
    }

    const cliente = obterCliente(compra.clienteId);

    if (cliente) {
        cliente.creditoUsado = Math.max(
            0,
            Number(cliente.creditoUsado || 0) - Number(compra.valor || 0)
        );
    }

    db.parcelas = db.parcelas.filter(p => Number(p.compraId) !== Number(id));
    db.compras = db.compras.filter(c => Number(c.id) !== Number(id));

    salvarBanco();
    paginaCompras();
}


/* =========================================================
   BOLETOS E PARCELAS
========================================================= */

function paginaParcelas() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="page-title">
            <h1>Boletos e parcelas</h1>
            <p>Gerencie vencimentos, pagamentos e emissão de boletos demonstrativos.</p>
        </div>

        <div class="card">
            <div class="filters">
                <input id="filtroParcela" class="form-control"
                       placeholder="Buscar cliente ou compra"
                       oninput="filtrarParcelas()">

                <select id="filtroStatusParcela" class="form-control"
                        onchange="filtrarParcelas()">
                    <option value="">Todos os status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Atrasada">Atrasada</option>
                    <option value="Pago">Pago</option>
                </select>

                <button class="btn btn-primary" onclick="exportarParcelasCSV()">Exportar CSV</button>
            </div>

            <div id="tabelaParcelas"></div>
        </div>
    `;

    renderParcelas(db.parcelas);
}

function renderParcelas(parcelas) {
    const destino = document.getElementById("tabelaParcelas");
    if (!destino) return;

    destino.innerHTML = renderTabelaParcelas(
        parcelas.slice().sort((a, b) => a.vencimento.localeCompare(b.vencimento)),
        true
    );
}

function filtrarParcelas() {
    const termo = document.getElementById("filtroParcela").value.toLowerCase();
    const statusFiltro = document.getElementById("filtroStatusParcela").value;

    const resultado = db.parcelas.filter(p => {
        const compra = obterCompra(p.compraId);
        const status = statusParcela(p);

        const correspondeTexto =
            nomeCliente(p.clienteId).toLowerCase().includes(termo) ||
            String(compra?.descricao || "").toLowerCase().includes(termo);

        const correspondeStatus = !statusFiltro || status === statusFiltro;

        return correspondeTexto && correspondeStatus;
    });

    renderParcelas(resultado);
}

function marcarParcelaPaga(id) {
    const parcela = db.parcelas.find(p => Number(p.id) === Number(id));
    if (!parcela || statusParcela(parcela) === "Pago") return;

    if (!confirm(`Confirmar o pagamento de ${moeda(parcela.valor)}?`)) return;

    parcela.status = "Pago";
    parcela.dataPagamento = hojeISO();

    salvarBanco();

    if (sessao?.tipo === "admin") {
        paginaParcelas();
    } else {
        paginaClienteBoletos();
    }
}

function gerarBoleto(id) {
    const parcela = db.parcelas.find(p => Number(p.id) === Number(id));
    if (!parcela) return;

    const compra = obterCompra(parcela.compraId);
    const cliente = obterCliente(parcela.clienteId);

    abrirModal("Boleto demonstrativo", `
        <div id="boletoImpressao" style="border:1px solid #ccc;padding:22px;">
            <h2 style="text-align:center;">Taty Confecções</h2>
            <p style="text-align:center;">Boleto demonstrativo de cobrança</p>
            <hr>
            <p><strong>Cliente:</strong> ${escapeHTML(cliente?.nome || "")}</p>
            <p><strong>CPF:</strong> ${escapeHTML(cliente?.cpf || "")}</p>
            <p><strong>Descrição:</strong> ${escapeHTML(compra?.descricao || "Compra")}</p>
            <p><strong>Parcela:</strong> ${parcela.numero}</p>
            <p><strong>Vencimento:</strong> ${dataBR(parcela.vencimento)}</p>
            <h2>Valor: ${moeda(parcela.valor)}</h2>
            <p><strong>Status:</strong> ${escapeHTML(statusParcela(parcela))}</p>
            <p style="font-size:12px;color:#666;">
                Documento demonstrativo. Não representa boleto bancário registrado.
            </p>
        </div>

        <button class="btn btn-primary" onclick="imprimirBoleto()">Imprimir / Salvar PDF</button>
    `);
}

function imprimirBoleto() {
    const conteudo = document.getElementById("boletoImpressao");
    if (!conteudo) return;

    const janela = window.open("", "_blank");

    if (!janela) {
        alert("Permita a abertura de janelas pop-up para imprimir o boleto.");
        return;
    }

    janela.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Boleto demonstrativo</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; }
                h2 { color: #8b1e3f; }
                @media print { button { display:none; } }
            </style>
        </head>
        <body>${conteudo.innerHTML}</body>
        </html>
    `);

    janela.document.close();
    janela.focus();
    janela.print();
}

function exportarParcelasCSV() {
    const linhas = [
        ["Cliente", "Compra", "Parcela", "Vencimento", "Valor", "Status"]
    ];

    db.parcelas.forEach(p => {
        const compra = obterCompra(p.compraId);

        linhas.push([
            nomeCliente(p.clienteId),
            compra?.descricao || "",
            p.numero,
            p.vencimento,
            Number(p.valor || 0).toFixed(2),
            statusParcela(p)
        ]);
    });

    baixarCSV("parcelas_taty.csv", linhas);
}

function baixarCSV(nome, linhas) {
    const conteudo = "\uFEFF" + linhas
        .map(linha => linha.map(valor =>
            `"${String(valor ?? "").replace(/"/g, '""')}"`
        ).join(";"))
        .join("\r\n");

    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = nome;
    link.click();

    URL.revokeObjectURL(url);
}


/* =========================================================
   CRÉDITOS
========================================================= */

function paginaCreditos() {
    const content = document.getElementById("content");

    const limiteTotal = db.clientes.reduce(
        (total, c) => total + Number(c.limite || 0), 0
    );

    const usadoTotal = db.clientes.reduce(
        (total, c) => total + Number(c.creditoUsado || 0), 0
    );

    content.innerHTML = `
        <div class="page-title">
            <h1>Controle de créditos</h1>
            <p>Consulte e atualize limites de crédito dos clientes.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Limite total</div>
                <div class="stat-value">${moeda(limiteTotal)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Crédito utilizado</div>
                <div class="stat-value">${moeda(usadoTotal)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Crédito disponível</div>
                <div class="stat-value">${moeda(limiteTotal - usadoTotal)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Clientes</div>
                <div class="stat-value">${db.clientes.length}</div>
            </div>
        </div>

        <div class="card">
            <h2>Limites por cliente</h2>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Limite</th>
                            <th>Utilizado</th>
                            <th>Disponível</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.clientes.map(c => `
                            <tr>
                                <td>${escapeHTML(c.nome)}</td>
                                <td>${moeda(c.limite)}</td>
                                <td>${moeda(c.creditoUsado)}</td>
                                <td>${moeda(Number(c.limite || 0) - Number(c.creditoUsado || 0))}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="editarCliente(${c.id})">Editar limite</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}


/* =========================================================
   DÍVIDAS
========================================================= */

function paginaDividas() {
    const content = document.getElementById("content");

    const abertas = db.parcelas.filter(p => statusParcela(p) !== "Pago");
    const atrasadas = abertas.filter(p => statusParcela(p) === "Atrasada");

    const totalAberto = abertas.reduce((s, p) => s + Number(p.valor || 0), 0);
    const totalAtrasado = atrasadas.reduce((s, p) => s + Number(p.valor || 0), 0);

    content.innerHTML = `
        <div class="page-title">
            <h1>Controle de dívidas</h1>
            <p>Visualize os valores pendentes e os débitos vencidos.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total em aberto</div>
                <div class="stat-value">${moeda(totalAberto)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total atrasado</div>
                <div class="stat-value">${moeda(totalAtrasado)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Parcelas pendentes</div>
                <div class="stat-value">${abertas.length}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Parcelas atrasadas</div>
                <div class="stat-value">${atrasadas.length}</div>
            </div>
        </div>

        <div class="card">
            <h2>Parcelas em aberto</h2>
            ${renderTabelaParcelas(abertas, true)}
        </div>
    `;
}


/* =========================================================
   NEGOCIAÇÕES
========================================================= */

function paginaNegociacoes() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <div class="page-title">
            <h1>Negociações</h1>
            <p>Registre acordos e acompanhe negociações de débitos.</p>
        </div>

        <div class="card">
            <button class="btn btn-primary" onclick="modalNovaNegociacao()">+ Nova negociação</button>

            <div style="margin-top:20px;" class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Descrição</th>
                            <th>Valor negociado</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.negociacoes.map(n => `
                            <tr>
                                <td>${escapeHTML(nomeCliente(n.clienteId))}</td>
                                <td>${escapeHTML(n.descricao)}</td>
                                <td>${moeda(n.valor)}</td>
                                <td>${dataBR(n.data)}</td>
                                <td><span class="${classeStatus(n.status)}">${escapeHTML(n.status)}</span></td>
                                <td>
                                    <button class="btn btn-success" onclick="concluirNegociacao(${n.id})">Concluir</button>
                                    <button class="btn btn-danger" onclick="excluirNegociacao(${n.id})">Excluir</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function modalNovaNegociacao() {
    abrirModal("Nova negociação", `
        <form onsubmit="salvarNegociacao(event)">
            <div class="form-group">
                <label>Cliente</label>
                <select name="clienteId" class="form-control" required>
                    ${db.clientes.map(c => `
                        <option value="${c.id}">${escapeHTML(c.nome)}</option>
                    `).join("")}
                </select>
            </div>

            <div class="form-group">
                <label>Descrição do acordo</label>
                <input name="descricao" class="form-control" required>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Valor negociado</label>
                    <input name="valor" type="number" min="0.01" step="0.01" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Data</label>
                    <input name="data" type="date" value="${hojeISO()}" class="form-control" required>
                </div>
            </div>

            <button class="btn btn-primary" type="submit">Salvar negociação</button>
        </form>
    `);
}

function salvarNegociacao(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    db.negociacoes.push({
        id: proximoId(db.negociacoes),
        clienteId: Number(form.get("clienteId")),
        descricao: String(form.get("descricao")).trim(),
        valor: Number(form.get("valor")),
        data: String(form.get("data")),
        status: "Pendente"
    });

    salvarBanco();
    fecharModal();
    paginaNegociacoes();
}

function concluirNegociacao(id) {
    const n = db.negociacoes.find(item => Number(item.id) === Number(id));
    if (!n) return;

    n.status = "Concluída";
    salvarBanco();
    paginaNegociacoes();
}

function excluirNegociacao(id) {
    if (!confirm("Deseja excluir esta negociação?")) return;

    db.negociacoes = db.negociacoes.filter(n => Number(n.id) !== Number(id));
    salvarBanco();
    paginaNegociacoes();
}


/* =========================================================
   ALERTAS E WHATSAPP
========================================================= */

function paginaAlertas() {
    const content = document.getElementById("content");

    const pendentes = db.parcelas.filter(p => statusParcela(p) !== "Pago");

    content.innerHTML = `
        <div class="page-title">
            <h1>Alertas e WhatsApp</h1>
            <p>Prepare mensagens de lembrete para os clientes. O envio depende da confirmação no WhatsApp.</p>
        </div>

        <div class="alert alert-info">
            Este recurso abre o WhatsApp com uma mensagem preenchida. Revise e envie manualmente.
        </div>

        <div class="card">
            <h2>Parcelas pendentes</h2>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Telefone</th>
                            <th>Valor</th>
                            <th>Vencimento</th>
                            <th>Status</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pendentes.map(p => {
                            const cliente = obterCliente(p.clienteId);

                            return `
                                <tr>
                                    <td>${escapeHTML(cliente?.nome || "")}</td>
                                    <td>${escapeHTML(cliente?.telefone || "-")}</td>
                                    <td>${moeda(p.valor)}</td>
                                    <td>${dataBR(p.vencimento)}</td>
                                    <td>${escapeHTML(statusParcela(p))}</td>
                                    <td>
                                        <button class="btn btn-success"
                                                onclick="abrirWhatsAppLembrete(${p.id})">
                                            Abrir WhatsApp
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function abrirWhatsAppLembrete(id) {
    const parcela = db.parcelas.find(p => Number(p.id) === Number(id));
    if (!parcela) return;

    const cliente = obterCliente(parcela.clienteId);
    if (!cliente || !cliente.telefone) {
        alert("O cliente não possui telefone cadastrado.");
        return;
    }

    const telefone = String(cliente.telefone).replace(/\D/g, "");
    const telefoneCompleto = telefone.startsWith("55") ? telefone : `55${telefone}`;

    const mensagem =
        `Olá, ${cliente.nome}! Aqui é da Taty Confecções. ` +
        `Estamos entrando em contato para lembrar da parcela de ${moeda(parcela.valor)}, ` +
        `com vencimento em ${dataBR(parcela.vencimento)}. ` +
        `Se você já realizou o pagamento, desconsidere esta mensagem. Obrigado!`;

    window.open(
        `https://wa.me/${telefoneCompleto}?text=${encodeURIComponent(mensagem)}`,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   ÁREA DO CLIENTE
========================================================= */

function paginaClienteInicio() {
    const content = document.getElementById("content");
    const cliente = obterCliente(sessao.usuario.id);

    if (!cliente) {
        content.innerHTML = `<div class="alert alert-danger">Cliente não encontrado.</div>`;
        return;
    }

    const compras = comprasCliente(cliente.id);
    const parcelas = parcelasCliente(cliente.id);
    const atrasadas = parcelasAtrasadas(cliente.id);
    const totalAberto = saldoCliente(cliente.id);
    const disponivel = Number(cliente.limite || 0) - Number(cliente.creditoUsado || 0);

    content.innerHTML = `
        <div class="page-title">
            <h1>Olá, ${escapeHTML(cliente.nome)}!</h1>
            <p>Consulte suas compras, parcelas e limite de crédito.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">🛍️</div>
                <div class="stat-label">Compras registradas</div>
                <div class="stat-value">${compras.length}</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🧾</div>
                <div class="stat-label">Total em aberto</div>
                <div class="stat-value">${moeda(totalAberto)}</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">💳</div>
                <div class="stat-label">Crédito disponível</div>
                <div class="stat-value">${moeda(disponivel)}</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">⚠️</div>
                <div class="stat-label">Parcelas atrasadas</div>
                <div class="stat-value">${atrasadas.length}</div>
            </div>
        </div>

        ${atrasadas.length ? `
            <div class="alert alert-warning">
                Você possui ${atrasadas.length} parcela(s) em atraso. Consulte seus boletos para verificar os vencimentos.
            </div>
        ` : ""}

        <div class="card">
            <h2>Próximos vencimentos</h2>
            ${renderTabelaParcelas(
                parcelas.filter(p => statusParcela(p) !== "Pago")
                    .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
                    .slice(0, 5)
            )}
        </div>
    `;
}

function paginaClienteCompras() {
    const content = document.getElementById("content");
    const compras = comprasCliente(sessao.usuario.id);

    content.innerHTML = `
        <div class="page-title">
            <h1>Minhas compras</h1>
            <p>Histórico das compras registradas em sua conta.</p>
        </div>

        <div class="card">
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Parcelas</th>
                            <th>Detalhes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${compras.map(c => `
                            <tr>
                                <td>${escapeHTML(c.descricao)}</td>
                                <td>${dataBR(c.data)}</td>
                                <td>${moeda(c.valor)}</td>
                                <td>${c.parcelas}</td>
                                <td>
                                    <button class="btn btn-light" onclick="verCompra(${c.id})">Ver</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
            ${compras.length ? "" : `<div class="empty">Você ainda não possui compras registradas.</div>`}
        </div>
    `;
}

function paginaClienteBoletos() {
    const content = document.getElementById("content");
    const parcelas = parcelasCliente(sessao.usuario.id);

    content.innerHTML = `
        <div class="page-title">
            <h1>Meus boletos e parcelas</h1>
            <p>Acompanhe vencimentos e a situação de cada parcela.</p>
        </div>

        <div class="card">
            ${renderTabelaParcelas(
                parcelas.slice().sort((a, b) => a.vencimento.localeCompare(b.vencimento))
            )}
        </div>
    `;
}

function paginaClienteCredito() {
    const content = document.getElementById("content");
    const cliente = obterCliente(sessao.usuario.id);

    if (!cliente) return;

    const limite = Number(cliente.limite || 0);
    const usado = Number(cliente.creditoUsado || 0);
    const disponivel = limite - usado;
    const percentual = limite > 0
        ? Math.min(100, Math.max(0, usado / limite * 100))
        : 0;

    content.innerHTML = `
        <div class="page-title">
            <h1>Meu crédito</h1>
            <p>Consulte seu limite e o saldo disponível.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Limite aprovado</div>
                <div class="stat-value">${moeda(limite)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Crédito utilizado</div>
                <div class="stat-value">${moeda(usado)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Saldo disponível</div>
                <div class="stat-value">${moeda(disponivel)}</div>
            </div>
        </div>

        <div class="card">
            <h2>Utilização do limite</h2>
            <div style="height:18px;background:#eee;border-radius:20px;overflow:hidden;">
                <div style="height:100%;width:${percentual}%;background:#8b1e3f;border-radius:20px;"></div>
            </div>
            <p>${percentual.toFixed(1)}% do limite utilizado</p>
            <p style="color:#707782;font-size:13px;">
                Para solicitar alteração do limite, entre em contato com a Taty Confecções.
            </p>
        </div>
    `;
}

function paginaClienteDividas() {
    const content = document.getElementById("content");
    const parcelas = parcelasCliente(sessao.usuario.id)
        .filter(p => statusParcela(p) !== "Pago");

    const total = parcelas.reduce((s, p) => s + Number(p.valor || 0), 0);

    content.innerHTML = `
        <div class="page-title">
            <h1>Minhas dívidas</h1>
            <p>Consulte os valores pendentes e os vencimentos.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total em aberto</div>
                <div class="stat-value">${moeda(total)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Parcelas pendentes</div>
                <div class="stat-value">${parcelas.length}</div>
            </div>
        </div>

        <div class="card">
            ${renderTabelaParcelas(parcelas)}
        </div>
    `;
}

function paginaClienteDados() {
    const content = document.getElementById("content");
    const cliente = obterCliente(sessao.usuario.id);

    if (!cliente) return;

    content.innerHTML = `
        <div class="page-title">
            <h1>Meus dados</h1>
            <p>Confira suas informações cadastrais.</p>
        </div>

        <div class="card">
            <form onsubmit="atualizarMeusDados(event)">
                <div class="grid-2">
                    <div class="form-group">
                        <label>Nome completo</label>
                        <input class="form-control" name="nome" value="${escapeHTML(cliente.nome)}" required>
                    </div>

                    <div class="form-group">
                        <label>CPF</label>
                        <input class="form-control" value="${escapeHTML(cliente.cpf)}" disabled>
                    </div>

                    <div class="form-group">
                        <label>Telefone / WhatsApp</label>
                        <input class="form-control" name="telefone" value="${escapeHTML(cliente.telefone || "")}" required>
                    </div>

                    <div class="form-group">
                        <label>E-mail</label>
                        <input class="form-control" name="email" type="email" value="${escapeHTML(cliente.email || "")}">
                    </div>

                    <div class="form-group">
                        <label>Cidade</label>
                        <input class="form-control" name="cidade" value="${escapeHTML(cliente.cidade || "")}">
                    </div>

                    <div class="form-group">
                        <label>Nova senha (opcional)</label>
                        <input class="form-control" name="senha" type="password" minlength="4">
                    </div>
                </div>

                <button class="btn btn-primary" type="submit">Salvar meus dados</button>
            </form>
        </div>
    `;
}

function atualizarMeusDados(event) {
    event.preventDefault();

    const cliente = obterCliente(sessao.usuario.id);
    if (!cliente) return;

    const form = new FormData(event.target);

    cliente.nome = String(form.get("nome")).trim();
    cliente.telefone = String(form.get("telefone") || "").replace(/\D/g, "");
    cliente.email = String(form.get("email") || "").trim();
    cliente.cidade = String(form.get("cidade") || "").trim();

    const senha = String(form.get("senha") || "");
    if (senha) cliente.senha = senha;

    sessao.usuario = cliente;

    salvarBanco();

    document.getElementById("topUserName").textContent = cliente.nome;
    document.getElementById("avatar").textContent =
        cliente.nome.substring(0, 2).toUpperCase();

    alert("Seus dados foram atualizados.");
    paginaClienteDados();
}


/* =========================================================
   MODAL
========================================================= */

function abrirModal(titulo, conteudo) {
    document.getElementById("modalTitle").textContent = titulo;
    document.getElementById("modalContent").innerHTML = conteudo;
    document.getElementById("modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function fecharModal() {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("modalContent").innerHTML = "";
    document.body.style.overflow = "";
}

document.getElementById("modal").addEventListener("click", function(event) {
    if (event.target === this) fecharModal();
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") fecharModal();
});


/* =========================================================
   MENU MOBILE
========================================================= */

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const button = document.querySelector(".mobile-menu");

    const aberto = sidebar.classList.toggle("open");

    if (button) {
        button.setAttribute("aria-expanded", String(aberto));
    }
}

function fecharSidebarMobile() {
    const sidebar = document.getElementById("sidebar");
    const button = document.querySelector(".mobile-menu");

    if (window.innerWidth <= 900) {
        sidebar.classList.remove("open");

        if (button) {
            button.setAttribute("aria-expanded", "false");
        }
    }
}

document.addEventListener("click", function(event) {
    const sidebar = document.getElementById("sidebar");
    const button = document.querySelector(".mobile-menu");

    if (!sidebar || !button || window.innerWidth > 900) return;

    if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !button.contains(event.target)
    ) {
        fecharSidebarMobile();
    }
});


/* =========================================================
   MÁSCARAS DE ENTRADA
========================================================= */

function mascaraCPF(valor) {
    return valor
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascaraTelefone(valor) {
    valor = valor.replace(/\D/g, "").slice(0, 11);

    if (valor.length <= 10) {
        return valor
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return valor
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
}

document.getElementById("loginCpf").addEventListener("input", function() {
    this.value = mascaraCPF(this.value);
});

document.getElementById("cadCpf").addEventListener("input", function() {
    this.value = mascaraCPF(this.value);
});

document.getElementById("cadTelefone").addEventListener("input", function() {
    this.value = mascaraTelefone(this.value);
});


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("tatyDb")) {
        salvarBanco();
    }

    alterarLogin("cliente");
});