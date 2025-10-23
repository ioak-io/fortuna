# Axion Python Middlewares

This package provides a collection of FastAPI middlewares designed for the Axion project, mirroring the functionality of the Node.js middlewares found in `node/packages/middlewares`.

## Middlewares Included:

-   **`auth_stub`**: A development-only authentication stub for local testing.
-   **`error_handler`**: A global exception handler that logs errors and returns standardized JSON error responses.
-   **`jwt`**: Handles JWT verification and decoding, including fetching JWKS (JSON Web Key Set) for secure token validation from Keycloak.
-   **`request_id`**: Assigns a unique request ID to each incoming request.
-   **`tenant_db`**: Extracts tenant and realm information from request headers and JWT claims for multi-tenant database routing and configuration.

## Installation

To install this package, add it to your project's `pyproject.toml` or `requirements.txt`.

```toml
# pyproject.toml
[project]
dependencies = [
    "middlewares",
    # ... other dependencies
]
```

## Usage

Integrate these middlewares into your FastAPI application:

```python
from fastapi import FastAPI
from package_middlewares import auth_stub, error_handler, verify_and_get_claims, request_id, tenant_db

app = FastAPI()

# Add the global exception handler
app.add_exception_handler(Exception, error_handler)

# Example usage of dependencies
@app.get("/secure-data", dependencies=[Depends(verify_and_get_claims), Depends(tenant_db)])
async def get_secure_data(request: Request):
    return {"message": "This is secure data", "claims": request.state.claims, "realm": request.state.realm, "tenant": request.state.tenant}

@app.get("/public-data", dependencies=[Depends(request_id)])
async def get_public_data(request: Request):
    return {"message": "This is public data", "request_id": request.state.id}

# For development with auth stub
@app.get("/dev-data", dependencies=[Depends(auth_stub)])
async def get_dev_data(request: Request):
    return {"message": "Development data", "user": request.state.user}

```
