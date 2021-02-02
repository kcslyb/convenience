import request from '../config/axios'

const Resources = (url: string, actions: object = {}) => {
  const resources = {
    get: (id: string) => request.get(`/${url}/${id}`),
    post: (params: object) => request.post(`/${url}`, params),
    put: (params: object) => request.put(`/${url}`, params),
    delete: (id: string) => request.delete(`/${url}/${id}`),
    queryAll: (params: object) => request.get(`/${url}/query`, { params: params }),
    queryPager: (params: object) => request.get(`/${url}/query/pager`, { params: params }),
    queryRelevance: (params: object) => request.get(`/${url}/query/relevance`, { params: params })
  }
  return Object.assign(resources, actions)
}
export default Resources

export const DictApi = Resources('dict', {
  queryByDictGroupLabel: (label: string) => request.get(`/dict/query/${label}`)
})

export const ConvertApi = Resources('convert', {
  queryById: (id: string) => request.get(`/convert/queryById?id=${id}`)
})

export const ProductWorkApi = Resources('productWork', {
  queryById: (id: string) => request.get(`/productWork/queryById?id=${id}`)
})

export const DayLogApi = Resources('dayLog', {
  queryById: (id: string) => request.get(`/dayLog/queryById?id=${id}`),
  queryCount: (params: any) => request.get('/dayLog/query/count', { params: params })
})
export const FileApi = Resources('file', {
  accessFileBase64: (ids: string) => request.post('/file/accessFileBase64', ids)
})
