export const textPlayers = `Frank		5
Piero gooo		6
Lucho gooooo		6
Bruce gooo		6
Jheyson gooo		7
Houston goooo		6
Luis Daniel		6
Juanecito		7
Ronaldo el bicho		5
Ronaldo A		5
Ivan		4
Gorpa		4
Kenyi		4
Ario		7
Juan Masgo		9
Sandrito		3
Trejo		6
Cato		8
Angel		5
Alexis		5
Terry		4
JP		5
Jhoan		7
Mikhail		8
Luis R		6
Luigi alva		6
Erick Jr.		8
Vladi		5
Erick Valdivia		4
Alpaquitay		7
Alanya		4
Yonil		6
Ricardo		7
Martin		4
Davis		5
Gala		3
Zalasar		7
Luigi Rocha		4
Diego Vega		4
Jhil		7
Francis z		5
Jhonatan		3
Gregory		4
Paulo T.		3`;

export const players = textPlayers.split("\n").map((player) => {
  const [name, number] = player.split("\t\t");
  return { name, level: Number(number) };
});
