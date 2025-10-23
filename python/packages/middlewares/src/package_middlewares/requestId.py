from fastapi import Request
import uuid

def request_id(request: Request):
    request.state.id = str(uuid.uuid4())
