FROM python:3.12-slim

# Install Node.js (required for @modelcontextprotocol/server-playwright via npx)
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency file
COPY pyproject.toml .

# Install dependencies
# We use a simple pip install trick to parse pyproject.toml dependencies if possible,
# or we can just manually install the key ones if pip doesn't fully support pyproject without build backend.
# Assuming standard backend like setuptools/hatch/pdm/poetry. 
# BUT `pyproject.toml` shown earlier was simple.
# Let's try installing directly if it's a package, or fallback to manual list if needed.
# For safety, let's extract them or just install expected ones.
# Actually, pip install . works if there is a build system.
# The file had `[project]`.
RUN pip install --no-cache-dir .

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
