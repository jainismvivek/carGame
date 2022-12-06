		const score = document.querySelector(".score");
		const startScreen = document.querySelector(".startScreen");
		const gameArea = document.querySelector(".gameArea");

		let keys = {ArrowUp:false, ArrowDown:false, ArrowRight:false, ArrowLeft:false};
        let player = {speed:5 , score:0};

		startScreen.addEventListener("click",start);
		document.addEventListener("keydown",pressOn);
		document.addEventListener("keyup",pressOff);

		function moveLines(){
			let lines = document.querySelectorAll(".line")
			lines.forEach(function(item){
				//console.log(item.y);
				if(item.y>1500){
					item.y -=1500;
				}
				item.y +=player.speed
				item.style.top = item.y + "px";


			})
		}
		function iscollide(a,b){
			let aRect = a.getBoundingClientRect();
			let bRect = b.getBoundingClientRect();

			return !(
				(aRect.bottom < bRect.top)||
				(aRect.top > bRect.bottom)||
				(aRect.right < bRect.left)||
				(aRect.left > bRect.right)
				)
		}

		function moveEnemy(car){
			let lines = document.querySelectorAll(".enemy")
			lines.forEach(function(item){
				if(iscollide(car,item)){
					endGame();

				}
 
				if(item.y>1500){
					item.y = -600;
					item.style.left = Math.floor(Math.random()*150)+"px";
				}
				item.y +=player.speed
				item.style.top = item.y + "px";


			})
		}
		function playGame(){
			
			let car = document.querySelector(".car");
			moveLines();
			moveEnemy(car);
			let road = gameArea.getBoundingClientRect();
			if (player.start) {
				if(keys.ArrowUp && player.y>((road.top + 100) * -1)){player.y-=player.speed}
				if(keys.ArrowDown && player.y<road.height-50){player.y+=player.speed}
				console.log('px',player.x, (road.width -50))
				if(keys.ArrowLeft && player.x>0){player.x-=player.speed}
				if(keys.ArrowRight && player.x < (road.width - 50)){player.x+=player.speed}	
				car.style.left = player.x + 'px';
				car.style.top = player.y + 'px';

				window.requestAnimationFrame(playGame);
				player.score++;
				score.innerText = player.score;

			}
		}


		function pressOn(e){
			e.preventDefault();
			keys[e.key] = true;
		}

		function pressOff(e){
			e.preventDefault();
			keys[e.key] = false;
		} 

		function endGame(){
			player.start = false;
			score.innerHTML = "Game Over <br>Score was "+ player.score;
			startScreen.classList.remove('hide');
		}

		function start(){
			startScreen.classList.add('hide');
			gameArea.innerHTML = "";
			player.start = true;
			player.score = 0;
			for(let x =0;x<10;x++){
				let div = document.createElement("div");
				div.classList.add("line");
				div.y = x*150;
				div.style.top = (x*150) +"px";
				gameArea.appendChild(div);
			}
			window.requestAnimationFrame(playGame);
			let car = document.createElement("div");
			const playerCarDiv = document.createElement('div')
			playerCarDiv.className = 'playerCarOuter'
			const playerCarImg = document.createElement('img')
			playerCarImg.setAttribute('src', './assets/player.png')
			playerCarDiv.appendChild(playerCarImg)
			car.appendChild(playerCarDiv)
			car.setAttribute("class","car")
			gameArea.appendChild(car);
			player.x = car.offsetLeft;
			player.y = car.offsetTop;
			console.log(car.offsetTop)
			player.start = true;
			for(let x =0;x<3;x++){
				let enemy = document.createElement("div");
				const enemyCarDiv = document.createElement('div')
			enemyCarDiv.classList.add('enemyCarDiv',`enemyCar${x+1}`)
			const enemyCarImg = document.createElement('img')
				enemyCarImg.setAttribute('src', `./assets/enemyCar${x + 1}.png`)
				enemyCarDiv.appendChild(enemyCarImg)
				enemy.appendChild(enemyCarDiv)
				enemy.classList.add("enemy");
				//enemy.y = Math.floor(Math.random()*500)*-1
				enemy.y = ((x+1)*600)*-1;
				enemy.style.top = enemy.y +"px";
				enemy.style.left = Math.floor(Math.random()*150)+"px";	
				gameArea.appendChild(enemy);
			}
		}

