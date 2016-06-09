$(document).keydown(function(e){
        var key = e.keyCode;
        if(key == 38 && ship.y > ship.image.height / 2){
            createjs.Tween.get(ship)
            .to({y: ship.y - 40}, 100, createjs.Ease.getPowInOut(1))
            createjs.Ticker.setFPS(60);
            // createjs.Ticker.addEventListener("tick", stage);
            console.log('up');
        }
        else if(key == 39 && ship.x < stage.canvas.width - ship.image.width - 25){
            createjs.Tween.get(ship)
            .to({x: ship.x + 40}, 100, createjs.Ease.getPowInOut(1))
            createjs.Ticker.setFPS(60);
            // createjs.Ticker.addEventListener("tick", stage);
            console.log('right');
        }
        else if(key == 40 && ship.y < stage.canvas.height - ship.image.height - 30){
            createjs.Tween.get(ship)
            .to({y: ship.y + 40}, 100, createjs.Ease.getPowInOut(1))
            createjs.Ticker.setFPS(60);
            // createjs.Ticker.addEventListener("tick", stage);
            console.log('down ' + ship.y);
        }
        else if(key == 37 && ship.x > 0){
            createjs.Tween.get(ship)
            .to({x: ship.x - 40}, 100, createjs.Ease.getPowInOut(1))
            createjs.Ticker.setFPS(60);
            // createjs.Ticker.addEventListener("tick", stage);
            console.log('left');
        }
        else if(key == 32 && canShoot && !paused){
            var shoot = new createjs.Bitmap('img/' +img.fire[fireLevel]);
            shoot.x = ship.x + (ship.image.width / 2) - (shoot.image.width / 2);
            shoot.y = ship.y - (ship.image.height / 2);
            shootArray.push(shoot);
            stage.addChild(shoot);
            var speed = (ship.y + 1000) * (4/3); 
            createjs.Tween.get(shoot)
            .to({y: - 1000}, speed, createjs.Ease.getPowInOut(1))
            createjs.Ticker.setFPS(60);
            // createjs.Ticker.addEventListener("tick", stage);
            console.log('fire');
        }
        else if(key == 27){
            if(!paused){
                $('#canvas').css('animation-iteration-count', '0');
                createjs.Ticker.setPaused(paused = true);
                var pauseText = new createjs.Text('PAUSE', '75px RAVIE', 'white');
                pauseText.x = 340;
                pauseText.y = 300;
                var restart = new createjs.Text('RESTART', '40px RAVIE', 'white');
                restart.x = 380;
                restart.y = 400;
                $('#canvas').click(function(){location.reload();});;
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
    });