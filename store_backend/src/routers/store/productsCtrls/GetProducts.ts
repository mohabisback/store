import { Status } from '../../../ErrAPI';
import { Facets, NextFunction, Request, Response } from '../../../interfaces/general';
import { Product, ProductTemp } from '../../../interfaces/store';
import { getQuery } from '../../_functions';

//import ProductsModel from '../../../DB/mongoDB/store/ProductsModel' //mongoDB model
//import ProductsModel from '../../../DB/pgDB/store/ProductsModel' //pgDB model
const ProductsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/ProductsModel`).default;

const GetProducts = async (req: Request, res: Response, next: NextFunction) => {
  const query = getQuery(req.query, ProductTemp);
  const projection: Product = {}
  const facets: Facets = {
    singles: {category: 1},
    arrays: {sizes: 1, colors: 1},
    dateTrunks: {addDate: 'month'},
    buckets: {price: [0, 10000, 20000, 30000]}
  }
  const respond = await ProductsModel.getAllProducts(query.search, query.props, projection, query.limit, query.page, query.sort, facets);
  if(respond.results){
    for (let product of respond.results) {
      //remove props editor shouldn't see
    }
  }
  res.status(Status.OK).send({ ...respond });
};
export default GetProducts;
