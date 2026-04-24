# Base image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY backend/ /app/

# Expose port
EXPOSE 8080

# Startup: migrate, seed custom schools, then run server on Railway's $PORT
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:${PORT:-8000}"]
