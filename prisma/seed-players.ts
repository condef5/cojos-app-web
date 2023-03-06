export const textPlayers = `Angel M		5
Anghelo		6
Luis simon		5
Josue		4
Cantaro		5
Jara		6
Amigo de jhoan		5
Fisher		5
Salas		5
Mori		3
Pavel		2
Jheampol		7
Amigo de Ronaldo A.		5
Loloy		5
Jhonatan		3
Gregory		4
Paulo T.		3
Jhil		7
Francis z		5
Luigi Rocha		4
Diego Vega		4
Gala		3
Zalasar		7
Ricardo		7
Martin		4
Davis		5
Alanya		4
Yonil		6
Erick Valdivia		4
Alpaquitay		8
Erick Jr		8
Vladi		5
Luigi alva		6
Mikhail		8
Luis R		6
Jhoan		7
Terry		4
JP		5
Alexis		5
Cato		8
Angel		5
Trejo		6
Sandrito		2
Juan Masgo		9
Ario		7
Kenyi		7
Gorpa		4
Ivan		4
Ronaldo A		5
Ronaldo el bicho		5
Juanecito		7
Luis Daniel		6
Houston go		6
Jheyson go		7
Bruce go		6
Lucho go		6
Piero go		6
Frank		5
George		5
Lucas		5`;

export const players = textPlayers.split("\n").map((player) => {
  const [name, number] = player.split("\t\t");
  return { name, level: Number(number) };
});
