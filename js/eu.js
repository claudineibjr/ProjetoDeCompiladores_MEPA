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

		//Verifica se tem um espaço ou vírgula e espaço, caso sim, verifica-se que é um token
		if (string.substring(i, i+1) == " " || string.substring(i, i+2) == ", "	|| string.substring(i, i+1) == "("	|| string.substring(i, i+1) == ")"	){

			//Separa o token
			newToken = string.substring(i_aux, i);
			newToken = newToken.replace(" ", "");

			//Verifica se o último caracter é um ponto e vírgula e então retira-o caso o mesmo exista
			if (newToken.substring(newToken.length, 1) == ";")
				newToken = newToken.replace(";", "");

			//Verifica se o primeiro caracter é um parênteses, o que indica que este token pode ser um parâmetro
			if (newToken.substring(0, 1) == "("){
				newToken = newToken.substring(1);
				bParametro = true;
			}
			if (newToken.substring(0, 1) == ":"){
				newToken = newToken.substring(1);
				newToken = newToken.replace(" ", "");
			}

			//Verifica se o token identificado não são caracteres especiais
			if (newToken != "," && newToken != ":"	&& newToken != "("	&& newToken != ")"){

				//Retira caracteres indesejados, como espaço, vírgula, dois pontos e ponto e vírgula
				newToken = newToken.replace(",", "");	/*newToken = newToken.replace(":", "");*/	newToken = newToken.replace(";", "");	//newToken = newToken.replace("(", "");	newToken = newToken.replace(")", "");
				
				//Se o token não for vazio, manipula-o
				if (newToken != ""){
					
					//Se a declaração de variável estiver ativa e for identificada uma variável, incrementa-se o número de variáveis
					if (identifyToken(newToken, tokens) == CARREGA_VALOR && bDeclaracaoVariavel == true)
						numVariaveis++;
					else{
						// Verifica se a definição de parâmetro está ativa, e se sim, insere o próprio token como um parâmetro
						if (identifyToken(newToken, tokens) == CARREGA_VALOR && bParametro == true)
							tokens.push([newToken, PARAMETRO]);
						else{
							//Verifica que tipo de token que é para que caso necessário, inicia ou finaliza a declaração de variáveis
							switch(identifyToken(newToken, tokens)){
								case ALOCA_ESPACO: bDeclaracaoVariavel = true;	break;
								case INICIO_BLOCO: bDeclaracaoVariavel = false;	break;
							}

							//Verifica se é diferente da definição de um tipo de variável
							if (identifyToken(newToken, tokens) != TIPO_VARIAVEL){

								//Verifica se já tem algum token inserido
								if (tokens.length > 0){
									//Verifica o token anterior
									switch(tokens[tokens.length-1][1]){
										//Se o token anterior for do início do programa não faz nada
										case INICIA_PROGRAMA: break;
										//Se o token anterior for diferente do início do programa, insere-o na lista de tokens
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