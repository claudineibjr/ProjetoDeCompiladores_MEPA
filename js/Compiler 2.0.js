/*
PROGRAM TESTE;
	VAR 	N,K : INTEGER;
			F1,F2,F3: INTEGER;
BEGIN
	READ(N);
	F1:=0; F2:=1; K:=1;
	WHILE K<= N DO
	BEGIN
		F3:=F1+F2;
		F1:=F2;
		F2:=F3;
		K:=K+1;
	END;
	WRITE (N, F1);
END.

->

	INPP
	AMEM 5
	LEIT
	ARMZ 0
	CRCT 0
	ARMZ 2
	CRCT 1
	ARMZ 3
	CRCT 1
	ARMZ 1
L1	NADA
	CRVL 1
	CRVL 0
	CMEG
	DSVF L2
	CRVL 2
	CRVL 3
	SOMA
	ARMZ 4
	CRVL 3
	ARMZ 2
	CRVL 4
	ARMZ 3
	CRVL 1
	CRCT 1
	SOMA
	ARMZ 1
	DSVS L1
L2	NADA
	CRVL 0
	IMPR 
	CRVL 2
	IMPR
	DMEM 5
	PARA

*/

const CONSTANTE = 0; 			//	CRCT K (Carregar constante K)
const CARREGA_VALOR = 1;		//	CRVL N (Carregar Valor)
const SOMA = 2;					//	SOMA (Somar)
const SUBTRACAO = 3;			//	SUBT (Subtração)
const MULTIPLICACAO = 4;		//	MULT (Multiplicação)
const DIVISAO = 5;				//	DIVI (Divisão)
const CONJUNCAO = 6;			//	CONJ (Conjunção: and lógico  True= 1 e False = 0)
const DISJUNCAO = 7;			//	DISJ (Disjunção: or lógico  True= 1 e False = 0)
const COMPARA_MENOR = 8;		//	CMME (Comparar Menor)
const COMPARA_MAIOR = 9;		//	CMMA (Comparar Maior)
const COMPARA_IGUAL = 10;		//	CMIG (Comparar Igual)
const COMPARA_DESIGUAL = 11;	//	CMDG (Comparar Desigual)
const COMPARA_MENOR_IGUAL = 12;	//	CMEG (Comparar menor Igual)
const COMPARA_MAIOR_IGUAL = 13;	//	CMAG (Comparar maior igual)
const INVERTE_SINAL = 14;		//	INVR (Inverte o sinal)
const NEGACAO = 15;				//	NEGA (Negação)
const ARMAZENA = 16;			//	ARMZ N (Armazena o valor do topo na posição N)
const LE_VALOR = 17;			//	LEIT (coloca no topo o valor lido)
const ESCREVE_VALOR = 18;		//	IMPR (coloca no dispositivo de saída o valor do topo)
const IF = 19;					/*	if (expr) then c1 else c2
									<expr>
									DSVF (*)
									----   (c1)
									----
									DSVS (**)
									(*) ----  (c2)
									-----
									(**)
								*/
const DESVIA_FALSO = 20;		//	DSVF p (desvia para p se topo for falso; (p é endereço))
const DESVIA = 21;				//	DSVS q (desvia sempre para q (q é endereço)
const WHILE = 22;				/*	WHILE expr DO c
									L1	NADA
										expr
										DSVF L2
										c
										DSVS L1
									L2	NADA
								*/
const INICIA_PROGRAMA = 23;		//	INPP (iniciar programa principal. Primeira instrução do programa objeto gerado.)
const ALOCA_ESPACO = 24;		//	AMEM n (aloca espaço na memória (pilha M) para n variáveis)
const DESALOCA_ESPACO = 25;		//	DMEM n (desaloca o espaço das n variáveis alocadas em AMEM)
const PARA_EXECUCAO = 26;		//	PARA (para a execução do MEPA)
const TIPO_VARIAVEL = 27;		//	Tipagem de variáveis
const INICIO_BLOCO = 28;		//	Início de bloco
const INICIO_PARAMETRO = 29;	//	Parâmetro
const FIM_PARAMETRO = 30;		//	Parâmetro
const SEPARADOR = 31;			//	Vírgula
const NOME_PROGRAMA = 100;

var posicoes;
posicoes = newMatriz(1, 2);
posicoes.push(["A", "100"]);
posicoes.push(["B", "101"]);
posicoes.push(["C", "103"]);
posicoes.push(["D", "104"]);

var numVariaveis;

function onLoad(){
	/*
	Restrições:
		 - As variáveis devem estar maiúsculas
		 - As atribuições devem ter a variável, dois pontos e igual. Ex: X:=
		 - Cada token deve ser separado por um espaço
	*/

	// Seto um valor padrão quando o programa for aberto
	var debugWords = new Array();
	debugWords.push("PROGRAM TESTE;");							//INPP
	debugWords.push("VAR N,K : INTEGER; F1,F2,F3: INTEGER;");		//AMEM 5
	//debugWords.push("BEGIN");
	//debugWords.push("READ(N);");
	//debugWords.push("F1:=0; F2:=1; K:=1;");
	//debugWords.push("WHILE K<= N DO");
	//debugWords.push("BEGIN");
	//debugWords.push("F3:=F1+F2;");
	//debugWords.push("F1:=F2;");
	//debugWords.push("F2:=F3;");
	//debugWords.push("K:=K+1;");
	//debugWords.push("END;");
	//debugWords.push("WRITE (N, F1);");
	//debugWords.push("END.");
	
	document.getElementById("pascalCode").value = showMatriz(debugWords, false);

}
function translate(){
	document.getElementById("pascalCode").value = document.getElementById("pascalCode").value + " ";

	var assembler;
	assembler = new Array();

	var tokens = translateStringToToken(document.getElementById("pascalCode").value, assembler);

	document.getElementById("assemblerCode").value = showMatriz(assembler, false);
}

function translateStringToToken(string, assembler){
	var tokens = newMatriz(1, 2);
	var newToken, newTokenParameter = "", identifiedToken = "";

	var iAux = 0, bParametro = false, auxParametros = new Array(), bInserted = false, numVariaveis = 0;

	for(var i = 0; i < string.length; i++){

		if (	(string.substring(i, i+1) == " ")	||
				(string.substring(i, i+1) == ",")	||
				(string.substring(i, i+1) == "(")	||
				(string.substring(i, i+1) == ")")	||
				(string.substring(i, i+1) == ":")	||
				(string.substring(i, i+1) == ";")	){
			if (string.substring(i, iAux).trim() == "(")
				newTokenParameter = newToken;

			if (string.substring(i, iAux).trim() != ""){
				newToken = string.substring(i, iAux).trim();

				bInserted = false;

				if (newToken == "(")
					bParametro = true;

				if (bParametro && newToken != "("){
					bInserted = true;
					((newToken == ")" || newToken == ",") ? null : auxParametros.push(newToken));
					if (newToken == "," || newToken == ")" ){
						for (var j = 0; j < auxParametros.length; j++){
							identifiedToken = identifyToken(String(auxParametros[j]), tokens);
							tokens.push([auxParametros[j], identifiedToken]);	// STOP
							if (newTokenParameter == "write")
								assembler.push(translateToken([auxParametros[j], identifiedToken], null));
						}
						identifiedToken = identifyToken(newTokenParameter, tokens);
						assembler.push(translateToken([newTokenParameter, identifiedToken], null));

						auxParametros = new Array();
					}
				}

				if (newToken == ")")
					bParametro = false;

				newToken = replaceValues(newToken, [",", ";", ":", " "], "");

				identifiedToken = identifyToken(String(newToken), tokens);

				if (identifiedToken != null){

					if (identifiedToken != NOME_PROGRAMA && bInserted == false){
						if (identifiedToken != ESCREVE_VALOR){
							if ( ((tokens.length > 0 ? tokens[tokens.length-1][1] : null) == ALOCA_ESPACO) ){
								numVariaveis++;
								if (assembler[assembler.length-1].indexOf("AMEM") >= 0){
									if (identifiedToken == CARREGA_VALOR){
										newToken = "VAR";	identifiedToken = identifyToken(String(newToken), tokens);
										tokens.pop();		tokens.push([newToken, identifiedToken]);	//STOP
										assembler.pop();	assembler.push(translateToken([newToken, identifiedToken], numVariaveis));
									}else
										numVariaveis--;
								}
							}
							else{
								//alert("O token é: " + newToken + "\nIdentificado como: " + identifiedToken);
								tokens.push([newToken, identifiedToken]);	//STOP
								assembler.push(translateToken([newToken, identifiedToken], numVariaveis));
							}
						}
					}
				}
			}
			iAux = i;
		}
	}

	return tokens;
}

function identifyToken(token, tokens){
	switch(token.toLowerCase()){
		case "+":	return SOMA;
		case "–": 	return SUBTRACAO;
		case "-": 	return SUBTRACAO;
		case "/":	return DIVISAO;
		case "*": 	return MULTIPLICACAO;		
		case "and": return CONJUNCAO;
		case "or": 	return DISJUNCAO;
		case "<": 	return COMPARA_MENOR;
		case ">": 	return COMPARA_MAIOR;
		case "=": 	return COMPARA_IGUAL;
		case "!=": 	return COMPARA_DESIGUAL;
		case "<=": 	return COMPARA_MENOR_IGUAL;
		case ">=": 	return COMPARA_MAIOR_IGUAL;
		case " ": 	return INVERTE_SINAL;	//<TO DO>
		case "!": 	return NEGACAO;
		case "read": 	return LE_VALOR;	//<TO DO>
		case "write": 	return ESCREVE_VALOR;	//<TO DO>
		case "if": 	return IF;
		case " ": 	return DESVIA_FALSO;	//<TO DO>
		case " ": 	return DESVIA;	//<TO DO>
		case " ": 	return WHILE;	//<TO DO>
		case "program": 	return INICIA_PROGRAMA;	//<TO DO>
		case "var": return ALOCA_ESPACO;
		case " ": 	return DESALOCA_ESPACO;	//<TO DO>
		case " ": 	return PARA_EXECUCAO;	//<TO DO>
		case "integer": return TIPO_VARIAVEL;
		case "begin": return INICIO_BLOCO;
		case "(": return INICIO_PARAMETRO;
		case ")": return FIM_PARAMETRO;
		case ",": return SEPARADOR;
	}

	if(token.substring(token.indexOf(":")) == ":=")
		return ARMAZENA;

	if (tokens.length >= 1){
		if (tokens[tokens.length-1][1] == INICIA_PROGRAMA)
			return NOME_PROGRAMA;
	}

	if (isNaN(token)){
		if( (token.indexOf(":") >= 0) || (token.indexOf(",") >= 0) || (token.indexOf(" ") >= 0) || (token.indexOf(";") >= 0) )
			return null;
		else
			return CARREGA_VALOR;
	}
	else
		return CONSTANTE;
}
function ordenaTokens(tokens, prioridades){
	var newTokens;
	newTokens = newMatriz(1, 2);

	var cont_Aux;
	cont_Aux = 0;

	var lenTokens, lenNewTokens;
	lenTokens = tokens.length;
	lenNewTokens = 0;

	do{
		cont_Aux++;
		for (var i = 0; i < tokens.length; i++){
			if (prioridades[tokens[i][1]] == cont_Aux){
				newTokens.push([tokens[i][0], tokens[i][1]]);
				lenNewTokens++;
			}
		}
	} while (lenTokens > lenNewTokens)

	return newTokens;	
}
function translateToken(token, numVariaveis){
	var texto = "";

	switch(token[1]){
		case CONSTANTE: {	texto = "CRCT " + token[0];	break;	}
		case CARREGA_VALOR: {	texto = "CRVL " + posicaoVariavel(token[0]);	break;	}	//<TO DO>
		case SOMA: {	texto = "SOMA";	break;	}
		case SUBTRACAO: {	texto = "SUBT";	break;	}
		case MULTIPLICACAO: {	texto = "MULT";	break;	}
		case DIVISAO: {	texto = "DIVI";	break;	}
		case CONJUNCAO: {	texto = "CONJ";	break;	}
		case DISJUNCAO: {	texto = "DISJ";	break;	}
		case COMPARA_MENOR: {	texto = "CMME";	break;	}
		case COMPARA_MAIOR: {	texto = "CMMA";	break;	}
		case COMPARA_IGUAL: {	texto = "CMIG";	break;	}
		case COMPARA_DESIGUAL: {	texto = "CMDG";	break;	}
		case COMPARA_MENOR_IGUAL: {	texto = "CMEG";	break;	}
		case COMPARA_MAIOR_IGUAL: {	texto = "CMAG";	break;	}
		case INVERTE_SINAL: {	texto = "INVR";	break;	}
		case NEGACAO: {	texto = "NEGA";	break;	}
		case ARMAZENA: {	texto = "ARMZ " + posicaoVariavel(token[0].substring(0, token[0].indexOf(":")));	break;	}	//<TO DO>
		case LE_VALOR: {	texto = "LEIT";	break;	}
		case ESCREVE_VALOR: {	texto = "IMPR";	break;	}
		//<TO DO> Falta fazer o if // case IF: {	texto = "";	break;	}
		case DESVIA_FALSO: {	texto = "DSVF " + posicaoVariavel(token[0]);	break;	}	//<TO DO>
		case DESVIA: {	texto = "DSVS " + posicaoVariavel(token[0]);	break;	}	//<TO DO>
		//<TO DO> Falta fazer o while // case WHILE: {	texto = "";	break;	}
		case INICIA_PROGRAMA: {	texto = "INPP";	break;	}
		case ALOCA_ESPACO: {	texto = "AMEM " + numVariaveis; break;	}
		case DESALOCA_ESPACO: {	texto = "DMEM " + posicaoVariavel(token[0]);	break;	}	//<TO DO>
		case PARA_EXECUCAO: {	texto = "PARA";	break;	}
		//case PARAMETRO:{	texto = "ARMZ " + posicaoVariavel(token[0]);	break;	} //<TO DO>
	}

	return texto;
}
function posicaoVariavel(CARREGA_VALOR){
	//for (var i = 0; i < posicoes.length; i++){
	//	if (posicoes[i][0] == CARREGA_VALOR)
	//		return posicoes[i][1];
	//}
	return "[VARIAVEL]";
	//return CARREGA_VALOR;
}