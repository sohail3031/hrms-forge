import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { BaseApiClient, ApiResponse } from "./BaseApiClient";
import { ENV } from "../../config/environment";
import { log } from "../../utils/logger";

interface LoginResponse {
  token: string;
  tokenType: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export class AuthApiClient extends BaseApiClient {
  constructor(context: APIRequestContext) {
    super(context);
  }

  static async create(token?: string): Promise<AuthApiClient> {
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

    return new AuthApiClient(apiContext);
  }

  /**
   * Attempts a REST login via ENV.ENDPOINTS.LOGIN.
   *
   * NOTE: This endpoint has been confirmed (via curl) to return 404 on the
   * public OrangeHRM demo — REST API v2 uses OAuth2, not a username/password
   * JSON login. This method is kept to document and test that behavior
   * (e.g. asserting the endpoint stays 404, or catching if OrangeHRM ever
   * adds a working one). It is NOT a valid way to obtain an authenticated
   * session — use authHelper.ts's authenticateAdmin() for that instead.
   */
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    log.info("Login attempt: " + username);

    const response = await this.post(ENV.ENDPOINTS.LOGIN, { username, password });
    const parsed = await this.parseResponse<LoginResponse>(response);

    if (response.status() === 200) {
      log.info("Login successful: " + username);
    } else {
      log.warn(`Login failed (${response.status()}): ${username}`);
    }

    return parsed;
  }

  /**
   * Attempts login with intentionally invalid credentials, for negative
   * test cases. Returns the raw, unparsed response so tests can assert
   * on exact status codes / error bodies.
   */
  async loginWithInvalidCredentials(username: string, password: string): Promise<APIResponse> {
    log.info("Testing invalid login: " + username);

    return await this.post(ENV.ENDPOINTS.LOGIN, { username, password });
  }

  /**
   * Checks whether a given bearer token is accepted by a protected
   * endpoint. Builds a dedicated request context carrying the token
   * being tested, independent of this client's own context.
   */
  async validateToken(token: string): Promise<boolean> {
    log.info("Validating token...");

    const tempContext = await request.newContext({
      baseURL: ENV.BASE_URL,
      extraHTTPHeaders: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    try {
      const response = await tempContext.get("/web/index.php/api/v2/admin/users?limit=1");
      const isValid = response.status() === 200;

      log.info("Token valid: " + isValid);

      return isValid;
    } finally {
      await tempContext.dispose();
    }
  }
}

export type { LoginResponse, LoginCredentials };
