import { ENV } from "../config/environment";

/**
 * Builds full API URLs from endpoint paths.
 * Ensures consistent URL construction across all API tests.
 */
export class UrlBuilder {
  /**
   * Build a full API URL
   * @param endpoint - API endpoint path (e.g., "/api/v2/pim/employees")
   * @param params - Optional quesry parameters
   */
  static api(endpoint: string, params?: Record<string, string | number>): string {
    const base = ENV.API_BASE_URL.replace("/web/index.php/api/v2", "");
    const url = new URL(endpoint, base);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Build a full UI URL
   * @param pagePath - Page path (e.g.,"/web/index.php/pim/viewEmployeeList")
   */
  static ui(pagePath: string): string {
    return `${ENV.BASE_URL}${pagePath}`;
  }

  /**
   * OrangeHRM specific page URLs
   */
  static pages = {
    LOGIN: () => UrlBuilder.ui("/web/index.php/auth/login"),
    DASHBOARD: () => UrlBuilder.ui("/web/index.php/dashboard/index"),
    EMPLOYEE_LIST: () => UrlBuilder.ui("/web/index.php/pim/viewEmployeeList"),
    ADD_EMPLOYEE: () => UrlBuilder.ui("/web/index.php/pim/addEmployee"),
    LEAVE_LIST: () => UrlBuilder.ui("/web/index.php/leave/viewLeaveList"),
    APPLY_LEAVE: () => UrlBuilder.ui("/web/index.php/leave/applyLeave"),
    ADMIN_USERS: () => UrlBuilder.ui("/web/index.php/admin/viewSystemUsers"),
    DIRECTORY: () => UrlBuilder.ui("/web/index.php/directory/viewDirectory"),
  };
}
