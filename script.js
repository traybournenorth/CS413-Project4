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
            ],
          
          // Checks to see which tiles you can walk on
          // Since it scales had to make it 10 * 12
          collision: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                       1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };

function testCollision( worldX, worldY )
{
    let mapX = Math.floor( worldX / tileSize / SCALE );
    let mapY = Math.floor( worldY / tileSize / SCALE );
    return map.collision[ mapY * map.width + mapX ];
}

/*class Keyboard
{
    constructor()
    {
        this.pressed = {};
    }
    
    watch( el )
    {
        el.addEventListener( 'keydown', (e) => {
            document.innerHTML = "UP PRESSED!";
            this.pressed[e.key] = true;
        } );
        
        el.addEventListener( 'keyup', (e) => {
            this.pressed[e.key] = false;
        } );
    }
}*/

document.body.appendChild(app.view);
//app.view.setAttribute( 'tabindex', 0 );

// load the texture we need
app.loader.add('tileset', '/assets/bunny.png');
app.loader.add('character', '/assets/bunny.png');
app.loader.load((loader, resources) => {
    
    // Uncomment to play sound
    /*const sound = PIXI.sound.Sound.from('/assets/Blue.mp3');
    sound.volume = 0.5;
    sound.play();*/
    
    /*let kb = new Keyboard();
    kb.watch( app.view );*/
    
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
    let character = { x: 0, y: 0, vx: 0, vy: 0 };

    // Listen for frame updates
    app.ticker.add(() => {
        avatar.x = character.x;
        avatar.y = character.y;
        
        character.vy = character.vy + 1;
        character.x += character.vx;

        /*let touchingGround = testCollision( character.x, character.y, tileSize * SCALE * 2 + 1 );*/
        
        if ( character.vy > 0 )
        {
            for ( let index = 0; index < character.vy; index++ )
            {
                let testX1 = character.x;
                let testX2 = character.x + tileSize * SCALE - 1;
                let testY = character.y + tileSize * SCALE * 2;
                
                if ( testCollision( testX1, testY ) || testCollision( testX2, testY ) )
                {
                    character.vy = 0;
                    break;
                }
                
                character.y = character.y + 1;
            }
        }
        
        document.addEventListener('keydown', function(event) 
        {
            // left
            if( event.keyCode == 37 && character.vx == 0 ) 
            {
                character.vx -= 2;
            }
            
            // top
            else if(event.keyCode == 38 && character.vy == 0 ) 
            {
                character.vy -= 2;
            }
            
            // right
            else if( event.keyCode == 39 && character.vx == 0 ) 
            {
                
                character.vx += 2;
                character.x += character.vx;
            }
            
            // bottom
            else if(event.keyCode == 40 && character.vy == 0 ) 
            {
                character.vy += 2;
            }
        });
        
        document.addEventListener('keyup', function(event) 
        {
            // left
            if( event.keyCode == 37 ) 
            {
                character.vx = 0;
            }
            
            // top
            else if( event.keyCode == 38 ) 
            {
                character.vy = 0;
            }
            
            // right
            if( event.keyCode == 39 ) 
            {
                character.vx = 0;
            }
            
            // bottom
            else if(event.keyCode == 40) 
            {
                character.vy = 0;
            }
        });
        
    });
});
