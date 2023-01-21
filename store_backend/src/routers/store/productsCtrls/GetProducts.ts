import { Status } from '../../../ErrAPI';
import { TyFacets, NextFunction, Request, Response } from '../../../types/general';
import { TyProduct, TmProduct } from '../../../types/store';
import { getQuery } from '../../_functions';

//import ProductsModel from '../../../DB/mongoDB/store/ProductsModel' //mongoDB model
//import ProductsModel from '../../../DB/pgDB/store/ProductsModel' //pgDB model
const ProductsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/ProductsModel`).default;

const GetProducts = async (req: Request, res: Response, next: NextFunction) => {
  const query = getQuery(req.query, TmProduct);
  console.log(query)
  const projection: TyProduct = {};
  const facets: TyFacets = {
    singles: { category_id: 1 },
    arrays: { sizes: 1, colors: 1 },
    dateTrunks: { addDate: 'month' },
    buckets: { price: [0, 10000, 20000, 30000] },
  };
  const respond = await ProductsModel.searchProducts(
    query.search,
    query.props,
    projection,
    query.limit,
    query.page,
    query.sort,
    facets,
  );
  if (respond.results) {
    for (let product of respond.results) {
      //remove props editor shouldn't see
    }
  }
  res.status(Status.OK).send({ ...respond });
};
export default GetProducts;
