from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet, BookViewSet, TransactionViewSet, LeaderboardViewSet,
    QuizViewSet, CompetitionViewSet, RewardViewSet, PurchaseViewSet,
    ProfileView, NameLoginView, SchoolClassViewSet, UserViewSet,
    NewsViewSet
)
from .reports import SchoolReportPDFView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'classes', SchoolClassViewSet)
router.register(r'books', BookViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'leaderboard', LeaderboardViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'competitions', CompetitionViewSet)
router.register(r'rewards', RewardViewSet)
router.register(r'purchases', PurchaseViewSet)
router.register(r'users', UserViewSet, basename='user-management')
router.register(r'news', NewsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', NameLoginView.as_view(), name='token_obtain_pair'), # Override with NameLogin
    path('auth/login-username/', TokenObtainPairView.as_view(), name='token_obtain_pair_original'),
    path('auth/profile/', ProfileView.as_view(), name='token_profile'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('reports/school-pdf/', SchoolReportPDFView.as_view(), name='school_report_pdf'),
]
