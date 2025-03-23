import os
import random
import requests
from django.core.management.base import BaseCommand
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.contrib.auth import get_user_model
from restaurant.models import Restaurant, RestaurantStaff
from food.models import Food

# Sample Kenyan dishes
KENYAN_DISHES = [
    {"name": "Ugali Nyama", "category": "Main Course", "description": "Ugali served with beef stew", "price": 250},
    {"name": "Chapo Beans", "category": "Main Course", "description": "Chapati with fried beans", "price": 2},
    {"name": "Mukimo", "category": "Main Course", "description": "Mashed potatoes, maize, and greens", "price": 300},
    {"name": "Githeri", "category": "Main Course", "description": "Boiled maize and beans", "price": 180},
    {"name": "Pilau", "category": "Main Course", "description": "Spiced rice with beef", "price": 350},
]

# Sample images
RESTAURANT_IMAGE_URLS = [
    "https://source.unsplash.com/400x300/?restaurant,food",
    "https://source.unsplash.com/400x300/?dining",
    "https://source.unsplash.com/400x300/?restaurant-interior"
]

FOOD_IMAGE_URLS = [
    "https://source.unsplash.com/400x300/?food",
    "https://source.unsplash.com/400x300/?meal",
    "https://source.unsplash.com/400x300/?dinner"
]

# Media directory
MEDIA_DIR = "media"
RESTAURANT_IMAGE_DIR = os.path.join(MEDIA_DIR, "restaurant_images")
FOOD_IMAGE_DIR = os.path.join(MEDIA_DIR, "food_images")


def download_image(url, save_path):
    """Downloads an image and saves it to the given path."""
    try:
        response = requests.get(url, stream=True, timeout=5)
        if response.status_code == 200:
            with open(save_path, "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return save_path
    except Exception as e:
        print(f"Failed to download image from {url}: {e}")
    return None


class Command(BaseCommand):
    help = "Populate the database with sample users, restaurants, and food items"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        # Ensure media directories exist
        os.makedirs(RESTAURANT_IMAGE_DIR, exist_ok=True)
        os.makedirs(FOOD_IMAGE_DIR, exist_ok=True)

        self.stdout.write("Creating users...")
        users = [
            User.objects.create_user(email=f"owner{i}@example.com", password="password", has_restaurant=True)
            for i in range(3)
        ] + [
            User.objects.create_user(email=f"staff{i}@example.com", password="password", is_staff=True)
            for i in range(3)
        ] + [
            User.objects.create_user(email=f"user{i}@example.com", password="password")
            for i in range(3)
        ]

        self.stdout.write("Creating restaurants...")
        restaurants = []
        for i in range(3):
            owner = users[i]  # First 3 users are restaurant owners
            image_url = random.choice(RESTAURANT_IMAGE_URLS)
            image_path = os.path.join(RESTAURANT_IMAGE_DIR, f"restaurant_{i}.jpg")
            download_image(image_url, image_path)

            restaurant = Restaurant.objects.create(
                name=f"Restaurant {i+1}",
                description="A great place to eat Kenyan dishes",
                image=f"restaurant_images/restaurant_{i}.jpg",
                owner=owner,
                rating=random.randint(3, 5),
            )
            restaurants.append(restaurant)

        self.stdout.write("Adding staff members...")
        for i in range(3):
            RestaurantStaff.objects.create(
                user=users[i + 3],  # Next 3 users are staff
                restaurant=restaurants[i],
                role=random.choice(["manager", "chef", "cashier"]),
            )

        self.stdout.write("Creating food items...")
        for i, restaurant in enumerate(restaurants):
            for j in range(5):  # Each restaurant gets 5 food items
                dish = random.choice(KENYAN_DISHES)
                image_url = random.choice(FOOD_IMAGE_URLS)
                image_path = os.path.join(FOOD_IMAGE_DIR, f"food_{i}_{j}.jpg")
                download_image(image_url, image_path)

                Food.objects.create(
                    name=dish["name"],
                    price=dish["price"],
                    category=dish["category"],
                    description=dish["description"],
                    image=f"food_images/food_{i}_{j}.jpg",
                    restaurant=restaurant,
                    availability=True,
                )

        self.stdout.write(self.style.SUCCESS("Successfully populated the database!"))
