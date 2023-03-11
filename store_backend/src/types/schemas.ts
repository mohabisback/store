//type of any table cell
export type TyCell = {
  name:string,
  type:string,
  required:boolean,
  noRepeat:boolean,
  seeRole: string,
  editRole: string,
}
type TySchemas = {
  products:TyCell[],
  categories:TyCell[],
}
const schemas:TySchemas = {
  products:[
    {name:'title', type:'text', required:true, noRepeat:true, seeRole:'', editRole:'editor'},
    {name:'category_id', type:'number', required:true, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'price', type:'number', required:true, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'discount', type:'number', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'stock', type:'number', required:true, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'maxItems', type:'number', required:false, noRepeat:false, seeRole:'editor', editRole:'editor'},
    {name:'viewsCount', type:'number', required:false, noRepeat:false, seeRole:'editor', editRole:'none'},
    {name:'ordersCount', type:'number', required:false, noRepeat:false, seeRole:'editor', editRole:'none'},
    {name:'keywords', type:'text', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'description', type:'textArea', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image0', type:'image', required:true, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image1', type:'image', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image2', type:'image', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image3', type:'image', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image4', type:'image', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image5', type:'image', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image6', type:'image', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image7', type:'image', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image8', type:'image', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    {name:'image9', type:'image', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    
    {name:'id', type:'number', required:false, noRepeat:true, seeRole:'editor', editRole:'none'},
    {name:'user_id', type:'number', required:false, noRepeat:false, seeRole:'editor', editRole:'none'},
    
    {name:'hidden', type:'boolean', required:false, noRepeat:false, seeRole:'', editRole:'editor'},
    
    {name:'grams', type:'text', required:false, noRepeat:false, seeRole:'none', editRole:'none'},
  ],
  categories:[
    {name:'id', type:'number', required:false, noRepeat:true, seeRole:'editor', editRole:'none'},
    {name:'title', type:'text', required:true, noRepeat:true, seeRole:'', editRole:'editor'},
    {name:'forbidden', type:'boolean', required:false, noRepeat:false, seeRole:'editor', editRole:'editor'},
    {name:'hidden', type:'boolean', required:false, noRepeat:false, seeRole:'editor', editRole:'editor'},
  ],
  
}
export default schemas





//schema of schema tables
const schema_schema:TyCell[] =[
  {name:'name', type:'text', required:true, noRepeat:true, seeRole:'admin', editRole:'admin'},
  {name:'type', type:'text', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
  {name:'required', type:'boolean', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
  {name:'noRepeat', type:'boolean', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
  {name:'seeRole', type:'text', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
  {name:'editRole', type:'text', required:true, noRepeat:false, seeRole:'admin', editRole:'admin'},
]

