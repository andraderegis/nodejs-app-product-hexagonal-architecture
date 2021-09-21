export interface HttpRequestParams {}

export interface GetProductsHttpRequestParams extends HttpRequestParams {
  id: string;
}

export interface CreateProductHttpRequestParams extends HttpRequestParams {
  name: string;
  price: number;
}
