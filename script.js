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
    
    PIXI.sound.Sound.from(
    {
        url: '/assets/menu.mp3',
        autoPlay: true,
        loop: true,
        volume: 0.5
    });
    
    let tileTextures = [];
    let characterFrames = [];
    
    // Loop that slices size of image ( 7 by 11 ) into individual cubes
    for ( let index = 0; index < 7 * 11; index++ )
    {
        let x = index % 7;
        let y = Math.floor( index / 7 );
        tileTextures[index] = new PIXI.Texture( resources.tileset.texture, new PIXI.Rectangle( x * tileSize, y * tileSize, tileSize, tileSize));
    }
    
    // Loop that slices size of character into individual cubes
    for ( let index = 0; index < 1; index++ )
    {
        characterFrames[index] = new PIXI.Texture( resources.character.texture, new PIXI.Rectangle( index * tileSize, 0, tileSize, tileSize * 2 ) );
    }
    
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
        
        //Left arrow key `press` method
        left.press = () => 
        {
            if ( avatar.position.x > 10 )
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
            avatar.position.vx = 0;
            avatar.position.vy = -2;
        };
        
        up.release = () => 
        {
            avatar.position.vy = 2.0;
            avatar.position.vy = 0;
        };
        
        //Right
        right.press = () => 
        {
            if ( avatar.position.x < 360 )
            {
                avatar.position.vx = 2;
                avatar.position.vy = 0; 
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
            if ( avatar.position.y < 320 )
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
