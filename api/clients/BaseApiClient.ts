import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { ENV } from "../../config/environment";
import { log } from "../../utils/logger";

interface ApiResponse<T> {
  status: number;
  data: T;
  total?: number;
  message?: string;
}

interface RequestOptions {
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
}

interface PaginationParams {
  limit?: number;
  offset?: number;
}

export abstract class BaseApiClient {
  protected readonly context: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(context: APIRequestContext) {
    this.context = context;
    this.baseUrl = ENV.BASE_URL;
  }

  static async create<T extends BaseApiClient>(
    this: new (context: APIRequestContext) => T,
    token?: string
  ): Promise<BaseApiClient> {
    // const client = await AuthApiClient.create(token);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }

    const apiContext = await request.newContext({
      baseURL: ENV.BASE_URL,
      extraHTTPHeaders: headers,
      timeout: ENV.TIMEOUTS.API,
    });

    return new this(apiContext);
  }

  protected async get(endPoint: string, options?: RequestOptions): Promise<APIResponse> {
    log.info("GET " + endPoint);

    const finalUrl = options?.params ? endPoint + this.buildQueryString(options.params) : endPoint;
    const response = await this.context.get(finalUrl, { headers: options?.headers });

    log.info("Response: " + response.status() + " " + finalUrl);

    return response;
  }

  protected async post(
    endPoint: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<APIResponse> {
    log.info("POST " + endPoint);

    if (data) {
      log.debug("Body: " + JSON.stringify(data));
    }

    const response = await this.context.post(endPoint, { data: data, headers: options?.headers });

    log.info("Response: " + response.status() + " " + endPoint);

    return response;
  }

  protected async put(
    endPoint: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<APIResponse> {
    log.info("PUT " + endPoint);

    if (data) {
      log.debug("Body: " + JSON.stringify(data));
    }

    const response = await this.context.put(endPoint, { data: data, headers: options?.headers });

    log.info("Response: " + response.status() + " " + endPoint);

    return response;
  }

  protected async patch(
    endPoint: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<APIResponse> {
    log.info("Patch " + endPoint);

    if (data) {
      log.debug("Body: " + JSON.stringify(data));
    }

    const response = await this.context.patch(endPoint, { data: data, headers: options?.headers });

    log.info("Response: " + response.status() + " " + endPoint);

    return response;
  }

  protected async delete(
    endPoint: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<APIResponse> {
    log.info("Delete " + endPoint);

    if (data) {
      log.debug("Body: " + JSON.stringify(data));
    }

    const response = await this.context.delete(endPoint, { data: data, headers: options?.headers });

    log.info("Response: " + response.status() + " " + endPoint);

    return response;
  }

  protected async parseResponse<T>(response: APIResponse): Promise<ApiResponse<T>> {
    const body = await response.json();

    return {
      status: response.status(),
      data: body.data,
      total: body.meta?.total,
      message: body.error?.message || body.message,
    };
  }

  protected async assertStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    const actualStatus = response.status();

    if (actualStatus !== expectedStatus) {
      const body = await response.text();

      throw new Error(
        "Expected status " +
          expectedStatus +
          " but got " +
          actualStatus +
          "\nResponse body: " +
          body
      );
    }

    log.assert("Status " + expectedStatus + " ✓");
  }

  public async dispose(): Promise<void> {
    await this.context.dispose();

    log.info("API context disposed");
  }

  protected buildQueryString(params: Record<string, string | number>): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, value.toString());
    }

    const queryString = searchParams.toString();

    return queryString ? `?${queryString}` : "";
  }
}

export type { ApiResponse, RequestOptions, PaginationParams };
