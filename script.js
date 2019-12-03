/*  Project 4: The Land Jelly

    Project authors: Jevin Dement ( jdk277@nau.edu ), Joseph Danciu ( jd2279@nau.edu ), Keenan Swanson ( kks279@nau.edu ), 
                     Traybourne North ( tpn26@nau.edu )

	Keyboard movement cite: 
	https://github.com/kittykatattack/learningPixi/blob/master/examples/12_keyboardMovement.html
*/
    
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    width: 400,
    height: 400
});

// TileSize
const tileSize = 16;

const SCALE = 2.5;

// Creates world map
let map = { width: 10, height: 10, 
            tiles: [ 
            // Dark top
            12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
            
            // Door with ground underneath
            12, 12, 35, 12, 12, 12, 12, 12, 50, 12,
            0, 0, 35, 0, 0, 0, 0, 0, 0, 0,
                
            12, 12, 35, 12, 12, 12, 12, 12, 12, 12,
            12, 12, 35, 12, 12, 12, 12, 12, 12, 12,
            12, 12, 35, 12, 41, 12, 12, 36, 12, 12,
            0, 0, 0, 0, 0, 0, 0, 36, 0, 0,
            12, 12, 12, 12, 12, 12, 12, 36, 12, 12,
            12, 12, 12, 12, 12, 12, 12, 36, 12, 12,
                
            // Bottom Floor
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]};

// Creates world map
let mapTwo = { width: 10, height: 10, 
            tiles: [ 
            // Dark top
            12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
            
            // Door with ground underneath
            12, 12, 12, 36, 12, 12, 12, 12, 12, 12,
            0, 0, 0, 36, 0, 0, 0, 0, 0, 0,
                
            12, 12, 12, 36, 12, 12, 12, 12, 12, 12,
            12, 12, 12, 36, 12, 12, 12, 12, 12, 12,
            12, 12, 12, 36, 12, 35, 12, 35, 12, 12,
            0, 0, 0, 0, 0, 35, 0, 35, 0, 0,
            12, 12, 12, 12, 12, 35, 12, 35, 12, 12,
            12, 50, 12, 12, 12, 35, 12, 35, 12, 12,
                
            // Bottom Floor
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]};

var jelly1 = PIXI.Texture.fromFrame("assets/JellyFish1.png");
var jelly2 = PIXI.Texture.fromFrame("assets/JellyFish2.png");
var jelly3 = PIXI.Texture.fromFrame("assets/JellyFish3.png");

//The `keyboard` helper function
function keyboard(keyCode) 
{
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    
    //The `downHandler`
    key.downHandler = event => 
    {
        if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
    }
        
    event.preventDefault();
  };
    
    //The `upHandler`
    key.upHandler = event => 
    {
        if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
    }
        
    event.preventDefault();
  };
    
  //Attach event listeners
  window.addEventListener( "keydown", key.downHandler.bind(key), false );
  window.addEventListener( "keyup", key.upHandler.bind(key), false );
  return key;
}

document.body.appendChild(app.view);

// load the texture we need
app.loader.add('tileset', '/assets/tileset.png');
app.loader.load((loader, resources) => {
    
    PIXI.sound.Sound.from(
    {
        url: 'assets/menu.mp3',
        autoPlay: true,
        volume: 0.5
    });
    
    let tileTextures = [];
    let jellyFrames = [jelly1,jelly2,jelly3];
    
    ////// Menu 
    
    let startGame = new PIXI.Text('Start Game',{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF });
    startGame.position.x = 140;
    startGame.position.y = 140;
    
    var moveFlag = false;
    
    startGame.interactive = true;
    startGame.buttonMode = true;
    startGame.on("mousedown", (event) => 
    {
        moveFlag = true; 
        title.visible = false;
        startGame.visible = false;
        instructions.visible = false;
        credits.visible = false;
    });
    
    let title = new PIXI.Text('The Land Jelly',{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF });
    title.position.x = 140;
    title.position.y = 30;
    
    let instructions = new PIXI.Text('Instructions',{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF });
    instructions.position.x = 140;
    instructions.position.y = 180;
    
    instructions.interactive = true;
    instructions.buttonMode = true;
    instructions.on("mousedown", (event) => 
    {
        startGame.visible = false;
        instructions.visible = false;
        credits.visible = false;
        title.visible = false;
        
        let instructionsText = new PIXI.Text('Use the left, right, up, down arrow keys\nto make your way to each door. Try to\navoid incoming objects / obstacles that\ncould prevent you from winning. Good luck!',{fontFamily : 'Arial', fontSize: 18, fill : 0xFFFFFF });
        instructionsText.position.x = 40;
        instructionsText.position.y = 140;
        
        let backText = new PIXI.Text('Back to menu',{fontFamily : 'Arial', fontSize: 18, fill : 0xFFFFFF });
        backText.position.x = 10;
        backText.position.y = 370;
    
        backText.interactive = true;
        backText.buttonMode = true;
        backText.on("mousedown", (event) => 
        {
            instructionsText.visible = false;
            backText.visible = false;
            title.visible = true;
            startGame.visible = true;
            instructions.visible = true;
            credits.visible = true;
        });
        
        app.stage.addChild( instructionsText );
        app.stage.addChild( backText );
    });
    
    let credits = new PIXI.Text('Credits',{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF });
    credits.position.x = 140;
    credits.position.y = 220;
    
    credits.interactive = true;
    credits.buttonMode = true;
    credits.on("mousedown", (event) => 
    {
        startGame.visible = false;
        instructions.visible = false;
        credits.visible = false;
        title.visible = false;
        
        let creditsText = new PIXI.Text('Game designers: Joseph Danciu, Jevin Dement, \nKeenan Swanson, Traybourne North\n\nEditors: Joseph Danciu, Jevin Dement, Keenan Swanson, \nTraybourne North\n\nProject Manager: Traybourne North\n\nComposer: Traybourne North',{fontFamily : 'Arial', fontSize: 14, fill : 0xFFFFFF });
        creditsText.position.x = 20;
        creditsText.position.y = 120;
        
        let backText = new PIXI.Text('Back to menu',{fontFamily : 'Arial', fontSize: 18, fill : 0xFFFFFF });
        backText.position.x = 10;
        backText.position.y = 370;
    
        backText.interactive = true;
        backText.buttonMode = true;
        backText.on("mousedown", (event) => 
        {
            creditsText.visible = false;
            backText.visible = false;
            title.visible = true;
            startGame.visible = true;
            instructions.visible = true;
            credits.visible = true;
        });
        
        app.stage.addChild( creditsText );
        app.stage.addChild( backText );
    });
    
    let theEnd = new PIXI.Text('You have won!!!',{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF });
    
    theEnd.position.x = 170;
    theEnd.position.y = 140;
                    
    app.stage.addChild( theEnd );
    theEnd.visible = false;
    
    // Loop that slices size of image ( 7 by 11 ) into individual cubes
    for ( let index = 0; index < 7 * 11; index++ )
    {
        let x = index % 7;
        let y = Math.floor( index / 7 );
        tileTextures[index] = new PIXI.Texture( resources.tileset.texture, new PIXI.Rectangle( x * tileSize, y * tileSize, tileSize, tileSize));
    }
    
    const avatar = new PIXI.AnimatedSprite(jellyFrames);
    avatar.animationSpeed = .1;
    avatar.play();
    avatar.scale.x = .9;
    avatar.scale.y = .9;
    
    avatar.position.x = 10;
    avatar.position.y = 320;
    avatar.position.vx = 0;
    avatar.position.vy = 0;
    
    let background = new PIXI.Container();
    
    for ( y = 0; y < map.width; y++ )
    {
        for ( let x = 0; x <map.width; x++ )
        {
            let tile = map.tiles[ y * map.width + x ];
            let sprite = new PIXI.Sprite( tileTextures[ tile ] );
            sprite.x = x * tileSize;
            sprite.y = y * tileSize;
            background.addChild( sprite );
        }
    }
    
    background.scale.x = SCALE;
    background.scale.y = SCALE;
    
    let backgroundTwo = new PIXI.Container();
    
    for ( y = 0; y < mapTwo.width; y++ )
    {
        for ( let x = 0; x < mapTwo.width; x++ )
        {
            let tile = mapTwo.tiles[ y * mapTwo.width + x ];
            let sprite = new PIXI.Sprite( tileTextures[ tile ] );
            sprite.x = x * tileSize;
            sprite.y = y * tileSize;
            backgroundTwo.addChild( sprite );
        }
    }
    
    backgroundTwo.scale.x = SCALE;
    backgroundTwo.scale.y = SCALE;

    // Add background to the scene we are building
    app.stage.addChild( background );
    
    app.stage.addChild( backgroundTwo );
    backgroundTwo.visible = false;
    
    // Add avatar
    app.stage.addChild( avatar );
    
    // Add menu stage
    app.stage.addChild( title );
    app.stage.addChild( startGame );
    app.stage.addChild( instructions );
    app.stage.addChild( credits );
    
    var levelOne = true;
    var levelTwo = false;
    
    function map2()
    {
        background.visible = false;
        backgroundTwo.visible = true;
    }

    // Listen for frame updates
    app.ticker.add(() => {
        
        avatar.position.x += avatar.position.vx;
        avatar.position.y += avatar.position.vy;
        
        //Capture the keyboard arrow keys
        let left = keyboard(37),
            up = keyboard(38),
            right = keyboard(39),
            down = keyboard(40);
        
        // Left number has to be smaller than right
        var doorXBound = avatar.position.x > 310 && avatar.position.x < 320;
        
        // Left number has to be bigger than right 
        var doorYBound = avatar.position.y < 50  && avatar.position.y > 40;
        
        // Left number has to be smaller than right
        var doorXBoundTwo = avatar.position.x > 37 && avatar.position.x < 47;
        
        // Left number has to be bigger than right 
        var doorYBoundTwo = avatar.position.y < 350  && avatar.position.y > 320;
        
        //Left arrow key `press` method
        left.press = () => 
        {
            if ( avatar.position.x > 10 && moveFlag )
            {
                if ( doorXBound && doorYBound && levelOne )
                {
                    avatar.position.x = 0;
                    avatar.position.y = 45;
                    doorXBound = false;
                    doorYBound = false;
                    levelOne = false;
                    map2();
                }
                
                else if ( doorXBoundTwo && doorYBoundTwo && !levelOne )
                {
                    avatar.position.x = 0;
                    avatar.position.y = 45;
                    doorXBoundTwo = false;
                    doorYBoundTwo = false;
                    avatar.visible = false;
                    
                    theEnd.visible = true;
                }
                
                else
                {
                    avatar.position.vx = -2;
                    avatar.position.vy = 0;
                }  
            }
            
            else
            {
                avatar.position.vx = 0;
                avatar.position.vy = 0;
            }
        };
  
        //Left arrow key `release` method
        left.release = () => 
        {
            avatar.position.vx = 0;
            avatar.position.vy = 0;
        };
        
        //Up
        up.press = () => 
        {
            if ( avatar.position.y > 10 && moveFlag )
            {
                if ( doorXBound && doorYBound && levelOne )
                {
                    avatar.position.x = 10;
                    avatar.position.y = 45;
                    doorXBound = false;
                    doorYBound = false;
                    levelOne = false;
                    map2();
                }
                
                else if ( doorXBoundTwo && doorYBoundTwo && !levelOne )
                {
                    doorXBoundTwo = false;
                    doorYBoundTwo = false;
                    avatar.visible = false;
                    
                    theEnd.visible = true;
                }
                
                else
                {
                    avatar.position.vx = 0;
                    avatar.position.vy = -2;
                } 
            }
            
            else
            {
                avatar.position.vx = 0;
                avatar.position.vy = 0;
            }
        };
        
        up.release = () => 
        {
            avatar.position.vy = 2.0;
            avatar.position.vy = 0;
        };
        
        //Right
        right.press = () => 
        {
            if ( avatar.position.x < 360 && moveFlag )
            {
                if ( doorXBound && doorYBound && levelOne )
                {
                    avatar.position.x = 10;
                    avatar.position.y = 45;
                    doorXBound = false;
                    doorYBound = false;
                    levelOne = false;
                    map2();
                }
                
                else if ( doorXBoundTwo && doorYBoundTwo && !levelOne )
                {
                    doorXBoundTwo = false;
                    doorYBoundTwo = false;
                    avatar.visible = false;
                    
                    theEnd.visible = true;
                }
                
                else
                {
                    avatar.position.vx = 2;
                    avatar.position.vy = 0;   
                }  
            }
            
            else
            {
                avatar.position.vx = 0;
                avatar.position.vy = 0;
            }
        };
        
        right.release = () => 
        {
            
            avatar.position.vx = 0;
            avatar.position.vy = 0;
        };
        
        //Down
        down.press = () => 
        {
            if ( avatar.position.y < 320 && moveFlag )
            {
                if ( doorXBound && doorYBound && levelOne )
                {
                    avatar.position.x = 10;
                    avatar.position.y = 45;
                    doorXBound = false;
                    doorYBound = false;
                    levelOne = false;
                    map2();
                }
                
                else if ( doorXBoundTwo && doorYBoundTwo && !levelOne )
                {
                    doorXBoundTwo = false;
                    doorYBoundTwo = false;
                    avatar.visible = false;
                    
                    theEnd.visible = true;
                }
                
                else
                {
                    avatar.position.vx = 0;
                    avatar.position.vy = 2;
                }
            }
            
            else
            {
                avatar.position.vx = 0;
                avatar.position.vy = 0;
            }
        };
        
        down.release = () => 
        {
            avatar.position.vx = 0;
            avatar.position.vy = 0;
        };
    });
});
