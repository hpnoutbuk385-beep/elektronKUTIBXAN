from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from library.models import Transaction, Book
from accounts.models import CustomUser

class SchoolReportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.organization:
            return HttpResponse("Organization not found", status=404)

        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # Title
        p.setFont("Helvetica-Bold", 20)
        p.drawString(100, height - 100, f"Kutubxona Hisoboti: {user.organization.name}")
        
        p.setFont("Helvetica", 12)
        p.drawString(100, height - 130, f"Sana: {request.GET.get('date', 'Bugun')}")
        
        # Stats
        total_books = Book.objects.filter(organization=user.organization).count()
        total_loans = Transaction.objects.filter(book__organization=user.organization).count()
        active_loans = Transaction.objects.filter(book__organization=user.organization, status='BORROWED').count()
        
        p.drawString(100, height - 180, f"Jami kitoblar: {total_books}")
        p.drawString(100, height - 200, f"Jami berilgan kitoblar: {total_loans}")
        p.drawString(100, height - 220, f"Ayni paytda o'qilmoqda: {active_loans}")

        # Top Readers Table Header
        p.setFont("Helvetica-Bold", 14)
        p.drawString(100, height - 270, "Eng faol o'quvchilar (Top 10)")
        
        p.setFont("Helvetica", 10)
        y = height - 300
        p.drawString(100, y, "Username")
        p.drawString(300, y, "Ballar")
        p.line(100, y-5, 400, y-5)
        
        # Data
        top_users = CustomUser.objects.filter(organization=user.organization, role='STUDENT').order_by('-points')[:10]
        y -= 20
        for student in top_users:
            p.drawString(100, y, student.username)
            p.drawString(300, y, str(student.points))
            y -= 15
            if y < 100: # Simple page break
                p.showPage()
                y = height - 100

        p.showPage()
        p.save()
        
        buffer.seek(0)
        filename = f"report_{user.organization.name}.pdf"
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
