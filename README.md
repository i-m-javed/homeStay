# HomeStay

## Overview

A full-stack web application built with Node.js, Express, and MongoDB that mimics the core functionalities of a property rental marketplace like Airbnb. The platform supports role-based user flows, allowing users to register as either guests or hosts. Guests can browse available homes, manage favorites, make reservations, and book stays. Hosts have full CRUD (Create, Read, Update, Delete) capabilities to manage property listings, including secure image and PDF uploads.

## Features

**Authentication & Authorization**
* User registration and login system with secure password hashing.
* Role-based access control distinguishing between `guest` and `host` accounts.
* Persistent, secure user sessions stored directly in MongoDB.

**Property Management (Hosts)**
* Create, read, update, and delete (CRUD) property listings.
* Secure multipart file uploads for property photos and PDF house rules using Multer.
* Automated cleanup of references (favorites, reserves, bookings) when a property is deleted via Mongoose pre-hooks.

**User Experience (Guests)**
* Browse a catalog of available homes.
* Add or remove homes from a personal "Favorites" list.
* Reserve homes for future dates.
* Finalize bookings for selected properties.
* Clear booking history.

## Screenshots / Demo

*(Add screenshots or GIFs of the application running here)*

* **Home Page:** `[Placeholder for screenshot]`
* **Property Details:** `[Placeholder for screenshot]`
* **Host Dashboard:** `[Placeholder for screenshot]`
* **User Favorites/Bookings:** `[Placeholder for screenshot]`

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication & Sessions** | `bcryptjs`, `express-session`, `connect-mongodb-session` |
| **Templating Engine** | EJS (Embedded JavaScript) |
| **Styling** | Tailwind CSS (v4), PostCSS, Autoprefixer |
| **File Handling** | Multer |
| **Environment Management** | `dotenv` |

## Architecture

The application follows a traditional **MVC (Model-View-Controller)** architecture and relies on Server-Side Rendering (SSR):

1.  **Models (`/models`)**: Defines the Mongoose schemas and database interactions. Includes business logic like cascading deletions to maintain referential integrity.
2.  **Views (`/views`)**: Contains EJS templates that dynamically generate HTML based on the data provided by the controllers.
3.  **Controllers (`/controllers`)**: Handles incoming HTTP requests, interacts with the database via Models, and renders the appropriate Views.
4.  **Routes (`/routes`)**: Maps HTTP methods and endpoint URLs to specific controller functions.

## Project Structure

```text
├── app.js                 # Application entry point and server setup
├── .env                   # Environment variables (PORT, MONGO_URL)
├── package.json           # Dependencies and NPM scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── controllers/           # Route handler logic
│   ├── authController.js
│   ├── hostController.js
│   └── storeController.js
├── models/                # Database schemas
│   ├── home.js            # Home/Property schema
│   └── user.js            # User schema (Guest/Host)
├── routes/                # Express router definitions
│   ├── authRouter.js
│   ├── hostRouter.js
│   └── storeRouter.js
├── views/                 # EJS Templates
│   ├── auth/              # Login, Signup templates
│   ├── host/              # Add, Edit, Delete property templates
│   ├── store/             # Home listings, Bookings, Favorites templates
│   ├── partials/          # Reusable UI components (Navbars, Footers)
│   ├── 404Page.ejs        # Custom 404 error page
│   └── input.css          # Source Tailwind CSS file
├── public/                # Static assets (compiled CSS)
├── uploads/               # Locally stored user-uploaded files (images/PDFs)
└── utils/                 # Helper utilities (e.g., path resolving)
```

## Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project directory:
    ```bash
    cd "homeStay"
    ```
3.  Install the necessary dependencies:
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory of the project and define the following variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | The port number the server will listen on. | `5678` |
| `MONGO_URL` | The connection string for your MongoDB database. | `mongodb+srv://<user>:<password>@cluster.mongodb.net/` |

## Running Locally

To start the application in **development mode** (with auto-reloading for the server and Tailwind CSS compilation):

```bash
npm run dev
```

To start the application in **production mode**:

```bash
npm start
```

The server will start running at `http://localhost:<PORT>` (e.g., `http://localhost:5678`).

## Available Scripts

*   `npm run dev`: Starts the application using `nodemon` for automatic restarts on file changes, and concurrently runs the Tailwind CSS watcher to compile styles.
*   `npm start`: Starts the standard Node.js server and concurrently runs the Tailwind CSS watcher.
*   `npm run build:css`: Runs the Tailwind CLI to compile `views/input.css` into `public/output.css` in watch mode.

## API Documentation

*Note: This application utilizes Server-Side Rendering (SSR) via EJS, so it primarily serves HTML pages rather than functioning as a pure REST/JSON API. Below are the primary route structures.*

**Auth Routes (`/routes/authRouter.js`)**
*   `GET /login`, `POST /login` - User authentication.
*   `POST /logout` - Terminate user session.
*   `GET /signup`, `POST /signup` - User registration.
*   `GET /terms-and-conditions` - View terms.

**Store/Guest Routes (`/routes/storeRouter.js`)**
*   `GET /` - Index page.
*   `GET /home` - View all available homes.
*   `GET /homes/:homeID` - View specific home details.
*   `GET /bookings`, `POST /book` - Manage and create bookings.
*   `GET /clearBookings`, `POST /clearBookings` - Clear user's booking history.
*   `GET /favorites`, `POST /add-favorites`, `POST /remove-favorites` - Manage favorite properties.
*   `GET /reserve`, `POST /add-reserves`, `POST /remove-reserve` - Manage property reservations.

**Host Routes (`/routes/hostRouter.js`)** - *Requires active session*
*   `GET /host/host-page` - Host dashboard.
*   `GET /host/add-page`, `POST /host/add-home` - Add a new property (supports `photo` and `pdf` uploads).
*   `GET /host/edit-page`, `GET /host/edit-home/:homeId`, `POST /host/edit-home/:homeId` - Modify existing properties.
*   `GET /host/delete-page`, `GET /host/delete-home/:homeId` - Remove properties.

## Database Schema Overview

**User Model**
*   `firstName`, `lastName`, `email` (Unique), `password`.
*   `userType`: Enum (`"guest"`, `"host"`), defaults to `"guest"`.
*   `favorites`, `reserves`, `booked`: Arrays containing ObjectIDs referencing the `Home` model.

**Home Model**
*   `name`, `location`, `description`, `price`, `rating`, `rules`.
*   `photo`: String (Path to the uploaded image).
*   *Pre-delete Hook:* When a `Home` document is deleted, Mongoose automatically triggers a hook to update all `User` documents, removing the deleted home's ID from their `favorites`, `reserves`, and `booked` arrays to prevent orphaned references.

## Authentication & Authorization

*   **Sessions:** Implemented using `express-session` with `connect-mongodb-session` to ensure sessions are securely stored in the database rather than memory, allowing for scalability.
*   **Protection:** Global middleware intercepts requests to `/host/*` routes, checking `req.session.isLoggedIn`. Unauthenticated users are forcefully redirected to the `/login` page.

## Key Workflows

1.  **Guest Browsing Flow:** A guest registers/logs in -> Navigates to `/home` -> Views property details (`/homes/:id`) -> Adds to Favorites -> Moves to Reservations -> Finalizes Booking.
2.  **Host Publishing Flow:** A user registers/logs in as a Host -> Navigates to the Host Dashboard -> Submits the Add Home form -> Multer processes the `multipart/form-data`, saving the image/PDF to `/uploads` -> The Home is saved to MongoDB -> The Home becomes visible in the public Store.

## Performance & Security Considerations

*   **Data Integrity:** The application heavily relies on Mongoose pre-hooks (`findOneAndDelete`) to maintain referential integrity. Deleting a home cleans up the state across all associated user accounts.
*   **File Upload Security:** Multer is configured with a custom `fileFilter` that strictly limits incoming file mimetypes to `image/jpeg`, `image/png`, `image/jpg`, and `application/pdf`, preventing malicious executable uploads.
*   **Static File Serving:** Uploaded files and compiled CSS are served efficiently via Express's built-in `express.static` middleware.

## Deployment

*Yet to deploy*

## Contributing

Contributions are always welcome! Please fork the repository and create a pull request with your proposed changes.

## License

ISC License (as specified in `package.json`).