from locust import HttpUser, task, between

class LibraryStudentUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        # Simulated Login
        response = self.client.post("/api/auth/login/", json={
            "username": "student1",
            "password": "password123"
        })
        self.token = response.json().get('access')
        self.headers = {'Authorization': f'Bearer {self.token}'}

    @task(3)
    def browse_books(self):
        self.client.get("/api/books/", headers=self.headers)

    @task(1)
    def view_leaderboard(self):
        self.client.get("/api/leaderboard/?scope=school", headers=self.headers)

    @task(2)
    def check_my_books(self):
        self.client.get("/api/transactions/", headers=self.headers)

class LibrarianUser(HttpUser):
    wait_time = between(2, 10)

    @task
    def process_loan(self):
        # Simulated librarian scanning a book
        self.client.post("/api/transactions/process-loan/", json={
            "student_qr": "USER-student1-1",
            "book_qr": "BOOK-abc123"
        }, headers=self.headers)
