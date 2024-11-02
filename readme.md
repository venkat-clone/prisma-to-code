API Code Generator
A customizable, full-stack code generation tool for rapidly creating CRUD endpoints, validation schemas, and route handlers based on your Prisma models. This generator also includes authorization, API documentation, and client code for consuming the generated APIs, all designed to streamline your backend development.

Features
CRUD Code Generation: Automatically generates controllers with CRUD operations for each Prisma model.
Validation Schemas: Creates Zod validation schemas to ensure robust input validation.
Routing: Auto-generates Express routes for each model, including dynamic filtering and pagination.
Authorization Middleware: Configurable middleware to protect routes based on user roles/permissions.
API Documentation: Generates Swagger/OpenAPI documentation for easy integration and API reference.
Client Code Generation: Automatically generates client code (REST API repository) to simplify frontend integration.
Flexible Filtering: Provides multiple filter utilities for query parameters, supporting complex filtering.
Folder Structure
plaintext
Copy code
.
├── modules
│   └── generated
│       └── codeGenerator.js          # Main generator logic
├── templates
│   ├── crudTemplate.js               # CRUD controller template
│   ├── routeTemplate.js              # Route template with authorization
│   ├── zodTemplate.js                # Validation schema template
│   ├── filterFunctionsTemplate.js    # Filters for queries
├── output                            # Generated output (Controllers, Routes, etc.)
│   ├── controllers
│   ├── routes
│   ├── validation
│   ├── utils
└── README.md                         # Project documentation
Getting Started
Prerequisites
Node.js (v14 or above)
Prisma ORM configured with your database models
Express.js
Installation
Clone the repository and install dependencies:

bash
Copy code
git clone <repository-url>
cd api-code-generator
npm install
Usage
Define Prisma Models: Ensure your models are defined in Prisma schema (e.g., schema.prisma).

Configure Generator:

Specify your Prisma models and enums in codeGenerator.js.
Define the output path where generated files should be saved.
Run Generator: Run the generator script to auto-create controllers, routes, and validation:

bash
Copy code
node modules/generated/codeGenerator.js
Generated Output:

Controllers: Located in /output/controllers
Validation Schemas: Located in /output/validation
Routes: Located in /output/routes
Utilities: Located in /output/utils
Features in Detail
Authorization: Middleware is added to protect routes with role-based access control.
API Documentation: Automatically generated Swagger documentation based on the routes and validation schemas.
Client Code Generation: Generates client-side API calls with support for GET, POST, PUT, and DELETE operations.
Example
To generate the CRUD code, route, validation schema, and filters for a User model, the generator will create files as follows:

Controller: UserController.js with CRUD functions
Routes: userRoutes.js configured with endpoints and authorization middleware
Validation: UserValidation.js with Zod schemas
Client Repository: Ready-to-use client code for the User model’s API.
Configuration
Authorization: Modify roles/permissions directly within the routeTemplate.js and authMiddleware.js as per your requirements.
API Documentation: Customize swaggerConfig.js for additional metadata (e.g., title, version, description).
Contribution
Fork the repo and create a new branch (feature/new-feature).
Make your changes and submit a pull request.
Review and feedback are highly encouraged.
License
MIT License. See LICENSE for more details.