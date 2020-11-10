//var fishka = 0; //"fishka" AkA token

const c = document.getElementById('canvas1');
const ctx = c.getContext("2d");

const worldmap = new Image();
worldmap.src = 'worldmap7.jpg'; 
worldmap.onload = () => { 
	ctx.drawImage(worldmap, 0, 0, c.width, c.height); 
};

var points = [];  //  координаты кругов
var company_owner = [];  //  Владельцы компаний
var company_price = [];  //  Цены компаний
var company_ipt = [];  //  Прибыль за ход с компаний
var company_rent_price = [];  //  Цены аренды компаний
var tokens = [];  //  номер и позиция фишек
var bankrupt = [];
var cur_token = 0;  //  номер фишки, которая ходит сейчас
var credits = [1000, 1000, 1000];  //  Счета игроков
const rollDicePrice = 200;

function clearRectDrawBackground() {
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.beginPath(); 
	ctx.globalCompositeOperation = "source-over"; 
	ctx.globalAlpha = 1; 
	ctx.drawImage(worldmap, 0, 0, c.width, c.height);
	ctx.closePath();
}

window.onload = () => {
	initialLoad();
	turnbutton.onclick = null;
}

function initialLoad() {
	points = [
		[c.width / 20, c.height / 4],  //  Начальная координата
		
		[c.width / 8, c.height / 4],  //  Канада
		[c.width / 8, c.height / 3],  //  Канада
		[c.width / 5, c.height / 3],  //  Канада
		[c.width / 4, c.height / 2.2],  //  США
		[c.width / 4.5, c.height / 2.1],  //  США
		
		[c.width / 5, c.height / 2.4],  //  США
		[c.width / 7.5, c.height / 2.15],  //  США
		[c.width / 5.5, c.height / 1.9],  //  Мексика
		[c.width / 3.5, c.height / 1.25],  //  Аргентина
		[c.width / 2.8, c.height / 1.48],  //  Бразилия
		
		[c.width / 2.05, c.height / 3.4],  //  Норвегия
		[c.width / 1.95, c.height / 3.3],  //  Швеция
		[c.width / 1.93, c.height / 2.75],  //  Польша
		[c.width / 2.02, c.height / 2.7],  //  Германия
		[c.width / 2.1, c.height / 2.5],  //  Франция
		
		[c.width / 2.1, c.height / 2.1],  //  Алжир
		[c.width / 1.87, c.height / 1.25],  //  ЮАР
		[c.width / 1.7, c.height / 1.9],  //  Саудовская Аравия
		[c.width / 1.7, c.height / 3.2],  //  Россия, Москва
		[c.width / 1.4, c.height / 3],  //  Россия, Новосибирск
		
		[c.width / 1.45, c.height / 1.8],  //  Индия
		[c.width / 1.26, c.height / 2],  //  Китай
		[c.width / 1.24, c.height / 1.85],  //  Тайвань
		[c.width / 1.17, c.height / 2.15],  //  Япония
		[c.width / 1.14, c.height / 1.25]  //  Австралия
	];
	
	tokens = [0, 0, 0];
	cur_token = 0;
	credits = [1000, 1000, 1000];
	
	company_prices = [0,
		100, 100, 100, 200, 100,
		100, 100, 100, 100, 100,
		100, 100, 100, 100, 100,
		100, 100, 300, 100, 100,
		100, 100, 100, 100, 100];
	company_rent_price = [0,
		50, 50, 50, 100, 50,
		50, 50, 50, 50, 50,
		50, 50, 50, 50, 50,
		50, 50, 200, 50, 50];
	company_ipt = [0,
		20, 20, 20, 50, 20,
		20, 20, 20, 20, 20,
		20, 20, 20, 20, 20,
		20, 20, 20, 20, 20,
		20, 20, 20, 50, 20];
	company_owner = [-1,
		-1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1];
	bankrupt = [0, 0, 0];
	
	for (var i = 0; i < points.length; i++) {
		company_prices[i] = Math.floor((Math.random() / 2 + 0.25) * 700);
		company_ipt[i] = Math.floor((Math.random() / 2 + 0.25) * 300);
		company_rent_price[i] = Math.floor((Math.random() / 2 + 0.25) * 700);
	}
	
	for (var i = 0; i < tokens.length; i++)
		document.getElementById('p' + (i + 1) + 'status').innerHTML = "";
	
	turnbutton.onclick = function() {
		rollDice();
	};
	
	clearRectDrawBackground();
	drawAll();
}

function rollDice() {
	clearRectDrawBackground();
	
	income();
	credits[cur_token] -= rollDicePrice;
	bankruptcy();
	if (turnbutton.onclick == null) return;  //  Конец игры
	else if (bankrupt[cur_token] == 1) {
		cur_token = bankrupt.indexOf(0, cur_token + 1);  //  Ищем следующего по порядку хода не обанкротившегося игрока (исключая текущего)
		if (cur_token == -1) cur_token = bankrupt.indexOf(0);
		return;  //  Ходит следующий игрок
	}
	
	tokens[cur_token] += Math.floor(Math.random() * 6 + 1);
	if (tokens[cur_token] >= points.length - 1 || tokens.length <= 1) {
		tokens[cur_token] = points.length - 1;
		endGame(cur_token + 1);
		return;  //  Конец игры
	}
	drawAll();
	
	if (company_owner[tokens[cur_token]] == -1) {
		purchase();
		return;
	}
	else {
		payRent();
		return;
	}
	if (turnbutton.onclick == null) return;  //  Конец игры
	drawAll();

	cur_token = bankrupt.indexOf(0, cur_token + 1);  //  Ищем следующего по порядку хода не обанкротившегося игрока (исключая текущего)
	if (cur_token == -1) cur_token = bankrupt.indexOf(0);
}

function purchase() {
	if (credits[cur_token] < company_prices[tokens[cur_token]]) {
		cur_token = bankrupt.indexOf(0, cur_token + 1);  //  Ищем следующего по порядку хода не обанкротившегося игрока (исключая текущего)
		if (cur_token == -1) cur_token = bankrupt.indexOf(0);
	}
	else {
		turnbutton.onclick = null;
		startbutton.onclick = null;
		
		var b1 = document.createElement("button");
		b1.id = "buyCompanyButton";
		b1.innerHTML = "Купить:<br/>Цена " + company_prices[tokens[cur_token]] +
			"<br/>Прибыль " + company_ipt[tokens[cur_token]] + "<br/>Аренда " + company_rent_price[tokens[cur_token]];
		b1.classList.add("block");
		b1.onclick = function() {
			credits[cur_token] -= company_prices[tokens[cur_token]];
			company_owner[tokens[cur_token]] = cur_token;
			drawAll();
		};
		turnbutton.onclick = function() {
			turnbutton.onclick = function() {
				rollDice();
			};
			startbutton.onclick = function() {
				initialLoad();
			};
			b1.parentElement.removeChild(b1);
			cur_token = bankrupt.indexOf(0, cur_token + 1);  //  Ищем следующего по порядку хода не обанкротившегося игрока (исключая текущего)
			if (cur_token == -1) cur_token = bankrupt.indexOf(0);
		};
		b1.addEventListener('click', turnbutton.onclick);
		document.getElementById('buyButtonDiv').appendChild(b1);
	}
}

function payRent() {
	turnbutton.onclick = null;
	startbutton.onclick = null;
	
	var b1 = document.createElement("button");
	b1.id = "payRentButton";
	b1.innerHTML = "Аренда " + company_rent_price[tokens[cur_token]];
	b1.classList.add("block");
	b1.onclick = function() {
		credits[cur_token] -= company_rent_price[tokens[cur_token]];
		credits[company_owner[tokens[cur_token]]] += company_rent_price[tokens[cur_token]];
		startbutton.onclick = function() {
			initialLoad();
		};
		turnbutton.onclick = function() {
			rollDice();
		};
		b1.parentElement.removeChild(b1);
		drawAll();
		bankruptcy();
		cur_token = bankrupt.indexOf(0, cur_token + 1);  //  Ищем следующего по порядку хода не обанкротившегося игрока (исключая текущего)
		if (cur_token == -1) cur_token = bankrupt.indexOf(0);
	};
	document.getElementById('buyButtonDiv').appendChild(b1);
}

function bankruptcy() {
	if (credits[cur_token] < 0) {
		bankrupt[cur_token] = 1;
			
		for (i = 0; i < company_owner.length; i++)
			if (company_owner[i] == cur_token) company_owner[i] = -1;
		
		document.getElementById('p' + (cur_token + 1) + 'status').innerHTML = "Банкрот";
		drawAll();
		if (bankrupt[0] + bankrupt[1] + bankrupt[2] == bankrupt.length - 1)
			endGame(bankrupt.indexOf(0) + 1);
	}
}

function income() {
	for (i = 0; i < company_owner.length; i++)
		if (company_owner[i] == cur_token) credits[cur_token] += company_ipt[i];
}



function endGame(i) {
	drawAll();
	document.getElementById('p' + i + 'status').innerHTML = "Победитель";
	alert("Поздравляем! Игрок " + i + " победил!");
	turnbutton.onclick = null;
}

function drawAll() {
	for (var i = 0; i < points.length - 1; i++) { 
		drawline(points, i);
	}
	for (var i = 0; i < points.length; i++) { 
		var s = "white";
		switch (company_owner[i]) {
			case 0:
				s = "red";
				break;
			case 1:
				s = "blue";
				break;
			case 2:
				s = "green";
				break;
		}
		drawcircle([points[i][0], points[i][1], c.height / 36], s);
	}
	
	// рисуем фишки
	var radius = c.height / 108;
	var offset = radius * 1.4;
	var token = tokens[0];
	drawcircle([points[token][0], points[token][1] + offset*1.1, radius], "red");
	token = tokens[1];
	drawcircle([points[token][0] + offset, points[token][1] - offset/1.4, radius], "blue");
	token = tokens[2];
	drawcircle([points[token][0] - offset, points[token][1] - offset/1.4, radius], "green");
	
	document.getElementById('p1account').innerHTML = "Игрок 1 (красный): " + credits[0];
	document.getElementById('p2account').innerHTML = "Игрок 2 (синий): " + credits[1];
	document.getElementById('p3account').innerHTML = "Игрок 3 (зелёный): " + credits[2];
}

function drawline(points, i) {
	ctx.beginPath();
	ctx.moveTo(points[i][0], points[i][1]); 
	ctx.lineTo(points[i+1][0], points[i+1][1]);
	ctx.stroke();
	ctx.closePath();
}

function drawcircle(arr, color) {
	ctx.beginPath();
	ctx.arc(arr[0], arr[1], arr[2], 0, 2 * Math.PI, false);
	ctx.save();
	ctx.fillStyle = color;
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

//jQuery programming
/*
$('input:radio').change(function(){
	var f = $(this).parent();
	alert(f);
	//f.('input:radio').prop('checked', false);
	$(this).prop('checked', true);
});
*/