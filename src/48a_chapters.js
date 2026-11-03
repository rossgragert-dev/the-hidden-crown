/* ================= OPENING SAGA — DISTINCT LOCATIONS =================
 * Inn, training ring and hidden garden are hand-authored game-scale pixel art,
 * not the legacy repeated tower / generic castle wallpaper.
 */
function sceneInn(cam,y){
  R(0,0,W,H,'#2b2429');
  R(0,0,W,y,'#51423d');
  R(0,y,W,H-y,'#615347');
  // Above the inn's stone ground floor, a timbered upper storeroom.
  for(let row=0;row<Math.ceil(y/17);row++){
    const yy=row*17-4;
    for(let i=Math.floor(cam/51)-2;i<=Math.ceil((cam+W)/51)+2;i++){
      const x=i*51+(row%2)*25-cam,h=worldHash(i,row);
      R(x,yy,50,15,(h%3)===0?'#67605d':(h%3)===1?'#746b64':'#5e5555');
      R(x+3,yy+2,22,1,'rgba(225,204,168,.07)');
    }
  }
  for(let i=Math.floor(cam/162)-1;i<=Math.ceil((cam+W)/162)+1;i++){
    const x=i*162-cam;
    // Oak frame and diagonal braces, with visible foot contact.
    R(x,0,13,y,'#49352d');R(x+4,0,4,y,'#ae845f');
    R(x+147,0,14,y,'#4a382f');R(x+148,0,4,y,'#b18b67');
    R(x+8,24,144,10,'#9c7556');R(x+10,25,140,2,'#deb589');
    g.strokeStyle='#79573e';g.lineWidth=5;g.beginPath();
    g.moveTo(x+15,37);g.lineTo(x+67,10);
    g.moveTo(x+145,37);g.lineTo(x+94,10);g.stroke();
    // A timber shelf with real crockery and different room props.
    if(i%3===0){
      R(x+26,y-127,105,64,'#383237');R(x+30,y-124,97,58,'#5a514e');
      R(x+34,y-91,89,5,'#aa8766');
      for(let j=0;j<7;j++){
        const xx=x+39+j*12;
        R(xx,y-106,8,12,j%2?'#b7a98e':'#798a8b');
        R(xx+1,y-106,6,2,'#e8d6b2');
      }
      R(x+30,y-58,104,7,'#a47c5c');
      R(x+36,y-46,13,45,'#76573a');R(x+115,y-46,13,45,'#76573a');
      R(x+33,y-4,102,3,'rgba(0,0,0,.3)');
    }else if(i%3===1){
      R(x+35,y-140,94,100,'#322d30');
      R(x+40,y-135,84,89,'#807061');
      R(x+42,y-132,81,7,'#b9a081');
      for(let j=0;j<6;j++){
        R(x+47+j*12,y-91,7,44,'#644c3f');
        R(x+48+j*12,y-87,3,38,'#91745d');
      }
      R(x+50,y-45,67,9,'#9c7c5b');
      R(x+47,y-36,73,32,'#735442');
      R(x+50,y-29,67,3,'#a17a52');
      R(x+57,y-4,59,3,'rgba(0,0,0,.27)');
    }else{
      // Arrival at an inn should read as an inn: a warm fire, benches, food.
      R(x+42,y-91,82,88,'#4d3d3b');
      R(x+50,y-83,64,76,'#282128');
      R(x+63,y-23,39,21,'#a65d28');
      R(x+67,y-25,29,12,'#f5aa47');
      const fl=5+Math.round(Math.sin(S.t*7+i)*4);
      R(x+74,y-28-fl,13,fl+14,'#ffd37b');
      worldGlow(x+81,y-34,65,'rgba(249,160,77,.19)');
      R(x+37,y-20,25,8,'#9c7352');R(x+45,y-12,5,12,'#654c36');
      R(x+110,y-20,24,7,'#917251');R(x+118,y-13,5,13,'#5e4536');
    }
    // Oil lantern and flags; only a few, not repeated at every pixel.
    R(x+138,y-130,3,37,'#a07d55');
    R(x+134,y-141,12,11,'#7c6a53');R(x+137,y-138,6,6,'#e6d291');
    worldGlow(x+140,y-134,35,'rgba(239,185,84,.14)');
  }
  R(0,y-5,W,5,'#958575');R(0,y+2,W,2,'#8c755b');
  for(let x=-(cam%30);x<W;x+=30){
    R(x,y+5,28,15,'#85746a');R(x+2,y+6,13,1,'#a39a85');
  }
}
