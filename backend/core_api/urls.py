from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet, BookViewSet, TransactionViewSet, LeaderboardViewSet,
    QuizViewSet, CompetitionViewSet, RewardViewSet, PurchaseViewSet,
    RegisterView, ProfileView
)
from .reports import SchoolReportPDFView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'books', BookViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'leaderboard', LeaderboardViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'competitions', CompetitionViewSet)
router.register(r'rewards', RewardViewSet)
router.register(r'purchases', PurchaseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', RegisterView.as_view(), name='token_register'),
    path('auth/profile/', ProfileView.as_view(), name='token_profile'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('reports/school-pdf/', SchoolReportPDFView.as_view(), name='school_report_pdf'),
]
