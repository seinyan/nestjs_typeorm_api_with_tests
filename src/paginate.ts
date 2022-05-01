import { PaginateResult } from './paginate-result';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { PaginateParams } from './paginate-params';

function paginateOffset(page, limit) {
  let offset = 0;
  if (page > 1) {
    offset = page * limit;
  }

  return offset;
}

export async function Paginate(
  queryBuilder: SelectQueryBuilder<any>,
  params: any,
): Promise<any> {
  const paginateResult: PaginateResult = new PaginateResult();

  // if (!params || Object.keys(params).length === 0) {
  //   params = new PaginateParams();
  // }

  const order = {};
  if (params.order) {
    if (params.order[0].length < 1 || !params.order[0]) {
      params.order[0] = 'id';
    }
    if (params.order[1].length < 1 || !params.order[1]) {
      params.order[1] = 'DESC';
    }
  }
  order[params.order[0]] = params.order[1];

  paginateResult.meta.order = params.order;
  paginateResult.meta.page = parseInt(String(params.page));
  paginateResult.meta.limit = parseInt(String(params.limit));

  const res = await queryBuilder
    .orderBy(order)
    .offset(paginateOffset(params.page, params.limit))
    .limit(params.limit)
    .getManyAndCount();

  paginateResult.items = res[0] || [];
  paginateResult.meta.totalItems = res[1] | 0;
  paginateResult.meta.totalPages =
    Math.ceil(paginateResult.meta.totalItems / params.limit) | 1;
  if (paginateResult.meta.totalItems === 0) {
    paginateResult.meta.totalPages = 0;
  }

  return paginateResult;
}

// sequelize
function paginateUtil(queryParams, { page, limit }) {
  let offset = 0;
  if (page > 1) {
    offset = page * limit;
  }

  return {
    ...queryParams,
    offset,
    limit,
  };
}
