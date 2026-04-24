from rest_framework import serializers
from accounts.models import Organization, CustomUser, SchoolClass
from library.models import Book, Category, Transaction, News
from exams.models import Quiz, Question, Attempt
from competitions.models import Competition, Participant
from market.models import Reward, Purchase

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'org_type', 'parent', 'region_name', 'district_name']

class SchoolClassSerializer(serializers.ModelSerializer):
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    class Meta:
        model = SchoolClass
        fields = ['id', 'name', 'language', 'language_display', 'organization']

class UserSerializer(serializers.ModelSerializer):
    organization_name = serializers.ReadOnlyField(source='organization.name')
    school_class_details = SchoolClassSerializer(source='school_class', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'role', 'organization', 'organization_name', 
            'school_class', 'school_class_details', 'subject', 'points', 'qr_code', 'phone', 'plain_password'
        ]

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=False, allow_blank=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'role', 'organization', 'school_class', 'subject', 'phone', 'plain_password']

    def create(self, validated_data):
        # Use provided username or auto-generate from Name + Familya
        username = validated_data.get('username')
        if not username:
            first_name = validated_data.get('first_name', '')
            last_name = validated_data.get('last_name', '')
            
            # Create a URL-friendly username
            base_username = f"{first_name.lower()}_{last_name.lower()}"
            if not base_username.strip('_'):
                base_username = validated_data['email'].split('@')[0]
                
            username = base_username
            # Ensure uniqueness
            counter = 1
            while CustomUser.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1

        user = CustomUser.objects.create_user(
            username=username,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'STUDENT'),
            organization=validated_data.get('organization'),
            school_class=validated_data.get('school_class'),
            subject=validated_data.get('subject', ''),
            phone=validated_data.get('phone', ''),
            plain_password=validated_data.get('password')
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

class NewsSerializer(serializers.ModelSerializer):
    organization_name = serializers.ReadOnlyField(source='organization.name')
    class Meta:
        model = News
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    reward_details = RewardSerializer(source='reward', read_only=True)
    class Meta:
        model = Purchase
        fields = '__all__'
