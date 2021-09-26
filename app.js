
/*--------------------- JSON -------------------------------------------
-------------------------------------------------------------------------
 objetos literais existem apenas na instancia da aplicação, 
 para que possam ser usados em outras instancias, precisam ser convertidos
 em strings. 
	JSON.stringfy - transforma um objeto literal em uma string
	JSON.pase - faz caminho inverso, transforma string em objeto
---------------------------------------------------------------------------*/


/*------------------ LOCAL STORAGE ---------------------
--------------------------------------------------------
armazenamento de informações diretamente no browser
acessado em F12 + aplicações + local storage
	setItem - inclui elemento no localstorage
	getItem - busca elemento dentro do localstorage
--------------------------------------------------------*/

//-----------------------------------------------------------------

class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() { // verifica de os campos estão preenchidos
		for(let i in this) { // this faz referencia ao proprio objeto (despesa)

				// this[i] percorre o indice dos atributos, é como se estivesse fazendo this.ano | this.mes | this.dia | etc
				// se qualquer campo do indice for undefined ou vazio ou nullo retorna falso e o gravar não ocorre
			if(this[i] == undefined || this[i] === '' || this[i] === null) { 
				return false
			}
		}

		return true // se não entrar no if, cai direto nessa instrução de true
	}								
}

//------------------------------------------------------------------
					// CLASS BD
//------------------------------------------------------------------

class Bd { // responsável por controlar a comunicação com o local storage e criar um indice dinamico

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) { // se o id for null, iniciar com 0
			localStorage.setItem('id', 0)
		}
	}

//-----------------------------------------
// Método para contar indice
//-----------------------------------------
	getProximoId() {// lógica para criar o indice do id, para que cada informação inserida seja incluida em um indice diferente
		let proximoId = localStorage.getItem('id') // recupera valor de id e o insere na variavel proximoId
		return parseInt(proximoId) + 1 // acrescenta 1 no id para formação do indice
	}

//-----------------------------------------
// Método para gravar despesas
//-----------------------------------------
	gravar(d) { // d === objeto literal 'despesa'

		let id = this.getProximoId() // this(d - parametro da função), recupera as infromações inseridas (ano, dia, etc ...)
		                              // executa função proximoId e define nº do indice ex. 1, 2, 3

		localStorage.setItem(id, JSON.stringify(d)) // transforma essa info em string

		localStorage.setItem('id', id) // 'limpa' as infromações
	}

//-----------------------------------------
// Método para recuperar registros
//-----------------------------------------
		// recuperar registros para exibi-los na página consulta
	recuperarTodosRegistros() {


		// array de despesas
		let despesas = Array()



		let id = localStorage.getItem('id') 
	
		// recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) { // corre todos os ids cadastrados

			// recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i)) // i === 1, 2, 3, 4, etc.. // JSON.parse transforma de string em objeto literal
		

			// testa se existe a possibilidade de haver indices que foram pulados ou removidos
			// neste caso pula esses indices
			if(despesa === null) {
				continue // faz com que o laço avance para a próxima iteração
			}

			despesa.id = i
			despesas.push(despesa) // inclui informações dos indices no array de despesas

		}
		return despesas
	}


//-----------------------------------------
// Método para filtrar busca
//-----------------------------------------

	pesquisar(despesa) {
		
		let despesasFiltradas = Array()

		despesasFiltradas = this.recuperarTodosRegistros()

		console.log(despesasFiltradas)

		// ano
		if(despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		// mes
		if(despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		// dia
		if(despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}


		// tipo
		if(despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}


		// descricao
		if(despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}


		// valor
		if(despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}


	remover(id) {
		localStorage.removeItem(id)
	}

}

let bd = new Bd()

//----------------------------------------------------------------------


function cadastrarDespesa() {


	// selecionando campos
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')


	// colocando os valores inseridos em um objeto chamado despesa 
	// criado com base na class Despesa definida acima
	let despesa = new Despesa (
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value,            // parametros passados ao objeto
		descricao.value,       // definidos no constructor
		valor.value
	)


// verificar se os campos estão preenchidos
	if(despesa.validarDados()) { // se true, gravar informações
		
		bd.gravar(despesa) // gravar informações
		
		// instruções que alteram as mensagens e cores do modal
		document.getElementById("modal_titulo").innerHTML = "Registro inserido com sucesso"
		document.getElementById("textBody").innerHTML = "Despesa foi cadastrada com sucesso!"
		document.getElementById("botaoRegistro").innerHTML = "Voltar"
		document.getElementById("botaoRegistro").className = "btn btn-success"
		document.getElementById("textoTitulo").className = "modal-header text-success"

		$('#modalRegistraDespesa').modal('show') 


		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	} else { // se false

		// instruções que alteram as mensagens e cores do modal
		document.getElementById("modal_titulo").innerHTML = "Erro na gravação"
		document.getElementById("textBody").innerHTML = "Existem campos obrigatórios que não foram preenchidos"
		document.getElementById("botaoRegistro").innerHTML = "Voltar e corrigir"
		document.getElementById("botaoRegistro").className = "btn btn-danger"
		document.getElementById("textoTitulo").className = "modal-header text-danger"
		
		$('#modalRegistraDespesa').modal('show') // comandos de JQuery

	}
}

//-----------------------------------------------------------------------------

function carregaListaDespesas(despesas = Array(), filtro = false) { // onload da página consulta (body)
	

	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros() // metodo dentro de bd
	}

	// selecionando tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''

	// percorrer array despesa, listando cada despesa de forma dinamica

	despesas.forEach(function(d) { // percorre cada elemento do array

		// criando a linha 'tr'
		var linha = listaDespesas.insertRow() // cria linhas baseada no nº de elementos do array

		//criar as colunas 'td' dentro de 'tr'
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

		
		// ajustar o tipo (trocar numeros pelo nome)
		switch(d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
		}

		linha.insertCell(1).innerHTML = d.tipo 
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor



		// criar o botão de exclusão
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function() { 
			// remover a despesa
			
			let id = this.id.replace('id_despesa_', '')

			bd.remover(id) 

			window.location.reload() // recarrega após exclusão
		}

		linha.insertCell(4).append(btn)

		console.log(d)

	})
}

//------------------------------------------------------------------

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)


	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)
}
