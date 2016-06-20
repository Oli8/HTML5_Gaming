function init(){
    var stage = new createjs.Stage("canvas");
    var img = {
        ship: 'PNG/playerShip2_red.png',    
        fire: {1: 'PNG/Lasers/laserBlue07.png', 2: 'PNG/Lasers/laserBlue06.png', 3: 'PNG/Lasers/laserBlue16.png', 4: 'PNG/Lasers/laserBlue16.png', 
               enemie: 'PNG/Lasers/laserRed07.png', hit: {blue: 'PNG/Lasers/LaserBlue10.png', red: 'PNG/Lasers/LaserBlue10.png'}},
        rocks: {small: 'PNG/Meteors/meteorBrown_med1.png', big: 'PNG/Meteors/meteorBrown_big3.png'},
        enemies: {0: 'PNG/Enemies/enemyBlue1.png', 1: 'PNG/Enemies/enemyBlue2.png', 2: 'PNG/Enemies/enemyBlue3.png', 3: 'PNG/Enemies/enemyBlue4.png', 4: 'PNG/Enemies/enemyBlue5.png'},
        bosses: {0: 'PNG/Enemies/enemyBlack5.png', 1: 'PNG/Enemies/enemyBlack4.png', 2: 'PNG/Enemies/enemyBlack3.png', 3: 'PNG/Enemies/enemyBlack2.png', 4: 'PNG/Enemies/enemyBlack1.png'}, 
        bonus: {life: 'PNG/Power-ups/pill_red.png', shoot: 'PNG/Power-ups/bolt_bronze.png', points: 'PNG/Power-ups/star_bronze.png', speed: 'PNG/Power-ups/powerupRed_star.png'},
        life: 'PNG/UI/playerLife2_red.png'
    };
    var level = 0;
    //describe game levels
    //text showing current level
    //infinite levels
    //some classes 
    //shoot
    //boss lives indicator
    //shoot anim
    var levels = [
        //{type: img.enemies[0], number: 2, shootY: 100, boss: img.bosses[0], pos: 300},
        new Level(img.enemies[0], 2, img.bosses[0], 300),
        {type: img.enemies[1], number: 3, boss: img.bosses[1], pos: 200},
        {type: img.enemies[2], number: 4, boss: img.bosses[2], pos: 175},
        {type: img.enemies[3], number: 5, boss: img.bosses[3], pos: 150},
        {type: img.enemies[4], number: 5, boss: img.bosses[4], pos: 150}
    ];
    var helpText = "The game consists of five phase, at the end of each\nyou will have to face the boss, you can not let it touch you\nor the game will end.\nUse the arrow key to move,\nthe spacebar to shoot\nand escape to pause.\nHave fun ! :)"; 
    var soundEnable = localStorage.getItem('sound') || 'enable';
    if( localStorage.getItem('highscore') === null) localStorage.setItem('highscore', 0);
    var highscore = JSON.parse(localStorage.getItem('highscore'));
    var paused = false;
    var started = false;
    var canShoot = false;
    var canFire = true;
    var bossArr = [];
    var bossPhase = false;
    var bonusArr = [];
    var pauseWrap = new createjs.Container();
    var startWrap = new createjs.Container();
    var end = false;
    var move = {up: false, right: false, down: false, left: false};
    var levelText;
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    var shootArray = [];
    var enemiesShootArr = [];
    var ennemiesArray = [];
    var livesArray = [];
    
    var enemiesSpeed = 5000;    
    var score = 0;
    var scoreWrap;

    var invicible = false;
    var fireLevel = 1;
    var speed = 7.5;
        
    var ship;

    createjs.Sound.registerSound("img/Bonus/sfx_laser2.ogg", 'laser');
    createjs.Sound.registerSound("img/Bonus/sfx_lose.ogg", 'lose');
    createjs.Sound.registerSound("img/Bonus/sfx_shieldUp.ogg", 'bonus');

    startScreen();

    function start(){
        started = true;
        stage.removeChild(startWrap);
        addShip();
        addEnnemies();
        addLives();
        addScore();
        addLevelText();
        createjs.Ticker.on("tick", tick);
    }

    function startScreen(){
        helpText = new createjs.Text(helpText, '20px RAVIE', 'white');
        helpText.x = 40;
        helpText.y = 200;
        var startText = new createjs.Text('PRESS ENTER TO START', '40px RAVIE', 'white');
        startText.x = 200;
        startText.y = 400;
        var soundEnableText = soundEnable == 'enable' ? 'ON' : 'OFF';
        var soundText = new createjs.Text('SOUND : ' + soundEnableText, '20px RAVIE', 'white');
        soundText.x = 390;
        soundText.y = 500;
        $(document).keydown(function(e){
            if(e.keyCode == 13 && !end && !paused) start();
        });
        startWrap.addChild(helpText, startText, soundText);
        stage.addChild(startWrap);
        $('#canvas').click(function(){
            if(!started){
                localStorage.setItem('sound', soundEnable == 'enable' ? 'disable' : 'enable');
                soundEnable = localStorage.getItem('sound');
                soundEnableText = soundEnable == 'enable' ? 'ON' : 'OFF';
                soundText.text = 'SOUND : ' + soundEnableText;
            }
        });
        createjs.Ticker.addEventListener("tick", stage);
    }
       
    function addShip(){
        ship = new createjs.Bitmap('img/' + img.ship);
        stage.addChild(ship);
        ship.x = 435; 
        ship.y = 650; 
    }

    function addEnnemies(){
        for(var i=0, c=0; i<levels[level].number; i++){
            var ennemie = new createjs.Bitmap('img/' + levels[level].type);
            ennemie.x = levels[level].pos + (i * levels[level].pos);
            ennemie.y = -100;
            ennemie.life = level+1;
            ennemiesArray.push(ennemie);
            stage.addChild(ennemie);
            createjs.Tween.get(ennemie)
            .to({y: 150}, 1000, createjs.Ease.getPowInOut(1))
            .call(function(){
                c++;
                if( c == levels[level].number){
                    canShoot = true;
                    moveEnemies();
                    enemiesShoot();
                }
            });
            createjs.Ticker.setFPS(60);
            createjs.Ticker.addEventListener("tick", stage);
        }
    }

    function addLives(){
        for(var i=0; i<3; i++){
            var life = new createjs.Bitmap('img/' + img.life);
            life.x = 900;
            life.y = 710 - ( i * 40);
            livesArray.push(life);
            stage.addChild(life);
        }
    }

    function addLevelText(){
        levelText = new createjs.Text('Level ' + (level + 1), '40px RAVIE', 'white');
        levelText.x = 20;
        stage.addChild(levelText);
    }

    function addScore(){
        scoreWrap = new createjs.Text('0'.repeat(5 - String(score).length) + score, '40px RAVIE', 'white');
        scoreWrap.x = 800;
        stage.addChild(scoreWrap);
    }

    function addBoss(){
        bossPhase = true;
        var boss = new createjs.Bitmap('img/' + levels[level].boss);
        boss.x = 400;
        boss.y = -100;
        boss.lives = (level + 1) * 3;
        bossArr.push(boss);
        stage.addChild(boss);
        createjs.Tween.get(boss)
        .to({y: 150}, 1000, createjs.Ease.getPowInOut(1))
        .call(function(){
            moveBoss();
            bossShoot();
        });
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", stage);
    }

    function tick(){
        //movement
        if(!paused){
            if(move.up && ship.y > 0 )
                ship.y -= speed;
            if(move.right && ship.x < stage.canvas.width - ship.image.width)
                ship.x += speed;
            if(move.down && ship.y < stage.canvas.height - ship.image.height)
                ship.y += speed;
            if(move.left && ship.x > 0)
                ship.x -= speed;
        }
        //shoot hit enemies
        for(var i=0; i<ennemiesArray.length; i++){
            for(var j=0; j<shootArray.length; j++){
                if(ndgmr.checkPixelCollision(ennemiesArray[i], shootArray[j], 0) && canShoot){
                    ennemiesArray[i].life -= fireLevel == 4 ? 3 : fireLevel;
                    if(ennemiesArray[i].life <= 0){
                        if(Math.random() > 0.8){
                            var bonusTypeArr = ['life', 'shoot', 'points', 'speed'];
                            var bonusType = bonusTypeArr.random();
                            var bonus = new createjs.Bitmap('img/' + img.bonus[bonusType]);
                            bonus.x = ennemiesArray[i].x;
                            bonus.y = ennemiesArray[i].y;
                            bonus.type = bonusType;
                            bonusArr.push(bonus);
                            stage.addChild(bonus);
                            createjs.Tween.get(bonus)
                            .to({y: 800}, ((800 - ennemiesArray[i].y) * (5/4)) + 2000, createjs.Ease.getPowInOut(1));
                            createjs.Ticker.setFPS(60);
                        }
                        stage.removeChild(ennemiesArray[i]);
                        ennemiesArray.splice(i, 1);
                        score += fireLevel == 4 ? (50 * (level + 1)) * 3 : (50 * (level + 1)) * fireLevel; 
                        scoreWrap.text = '0'.repeat(5 - String(score).length) + score;
                    }
                    else
                        ennemiesArray[i].alpha = ennemiesArray[i].life / (level + 1); 
                    stage.removeChild(shootArray[j]);
                    shootArray.splice(j, 1);
                    stage.update();
                }
            }
        }
        //enemies hit ship
        for(var i=0; i<ennemiesArray.length; i++){
            if(ndgmr.checkPixelCollision(ennemiesArray[i], ship, 0) && !invicible){
                stage.removeChild(ennemiesArray[i]);
                ennemiesArray.splice(i, 1);
                stage.removeChild(livesArray[livesArray.length-1]);
                livesArray.splice(livesArray.length - 1, 1);
                if(soundEnable == 'enable'){
                    var sound = createjs.Sound.play('lose');
                    sound.volume = 1;
                }
                stage.update();
                invicible = true;
                ship.alpha = 0.5;
                setTimeout(function(){
                    invicible = false;
                    ship.alpha = 1;
                }, 1000);
                if( livesArray.length === 0)
                    gameOver(0);
            }
        }
        //enemies shoot hit ship
        for(var i=0; i<enemiesShootArr.length; i++){
            if(ndgmr.checkPixelCollision(enemiesShootArr[i], ship, 0) && !invicible){
                stage.removeChild(enemiesShootArr[i]);
                enemiesShootArr.splice(i, 1);
                stage.removeChild(livesArray[livesArray.length-1]);
                livesArray.splice(livesArray.length - 1, 1);
                stage.update();
                if(soundEnable == 'enable'){
                    var sound = createjs.Sound.play('lose');
                    sound.volume = 1;
                }
                invicible = true;
                ship.alpha = 0.5;
                setTimeout(function(){
                    invicible = false;
                    ship.alpha = 1;
                }, 1000);
                if( livesArray.length === 0)
                    gameOver(0);
            }
        }
        //check if all enemies died and if so launch boss
        if(ennemiesArray.length === 0 && !bossPhase && !end){
            bossPhase = true;
            addBoss();
        }
        //ship get bonus
        for(var i=0; i<bonusArr.length; i++){
            if( ndgmr.checkPixelCollision(bonusArr[i], ship, 0)){
                if(soundEnable == 'enable') createjs.Sound.play('bonus');
                doBonus(bonusArr[i].type);
                stage.removeChild(bonusArr[i]);
                bonusArr.splice(i, 1);
                stage.update();
            }
        }

        if(bossPhase){
            //check if boss hit ship
            if( ndgmr.checkPixelCollision(bossArr[bossArr.length - 1], ship, 0) && !invicible)
                gameOver(0);
            //check if shoot hit boss
            for(var i=0; i<shootArray.length; i++){
                if( ndgmr.checkPixelCollision(bossArr[bossArr.length - 1], shootArray[i], 0)){
                    stage.removeChild(shootArray[i]);
                    shootArray.splice(i, 1);
                    stage.update();
                    bossArr[bossArr.length-1].lives -= fireLevel == 4 ? 3 : fireLevel;
                    score += fireLevel == 4 ? (100 * (level + 1)) * 3 : (100 * (level + 1)) * fireLevel;
                    if(bossArr[bossArr.length-1].lives <= 0){ 
                        score += 1000;
                        stage.removeChild(bossArr[bossArr.length - 1]);
                        bossArr.splice(bossArr[bossArr.length - 1], 1);
                        stage.update();
                        bossPhase = false;
                        canShoot = false;
                        level++;
                        levelText.text = 'Level ' + (level + 1);
                        if(level < levels.length)
                            addEnnemies();
                        else
                            gameOver(1);
                    }
                    scoreWrap.text = '0'.repeat(5 - String(score).length) + score;
                }
            }
        }
    }

    function moveEnemies(){
        for(var i=0, c=0, d=ennemiesArray.length; i<ennemiesArray.length; i++){
            createjs.Tween.get(ennemiesArray[i])
            .to({y: Math.floor(Math.random() * 750) + 1, x: Math.floor(Math.random() * 960) + 1}, 2000, createjs.Ease.getPowInOut(1))
            .call(function(){
                c++;
                if(c == d && !bossPhase) moveEnemies();
            });
            createjs.Ticker.setFPS(60);
        }
    }

    function enemiesShoot(){
        for(var i=0, c=0, d=ennemiesArray.length; i<ennemiesArray.length; i++){
                var enemieShoot = new createjs.Bitmap('img/' +img.fire.enemie);
                enemieShoot.rotation = 180;
                enemieShoot.x = ennemiesArray[i].x + (ennemiesArray[i].image.width / 2) + 5;
                enemieShoot.y = ennemiesArray[i].y + 100;
                enemiesShootArr.push(enemieShoot);
                stage.addChild(enemieShoot);
                createjs.Tween.get(enemieShoot)
                .to({y: 800}, ((800 - ennemiesArray[i].y) * (5/4)) + 250, createjs.Ease.getPowInOut(1))
                .call(function(){
                    c++;
                    if(c == d && !bossPhase && !end) enemiesShoot();
                });
                createjs.Ticker.setFPS(60);
        }
    }

    function moveBoss(){
        createjs.Tween.get(bossArr[bossArr.length-1])
        .to({y: Math.floor(Math.random() * 750) + 1, x: Math.floor(Math.random() * 960) + 1}, 1500, createjs.Ease.getPowInOut(1))
        .call(function(){
            if(bossPhase) moveBoss();
        });
        createjs.Ticker.setFPS(60);
    }

    function bossShoot(){
        var dShoot, eShoot;
        var bShoot = new createjs.Bitmap('img/' +img.fire.enemie);
        bShoot.rotation = 180;
        bShoot.x = bossArr[bossArr.length-1].x + (bossArr[bossArr.length-1].image.width / 2) + 5;
        bShoot.y = bossArr[bossArr.length-1].y + 100;
        enemiesShootArr.push(bShoot);
        stage.addChild(bShoot);
        createjs.Tween.get(bShoot)
        .to({y: 800}, ((800 - bossArr[bossArr.length-1].y) * (5/4)) + 150, createjs.Ease.getPowInOut(1))
        .call(function(){
            if(bossPhase && !end) bossShoot();
        });
        if(level == 4){
            dShoot = new createjs.Bitmap('img/' +img.fire.enemie);
            dShoot.rotation = 135;
            dShoot.x = bossArr[bossArr.length-1].x + (bossArr[bossArr.length-1].image.width / 2) + 5;
            dShoot.y = bossArr[bossArr.length-1].y + 100;
            eShoot = new createjs.Bitmap('img/' +img.fire.enemie);
            eShoot.x = bossArr[bossArr.length-1].x + (bossArr[bossArr.length-1].image.width / 2) + 5;
            eShoot.rotation = -135;
            eShoot.y = bossArr[bossArr.length-1].y + 100;
            stage.addChild(dShoot, eShoot);
            enemiesShootArr.push(dShoot, eShoot);
            createjs.Tween.get(dShoot)
            .to({y: dShoot.y+960, x: dShoot.x+960}, 2500, createjs.Ease.getPowInOut(1));
            createjs.Ticker.setFPS(60);
            createjs.Tween.get(eShoot)
            .to({y: eShoot.y+960, x: eShoot.x-960}, 2500, createjs.Ease.getPowInOut(1));
        }
        createjs.Ticker.setFPS(60);
    }

    function doBonus(type){
        if(type == 'life'){
            var life = new createjs.Bitmap('img/' + img.life);
            life.x = 900;
            life.y = 630 + ( (2 - livesArray.length) * 40);
            livesArray.push(life);
            stage.addChild(life);
            stage.update();
        }
        else if(type == 'shoot'){
            if(fireLevel < 4)
                fireLevel++;
        }
        else if(type == 'points'){
            console.log('points bonus');
            score += 1000;
            scoreWrap.text = '0'.repeat(5 - String(score).length) + score;
        }
        else if(type == 'speed' && speed < 20){
            speed *= 1.25;
        }
    }

    function gameOver(win){
        end = true;
        var text, scoreBox, msg, replay;
        msg = win ? 'Congratulations !' : 'Game over';
        if(win) score += 1000 * livesArray.length;
        if( score > highscore ){
            highscore = score;
            localStorage.setItem('highscore', highscore);
        }
        stage.removeAllChildren();
        text = new createjs.Text(msg, '75px RAVIE', 'white');
        text.x = win ? 6 : 225;
        text.y = 200;
        scoreBox = new createjs.Text('0'.repeat(5 - String(score).length) + score +' Points', '75px RAVIE', 'white');
        scoreBox.x = 160;
        scoreBox.y = 310;
        replay = new createjs.Text('Replay', '50px RAVIE', 'white');
        replay.x = 370;
        replay.y = 430;
        var hsText = new createjs.Text("HIGHSCORE : " + highscore, '30px RAVIE', 'white');
        hsText.x = 370;
        hsText.y = 490;
        stage.addChild(text, replay, scoreBox, hsText);
        $('#canvas').click(function(){
            if(end)location.reload();
        });
    }

    function handleKeyDown(e){
        var key = e.keyCode;
        if( key == 38 || key == 90) //up and Z
            move.up = true;
        else if( key == 39 || key == 68) //right and D             
            move.right = true;       
        else if( key == 40 || key == 83) // down and S          
            move.down = true;
        else if( key == 37 || key == 81) // left and Q          
            move.left = true;
        else if( (key == 32 || key == 17) && canShoot && !paused && started){ // space and ctrl
            if(canFire && !end){
                if(soundEnable == 'enable'){
                    var sound = createjs.Sound.play('laser');
                    sound.volume = 0.3;
                }
                var shoot = new createjs.Bitmap('img/' +img.fire[fireLevel]);
                shoot.x = ship.x + (ship.image.width / 2) - (shoot.image.width / 2);
                shoot.y = ship.y - (ship.image.height / 2);
                shootArray.push(shoot);
                stage.addChild(shoot); 
                createjs.Tween.get(shoot)
                .to({y: - 1000}, (ship.y + 1000) * (4/3), createjs.Ease.getPowInOut(1));
                if( fireLevel == 4){
                    var aShoot = new createjs.Bitmap('img/' +img.fire[fireLevel]);
                    aShoot.rotation = 45;
                    aShoot.x = ship.x + (ship.image.width / 2) - (shoot.image.width / 2);
                    aShoot.y = ship.y - (ship.image.height / 2);
                    var zShoot = new createjs.Bitmap('img/' +img.fire[fireLevel]);
                    zShoot.rotation = -45;
                    zShoot.x = ship.x + (ship.image.width / 2) - (shoot.image.width / 2);
                    zShoot.y = ship.y - (ship.image.height / 2);
                    stage.addChild(aShoot, zShoot);
                    shootArray.push(aShoot, zShoot);
                     createjs.Tween.get(aShoot)
                    .to({y: aShoot.y-960, x: aShoot.x+960}, 2500, createjs.Ease.getPowInOut(1));
                    createjs.Ticker.setFPS(60);
                    createjs.Tween.get(zShoot)
                    .to({y: zShoot.y-960, x: zShoot.x-960}, 2500, createjs.Ease.getPowInOut(1));
                }
                createjs.Ticker.setFPS(60);
                canFire = false;
                setTimeout(function(){canFire = true;}, 200);
            }
        }
        else if( key == 80 || key == 27){ // P and escape
            if(!paused){
                $('#canvas').css('animation-iteration-count', '0');
                createjs.Ticker.setPaused(paused = true);
                var pauseText = new createjs.Text('PAUSE', '75px RAVIE', 'white');
                pauseText.x = 340;
                pauseText.y = 300;
                var restart = new createjs.Text('RESTART', '40px RAVIE', 'white');
                restart.x = 380;
                restart.y = 400;
                $('#canvas').click(function(){location.reload();});
                pauseWrap.addChild(pauseText, restart);
                stage.addChild(pauseWrap);
                stage.alpha = 0.5;
            }
            else{
                $('#canvas').css('animation-iteration-count', 'infinite');
                createjs.Ticker.setPaused(paused = false);
                stage.removeChild(pauseWrap);
                stage.alpha = 1;
            }
        }
    }

    function handleKeyUp(e){
        var key = e.keyCode;
        if( key == 38 || key == 90) //up and Z
            move.up = false;
        else if( key == 39 || key == 68) //right and D             
            move.right = false;         
        else if( key == 40 || key == 83) // down and S         
            move.down = false;
        else if( key == 37 || key == 81) // left and Q         
            move.left = false;
    }

}