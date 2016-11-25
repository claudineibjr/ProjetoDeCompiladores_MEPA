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
									L1	expr
										DSVF L2
										c
										DSVS L1
									L2	
								*/
const INICIA_PROGRAMA = 23;		//	INPP (iniciar programa principal. Primeira instrução do programa objeto gerado.)
const ALOCA_ESPACO = 24;		//	AMEM n (aloca espaço na memória (pilha M) para n variáveis)
const DESALOCA_ESPACO = 25;		//	DMEM n (desaloca o espaço das n variáveis alocadas em AMEM)
const PARA_EXECUCAO = 26;		//	PARA (para a execução do MEPA)
const TIPO_VARIAVEL = 27;		//	Tipagem de variáveis
const INICIO_BLOCO = 28;		//	Início de bloco
const FIM_BLOCO = 29;			//	Fim de um bloco de código
const INICIO_PARAMETRO = 30;	//	Parâmetro
const FIM_PARAMETRO = 31;		//	Parâmetro
const SEPARADOR = 32;			//	Vírgula
const PARAMETRO = 33;
const ELSE = 34;
const NOME_PROGRAMA = 100;

var variaveis;
variaveis = new Array();

var numVariaveis;

function onLoad(){
	/*
	Restrições:
		 - As variáveis devem estar maiúsculas
		 - As atribuições devem ter a variável, dois pontos e igual. Ex: X:=
		 - Cada token deve ser separado por um espaço
	*/

	// Seto um valor padrão quando o programa for aberto
	var readyExample1 = new Array();
	readyExample1.push("PROGRAM TESTE; ");
	readyExample1.push("VAR N, K : INTEGER; F1, F2, F3: INTEGER; ");
	readyExample1.push("BEGIN ");
	readyExample1.push("READ ( N );");
	readyExample1.push("F1 := 0; F2 := 1; K := 1;");
	readyExample1.push("WHILE K <= N DO ");
	readyExample1.push("BEGIN");
	readyExample1.push("F3 := F1 + F2;");
	readyExample1.push("F1 := F2;");
	readyExample1.push("F2 := F3;");
	readyExample1.push("K := K + 1;");
	readyExample1.push("END;");
	readyExample1.push("WRITE ( N, F1 );");
	readyExample1.push("END .");

	var readyExample2 = new Array();
	readyExample2.push("PROGRAM XYZ; ");
	readyExample2.push("VAR A, S, NUM: INTEGER; ");
	readyExample2.push("BEGIN ")
	readyExample2.push("A := 1;")
	readyExample2.push("S := 0;")
	readyExample2.push("WHILE A <= 100 DO ")
	readyExample2.push("BEGIN ")
	readyExample2.push("READ ( NUM ); ")
	readyExample2.push("IF NUM > 0 THEN ")
	readyExample2.push("S := S + NUM;")
	readyExample2.push("A := A + 1;")
	readyExample2.push("END; ")
	readyExample2.push("WRITE ( S ); ")
	readyExample2.push("END.")
	
	document.getElementById("pascalCode").value = showMatriz(readyExample2, false);

}
function translate(){
	document.getElementById("pascalCode").value = document.getElementById("pascalCode").value + " ";

	var assembler;
	assembler = newMatriz(1, 2);

	var tokens = translateStringToToken(document.getElementById("pascalCode").value, assembler);

	document.getElementById("assemblerCode").value = showMatriz(assembler, true);
}

function translateStringToToken(string, assembler){
	var tokens = newMatriz(1, 2);
	var newToken, newTokenParameter = "", identifiedToken = "";

	var iAux = 0, bParametro = false, auxParametros = new Array(), bInserted = false, numVariaveis = 0;
	var whileLine = new Array(), endWhileLine = new Array(), jumpConditionalLine = new Array();

	// Percorre caracter a caracter do texto em Pascal
	for(var i = 0; i < string.length; i++){

		// Verifica se há algum separador
		if (	(string.substring(i, i+1) == " ")	||
				(string.substring(i, i+1) == ",")	||
				(string.substring(i, i+1) == "(")	||
				(string.substring(i, i+1) == ")")	||
				(string.substring(i, i+1) == ":")	||
				(string.substring(i, i+1) == ";")	){

			// Verifica se o token é uma abertura de parênteses, se sim, identifica que é uma função com parâmetros, guarda a função que a chamou
			if (string.substring(i, iAux).trim() == "(")
				newTokenParameter = newToken;

			// Verifica se o token identificado é diferente de vazio
			if (string.substring(i, iAux).trim() != ""){
				newToken = string.substring(i, iAux).trim();

				// Identifica que o token ainda não foi inserido
				bInserted = false;

				// Se o novo token é um abre parênteses, identifica que estamos trabalhando com parâmetros
				if (newToken == "(")
					bParametro = true;

				// Se for parâmetros que o token é um abre parenteses
				if (bParametro && newToken != "("){
					bInserted = true;	// Identifica que o token já foi inserido e não será inserido novamente posteriormente
					((newToken == ")" || newToken == ",") ? null : auxParametros.push(newToken));	// Caso não seja ) ou , , insere este token no array de parâmetros
					if (newToken == "," || newToken == ")" ){
						// Percorre o array de parâmetros e os insere
						for (var j = 0; j < auxParametros.length; j++){
							identifiedToken = PARAMETRO;
							tokens.push([auxParametros[j], identifiedToken]);
							console.log("1\tToken em pascal: " + newToken + "\n\nIdentificado como: " + identifiedToken + "\n\nTraduzido: " + translateToken([auxParametros[j], identifiedToken], numVariaveis) + "\n\nÉ token de numero: " + assembler.length );
							switch(newTokenParameter.toUpperCase()){
								case "WRITE": {assembler.push([(assembler.length + 1), translateToken([auxParametros[j], identifiedToken], null, 1)]);	break;}
								case "READ": {assembler.push([(assembler.length + 1), translateToken([auxParametros[j], identifiedToken], null, 2)]);	break;}
							}
						}
						// Após inserir os parâmetros, insere a função responsável pelos parâmetros
						identifiedToken = identifyToken(newTokenParameter, tokens);
						console.log("2\tToken em pascal: " + newToken + "\n\nIdentificado como: " + identifiedToken + "\n\nTraduzido: " + translateToken([auxParametros[j], identifiedToken], numVariaveis) + "\n\nÉ token de numero: " + assembler.length );
						assembler.push([(assembler.length + 1), translateToken([newTokenParameter, identifiedToken], null)]);

						auxParametros = new Array();
					}
				}

				// Se for um fecha parênteses, indica que acabaram os parâmetros
				if (newToken == ")")
					bParametro = false;

				// Retira caracteres indesejados do token
				newToken = replaceValues(newToken, [",", ";", "\n", "\t", " ", "(", ")", "."], "");

				// Guarda a informação de que tipo de token que é
				identifiedToken = identifyToken(String(newToken), tokens);

				// Se o tipo identificado é diferente de null, começa a tratativa para tradução
				if ( (identifiedToken != null) && (newToken != "") ){

					// Se a identificação do token for diferente do nome do programa continua
					if (identifiedToken != NOME_PROGRAMA && bInserted == false){
						
						// Se a identificação do token for diferente de WRITE continua
						if (identifiedToken != ESCREVE_VALOR){
							
							// Se há mais de um token e este token for igual a alocação de espaço continua
							if ( ((tokens.length > 0 ? tokens[tokens.length-1][1] : null) == ALOCA_ESPACO) && (identifiedToken != INICIO_BLOCO) ){
								variaveis.push(newToken);
								numVariaveis++;
								
								// Se o último token inserido no assembler for amem continua
								if (assembler[assembler.length-1].indexOf("AMEM") >= 0){
									
									// Se o último token do assembler for amem e o token atual for uma variável,
									if (identifiedToken == CARREGA_VALOR){
										
										// Caso seja mais uma variável, retira o último token e o reinsere com o númeo correto de variáveis
										newToken = "VAR";	identifiedToken = identifyToken(String(newToken), tokens);
										tokens.pop();		tokens.push([newToken, identifiedToken]);
										console.log("3\tToken em pascal: " + newToken + "\n\nIdentificado como: " + identifiedToken + "\n\nTraduzido: " + translateToken([auxParametros[j], identifiedToken], numVariaveis) + "\n\nÉ token de numero: " + assembler.length );
										assembler.pop();	assembler.push([(assembler.length + 1), translateToken([newToken, identifiedToken], numVariaveis)]);
									}else{

										// Na realidade não era uma variável, então tira o valor do array de variáveis e decrementa a variável contadora
										variaveis.pop();	numVariaveis--;	
									}
								}
							}
							else{
								if (identifiedToken != LE_VALOR){
									// Insere o token e o traduz para assembler
									console.log("4\tToken em pascal: " + newToken + "\n\nIdentificado como: " + identifiedToken + "\n\nTraduzido: " + translateToken([auxParametros[j], identifiedToken], numVariaveis) + "\n\nÉ token de numero: " + assembler.length );
									
									// Caso o token atual seja := e esteja identificado como armazena, eu retiro os anteriores pois seis que estão lá indevidamente
									if (newToken == ":=" && identifiedToken == ARMAZENA)	{	tokens.pop(); assembler.pop();	}

									// Caso o token atual seja um while, guarda o número da linha atual
									(identifiedToken == WHILE || identifiedToken == WHILE ? whileLine.push(assembler.length + 1) : null );

									// Caso seja o DO ou o THEN guarda o número da linha para posteriormente ajustar o JUMP
									(identifiedToken == DESVIA_FALSO ? jumpConditionalLine.push(assembler.length + 1) : null);

									tokens.push([newToken, identifiedToken]);	//STOP
									var assemblerToken = translateToken([newToken, identifiedToken], numVariaveis);
									(assemblerToken != "" ? assembler.push([(assembler.length + 1), assemblerToken]) : null);

									// Caso for o fim de um bloco de WHILE ou IF, eu insiro uma nova linha quando necessário e também arrumo a linha do desvia se falso que ficou para trás
									if (whileLine.length > 0 && ((i+1 == string.length) || identifiedToken == FIM_BLOCO || identifiedToken == ELSE )){
										assembler.push([(assembler.length + 1), "DSVS L" + whileLine.pop()]);
									}

									// Caso for o fim de um bloco de WHILE ou IF, eu insiro uma nova linha quando necessário e também arrumo a linha do desvia se falso que ficou para trás
									if (jumpConditionalLine.length > 0 && ((i+1 == string.length) || identifiedToken == FIM_BLOCO || identifiedToken == ELSE )){
										if (identifiedToken == ELSE){
											jumpConditionalLine.push(assembler.length+1);
											assembler.push([(assembler.length+1), "DSVS then"]);
										}

										assembler[jumpConditionalLine[0]-1][1] = assembler[jumpConditionalLine[0]-1][1].toUpperCase().replace("DO", "L" + (assembler.length + 1));
										assembler[jumpConditionalLine[0]-1][1] = assembler[jumpConditionalLine[0]-1][1].toUpperCase().replace("THEN", "L" + (assembler.length + 1));
										assembler.push([(assembler.length+1), ""]);
										jumpConditionalLine.shift();										
									}
								}
							}
						}
					}
				}
			}
			iAux = i;
		}
	}
	assembler.push([(assembler.length + 1), "DMEM " + numVariaveis]);
	assembler.push([(assembler.length + 1), "PARA"]);
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
		case " ": 	return INVERTE_SINAL;
		case "!": 	return NEGACAO;
		case "read": 	return LE_VALOR;
		case "write": 	return ESCREVE_VALOR;
		case "if": 	return IF;
		case "do" : return DESVIA_FALSO;
		case "then" : return DESVIA_FALSO;
		case " ": 	return DESVIA;
		case "while": 	return WHILE;
		case "program": 	return INICIA_PROGRAMA;
		case "var": return ALOCA_ESPACO;
		case " ": 	return DESALOCA_ESPACO;
		case " ": 	return PARA_EXECUCAO;
		case "integer": return TIPO_VARIAVEL;
		case "begin": return INICIO_BLOCO;
		case "(": return INICIO_PARAMETRO;
		case ")": return FIM_PARAMETRO;
		case ",": return SEPARADOR;
		case "end" : return FIM_BLOCO;
		case "else": return ELSE;

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
function translateToken(token, numVariaveis, tpFuncao){
	/*	tpFuncao
			1 - WRITE
			2 - READ
	*/
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
		case ARMAZENA: {	texto = "ARMZ " + posicaoVariavel(token[0]);	break;	}	//<TO DO>
		case LE_VALOR: {	texto = "LEIT";	break;	}
		case ESCREVE_VALOR: {	texto = "IMPR";	break;	}
		//<TO DO> Falta fazer o if // case IF: {	texto = "";	break;	}
		case DESVIA_FALSO: {	texto = "DSVF " + posicaoVariavel(token[0]);	break;	}	//<TO DO>
		case DESVIA: {	texto = "DSVS " + posicaoVariavel(token[0]);	break;	}	//<TO DO>
		case WHILE: {	texto = "";	break;	}
		case INICIA_PROGRAMA: {	texto = "INPP";	break;	}
		case ALOCA_ESPACO: {	texto = "AMEM " + numVariaveis; break;	}
		case DESALOCA_ESPACO: {	texto = "DMEM " + posicaoVariavel(token[0]);	break;	}	//<TO DO>
		case PARA_EXECUCAO: {	texto = "PARA";	break;	}
		case PARAMETRO:{	texto = (tpFuncao == 1 ? "CRVL " : "ARMZ ") + posicaoVariavel(token[0]);	break;	} //<TO DO>
	}

	return texto;
}
function posicaoVariavel(CARREGA_VALOR){
	//for (var i = 0; i < posicoes.length; i++){
	//	if (posicoes[i][0] == CARREGA_VALOR)
	//		return posicoes[i][1];
	//}
	//return "[VARIAVEL]";
	return CARREGA_VALOR;
}