// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({
    width: 400,
    height: 400
});

const tileSize = 16;

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

// load the texture we need
app.loader.add('tileset', '/assets/bunny.png').load((loader, resources) => {
    // Uncomment to play sound
    /*const sound = PIXI.sound.Sound.from('/assets/Blue.mp3');
    sound.volume = 0.5;
    sound.play();*/
    
    let tileTextures = [];
    
    // Loop that slices size of image ( 7 by 11 ) into individual cubes
    for ( let index = 0; index < 7 * 11; index++ )
    {
        let x = index % 7;
        let y = Math.floor( index / 7 );
        tileTextures[index] = new PIXI.Texture( resources.tileset.texture, new PIXI.Rectangle( x * tileSize, y * tileSize, tileSize, tileSize));
    }
    
    const bunny = new PIXI.Sprite(tileTextures[53]);

    // Setup the position of the bunny
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // Add the bunny to the scene we are building
    app.stage.addChild(bunny);

    // Listen for frame updates
    app.ticker.add(() => {
         // each frame we spin the bunny around a bit
        //bunny.rotation += 0.01;
    });
});
