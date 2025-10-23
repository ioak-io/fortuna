import threading


class TaskRunner:
    """Simple threaded task runner."""

    def run_background(self, target, *args, **kwargs):
        thread = threading.Thread(
            target=target, args=args, kwargs=kwargs, daemon=True)
        thread.start()
        return thread
