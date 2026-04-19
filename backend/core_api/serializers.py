from rest_framework import serializers
from accounts.models import Organization, CustomUser
from library.models import Book, Category, Transaction
from exams.models import Quiz, Question, Attempt
from competitions.models import Competition, Participant
from market.models import Reward, Purchase

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'org_type', 'parent', 'region_name', 'district_name']

class UserSerializer(serializers.ModelSerializer):
    organization_name = serializers.ReadOnlyField(source='organization.name')
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'organization', 'organization_name', 'points', 'qr_code', 'phone']

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role', 'organization', 'phone']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'STUDENT'),
            organization=validated_data.get('organization'),
            phone=validated_data.get('phone', '')
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    organization_name = serializers.ReadOnlyField(source='organization.name')

    class Meta:
        model = Book
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'

# Phase 3 Serializers
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = '__all__'

class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = '__all__'

class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = '__all__'

class ParticipantSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    class Meta:
        model = Participant
        fields = '__all__'

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    reward_details = RewardSerializer(source='reward', read_only=True)
    class Meta:
        model = Purchase
        fields = '__all__'
