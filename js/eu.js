function translateStringToToken(string){
	var tokens = newMatriz(1, 2);

	var intCount, bDeclaracaoVariavel, bParametro;
	bDeclaracaoVariavel = false;
	numVariaveis = 0;
	bParametro = false;

	var i_aux, newToken;
	i_aux = 0;

	// Transforma os caracteres nos devidos tokens e seu tipo

	// Percorre toda a string
	for (var i = 0; i < string.length; i++){

		//Verifica se tem um espa�o ou v�rgula e espa�o, caso sim, verifica-se que � um token
		if (string.substring(i, i+1) == " " || string.substring(i, i+2) == ", "	|| string.substring(i, i+1) == "("	|| string.substring(i, i+1) == ")"	){

			//Separa o token
			newToken = string.substring(i_aux, i);
			newToken = newToken.replace(" ", "");

			//Verifica se o �ltimo caracter � um ponto e v�rgula e ent�o retira-o caso o mesmo exista
			if (newToken.substring(newToken.length, 1) == ";")
				newToken = newToken.replace(";", "");

			//Verifica se o primeiro caracter � um par�nteses, o que indica que este token pode ser um par�metro
			if (newToken.substring(0, 1) == "("){
				newToken = newToken.substring(1);
				bParametro = true;
			}
			if (newToken.substring(0, 1) == ":"){
				newToken = newToken.substring(1);
				newToken = newToken.replace(" ", "");
			}

			//Verifica se o token identificado n�o s�o caracteres especiais
			if (newToken != "," && newToken != ":"	&& newToken != "("	&& newToken != ")"){

				//Retira caracteres indesejados, como espa�o, v�rgula, dois pontos e ponto e v�rgula
				newToken = newToken.replace(",", "");	/*newToken = newToken.replace(":", "");*/	newToken = newToken.replace(";", "");	//newToken = newToken.replace("(", "");	newToken = newToken.replace(")", "");
				
				//Se o token n�o for vazio, manipula-o
				if (newToken != ""){
					
					//Se a declara��o de vari�vel estiver ativa e for identificada uma vari�vel, incrementa-se o n�mero de vari�veis
					if (identifyToken(newToken, tokens) == CARREGA_VALOR && bDeclaracaoVariavel == true)
						numVariaveis++;
					else{
						// Verifica se a defini��o de par�metro est� ativa, e se sim, insere o pr�prio token como um par�metro
						if (identifyToken(newToken, tokens) == CARREGA_VALOR && bParametro == true)
							tokens.push([newToken, PARAMETRO]);
						else{
							//Verifica que tipo de token que � para que caso necess�rio, inicia ou finaliza a declara��o de vari�veis
							switch(identifyToken(newToken, tokens)){
								case ALOCA_ESPACO: bDeclaracaoVariavel = true;	break;
								case INICIO_BLOCO: bDeclaracaoVariavel = false;	break;
							}

							//Verifica se � diferente da defini��o de um tipo de vari�vel
							if (identifyToken(newToken, tokens) != TIPO_VARIAVEL){

								//Verifica se j� tem algum token inserido
								if (tokens.length > 0){
									//Verifica o token anterior
									switch(tokens[tokens.length-1][1]){
										//Se o token anterior for do in�cio do programa n�o faz nada
										case INICIA_PROGRAMA: break;
										//Se o token anterior for diferente do in�cio do programa, insere-o na lista de tokens
										default: tokens.push([newToken, identifyToken(newToken, tokens)]);	break;
									}
								} else
									//Se for o primeiro token a ser inserido, insere-o
									tokens.push([newToken, identifyToken(newToken, tokens)]);
							}							
						}
					}
				}
				i_aux = i;
			}
			if (string.substring(i, i+1) == ")")
				bParametro = false;
		}	
	}

	return tokens;
}