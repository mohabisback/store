import c from '../assets/colors'

type s = string
export type TyCs = [s,s,s,s,s,s]
export type TyColor = {name:s, colors:TyCs}
const themeColors:TyColor[] = [
  {name:'default', colors:[c.blue0, c.blue2, c.blue4, c.blue6, c.blue8, c.blue9]},
  {name:'black', colors:[c.black0, c.black2,c.black4, c.black6, c.black8, c.black9]},
  {name:'gray', colors:[c.gray0, c.gray2,c.gray4, c.gray6, c.gray8, c.gray9]},
  {name:'green', colors:[c.green0, c.green2,c.green4, c.green6, c.green8, c.green9]},
  {name:'orange', colors:[c.orange0, c.orange2,c.orange4, c.orange6, c.orange8, c.orange9]},
  {name:'pink', colors:[c.pink0, c.pink2,c.pink4, c.pink6, c.pink8, c.pink9]},
  {name:'cyan', colors:[c.cyan0, c.cyan2,c.cyan4, c.cyan6, c.cyan8, c.cyan9]},
  {name:'violet', colors:[c.violet0, c.violet2,c.violet4, c.violet6, c.violet8, c.violet9]},
  {name:'grape', colors:[c.grape0, c.grape2,c.grape4, c.grape6, c.grape8, c.grape9]},
  {name:'red', colors:[c.red0, c.red2,c.red4, c.red6, c.red8, c.red9]},
  {name:'indigo', colors:[c.indigo0, c.indigo2,c.indigo4, c.indigo6, c.indigo8, c.indigo9]},
  {name:'teal', colors:[c.teal0, c.teal2,c.teal4, c.teal6, c.teal8, c.teal9]},
  {name:'lime', colors:[c.lime0, c.lime2,c.lime4, c.lime6, c.lime8, c.lime9]},
  {name:'yellow', colors:[c.yellow0, c.yellow2,c.yellow4, c.yellow6, c.yellow8, c.yellow9]},
]

export default themeColors