<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  
</head>
<body>

  <h1>Ghummakad-Niwas</h1>

  <a href="https://airbnb-clone-2-ogpo.onrender.com/">Here is the link to the Site.</a>

  <p>
    A full-stack booking platform.
    This project demonstrates booking logic, payments, role-based authentication,
    and a responsive user interface.
  </p>

  <h2>Overview</h2>
  <p>
    This application allows users to browse listings, make bookings, and manage their properties as hosts.
    It features a complete payment flow using Cashfree, real-time availability checks, and image management
    via Cloudinary.
  </p>

  <h2>Tech Stack</h2>

  <h3>Frontend</h3>
  <ul>
    <li><strong>Framework:</strong> React 19 (Vite)</li>
    <li><strong>Language:</strong> TypeScript</li>
    <li><strong>State Management:</strong> Redux Toolkit and React Context API</li>
    <li><strong>Routing:</strong> React Router 7</li>
    <li><strong>UI Libraries:</strong> Material UI, Mantine UI, TailwindCSS</li>
    <li><strong>Forms:</strong> React Hook Form and Yup Validation</li>
    <li><strong>Maps:</strong> React Leaflet</li>
  </ul>

  <h3>Backend</h3>
  <ul>
    <li><strong>Framework:</strong> Django 5.2</li>
    <li><strong>API:</strong> Django REST Framework (DRF)</li>
    <li><strong>Authentication:</strong> JWT (SimpleJWT) with Custom User Model</li>
    <li><strong>Database:</strong> SQLite (Dev) and PostgreSQL compatible (Prod)</li>
    <li><strong>Documentation:</strong> Swagger and Redoc (drf-spectacular)</li>
    <li><strong>Unit Tests:</strong> Django's standard TestCase and DRF's APITestCase.</li>
  </ul>

  <h3>DevOps and Services</h3>
  <ul>
    <li><strong>Containerization:</strong> Docker and Docker Compose</li>
    <li><strong>Payment Gateway:</strong> Cashfree</li>
    <li><strong>File Storage:</strong> Cloudinary</li>
    <li><strong>Deployment:</strong> Configured for Render</li>
  </ul>

  <h2>Key Features</h2>

  <h3>Authentication and Authorization</h3>
  <ul>
    <li>Secure user registration and login with JWT</li>
    <li>Role-based interaction between Guest and Host</li>
    <li>Password reset functionality</li>
  </ul>

  <h3>Listings Management</h3>
  <ul>
    <li>Create, update, and delete listings</li>
    <li>Multi-step listing creation form</li>
    <li>Cloudinary image upload and management</li>
    <li>Advanced filtering options</li>
  </ul>

  <h3>Booking System</h3>
  <ul>
    <li>Real-time date availability validation</li>
    <li>Prevention of overlapping bookings</li>
    <li>Guest capacity checks</li>
    <li>Dynamic pricing and night calculation</li>
  </ul>

  <h3>Payments</h3>
  <ul>
    <li>Cashfree payment gateway integration</li>
    <li>Secure order creation and webhook handling</li>
    <li>Atomic transactions for payment processing</li>
  </ul>

  <h3>Reviews and Wishlists</h3>
  <ul>
    <li>Users can review listings they have booked</li>
    <li>Wishlist functionality for favorite listings</li>
  </ul>

  <h2>Installation and Setup</h2>

  <h3>Prerequisites</h3>
  <ul>
    <li>Node.js v18 or higher</li>
    <li>Python v3.12 or higher</li>
    <li>Docker (optional)</li>
  </ul>

  <h3>1. Clone the Repository</h3>
  <pre><code>git clone https://github.com/Parpa-123/airbnb-clone.git
cd Ghummakad-Niwas</code></pre>

  <h3>2. Backend Setup</h3>
  <pre><code>cd backend
python -m venv venv

# Activate virtual environment
venv\Scripts\activate        # Windows
source venv/bin/activate    # Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Run Unit Tests
python manage.py test</code></pre>

  <h3>3. Frontend Setup</h3>
  <pre><code>cd frontend
npm install
npm run dev</code></pre>

  <h3>4. Docker Setup (Alternative)</h3>
  <pre><code>docker-compose up --build</code></pre>

  <h2>Environment Variables</h2>

  <p>Create a <code>.env</code> file in the backend directory:</p>

  <pre><code>SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=TEST
CASHFREE_BASE_URL=https://sandbox.cashfree.com/pg

FRONTEND_URL=http://localhost:5173
</code></pre>

  <h2>API Documentation</h2>
  <ul>
    <li>Swagger UI: http://localhost:8000/api/schema/swagger-ui/</li>
    <li>Redoc: http://localhost:8000/api/schema/redoc/</li>
  </ul>

</body>
</html>
