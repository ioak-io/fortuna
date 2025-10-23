import { QueryClient } from "@tanstack/react-query";

// jest.mock("@/lib/shared/env", () => ({
//   env: {
//     NEXT_PUBLIC_API_URL: "http://localhost",
//     NEXT_PUBLIC_APP_ENV: "development"
//   },
// }));

export const queryClient = new QueryClient();

export const setupMocks = () => {
  jest.mock("@/lib/auth/AuthContext", () => ({
    useAuth: () => ({
      httpFetch: jest.fn(),
    }),
  }));

  jest.mock("@/lib/services/domain", () => ({
    createDomainService: () => ({
      search: jest.fn().mockResolvedValue({
        data: [],
        totalPages: 1,
      }),
    }),
  }));

  jest.mock("@/components/ui-library/hooks/useTypedParams", () => ({
    useTypedParams: () => ({
      team: "test-team",
    }),
  }));
};
