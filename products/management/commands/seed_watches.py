"""
Management command to seed the database with sample watch data.
"""

from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = "Seeds the database with sample watch products"

    def handle(self, *args, **options):
        self.stdout.write("Seeding watch data...")

        # Create categories
        categories_data = [
            {
                "name": "Luxury",
                "slug": "luxury",
                "description": "Exquisite timepieces from prestigious watchmakers",
            },
            {
                "name": "Sport",
                "slug": "sport",
                "description": "Durable watches designed for active lifestyles",
            },
            {
                "name": "Casual",
                "slug": "casual",
                "description": "Stylish everyday watches for any occasion",
            },
            {
                "name": "Vintage",
                "slug": "vintage",
                "description": "Classic designs with timeless appeal",
            },
            {
                "name": "Smart",
                "slug": "smart",
                "description": "Connected watches with modern technology",
            },
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data["slug"],
                defaults=cat_data,
            )
            categories[cat_data["slug"]] = category
            if created:
                self.stdout.write(f"  Created category: {category.name}")
            else:
                self.stdout.write(f"  Category exists: {category.name}")

        # Create products
        products_data = [
            # Luxury watches
            {
                "name": "Rolex Submariner Date",
                "slug": "rolex-submariner-date",
                "description": "The Rolex Submariner is the archetypal diver's watch, featuring a unidirectional rotatable bezel and water resistance to 300 meters. A true icon of luxury watchmaking.",
                "price": "14500.00",
                "category": "luxury",
                "brand": "Rolex",
                "sku": "ROL-SUB-001",
                "stock_quantity": 3,
                "is_featured": True,
                "image": "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop",
            },
            {
                "name": "Patek Philippe Nautilus",
                "slug": "patek-philippe-nautilus",
                "description": "The Nautilus is a luxury sports watch with an instantly recognizable porthole-shaped case. Designed by legendary watch designer Gérald Genta.",
                "price": "35000.00",
                "category": "luxury",
                "brand": "Patek Philippe",
                "sku": "PP-NAU-001",
                "stock_quantity": 2,
                "is_featured": True,
                "image": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop",
            },
            {
                "name": "Omega Seamaster Diver 300M",
                "slug": "omega-seamaster-diver-300m",
                "description": "The Seamaster Diver 300M is known for its exceptional water resistance and diving capabilities. Featured in James Bond films.",
                "price": "5200.00",
                "category": "luxury",
                "brand": "Omega",
                "sku": "OMG-SEA-001",
                "stock_quantity": 5,
                "is_featured": False,
                "image": "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600&h=600&fit=crop",
            },
            # Sport watches
            {
                "name": "Garmin Fenix 7",
                "slug": "garmin-fenix-7",
                "description": "The ultimate multisport GPS watch with advanced training features, maps, and long battery life for serious athletes.",
                "price": "699.99",
                "category": "sport",
                "brand": "Garmin",
                "sku": "GAR-FEN-001",
                "stock_quantity": 15,
                "is_featured": True,
                "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
            },
            {
                "name": "TAG Heuer Carrera",
                "slug": "tag-heuer-carrera",
                "description": "A legendary chronograph with motorsport heritage. Combines sporty elegance with precision Swiss engineering.",
                "price": "4950.00",
                "category": "sport",
                "brand": "TAG Heuer",
                "sku": "TAG-CAR-001",
                "stock_quantity": 7,
                "is_featured": False,
                "image": "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop",
            },
            {
                "name": "Casio G-Shock Mudmaster",
                "slug": "casio-g-shock-mudmaster",
                "description": "Built for the toughest conditions with mud resistance, shock resistance, and triple sensor technology.",
                "price": "350.00",
                "category": "sport",
                "brand": "Casio",
                "sku": "CAS-MUD-001",
                "stock_quantity": 20,
                "is_featured": False,
                "image": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&h=600&fit=crop",
            },
            # Casual watches
            {
                "name": "Seiko Presage Cocktail Time",
                "slug": "seiko-presage-cocktail-time",
                "description": "An elegant dress watch with a stunning sunburst dial inspired by cocktails. Japanese craftsmanship at its finest.",
                "price": "450.00",
                "category": "casual",
                "brand": "Seiko",
                "sku": "SEI-COC-001",
                "stock_quantity": 12,
                "is_featured": True,
                "image": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
            },
            {
                "name": "Tissot PRX Powermatic 80",
                "slug": "tissot-prx-powermatic-80",
                "description": "A modern reissue of a 1970s classic. Features an 80-hour power reserve and integrated bracelet design.",
                "price": "675.00",
                "category": "casual",
                "brand": "Tissot",
                "sku": "TIS-PRX-001",
                "stock_quantity": 10,
                "is_featured": False,
                "image": "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop",
            },
            {
                "name": "Hamilton Khaki Field",
                "slug": "hamilton-khaki-field",
                "description": "A military-inspired field watch with rugged reliability. Perfect for everyday adventures.",
                "price": "595.00",
                "category": "casual",
                "brand": "Hamilton",
                "sku": "HAM-KHA-001",
                "stock_quantity": 8,
                "is_featured": False,
                "image": "https://images.unsplash.com/photo-1506193095-80f06c0a483b?w=600&h=600&fit=crop",
            },
            # Vintage watches
            {
                "name": "Orient Bambino",
                "slug": "orient-bambino",
                "description": "A classic dress watch with vintage aesthetics and automatic movement. Exceptional value for money.",
                "price": "275.00",
                "category": "vintage",
                "brand": "Orient",
                "sku": "ORI-BAM-001",
                "stock_quantity": 15,
                "is_featured": False,
                "image": "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=600&h=600&fit=crop",
            },
            {
                "name": "Junghans Max Bill",
                "slug": "junghans-max-bill",
                "description": "Bauhaus design icon. Clean, minimalist aesthetics designed by legendary architect Max Bill.",
                "price": "1095.00",
                "category": "vintage",
                "brand": "Junghans",
                "sku": "JUN-MAX-001",
                "stock_quantity": 6,
                "is_featured": True,
                "image": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&h=600&fit=crop",
            },
            # Smart watches
            {
                "name": "Apple Watch Ultra 2",
                "slug": "apple-watch-ultra-2",
                "description": "The most rugged Apple Watch yet with titanium case, Action button, and all-day battery life.",
                "price": "799.00",
                "category": "smart",
                "brand": "Apple",
                "sku": "APL-ULT-001",
                "stock_quantity": 25,
                "is_featured": True,
                "image": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop",
            },
            {
                "name": "Samsung Galaxy Watch 6 Pro",
                "slug": "samsung-galaxy-watch-6-pro",
                "description": "Premium smartwatch with rotating bezel, advanced health monitoring, and Wear OS.",
                "price": "449.00",
                "category": "smart",
                "brand": "Samsung",
                "sku": "SAM-GW6-001",
                "stock_quantity": 18,
                "is_featured": False,
                "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop",
            },
        ]

        for prod_data in products_data:
            category_slug = prod_data.pop("category")
            product, created = Product.objects.get_or_create(
                slug=prod_data["slug"],
                defaults={
                    **prod_data,
                    "category": categories[category_slug],
                },
            )
            if created:
                self.stdout.write(f"  Created product: {product.name}")
            else:
                self.stdout.write(f"  Product exists: {product.name}")

        self.stdout.write(self.style.SUCCESS("Successfully seeded watch data!"))
