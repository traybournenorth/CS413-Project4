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
app.loader.add('character', '/assets/tileset.png');
app.loader.load((loader, resources) => {
    
    /*PIXI.sound.Sound.from(
    {
        url: 'assets/menu.mp3',
        autoPlay: true,
        volume: 0.5
    });*/
    
    let tileTextures = [];
    //let characterFrames = [];
    
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
        startGame.visible = false;
        instructions.visible = false;
        credits.visible = false;
    });
    
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
            startGame.visible = true;
            instructions.visible = true;
            credits.visible = true;
        });
        
        app.stage.addChild( creditsText );
        app.stage.addChild( backText );
    });
    
    // Loop that slices size of image ( 7 by 11 ) into individual cubes
    for ( let index = 0; index < 7 * 11; index++ )
    {
        let x = index % 7;
        let y = Math.floor( index / 7 );
        tileTextures[index] = new PIXI.Texture( resources.tileset.texture, new PIXI.Rectangle( x * tileSize, y * tileSize, tileSize, tileSize));
    }
    
    // Loop that slices size of character into individual cubes
    /*for ( let index = 0; index < 1; index++ )
    {
        characterFrames[index] = new PIXI.Texture( resources.character.texture, new PIXI.Rectangle( index * tileSize, 0, tileSize, tileSize * 2 ) );
    }*/
    
    // Switch tileTextures to characterFrames once we create avatar spritesheet
    const avatar = new PIXI.Sprite( tileTextures[61]);
    avatar.scale.x = SCALE;
    avatar.scale.y = SCALE;
    
    avatar.position.x = 0;
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

    // Add background to the scene we are building
    app.stage.addChild( background );
    
    // Add avatar
    app.stage.addChild( avatar );
    
    // Add menu stage
    app.stage.addChild( startGame );
    app.stage.addChild( instructions );
    app.stage.addChild( credits );
    
    // Sets position of avatar
    //let character = { x: 0, y: 360, vx: 0, vy: 0 };
    
    // Listen for frame updates
    app.ticker.add(() => {
        
        avatar.position.x += avatar.position.vx;
        avatar.position.y += avatar.position.vy;
        
        //Capture the keyboard arrow keys
        let left = keyboard(37),
            up = keyboard(38),
            right = keyboard(39),
            down = keyboard(40);
        
        // Left number has to smaller than right
        var doorXBound = avatar.position.x > 310 && avatar.position.x < 320;
        var doorYBound = avatar.position.y < 50  && avatar.position.y > 40;
        
        //Left arrow key `press` method
        left.press = () => 
        {
            if ( avatar.position.x > 10 && moveFlag )
            {            
                avatar.position.vx = -2;
                avatar.position.vy = 0;
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
                avatar.position.vx = 0;
                avatar.position.vy = -2;
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
                if ( doorXBound && doorYBound )
                {
                    avatar.position.x = 0;
                    avatar.position.y = 320;
                    doorXBound = false;
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
                avatar.position.vx = 0;
                avatar.position.vy = 2;
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
