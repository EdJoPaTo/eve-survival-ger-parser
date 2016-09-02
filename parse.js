const fs = require( "fs" );

function save( data ) {
  fs.mkdir( 'output', error => {
    fs.writeFile( 'output/missions.human.json', JSON.stringify( data, null, '  ' ), 'utf8', err => {
      if ( err ) throw err;
      console.log( 'human readable saved!' );
    } );
    fs.writeFile( 'output/missions.json', JSON.stringify( data ), 'utf8', err => {
      if ( err ) throw err;
      console.log( 'minified saved!' );
    } );
  } );
}

function read( callback ) {
  fs.readFile( 'orig.json', 'utf8', ( err, data ) => {
    if ( err ) throw err;
    let json = JSON.parse( data );
    callback( json );
  } );
}

read( olddata => {
  save( olddata.map( oldArrToObj ) );
} );

function oldArrToObj( oldArr ) {
  let obj = {};

  if ( oldArr[ 0 ] ) {
    obj.warn = parseWarning( oldArr[ 0 ] );
  }

  obj.name = {};
  obj.name.en = deescapeStuff( parseName( oldArr[ 1 ] ) );
  obj.name.de = deescapeStuff( parseDeName( oldArr[ 2 ] ) );

  obj.infos = parseInfos( oldArr[ 3 ] );

  let blitz = parseBlitz( oldArr[ 3 ] );
  if ( blitz ) obj.blitz = blitz;

  obj.level = {};
  if ( oldArr[ 4 ] ) obj.level[ 1 ] = parseLevel( oldArr[ 4 ] );
  if ( oldArr[ 5 ] ) obj.level[ 2 ] = parseLevel( oldArr[ 5 ] );
  if ( oldArr[ 6 ] ) obj.level[ 3 ] = parseLevel( oldArr[ 6 ] );
  if ( oldArr[ 7 ] ) obj.level[ 4 ] = parseLevel( oldArr[ 7 ] );
  if ( oldArr[ 8 ] ) obj.level[ 5 ] = parseLevel( oldArr[ 8 ] );

  return obj;
}

function parseWarning( val ) {
  return /fa-warning (\w+)/.exec( val )[ 1 ];
}

function parseName( val ) {
  return val.replace( /<.+>/, '' );
}

function parseDeName( val ) {
  var name = parseName( val );
  if ( !name ) {
    let tmp = /<(\w+)[^>]+>(.+)<\/\1>/.exec( val );
    name = tmp ? parseName( tmp[ 2 ] ) : null;
  }
  return name;
}

function deescapeStuff( val ) {
  return val.replace( /&quot;/g, '"' );
}

function parseInfos( val ) {
  let regex = /<span class='sites-sprites sites-(\w+)' title='[^']+'>[^<]+<\/span>/g;
  let hit;
  let result = [];
  while ( ( hit = regex.exec( val ) ) !== null ) {
    result.push( hit[ 1 ] );
  }
  if ( val.indexOf( 'Courier' ) >= 0 ) {
    result.push( 'courier' );
  }
  return result;
}

function parseBlitz( val ) {
  let result = /'([^']+)'>Blitz/.exec( val );
  return result ? result[ 1 ] : null;
}

function parseLevel( val ) {
  return /'([^']+)'/.exec( val )[ 1 ];
}
