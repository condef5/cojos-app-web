export const textPlayers = `Jesse		4
Cato		7
Julio Gonzales		3
Bill		3
Joshi		4
Lebuh		5
Conde		4
Alanya		3
Gorpa		3
Giussepe		4
Einstein		4
Johan		6
Andy pena		6
Ivan canta		3
Caruz		6
Erick Valdivia		3
Martin		2
Andy peña		5
Deiby		5
Vicente		3
Mikhail		5
Milo		2
Reynaldo		4
Leon angel		3
Andrade		3
Sandrito		3
Paulo T.		3
Gala		3
Jhonatan		3
Mori		3
Pavel		3
Alfredo f		4
Ivan		4
JP		5
Terry		3
Diego Vega		4
Luigi Rocha		4
Gregory		4
Kenny		5
Pastor go		5
Pastor go		5
johan v		5
Henry		5
Mail go		5
Spectre		5
Ambi suport		5
Cristian		5
Dante		5
Max		5
Fabricio		5
Javier		5
George		4
Ronaldo el bicho		4
Frank		4
Ronaldo A		5
Alexis		5
Angel		5
Davis		5
Vladi		5
Francis z		5
Loloy		5
Fisher		5
Salas		5
Cantaro		5
Angel M		5
Luis simon		5
L Phant(Gaspar)		6
Gaspar		6
Efrain		6
Beraun		5
Piero go		6
Anibal Diaz		6
Bruce go		6
Lucho go		6
Luis Daniel		6
Luis R		5
Trejo		6
Luigi alva		6
Anghelo		6
Jara		6
Yonil		6
Jheampol		7
Maik		7
Jheampol		7
Mario		7
Mario		7
Jheyson go		7
Juanecito		7
Kenyi		7
Jhoan		7
Ario		7
Ricardo		7
Zalasar		7
Jhil		7
Jheampol		7
Erick Jr		8
Alpaquitay		7
Juan Masgo		9`;

export const players = textPlayers.split("\n").map((player) => {
  const [name, number] = player.split("\t\t");
  return { name, level: Number(number) };
});
