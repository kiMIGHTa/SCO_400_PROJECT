# SCO_400_PROJECT

## System Requirements
- Python 3.8+ (Backend)
- Node.js 16+ (Frontend)
- PostgreSQL 12+ (Database)
- Git (Version Control)

## 1. Backend Setup (Django)

### Installation
```bash
# Clone repository
git clone https://github.com/your-repo/mpishi.git

# Create virtual environment
python -m venv venv

# Activate environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
cd mpishi/CORE
pip install -r requirements.txt

#run server
python manage.py runserver

#install frontend dependencies
cd mpishi/frontend
npm  install .

#run frontend app
npm run dev
