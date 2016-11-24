function newMatriz(linhas, colunas){
	// Criando matriz	
	var table = new Array(linhas);

	if (colunas == undefined){
		colunas = linhas;
		linhas = 1;
	}

	var i;
	for (i = 0; i < linhas; i++){
		table[i] = new Array(colunas);
	}
	// Matriz criada
	table.shift()

	//Exemplo de push
	//table.push(["Coluna 1", "Coluna 2"]);
	
	return table;
}
function showMatriz(matriz){
	var linhas, colunas;

	linhas = matriz.length;
	colunas = matriz[linhas-1].length;

	var texto;
	texto = "";

	for (var i=0; i<linhas; i++){
		for (var j=0; j<colunas; j++){
			texto = texto + matriz[i][j] + (j+1 == colunas ? "" : "\t");
		}
		texto = texto + "\n";
	}

	return texto;
}
function showArray(array){
	var linhas;
	linhas = array.length;

	var texto;
	texto = "";

	for (var i=0; i<linhas; i++){
		texto = texto + array[i] + "\n";
	}
	return texto;	
}