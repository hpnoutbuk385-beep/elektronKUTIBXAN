from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count
from .serializers import *
from accounts.models import Organization, CustomUser, SchoolClass
from library.models import Book, Category, Transaction
from exams.models import Quiz, Question, Attempt
from competitions.models import Competition, Participant
from market.models import Reward, Purchase

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = Organization.objects.all()
        
        # Allow filtering by org_type (e.g. ?org_type=SCHOOL)
        org_type = self.request.query_params.get('org_type')
        if org_type:
            qs = qs.filter(org_type=org_type)
            
        if not user.is_authenticated:
            return qs
        if user.role == 'SUPERADMIN' or user.is_superuser:
            return qs
        return qs.filter(id=user.organization_id)

class SchoolClassViewSet(viewsets.ModelViewSet):
    queryset = SchoolClass.objects.all()
    serializer_class = SchoolClassSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = SchoolClass.objects.all()
        if user.is_superuser or user.role == 'SUPERADMIN':
            return qs
        if user.organization:
            return qs.filter(organization=user.organization)
        return qs.none()

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # HAMMA KITOBNI HAMMAGA KO'RSATAMIZ
        return Book.objects.all()

    @action(detail=False, methods=['get', 'post'], url_path='force-seed')
    def force_seed(self, request):
        """Bazani Nukus va Xo'jayli maktablari bilan to'ldirish"""
        Book.objects.all().delete()
        Organization.objects.all().delete()
        
        # 1. Viloyatni yaratish
        qoraqalpoq_reg = Organization.objects.create(
            name="Qoraqalpog'iston Respublikasi Maktabgacha va maktab ta'limi vazirligi",
            org_type='REGION',
            region_name="Qoraqalpog'iston Resp."
        )
        
        # 2. Nukus shahri bo'limi
        nukus_dist = Organization.objects.create(
            name="Nukus shahri bo'limi",
            org_type='DISTRICT',
            parent=qoraqalpoq_reg,
            district_name="Nukus shahri"
        )
        
        # 3. Xo'jayli tumani bo'limi
        xojayli_dist = Organization.objects.create(
            name="Xo'jayli tumani bo'limi",
            org_type='DISTRICT',
            parent=qoraqalpoq_reg,
            district_name="Xo'jayli tumani"
        )

        # 4. Nukus maktablari (1-60)
        for i in range(1, 61):
            Organization.objects.create(
                name=f"{i}-maktab — Nukus",
                org_type='SCHOOL',
                parent=nukus_dist,
                district_name="Nukus shahri"
            )

        # 5. Xo'jayli maktablari (1-44)
        schools = []
        for i in range(1, 45):
            school = Organization.objects.create(
                name=f"{i}-maktab — Xo'jayli",
                org_type='SCHOOL',
                parent=xojayli_dist,
                district_name="Xo'jayli tumani"
            )
            schools.append(school)
            
        # 5.5 Nukus maktablarini ham listga qo'shish
        for i in range(1, 61):
            school = Organization.objects.get(name=f"{i}-maktab — Nukus")
            schools.append(school)

        # 5.6 Har bir maktab uchun sinflar yaratish
        from accounts.models import SchoolClass
        for school in schools:
            SchoolClass.objects.create(name="5-A", language='kk', organization=school)
            SchoolClass.objects.create(name="6-B", language='uz', organization=school)
            SchoolClass.objects.create(name="11-V", language='ru', organization=school)

        # 5.7 Kategoriyalar yaratish
        from library.models import Category
        cats = ["Badiiy adabiyot", "Ilmiy-ommabop", "Darsliklar", "Psixologiya", "Biznes"]
        cat_objs = []
        for cname in cats:
            cat_objs.append(Category.objects.create(name=cname))

        # 6. Kitoblarni qo'shish
        books_data = [
            {"title": "O'tkan kunlar", "author": "Abdulla Qodiriy", "img": "https://kitobxon.com/img_u/b/887.jpg"},
            {"title": "Mehrobdan chayon", "author": "Abdulla Qodiriy", "img": "https://kitobxon.com/img_u/b/1500.jpg"},
            {"title": "Kecha va kunduz", "author": "Cho'lpon", "img": "https://kitobxon.com/img_u/b/2034.jpg"},
            {"title": "Yulduzli tunlar", "author": "Pirimqul Qodirov", "img": "https://kitobxon.com/img_u/b/2012.jpg"},
            {"title": "Dunyoning ishlari", "author": "O'tkir Hoshimov", "img": "https://kitobxon.com/img_u/b/814.jpg"},
            {"title": "Sariq devni minib", "author": "X. To'xtaboyev", "img": "https://kitobxon.com/img_u/b/263.jpg"},
            {"title": "Atom odatlar", "author": "James Clear", "img": "https://kitobxon.com/img_u/b/6146.jpg"},
            {"title": "Boy ota, kambag'al ota", "author": "Robert Kiyosaki", "img": "https://kitobxon.com/img_u/b/4836.jpg"},
            {"title": "Diqqat", "author": "Cal Newport", "img": "https://kitobxon.com/img_u/b/6169.jpg"},
            {"title": "Psixologiya", "author": "Darslik", "img": "https://kitobxon.com/img_u/b/402.jpg"}
        ]

        for i, b in enumerate(books_data):
            Book.objects.create(
                title=b["title"],
                author=b["author"],
                image=b.get("img", ""),
                organization=qoraqalpoq_reg,
                total_copies=10,
                available_copies=10,
                qr_code=f"BK-{i}-{timezone.now().timestamp()}"
            )

        return Response({"message": "Nukus va Xo'jayli maktablari (104 ta) va 10 ta kitob muvaffaqiyatli qo'shildi!"})

    @action(detail=False, methods=['post'], url_path='scan-qr')
    def scan_qr(self, request):
        qr_code = request.data.get('qr_code')
        try:
            book = Book.objects.get(qr_code=qr_code)
            serializer = self.get_serializer(book)
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='my-loans')
    def my_loans(self, request):
        loans = Transaction.objects.filter(user=request.user, status='BORROWED')
        serializer = self.get_serializer(loans, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='process_loan')
    def process_loan(self, request):
        """Processes a book loan: Dynamic Student QR + Book ID"""
        qr_string = request.data.get('qr_code')
        book_id = request.data.get('book_id')
        
        try:
            # 1. Identify student from QR
            student = None
            if qr_string.startswith('DYN-'):
                # Dynamic QR: DYN-BASEQR-HASH
                parts = qr_string.split('-')
                if len(parts) == 3:
                    base_qr = parts[1]
                    received_hash = parts[2]
                    student = CustomUser.objects.filter(qr_code=base_qr, role='STUDENT').first()
                    
                    if student:
                        # Verify hash (approximate for the minute)
                        import hashlib
                        import time
                        minute_timestamp = int(time.time() / 120)
                        
                        def verify_hash(ts):
                            hash_input = f"{student.qr_code}{ts}{student.dynamic_qr_secret}"
                            return hashlib.sha256(hash_input.encode()).hexdigest()[:10]
                        
                        # Allow +/- 1 minute for clock drift
                        if received_hash not in [verify_hash(minute_timestamp), verify_hash(minute_timestamp-1), verify_hash(minute_timestamp+1)]:
                            return Response({"error": "QR kod muddati o'tgan yoki noto'g'ri"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Fallback to static QR for testing/demo
                student = CustomUser.objects.filter(qr_code=qr_string, role='STUDENT').first()

            if not student:
                 return Response({"error": "O'quvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)

            # 2. Identify book
            book = Book.objects.get(id=book_id, organization=request.user.organization)
            
            if book.available_copies <= 0:
                return Response({"error": "Kitobning nusxalari tugagan"}, status=status.HTTP_400_BAD_REQUEST)
            
            # 3. Create transaction
            transaction = Transaction.objects.create(
                book=book,
                user=student,
                due_date=timezone.now() + timezone.timedelta(days=14),
                status='BORROWED'
            )
            
            book.available_copies -= 1
            book.save()
            
            return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)
            
        except (CustomUser.DoesNotExist, Book.DoesNotExist):
            return Response({"error": "Ma'lumot topilmadi"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='process-return')
    def process_return(self, request):
        """Processes a return by Book QR"""
        book_qr = request.data.get('book_qr')
        try:
            book = Book.objects.get(qr_code=book_qr)
            transaction = Transaction.objects.filter(book=book, status='BORROWED').latest('borrow_date')
            
            transaction.status = 'RETURNED'
            transaction.return_date = timezone.now()
            
            # Award points logic (Placeholder: 10 points per return)
            transaction.points_earned = 10
            transaction.user.points += 10
            transaction.user.save()
            transaction.save()
            
            book.available_copies += 1
            book.save()
            
            return Response({"message": "Returned successfully", "points": 10})
        except (Book.DoesNotExist, Transaction.DoesNotExist):
            return Response({"error": "Active loan not found for this book"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='digital-loan')
    def digital_loan(self, request):
        """Student borrows a book digitally (no QR needed)"""
        book_id = request.data.get('book_id')
        try:
            book = Book.objects.get(id=book_id)
            
            # Check if user already has this book borrowed
            existing = Transaction.objects.filter(book=book, user=request.user, status='BORROWED').first()
            if existing:
                return Response({"error": "Siz bu kitobni allaqachon ijaraga olgansiz"}, status=status.HTTP_400_BAD_REQUEST)
            
            if book.available_copies <= 0:
                return Response({"error": "Kitobning nusxalari tugagan"}, status=status.HTTP_400_BAD_REQUEST)
            
            transaction = Transaction.objects.create(
                book=book,
                user=request.user,
                due_date=timezone.now() + timezone.timedelta(days=14),
                status='BORROWED'
            )
            
            book.available_copies -= 1
            book.save()
            
            return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)
            
        except Book.DoesNotExist:
            return Response({"error": "Kitob topilmadi"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='digital-return')
    def digital_return(self, request):
        """Student returns a borrowed book digitally"""
        transaction_id = request.data.get('transaction_id')
        try:
            transaction = Transaction.objects.get(id=transaction_id, user=request.user, status='BORROWED')
            
            transaction.status = 'RETURNED'
            transaction.return_date = timezone.now()
            
            # Award points
            transaction.points_earned = 10
            request.user.points += 10
            request.user.save()
            transaction.save()
            
            transaction.book.available_copies += 1
            transaction.book.save()
            
            return Response({"message": "Kitob muvaffaqiyatli qaytarildi!", "points": 10})
        except Transaction.DoesNotExist:
            return Response({"error": "Bu tranzaksiya topilmadi"}, status=status.HTTP_404_NOT_FOUND)

class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """Viewset for regional/district/school level leaderboards"""
    queryset = CustomUser.objects.filter(role='STUDENT').order_by('-points')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        
        # Filter by organization level
        scope = self.request.query_params.get('scope', 'school') # school, district, region
        
        if scope == 'school':
            return qs.filter(organization=user.organization)
        elif scope == 'district':
            return qs.filter(organization__parent=user.organization.parent)
        
        return qs

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk=None):
        """Submit answers: {answers: {question_id: 'A', ...}}"""
        quiz = self.get_object()
        answers = request.data.get('answers', {})
        correct_count = 0
        total_points = 0
        
        for q in quiz.questions.all():
            if answers.get(str(q.id)) == q.correct_answer:
                correct_count += 1
                total_points += q.points_value
        
        score_percent = (correct_count / quiz.questions.count()) * 100
        is_passed = score_percent >= quiz.passing_score
        
        attempt = Attempt.objects.create(
            user=request.user,
            quiz=quiz,
            score=score_percent,
            is_passed=is_passed
        )
        
        if is_passed:
            request.user.points += total_points
            request.user.save()
            
        return Response({
            "score": score_percent,
            "is_passed": is_passed,
            "points_earned": total_points if is_passed else 0
        })

class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.filter(is_active=True)
    serializer_class = CompetitionSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='register')
    def register(self, request, pk=None):
        comp = self.get_object()
        participant, created = Participant.objects.get_or_create(user=request.user, competition=comp)
        if not created:
            return Response({"message": "Already registered"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Registered successfully"})

class RewardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Reward.objects.filter(is_active=True, stock__gt=0)
    serializer_class = RewardSerializer
    permission_classes = [permissions.IsAuthenticated]

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        reward_id = request.data.get('reward')
        try:
            reward = Reward.objects.get(id=reward_id, is_active=True)
            if reward.stock <= 0:
                return Response({"error": "Out of stock"}, status=status.HTTP_400_BAD_REQUEST)
            
            if request.user.points < reward.points_cost:
                return Response({"error": "Not enough points"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Logic: Deduct points and decrease stock
            request.user.points -= reward.points_cost
            request.user.save()
            
            reward.stock -= 1
            reward.save()
            
            purchase = Purchase.objects.create(user=request.user, reward=reward)
            return Response(PurchaseSerializer(purchase).data, status=status.HTTP_201_CREATED)
            
        except Reward.DoesNotExist:
            return Response({"error": "Reward not found"}, status=status.HTTP_404_NOT_FOUND)

class HemisMockAuthView(APIView):
    """
    Mock view to simulate an SSO callback from HEMIS.
    In real usage, this would verify an OAuth2 'code' with HEMIS server.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        hemis_user_id = request.data.get('hemis_id') # Simulated external ID
        username = request.data.get('username')
        school_id = request.data.get('school_id')
        
        if not hemis_user_id:
            return Response({"error": "No HEMIS ID provided"}, status=400)
            
        # Logic: Find or Create the student
        user, created = CustomUser.objects.get_or_create(
            username=f"hemis_{hemis_user_id}",
            defaults={
                'email': f"{username}@student.uz",
                'role': 'STUDENT',
                'organization_id': school_id
            }
        )
        
        if created:
            user.set_unusable_password()
            user.save()
            
        # Return JWT token (Simulated)
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
            'is_new': created
        })

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NameLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        password = request.data.get('password')

        if not password:
            return Response({"error": "Parol majburiy"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = None
            if username:
                # Try login by username first
                user = CustomUser.objects.filter(username=username).first()
            
            if not user and first_name and last_name:
                # Fallback to Name + Familya
                user = CustomUser.objects.filter(first_name__iexact=first_name, last_name__iexact=last_name).first()

            if user and user.check_password(password):
                from rest_framework_simplejwt.tokens import RefreshToken
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                })
            else:
                return Response({"error": "Login yoki parol noto'g'ri"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
        data['dynamic_qr'] = request.user.get_dynamic_qr()
        return Response(data)

    @action(detail=False, methods=['get'], url_path='dynamic-qr')
    def dynamic_qr(self, request):
        return Response({"dynamic_qr": request.user.get_dynamic_qr()})
