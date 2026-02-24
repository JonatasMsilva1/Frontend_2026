# Frontend_2026
Repositorio para as atividades de frontend do 3º semestre de ESOFT com o prof Dacio.

<!DOCTYPE HTML>
<html lang="pt-BR>
<head>
 	<meta charset="UTF-8">
	<meta name="viewport" content:="width=device-width, initial-scale=1.0">
	<meta htpp-equiv="X-UA-Compatible" content"IE-edge">
	<title> Portifolio Jonatas </title>
</head>
<style>


	*{
	  font-size:20px;
	}
 
	.cabecalho{
	  color:black;
	{
	
	

	
</style>
<body>

	<div class="cabecalho">
		<h1> Bem Vindos a minha página <h1>
		<p> Portifolio pessoal Jonatas</p>
	</div>
	<nav>
		<a href="#sobre" target="_self">Sobre</a>
		<a href="#projetos" target="_self">Projetos</a>
		<a href="#contatos" target="_self">Contato</a>
	</nav>
        <div id="main">
		<section id="sobre">
			<h4>Sobre mim</h4>
			<p>Eu sou o jonatas programo em html <i>rsrsrs<i>, <del>estou brincando</del></p>
		</section>

		<section id="projetos">
			<h3> Projetos </h3>
			<article>
				<h5>Bob clocks: Uma aventura no código</h5>
				<p> Não pesquise isso </p>
			</article>
		</section>

		<section id="contatos">
			<h2>Contato</h2>
			<form>
				<fieldset>
					<legend> Envie uma Mensagem </legends>
					<lable> Nome </lable>
					<input type="text" id="nome" name="nome"<br><br>
					

					<lable> Gênero </lable>
					<input type="radio" name="gen">Masculino
					<input type="radio" name="gen">Feminino<br><br>


					<lable> Interesses </lable>
					<input type="checkbox"> BBB26
					<input type="checkbox"> PANICO DA BAND <br><br>


					<lable> Linguagens </lable>
					<input list="linguagens" name="linguagem">
					<datalist id="linguagens>
						<option value="java">
						<option value="python">
					</datalist><br><br>

				</fieldset>
			</form>
		</section>		
	</div>

	<footer>
		<h5>Feito com Coração</h5>
		<p> by Jonatas </p>
	</footer>


</body>
</html>
