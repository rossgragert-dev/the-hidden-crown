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
function scenePractice(cam,y){
  // Quiet practice lists: sandy surface, timber rail, stone stable wall,
  // hay targets and individual shield banners instead of tournament crowds.
  const gr=g.createLinearGradient(0,0,0,y);
  gr.addColorStop(0,'#6596be');gr.addColorStop(.62,'#b4bdac');gr.addColorStop(1,'#d5ba89');
  g.fillStyle=gr;g.fillRect(0,0,W,H);
  R(0,y,W,H-y,'#a99879');
  for(let k=-1;k<11;k++){
    const x=k*112-cam*.2;
    R(x,y-138,104,138,'#7a7b75');
    R(x+4,y-134,96,130,'#b1a28d');
    R(x+11,y-113,78,4,'#756f6e');
    for(let j=0;j<5;j++)R(x+12+j*16,y-108,12,37,'#777a79');
    R(x+6,y-11,94,10,'#625b55');
  }
  for(let i=Math.floor(cam/191)-1;i<=Math.ceil((cam+W)/191)+1;i++){
    const x=i*191-cam;
    R(x+24,y-38,113,5,'#946e49');R(x+27,y-34,110,2,'#e5c18a');
    for(let j=0;j<4;j++){
      R(x+28+j*33,y-35,6,35,'#755139');
      R(x+30+j*33,y-33,2,29,'#c39c69');
      R(x+23+j*33,y-6,14,5,'rgba(36,22,17,.18)');
    }
    R(x+64,y-74,4,35,'#765437');
    R(x+58,y-78,16,7,'#d8b77e');
    R(x+62,y-86,8,8,'#9b6d39');
    R(x+5,y-65,2,34,'#96734f');
    R(x+7,y-65,26,17,(i%2)?'#3c5f83':'#9d6844');
    R(x+11,y-63,16,2,'#c5b88b');
  }
  R(0,y-5,W,5,'#e4c99b');
  for(let i=0;i<W;i+=23){const x=i-(cam%23);R(x,y-3,13,1,'#b69870');R(x+5,y+2,3,1,'#8e7d65');}
}
function sceneRangerRange(cam,y){
  const first=Math.floor(cam/204)-1,last=Math.ceil((cam+W)/204)+1;
  for(let i=first;i<=last;i++){
    const x=i*204-cam;
    // Scattered stone and timber huts, outer range wall and rope lines.
    R(x+21,y-52,125,50,'#807d70');
    R(x+28,y-57,111,8,'#ac9d7c');
    for(let b=0;b<6;b++){
      R(x+30+b*18,y-43,16,28,'#a4a18a');
      R(x+33+b*18,y-41,7,1,'#e2d3b1');
    }
    R(x+20,y-54,4,52,'#544c44');
    R(x+142,y-55,4,53,'#544c44');
    R(x+36,y-4,95,3,'rgba(34,29,25,.3)');
    // Hay and practice bows hang from an intermittent rack.
    if(i%2===0){
      R(x+160,y-37,30,24,'#b79552');
      R(x+162,y-41,26,5,'#e2c77e');
      for(let k=0;k<6;k++){R(x+160+k*5,y-34,3,22,k%2?'#927144':'#cead6d');}
    }else{
      R(x+165,y-58,5,58,'#75563b');R(x+176,y-54,5,54,'#725339');
      R(x+163,y-58,21,4,'#b59162');
      g.strokeStyle='#e2b984';g.lineWidth=1;g.beginPath();g.arc(x+175,y-38,10,1.45,4.9);g.stroke();
    }
  }
}
function sceneMysticGrove(cam,y){
  // Ancient arch behind Ione's magic crossing and winding luminous garden.
  const x=797-cam;
  if(x>W+150||x+350<-150)return;
  R(x+10,y-91,11,91,'#697b75');
  R(x+318,y-103,11,103,'#697b75');
  R(x+11,y-102,317,10,'#a0b1a4');
  for(let k=0;k<12;k++){
    const xx=x+20+k*24;
    R(xx,y-99,21,5,k%2?'#8e9d95':'#c1c0ad');
    R(xx+2,y-96,7,2,'#d2d9c3');
  }
  for(let k=0;k<19;k++){
    const xx=x+18+k*17,yy=y-110-(k%4)*7;
    R(xx,yy,7,4,k%2?'#4e8b67':'#2c674d');
    R(xx+3,yy-3,4,3,'#a9bd82');
  }
  for(let i=0;i<5;i++){
    const xx=x+49+i*54;
    R(xx,y-25,31,21,'#677f65');R(xx+2,y-28,25,5,'#a9ad79');
    R(xx+9,y-41,5,18,'#638b66');
    R(xx+4,y-44,17,4,i%2?'#bfa7d1':'#e3d38d');
    R(xx+12,y-47,6,3,'#f1edd0');
    R(xx+17,y-4,8,2,'rgba(31,19,29,.24)');
  }
  worldGlow(x+166,y-87,74,'rgba(166,231,176,.17)');
  R(x+159,y-99,18,32,'#7b8e86');
  R(x+164,y-106,8,10,'#e1dbab');
  R(x+167,y-104,3,7,'#fcf4bd');
}
